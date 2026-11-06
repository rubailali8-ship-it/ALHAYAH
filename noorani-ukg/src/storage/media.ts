// IndexedDB storage for media (photos, voice notes) and teacher messages.
// localStorage is too small for blobs, so they live here via idb-keyval.
import { clear, createStore, del, get, set } from 'idb-keyval';

const store = createStore('noorani-ukg', 'media');

export interface TeacherMessage {
  id: string;
  ts: number;
  from: 'parent' | 'teacher';
  text?: string;
  /** Key of an image blob in IndexedDB. */
  imageKey?: string;
  /** Key of an audio blob in IndexedDB. */
  audioKey?: string;
  audioMime?: string;
  demoAutoReply?: boolean;
}

const MESSAGES_KEY = 'teacher:messages';

export async function putBlob(key: string, blob: Blob): Promise<void> {
  await set(key, blob, store);
}

export async function getBlob(key: string): Promise<Blob | undefined> {
  return get<Blob>(key, store);
}

export async function deleteBlob(key: string): Promise<void> {
  await del(key, store);
}

export async function getMessages(): Promise<TeacherMessage[]> {
  return (await get<TeacherMessage[]>(MESSAGES_KEY, store)) ?? [];
}

export async function saveMessages(messages: TeacherMessage[]): Promise<void> {
  await set(MESSAGES_KEY, messages, store);
}

export async function clearMedia(): Promise<void> {
  await clear(store);
}

/** Downscale a photo before storing it so IndexedDB stays small on budget phones. */
export async function compressImage(file: File, maxSide = 1024): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.8));
    return blob ?? file;
  } catch {
    return file;
  }
}
