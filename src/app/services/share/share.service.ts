import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SHARES_ENDPOINTS } from '../../constants/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private http: HttpClient) {}

  getSharedImages(): Observable<any[]> {
    return this.http.get<any[]>(SHARES_ENDPOINTS.GET_SHARED_IMAGES);
  }

  /**
   * Share an image with a user
   */
  shareImage(userId: number, imageId: number): Observable<string> {
    return this.http.post<string>(SHARES_ENDPOINTS.SHARE_IMAGE(userId, imageId), {});
  }

  /**
   * Unshare an image from a user
   */
  unshareImage(userId: number, imageId: number): Observable<string> {
    return this.http.delete<string>(SHARES_ENDPOINTS.UNSHARE_IMAGE(userId, imageId));
  }

  /**
   * Remove a shared image (when you received it from someone)
   */
  removeSharedImage(userId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(SHARES_ENDPOINTS.REMOVE_SHARED_IMAGE(userId, imageId));
  }

  /**
   * Check if an image is shared with a user
   */
  checkIfImageShared(userId: number, imageId: number): Observable<number> {
    return this.http.get<number>(SHARES_ENDPOINTS.CHECK_IF_SHARED(userId, imageId));
  }
}