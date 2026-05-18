import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData,
  addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly db = inject(Firestore);

  list(): Observable<Product[]> {
    const productsQuery = query(
      collection(this.db, 'products')
    );
  
    return collectionData(productsQuery, {
      idField: 'id'
    }) as Observable<Product[]>;
  }

  listAll(): Observable<Product[]> {
    const productsQuery = query(
      collection(this.db, 'products')
    );
  
    return collectionData(productsQuery, {
      idField: 'id'
    }) as Observable<Product[]>;
  }

  byCategory(categoryId: string): Observable<Product[]> {
    return collectionData(
      query(collection(this.db, 'products'),
        where('isAvailable', '==', true),
        where('categoryId', '==', categoryId),
        orderBy('createdAt', 'desc')),
      { idField: 'id' }
    ) as Observable<Product[]>;
  }

  search(keyword: string): Observable<Product[]> {
    return collectionData(
      query(collection(this.db, 'products'),
        where('isAvailable', '==', true),
        where('searchKeywords', 'array-contains', keyword.toLowerCase())),
      { idField: 'id' }
    ) as Observable<Product[]>;
  }

  one(id: string): Observable<Product | undefined> {
    return docData(doc(this.db, `products/${id}`), { idField: 'id' }) as Observable<Product | undefined>;
  }

  async create(p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(this.db, 'products'), {
      ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async update(id: string, patch: Partial<Product>): Promise<void> {
    await updateDoc(doc(this.db, `products/${id}`), { ...patch, updatedAt: serverTimestamp() });
  }

  async upsert(id: string, p: Partial<Product>): Promise<void> {
    await setDoc(doc(this.db, `products/${id}`), { ...p, updatedAt: serverTimestamp() }, { merge: true });
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, `products/${id}`));
  }

  /** Build searchKeywords from name + category. Stored on writes for `array-contains` queries. */
  static buildKeywords(name: string, category: string): string[] {
    const words = `${name} ${category}`.toLowerCase().split(/\s+/).filter(Boolean);
    const prefixes = new Set<string>();
    for (const w of words) {
      for (let i = 1; i <= w.length; i++) prefixes.add(w.slice(0, i));
    }
    return [...prefixes];
  }

  /** Client-side filter: substring match on name, category, slug, and stored keywords. */
  static matchesSearch(p: Product, raw: string): boolean {
    const q = raw.trim().toLowerCase();
    if (!q) return true;
    const parts = [p.name, p.categoryName, p.slug, ...(p.searchKeywords ?? [])].map((s) =>
      String(s ?? '').toLowerCase(),
    );
    return parts.some((s) => s.includes(q));
  }
}
