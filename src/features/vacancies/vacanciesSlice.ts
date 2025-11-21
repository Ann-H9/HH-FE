import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Vacancy } from '../../types/vacancy';
import { fetchVacancies } from '../../services/hhApi';
import type { RootState } from '../../store';

export interface VacanciesState {
  items: Vacancy[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
}

const initialState: VacanciesState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
};

export const getVacancies = createAsyncThunk(
  'vacancies/getVacancies',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { searchText, city, skills } = state.filters;
    const { page } = state.vacancies;

    try {
      const response = await fetchVacancies({
        text: searchText,
        area: city === 'all' ? undefined : city,
        skills,
        page,
        per_page: 10,
      });
      return response;
    } catch  {
      return thunkAPI.rejectWithValue('Ошибка загрузки вакансий');
    }
  }
);

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.found;
      })
      .addCase(getVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;