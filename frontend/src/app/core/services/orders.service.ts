import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc,
  query, where, orderBy, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { Order, OrderStatus, PaymentMethod } from '../models';

interface CreateRazorpayInput { orderId: string; amount: number; currency?: 'INR'; }
interface CreateRazorpayResult { razorpayOrderId: string; amount: number; currency: 'INR'; }
interface VerifyRazorpayInput {
  razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; orderId: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly db = inject(Firestore);
  private readonly fns = inject(Functions);
  private readonly col = collection(this.db, 'orders');

  myOrders(userId: string): Observable<Order[]> {
    return collectionData(
      query(this.col, where('userId', '==', userId), orderBy('createdAt', 'desc')),
      { idField: 'orderId' }
    ) as Observable<Order[]>;
  }

  byStatus(status: OrderStatus): Observable<Order[]> {
    return collectionData(
      query(this.col, where('orderStatus', '==', status), orderBy('createdAt', 'desc')),
      { idField: 'orderId' }
    ) as Observable<Order[]>;
  }

  all(): Observable<Order[]> {
    return collectionData(query(this.col, orderBy('createdAt', 'desc')), { idField: 'orderId' }) as Observable<Order[]>;
  }

  one(orderId: string): Observable<Order | undefined> {
    return docData(doc(this.db, `orders/${orderId}`), { idField: 'orderId' }) as Observable<Order | undefined>;
  }

  async create(order: Omit<Order, 'orderId' | 'createdAt' | 'updatedAt' | 'orderStatus' | 'paymentStatus' | 'estimatedArrivalTime'> & { paymentMethod: PaymentMethod }): Promise<string> {
    const eta = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes default
    const ref = await addDoc(this.col, {
      ...order,
      orderStatus: 'placed' as OrderStatus,
      paymentStatus: order.paymentMethod === 'cod' ? 'pending' : 'pending',
      estimatedArrivalTime: Timestamp.fromDate(eta),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async updateStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
    await updateDoc(doc(this.db, `orders/${orderId}`), {
      orderStatus,
      updatedAt: serverTimestamp(),
    });
  }

  async cancel(orderId: string, reason: string): Promise<void> {
    await updateDoc(doc(this.db, `orders/${orderId}`), {
      orderStatus: 'cancelled', cancelReason: reason, updatedAt: serverTimestamp(),
    });
  }

  // ---- Razorpay (via Cloud Functions) ----
  createRazorpayOrder(input: CreateRazorpayInput): Promise<CreateRazorpayResult> {
    const fn = httpsCallable<CreateRazorpayInput, CreateRazorpayResult>(this.fns, 'createRazorpayOrder');
    return fn(input).then((r) => r.data);
  }

  verifyRazorpayPayment(input: VerifyRazorpayInput): Promise<{ success: boolean }> {
    const fn = httpsCallable<VerifyRazorpayInput, { success: boolean }>(this.fns, 'verifyRazorpayPayment');
    return fn(input).then((r) => r.data);
  }
}
