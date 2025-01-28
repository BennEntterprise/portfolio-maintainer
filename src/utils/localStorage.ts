import { SettingsState, SettingsSchema } from '../redux/settingsSlice'

export const LOCAL_STORAGE_KEYS = {
  SAVED_SETTINGS: 'SAVED_SETTINGS',
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

export const getSettingsLS = (): SettingsState => {
  const settings = getLS(LOCAL_STORAGE_KEYS.SAVED_SETTINGS)
  let parsed;
  try {
    parsed = SettingsSchema.parse(settings)
  } catch (error) {
    console.error('Error parsing settings from local storage:', error)
    // alert('Error parsing settings from local storage. Please check the console for more information.')
  }
  return parsed as SettingsState;
}
