import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import logger from 'redux-logger';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),//.concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
