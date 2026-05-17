import { Injectable } from '@angular/core';

type Folder = 'products' | 'categories' | 'banners' | 'users';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private cloudName = 'dnmuwin6h';

  private uploadPreset = 'instafruit_products';

  async upload(folder: Folder, file: File): Promise<string> {

    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();

    return data.secure_url;
  }

  async delete(url: string): Promise<void> {
    console.log('Delete manually from Cloudinary');
  }
}