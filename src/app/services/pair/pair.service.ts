import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PAIRS_ENDPOINTS } from '../../constants/endpoints'; 

export interface User {
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class PairsService {

  constructor(private http: HttpClient) {}

  /**
   * Get available users (not friends, no pending requests)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(PAIRS_ENDPOINTS.USERS);
  }

  /**
   * Get friends
   */
  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(PAIRS_ENDPOINTS.FRIENDS);
  }

  /**
   * Get pending friend requests
   */
  getRequests(): Observable<User[]> {
    return this.http.get<User[]>(PAIRS_ENDPOINTS.REQUESTS);
  }

  /**
   * Get sent request IDs
   */
  getRequestsSent(): Observable<number[]> {
    return this.http.get<number[]>(PAIRS_ENDPOINTS.REQUESTS_SENT);
  }

  /**
   * Send friend request
   */
  sendRequest(userId: number): Observable<string> {
    return this.http.post<string>(PAIRS_ENDPOINTS.SEND_REQUEST(userId), {});
  }

  /**
   * Delete sent friend request
   */
  deleteRequest(userId: number): Observable<string> {
    return this.http.delete<string>(PAIRS_ENDPOINTS.DELETE_REQUEST(userId));
  }

  /**
   * Accept friend request
   */
  acceptRequest(userId: number): Observable<string> {
    return this.http.put<string>(PAIRS_ENDPOINTS.ACCEPT_REQUEST(userId), {});
  }

  /**
   * Reject friend request
   */
  rejectRequest(userId: number): Observable<string> {
    return this.http.delete<string>(PAIRS_ENDPOINTS.REJECT_REQUEST(userId));
  }

  /**
   * Remove friend
   */
  removeFriend(userId: number): Observable<string> {
    return this.http.delete<string>(PAIRS_ENDPOINTS.REMOVE_FRIEND(userId));
  }
}