import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppUser } from '../models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly db = inject(Firestore);
  private readonly col = collection(this.db, 'users');

  list(): Observable<AppUser[]> {
    return collectionData(query(this.col, orderBy('createdAt', 'desc'))) as Observable<AppUser[]>;
  }

  async setBlocked(uid: string, isBlocked: boolean): Promise<void> {
    await updateDoc(doc(this.db, `users/${uid}`), { isBlocked });
  }

  async setRole(uid: string, role: 'customer' | 'admin'): Promise<void> {
    await updateDoc(doc(this.db, `users/${uid}`), { role });
  }
}
