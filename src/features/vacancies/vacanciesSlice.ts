import  { createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';
import type { Vacancy } from '../../types/vacancy';
import { fetchVacancies, fetchVacancyById } from '../../services/hhApi'; 
import type { RootState } from '../../store';

export interface VacanciesState {
  items: Vacancy[];
  total: number;
  currentVacancy: Vacancy | null; 
  loading: boolean;
  error: string | null;
  page: number;
}

const initialState: VacanciesState = {
  items: [],
  total: 0,
  currentVacancy: null, 
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
    } catch {
      return thunkAPI.rejectWithValue('Ошибка загрузки вакансий');
    }
  }
);

export const getVacancy = createAsyncThunk(
  'vacancies/getVacancy',
  async (id: string, thunkAPI) => {
    try {
      const data = await fetchVacancyById(id);
      return data;
    } catch {
      return thunkAPI.rejectWithValue('Ошибка загрузки описания вакансии');
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
    clearCurrentVacancy(state) {
      state.currentVacancy = null;
    }
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
      })
      .addCase(getVacancy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVacancy.fulfilled, (state, action: PayloadAction<Vacancy>) => {
        state.loading = false;
        state.currentVacancy = action.payload;
      })
      .addCase(getVacancy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPage, clearCurrentVacancy } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;