export const LOCAL_STORAGE_KEYS = {
  FILTER_STATUS: 'FILTER_STATUS',
  VITE_GITHUB_TOKEN: 'VITE_GITHUB_TOKEN',
}

/**
 * @description Will get a value from local storage. Assumes you will deserialize the value.
 * @param key
 * @returns string | null
 */
export const getLS = (key: string) => {
  return localStorage.getItem(key)
}
/**
 * @description Will set a value in local storage. Assumes you have already serialized the value.
 * @param key
 * @param value
 */
export const setLS = (key: string, value: string) => {
  localStorage.setItem(key, value)
}