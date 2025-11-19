import { configureStore } from '@reduxjs/toolkit';
import vacanciesReducer from '../features/vacancies/vacanciesSlice';
import filtersReducer from '../features/filters/filtersSlice';

export const store = configureStore({
  reducer: {
    vacancies: vacanciesReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;