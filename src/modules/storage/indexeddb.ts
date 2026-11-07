import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface StoredDocument {
  id: string
  name: string
  bytes: Uint8Array
  size: number
  pageCount: number
  lastModified: number
  isDirty: boolean
}

interface AppDBSchema extends DBSchema {
  documents: {
    key: string
    value: StoredDocument
  }
  settings: {
    key: string
    value: any
  }
}

const DB_NAME = 'privacy_pdf_editor_db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<AppDBSchema>> | null = null

export function getDB(): Promise<IDBPDatabase<AppDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<AppDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings')
        }
      }
    })
  }
  return dbPromise
}

export async function saveDocumentDraft(doc: StoredDocument): Promise<void> {
  const db = await getDB()
  await db.put('documents', doc)
}

export async function loadDocumentDraft(id: string): Promise<StoredDocument | undefined> {
  const db = await getDB()
  return await db.get('documents', id)
}

export async function listDocumentDrafts(): Promise<StoredDocument[]> {
  const db = await getDB()
  return await db.getAll('documents')
}

export async function deleteDocumentDraft(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('documents', id)
}

export async function clearAllDrafts(): Promise<void> {
  const db = await getDB()
  await db.clear('documents')
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB()
  await db.put('settings', value, key)
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  return await db.get('settings', key)
}
