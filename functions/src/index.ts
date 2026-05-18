/**
 * InstaFruit — Cloud Functions
 *
 * Deploy:
 *   1) firebase functions:config:set razorpay.key_id="rzp_test_xxx" razorpay.key_secret="xxx"
 *   2) firebase deploy --only functions
 */

import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

const RAZORPAY_KEY_ID = defineSecret('RAZORPAY_KEY_ID');
const RAZORPAY_KEY_SECRET = defineSecret('RAZORPAY_KEY_SECRET');
const GOOGLE_MAPS_API_KEY = defineSecret('GOOGLE_MAPS_API_KEY');
const REGION = 'asia-south1';

interface GeocodeInput { lat: number; lng: number; }
interface AddressComponent { long_name: string; short_name: string; types: string[]; }

function pickComponent(components: AddressComponent[], type: string): string {
  return components.find((c) => c.types.includes(type))?.long_name ?? '';
}

function parseGoogleResult(result: { address_components: AddressComponent[]; formatted_address: string }) {
  const ac = result.address_components;
  const locality =
    pickComponent(ac, 'sublocality_level_1') ||
    pickComponent(ac, 'sublocality') ||
    pickComponent(ac, 'neighborhood') ||
    pickComponent(ac, 'locality');
  const city = pickComponent(ac, 'locality') || pickComponent(ac, 'administrative_area_level_2');
  const route = pickComponent(ac, 'route');
  const streetNumber = pickComponent(ac, 'street_number');
  const line1 = [streetNumber, route].filter(Boolean).join(' ') || result.formatted_address.split(',')[0]?.trim() || '';
  return {
    locality: locality || city,
    city: city || locality,
    state: pickComponent(ac, 'administrative_area_level_1'),
    postalCode: pickComponent(ac, 'postal_code'),
    country: pickComponent(ac, 'country'),
    line1,
    formattedAddress: result.formatted_address,
  };
}

interface CreateOrderInput { orderId: string; amount: number; currency?: 'INR'; }
interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId: string;
}
interface RefundInput { orderId: string; reason: string; }

/** Reverse geocode GPS coordinates (Google Geocoding API). Works for guests. */
export const reverseGeocode = onCall(
  { region: REGION, secrets: [GOOGLE_MAPS_API_KEY] },
  async (req) => {
    const { lat, lng } = req.data as GeocodeInput;
    if (typeof lat !== 'number' || typeof lng !== 'number' || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new HttpsError('invalid-argument', 'lat and lng required');
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new HttpsError('invalid-argument', 'Invalid coordinates');
    }
    const key = GOOGLE_MAPS_API_KEY.value();
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    const res = await fetch(url);
    const data = (await res.json()) as {
      status: string;
      results?: { address_components: AddressComponent[]; formatted_address: string }[];
      error_message?: string;
    };
    if (data.status !== 'OK' || !data.results?.[0]) {
      logger.warn('Geocode failed', { status: data.status, message: data.error_message });
      throw new HttpsError('not-found', data.error_message ?? 'Address not found');
    }
    return parseGoogleResult(data.results[0]);
  }
);

/** Razorpay: create order on backend, return order to client to launch checkout. */
export const createRazorpayOrder = onCall(
  { region: REGION, secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');
    const { orderId, amount, currency = 'INR' } = req.data as CreateOrderInput;
    if (!orderId || !amount || amount <= 0) {
      throw new HttpsError('invalid-argument', 'orderId and positive amount required');
    }
    const orderSnap = await db.collection('orders').doc(orderId).get();
    if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found');
    if (orderSnap.data()?.userId !== req.auth.uid) {
      throw new HttpsError('permission-denied', 'Not your order');
    }
    const rzp = new Razorpay({
      key_id: RAZORPAY_KEY_ID.value(),
      key_secret: RAZORPAY_KEY_SECRET.value(),
    });
    const rzpOrder = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: orderId,
      notes: { firebaseUid: req.auth.uid, orderId },
    });
    await db.collection('payments').doc(rzpOrder.id).set({
      paymentId: rzpOrder.id,
      orderId,
      userId: req.auth.uid,
      razorpayOrderId: rzpOrder.id,
      amount,
      currency,
      method: 'razorpay',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { razorpayOrderId: rzpOrder.id, amount, currency };
  }
);

