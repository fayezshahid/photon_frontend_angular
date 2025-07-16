import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ALBUMS_API, ALBUM_IMAGES_API } from '../../constants/endpoints';

export interface Album {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private albumUrl = ALBUMS_API;
  private albumImageUrl = ALBUM_IMAGES_API;

  constructor(private http: HttpClient) {}

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(this.albumUrl);
  }

  addAlbum(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.http.post(this.albumUrl, null, { params });
  }

  updateAlbum(id: number, name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.http.put(`${this.albumUrl}/${id}`, null, { params });
  }

  deleteAlbum(id: number): Observable<any> {
    return this.http.delete(`${this.albumUrl}/${id}`);
  }

  getAlbumById(albumId: number): Observable<Album> {
    return this.http.get<Album>(`${this.albumUrl}/${albumId}`);
  }

  sortAlbums(albums: Album[], sortBy: string, order: string): Album[] {
    return [...albums].sort((a, b) => {
      let comparison = 0;

      switch (sortBy.toLowerCase()) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Album-image operations

  addImageToAlbum(albumId: number, imageId: number): Observable<any> {
    const params = new HttpParams()
      .set('albumId', albumId.toString())
      .set('imageId', imageId.toString());
    return this.http.post(`${this.albumImageUrl}/add`, null, { params });
  }

  removeImageFromAlbum(albumId: number, imageId: number): Observable<any> {
    const params = new HttpParams()
      .set('albumId', albumId.toString())
      .set('imageId', imageId.toString());
    return this.http.delete(`${this.albumImageUrl}/remove`, { params });
  }

  getImagesInAlbum(albumId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.albumImageUrl}/album/${albumId}`);
  }
}
