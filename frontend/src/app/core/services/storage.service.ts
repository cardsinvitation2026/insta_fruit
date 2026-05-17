import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

type Folder = 'products' | 'categories' | 'banners' | 'users';

export type CloudinaryUploadOptions = {
  /** Max bytes (default: 5MB for users, 12MB for other folders). */
  maxBytes?: number;
};

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly cloudName = environment.cloudinary.cloudName;
  private readonly uploadPreset = environment.cloudinary.uploadPreset;

  /** Default size limits keep uploads safe for mobile networks and Cloudinary free tier. */
  private defaultMaxBytes(folder: Folder): number {
    return folder === 'users' ? 5 * 1024 * 1024 : 12 * 1024 * 1024;
  }

  async upload(folder: Folder, file: File, options?: CloudinaryUploadOptions): Promise<string> {
    const maxBytes = options?.maxBytes ?? this.defaultMaxBytes(folder);
    if (!file.type.startsWith('image/')) {
      throw new Error('Please choose an image file (JPEG, PNG, WebP, GIF).');
    }
    if (file.size > maxBytes) {
      const mb = maxBytes / (1024 * 1024);
      throw new Error(`Image is too large. Maximum size is ${mb} MB.`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!response.ok) {
      throw new Error(data.error?.message ?? `Upload failed (HTTP ${response.status}).`);
    }
    if (!data.secure_url) {
      throw new Error(data.error?.message ?? 'Upload failed: no image URL returned.');
    }
    return data.secure_url;
  }

  async delete(_url: string): Promise<void> {
    // Unsigned uploads require server-side signed delete or Cloudinary console.
    console.warn('[StorageService] Delete asset from Cloudinary dashboard if needed.');
  }
}
