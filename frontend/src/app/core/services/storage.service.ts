import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

type Folder = 'products' | 'categories' | 'banners' | 'users';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly storage = inject(Storage);

  async upload(folder: Folder, file: File, fileName?: string): Promise<string> {
    const path = `${folder}/${Date.now()}-${fileName ?? file.name}`;
    const r = ref(this.storage, path);
    await uploadBytes(r, file, { contentType: file.type });
    return await getDownloadURL(r);
  }

  async delete(url: string): Promise<void> {
    try {
      const r = ref(this.storage, url);
      await deleteObject(r);
    } catch {
      // already removed
    }
  }
}
