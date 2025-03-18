import { BookingResponse } from "@/services/bookings.service";

const DB_NAME = 'big-wing-cache';
const DB_VERSION = 1;
const BOOKINGS_STORE = 'bookings';

export class IndexedDBHelper {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(BOOKINGS_STORE)) {
          db.createObjectStore(BOOKINGS_STORE, { keyPath: 'id' });
        }
      };
    });
  }

  async getBookings(): Promise<BookingResponse[]> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(BOOKINGS_STORE, 'readonly');
      const store = transaction.objectStore(BOOKINGS_STORE);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveBookings(bookings: BookingResponse[]): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(BOOKINGS_STORE, 'readwrite');
      const store = transaction.objectStore(BOOKINGS_STORE);
      
      // Clear existing data
      store.clear();

      // Add new data
      bookings.forEach(booking => {
        store.add(booking);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clearBookings(): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(BOOKINGS_STORE, 'readwrite');
      const store = transaction.objectStore(BOOKINGS_STORE);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Create a singleton instance
export const indexedDBHelper = new IndexedDBHelper(); 