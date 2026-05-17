import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc,
  serverTimestamp } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Category } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly db = inject(Firestore);
  private readonly col = collection(this.db, 'categories');

  /** Avoid Firestore composite indexes: read collection once, sort/filter in memory (small dataset). */
  private sortCategories(rows: Category[]): Category[] {
    return [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  list(): Observable<Category[]> {
    return collectionData(this.col, { idField: 'id' }).pipe(
      map((rows) =>
        this.sortCategories((rows as Category[]).filter((c) => c.isActive === true)),
      ),
    );
  }

  listAll(): Observable<Category[]> {
    return collectionData(this.col, { idField: 'id' }).pipe(
      map((rows) => this.sortCategories(rows as Category[])),
    );
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
