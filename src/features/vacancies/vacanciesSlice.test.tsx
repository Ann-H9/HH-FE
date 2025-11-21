import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VacanciesState } from './vacanciesSlice';
import vacanciesReducer, { 
  setPage, 
  getVacancies 
} from './vacanciesSlice';
import type { RootState } from '../../store';

vi.mock('../../services/hhApi', () => ({
  fetchVacancies: vi.fn(),
}));

import { fetchVacancies } from '../../services/hhApi';


const initialState: VacanciesState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
};

const mockApiResponse = { 
  items: [
    {
      id: '1',
      name: 'Frontend Developer',
      salary: { from: 100000, to: 150000, currency: 'RUR' },
      schedule: { id: 'remote', name: 'remote' },
      experience: { name: '3–6 лет' },
      employer: { name: 'Tech Corp' },
      area: { name: 'Москва' },
      url: 'https://hh.ru/vacancy/123456',
    },
  ],
  found: 100,
  pages: 10,
  per_page: 10,
  page: 0,
};


describe('vacanciesSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('setPage: обновляет номер страницы', () => {
      const nextState = vacanciesReducer(initialState, setPage(5));
      expect(nextState.page).toBe(5);
    });
  });

  describe('extraReducers (state transitions)', () => {
    
    it('pending: должен установить loading = true и очистить error', () => {
      const action = getVacancies.pending('requestId', undefined);
      
      const stateWithError: VacanciesState = { ...initialState, error: 'Old error' };
      const nextState = vacanciesReducer(stateWithError, action);

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('fulfilled: должен сохранить данные и убрать loading', () => {
      const action = getVacancies.fulfilled(
        mockApiResponse,
        'requestId', 
        undefined 
      ) as unknown as ReturnType<typeof getVacancies.fulfilled>;

      const nextState = vacanciesReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.items).toEqual(mockApiResponse.items);
      expect(nextState.total).toBe(100);
    });

    it('rejected: должен записать ошибку и убрать loading', () => {
      const action = getVacancies.rejected(
        new Error('Network error'), 
        'requestId', 
        undefined, 
        'Ошибка загрузки вакансий'
      );

      const nextState = vacanciesReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка загрузки вакансий');
    });
  });

  describe('getVacancies thunk logic', () => {
    it('вызывает API с правильными параметрами (учитывая фильтры)', async () => {
      (fetchVacancies as unknown as { mockResolvedValue: (val: unknown) => void }).mockResolvedValue(mockApiResponse);

      const dispatch = vi.fn();
      
      const getState = vi.fn(() => ({
        filters: {
          searchText: 'React',
          city: '1',
          skills: ['Redux'],
        },
        vacancies: {
          page: 2,
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
      } as RootState));

      await getVacancies()(dispatch, getState, undefined);

      expect(fetchVacancies).toHaveBeenCalledTimes(1);
      
      expect(fetchVacancies).toHaveBeenCalledWith({
        text: 'React',
        area: '1',
        skills: ['Redux'],
        page: 2,
        per_page: 10,
      });
    });

    it('преобразует city="all" в undefined при вызове API', async () => {
      (fetchVacancies as unknown as { mockResolvedValue: (val: unknown) => void }).mockResolvedValue(mockApiResponse);
      const dispatch = vi.fn();
      
      const getState = vi.fn(() => ({
        filters: {
          searchText: '',
          city: 'all',
          skills: [],
        },
        vacancies: { 
          page: 0,
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
      } as RootState));

      await getVacancies()(dispatch, getState, undefined);

      expect(fetchVacancies).toHaveBeenCalledWith(expect.objectContaining({
        area: undefined,
      }));
    });

    it('диспатчит rejected, если API вернул ошибку', async () => {
      (fetchVacancies as unknown as { mockRejectedValue: (val: unknown) => void }).mockRejectedValue(new Error('API Fail'));
      
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({
        filters: { searchText: '', city: 'all', skills: [] },
        vacancies: { 
          page: 0,
          items: [],
          total: 0,
          loading: false,
          error: null,
        },
      } as RootState));

      await getVacancies()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledTimes(2); // pending + rejected
      
      const rejectedCall = dispatch.mock.calls[1][0] as { type: string; payload?: unknown };
      
      expect(rejectedCall.type).toBe('vacancies/getVacancies/rejected');
      expect(rejectedCall.payload).toBe('Ошибка загрузки вакансий');
    });
  });
});