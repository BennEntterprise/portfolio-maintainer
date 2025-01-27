import { Middleware } from '@reduxjs/toolkit';

// Pre-action logging middleware
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
export const preActionLogger: Middleware = _storeAPI => next => (action: any) => {
  // console.log(storeAPI.getState());
  // console.log('Dispatching action:', action.type)
  return next(action)
}