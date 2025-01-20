export const LOCAL_STORAGE_KEYS = {
  FILTER_STATUS: 'FILTER_STATUS',
  VITE_GITHUB_TOKEN: 'VITE_GITHUB_TOKEN',
} as const

// A type which is the union of LOCAL_STORAGE_KEYS
export type LocalStorageKey = keyof typeof LOCAL_STORAGE_KEYS

/**
 * @description Will get a value from local storage. Assumes you will deserialize the value.
 * @param {LocalStorageKey} LocalStorageKey
 * @returns string | null
 */
export const getLS = (key: LocalStorageKey) => {
  return localStorage.getItem(key)
}
/**
 * @description Will set a value in local storage. Assumes you have already serialized the value.
 * @param key
 * @param value
 */
export const setLS = (key: LocalStorageKey, value: string) => {
  localStorage.setItem(key, value)
}

/**
 * @description Will delete a value from local storage.
 * @param key
 */
export const deleteLS = (key: LocalStorageKey) => {
  localStorage.removeItem(key)
}