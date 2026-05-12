import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Firestore, collection, collectionData, addDoc, query, orderBy, serverTimestamp,
  doc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Refund } from '../models';

@Injectable({ providedIn: 'root' })
export class RefundsService {
  private readonly db = inject(Firestore);
  private readonly fns = inject(Functions);
  private readonly col = collection(this.db, 'refunds');

  list(): Observable<Refund[]> {
    return collectionData(query(this.col, orderBy('createdAt', 'desc')), { idField: 'refundId' }) as Observable<Refund[]>;
  }

  myRefunds(userId: string): Observable<Refund[]> {
    return collectionData(
      query(this.col, where('userId', '==', userId), orderBy('createdAt', 'desc')),
      { idField: 'refundId' }
    ) as Observable<Refund[]>;
  }

  async request(orderId: string, userId: string, paymentId: string, amount: number, reason: string): Promise<string> {
    const ref = await addDoc(this.col, {
      orderId, userId, paymentId, amount, reason,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  async approveAndProcess(orderId: string, reason: string): Promise<{ success: boolean; razorpayRefundId: string }> {
    const fn = httpsCallable<{ orderId: string; reason: string }, { success: boolean; razorpayRefundId: string }>(
      this.fns, 'processRefund');
    return (await fn({ orderId, reason })).data;
  }

  async reject(refundId: string): Promise<void> {
    await updateDoc(doc(this.db, `refunds/${refundId}`), { status: 'rejected', updatedAt: serverTimestamp() });
  }
}
