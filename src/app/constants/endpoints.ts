import { environment } from "../../environments/environment";

export const API_BASE_URL = environment.apiBaseUrl;

export const AUTH_API = `${API_BASE_URL}/auth`;
export const ALBUMS_API = `${API_BASE_URL}/albums`;
export const ALBUM_IMAGES_API = `${API_BASE_URL}/album-images`;
export const IMAGES_API = `${API_BASE_URL}/images`;
export const PAIRS_API = `${API_BASE_URL}/pairs`;
export const SHARES_API = `${API_BASE_URL}/shares`;

export const IMAGE_UPLOAD_URL = `${environment.imageUploadUrl}/`;

// Pairs API endpoints
export const PAIRS_ENDPOINTS = {
  USERS: `${PAIRS_API}/users`,
  FRIENDS: `${PAIRS_API}/friends`,
  REQUESTS: `${PAIRS_API}/requests`,
  REQUESTS_SENT: `${PAIRS_API}/requests/sent`,
  SEND_REQUEST: (id: number) => `${PAIRS_API}/request/${id}`,
  DELETE_REQUEST: (id: number) => `${PAIRS_API}/request/${id}`,
  ACCEPT_REQUEST: (id: number) => `${PAIRS_API}/request/${id}/accept`,
  REJECT_REQUEST: (id: number) => `${PAIRS_API}/request/${id}/reject`,
  REMOVE_FRIEND: (id: number) => `${PAIRS_API}/friend/${id}`
};

// Shares API endpoints
export const SHARES_ENDPOINTS = {
  GET_SHARED_IMAGES: SHARES_API,
  SHARE_IMAGE: (userId: number, imageId: number) => `${SHARES_API}/share/${userId}/${imageId}`,
  UNSHARE_IMAGE: (userId: number, imageId: number) => `${SHARES_API}/unshare/${userId}/${imageId}`,
  REMOVE_SHARED_IMAGE: (userId: number, imageId: number) => `${SHARES_API}/remove/${userId}/${imageId}`,
  CHECK_IF_SHARED: (userId: number, imageId: number) => `${SHARES_API}/check/${userId}/${imageId}`
};
