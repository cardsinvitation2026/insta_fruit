import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly db = inject(Firestore);
  private readonly col = collection(this.db, 'categories');

  list(): Observable<Category[]> {
    return collectionData(
      query(this.col, where('isActive', '==', true), orderBy('sortOrder', 'asc')),
      { idField: 'id' }
    ) as Observable<Category[]>;
  }

  listAll(): Observable<Category[]> {
    return collectionData(query(this.col, orderBy('sortOrder', 'asc')), { idField: 'id' }) as Observable<Category[]>;
  }

  async create(c: Omit<Category, 'id' | 'createdAt'>): Promise<string> {
    const ref = await addDoc(this.col, { ...c, createdAt: serverTimestamp() });
    return ref.id;
  }

  async update(id: string, patch: Partial<Category>): Promise<void> {
    await updateDoc(doc(this.db, `categories/${id}`), patch);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, `categories/${id}`));
  }
}