/** Razorpay: verify signature, mark order paid. */
export const verifyRazorpayPayment = onCall(
  { region: REGION, secrets: [RAZORPAY_KEY_SECRET] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.data as VerifyPaymentInput;
    const expected = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET.value())
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    if (expected !== razorpaySignature) {
      logger.warn('Invalid Razorpay signature', { razorpayOrderId, uid: req.auth.uid });
      throw new HttpsError('permission-denied', 'Invalid payment signature');
    }
    const batch = db.batch();
    batch.update(db.collection('payments').doc(razorpayOrderId), {
      razorpayPaymentId,
      razorpaySignature,
      status: 'success',
    });
    batch.update(db.collection('orders').doc(orderId), {
      paymentStatus: 'success',
      paymentId: razorpayPaymentId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await batch.commit();
    return { success: true };
  }
);

/** Customer requests refund; admin approves; this function processes via Razorpay. */
export const processRefund = onCall(
  { region: REGION, secrets: [RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET] },
  async (req) => {
    if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required');
    const callerSnap = await db.collection('users').doc(req.auth.uid).get();
    if (callerSnap.data()?.role !== 'admin') {
      throw new HttpsError('permission-denied', 'Admin only');
    }
    const { orderId } = req.data as RefundInput;
    const orderSnap = await db.collection('orders').doc(orderId).get();
    if (!orderSnap.exists) throw new HttpsError('not-found', 'Order not found');
    const order = orderSnap.data()!;
    if (order.paymentMethod !== 'razorpay' || order.paymentStatus !== 'success') {
      throw new HttpsError('failed-precondition', 'Order is not refundable');
    }
    const rzp = new Razorpay({
      key_id: RAZORPAY_KEY_ID.value(),
      key_secret: RAZORPAY_KEY_SECRET.value(),
    });
    const refund = await rzp.payments.refund(order.paymentId, {
      amount: Math.round(order.total * 100),
      speed: 'normal',
      notes: { orderId },
    });
    const batch = db.batch();
    batch.update(db.collection('orders').doc(orderId), {
      paymentStatus: 'refunded',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(db.collection('refunds').doc(refund.id), {
      refundId: refund.id,
      orderId,
      paymentId: order.paymentId,
      userId: order.userId,
      amount: order.total,
      reason: (req.data as RefundInput).reason ?? 'Admin initiated',
      status: 'processed',
      razorpayRefundId: refund.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    await batch.commit();
    return { success: true, razorpayRefundId: refund.id };
  }
);

/** Notify on order status change (FCM hook-in point). */
export const onOrderStatusChange = onDocumentUpdated(
  { region: REGION, document: 'orders/{orderId}' },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after || before.orderStatus === after.orderStatus) return;
    logger.info('Order status changed', {
      orderId: event.params.orderId,
      from: before.orderStatus,
      to: after.orderStatus,
    });
    // Hook FCM / email here.
  }
);

/** Image upload trigger — placeholder for compression. */
export const onImageUpload = onObjectFinalized(
  { region: REGION, cpu: 1 },
  async (event) => {
    logger.info('Storage upload', { name: event.data.name, size: event.data.size });
  }
);

/** Daily aggregation of order/sales stats into analytics/{yyyy-MM-dd}. */
export const aggregateAnalytics = onSchedule(
  { region: REGION, schedule: 'every day 00:30', timeZone: 'Asia/Kolkata' },
  async () => {
    const since = new Date(); since.setDate(since.getDate() - 1);
    const snap = await db.collection('orders')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(since))
      .get();
    let totalSales = 0; let totalOrders = 0; let delivered = 0;
    snap.forEach((d) => {
      const o = d.data();
      totalOrders += 1;
      totalSales += o.total ?? 0;
      if (o.orderStatus === 'delivered') delivered += 1;
    });
    const key = since.toISOString().slice(0, 10);
    await db.collection('analytics').doc(key).set({
      date: key, totalOrders, totalSales, delivered,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);
