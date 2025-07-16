import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IMAGES_API } from '../../constants/endpoints';

export interface Photo {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  size: number;
  favourite: boolean;
  archived: boolean;
  inTrash: boolean;
  albumIds: number [] | null;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private baseUrl = IMAGES_API // Adjust URL as needed

  constructor(private http: HttpClient) {}

  getActivePhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.baseUrl);
  }

  getFavouritePhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/favourites`);
  }

  getArchivedPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/archived`);
  }

  getDeletedPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/trash`);
  }

  addPhoto(photoData: { name?: string; image: File }): Observable<any> {
    const formData = new FormData();
    if (photoData.name) {
      formData.append('name', photoData.name);
    }
    formData.append('image', photoData.image);

    return this.http.post(this.baseUrl, formData);
  }

  updatePhoto(
    id: number,
    photoData: { name?: string; image?: File }
  ): Observable<any> {
    const formData = new FormData();
    if (photoData.name) {
      formData.append('name', photoData.name);
    }
    if (photoData.image) {
      formData.append('image', photoData.image);
    }

    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  toggleFavourite(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/favourite`, {});
  }

  toggleArchive(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/archive`, {});
  }

  toggleDelete(id: number): Observable<any> {
    // console.log(`${this.baseUrl}/${id}/trash`);
    return this.http.patch(`${this.baseUrl}/${id}/trash`, {});
    // this.updatePhoto(id, { isFavourite: !photo.isFavourite });
  }

  restorePhoto(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/restore`, {});
  }

  permanentlyDeletePhoto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  sortPhotos(photos: Photo[], arrange: string, order: string): Photo[] {
    return [...photos].sort((a, b) => {
      let comparison = 0;
      // console.log(a,b);
      if (arrange === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (arrange === 'date') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (arrange === 'size') {
        comparison = a.size - b.size;
      }

      return order === 'asc' ? comparison : -comparison;
    });
    // return photos;
  }

  removePhotoFromAlbum(photoId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${photoId}/remove-album`, {});
  }

  getPhotosByAlbumId(albumId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/album/${albumId}`);
  }
}
