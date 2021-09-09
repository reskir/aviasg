import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { serviceApi } from './service';
import mainReducer from './slices/main';

export const store = configureStore({
    reducer: {
        [serviceApi.reducerPath]: serviceApi.reducer,
        main: mainReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(serviceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
