import { apiClient } from './client';
import type { Photo, PhotoList } from '../../types';

const PHOTO_SHARES_PATH = '/api/v1/photo/photo-shares';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function normalizeMediaUrl(url: string): string {
  return url.replace(
    'http://0.0.0.0:8080',
    API_BASE_URL,
  );
}

export const photoApi = {
  async upload(requestId: number, file: File): Promise<Photo> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post<Photo>(
      PHOTO_SHARES_PATH,
      formData,
      {
        params: {
          request_id: requestId,
        },
      },
    );

    return {
      ...response.data,
      url: normalizeMediaUrl(response.data.url),
    };
  },

  async getAll(requestId: number): Promise<PhotoList> {
    const response = await apiClient.get<PhotoList>(
      PHOTO_SHARES_PATH,
      {
        params: {
          request_id: requestId,
        },
      },
    );

    return {
      ...response.data,
      items: response.data.items.map((photo) => ({
        ...photo,
        url: normalizeMediaUrl(photo.url),
      })),
    };
  },
};