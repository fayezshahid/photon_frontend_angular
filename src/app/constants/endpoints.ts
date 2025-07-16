import { environment } from "../../environments/environment";

export const API_BASE_URL = environment.apiBaseUrl;

export const ALBUMS_API = `${API_BASE_URL}/albums`;
export const ALBUM_IMAGES_API = `${API_BASE_URL}/album-images`;
export const IMAGES_API = `${API_BASE_URL}/images`;
export const AUTH_API = `${API_BASE_URL}/auth`;

export const IMAGE_UPLOAD_URL = environment.imageUploadUrl;
