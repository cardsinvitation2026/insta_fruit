import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Banner } from '../models';

@Injectable({ providedIn: 'root' })
export class BannersService {
  private readonly db = inject(Firestore);
  private readonly col = collection(this.db, 'banners');

  list(): Observable<Banner[]> {
    return collectionData(
      query(this.col, where('isActive', '==', true), orderBy('sortOrder', 'asc')),
      { idField: 'id' }
    ) as Observable<Banner[]>;
  }

  listAll(): Observable<Banner[]> {
    return collectionData(this.col, { idField: 'id' }) as Observable<Banner[]>;
  }

  async create(b: Omit<Banner, 'id'>): Promise<string> {
    const ref = await addDoc(this.col, b);
    return ref.id;
  }

  async update(id: string, patch: Partial<Banner>): Promise<void> {
    await updateDoc(doc(this.db, `banners/${id}`), patch);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, `banners/${id}`));
  }
}
