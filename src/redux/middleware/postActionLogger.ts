import { Middleware } from '@reduxjs/toolkit';

// Post-action logging middleware
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export const postActionLogger: Middleware = _storeAPI => next => (action: any) => {
  const result = next(action)
  // console.log('Action dispatched:', action.type)
  // console.log('New state:', storeAPI.getState())
  return result
}
