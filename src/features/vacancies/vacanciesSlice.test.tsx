import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VacanciesState } from './vacanciesSlice';
import vacanciesReducer, { 
  setPage,
  clearCurrentVacancy,
  getVacancies,
  getVacancy,
} from './vacanciesSlice';
import type { RootState } from '../../store';

vi.mock('../../services/hhApi', () => ({
  fetchVacancies: vi.fn(),
  fetchVacancyById: vi.fn(),
}));

import { fetchVacancies, fetchVacancyById } from '../../services/hhApi';


const initialState: VacanciesState = {
  items: [],
  total: 0,
  currentVacancy: null,
  loading: false,
  error: null,
  page: 0,
};

const mockVacancy = {
  id: '1',
  name: 'Frontend Developer',
  description: '<p>Ищем опытного Frontend разработчика</p>',
  alternate_url: 'https://hh.ru/vacancy/123456',
  salary: { from: 100000, to: 150000, currency: 'RUR' },
  schedule: { id: 'remote', name: 'remote' },
  experience: { name: '3–6 лет' },
  employer: { name: 'Tech Corp' },
  area: { name: 'Москва' },
  url: 'https://hh.ru/vacancy/123456',
};

const mockApiResponse = { 
  items: [mockVacancy],
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

    it('clearCurrentVacancy: очищает текущую вакансию', () => {
      const stateWithVacancy = { ...initialState, currentVacancy: mockVacancy };
      const nextState = vacanciesReducer(stateWithVacancy, clearCurrentVacancy());
      expect(nextState.currentVacancy).toBe(null);
    });
  });

  describe('getVacancies thunk', () => {
    
    it('pending: установить loading = true и очистить error', () => {
      const action = getVacancies.pending('requestId', undefined);
      
      const stateWithError: VacanciesState = { ...initialState, error: 'Old error' };
      const nextState = vacanciesReducer(stateWithError, action);

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('fulfilled: сохранить данные и убрать loading', () => {
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

    it('rejected: записать ошибку и убрать loading', () => {
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

  describe('getVacancy thunk', () => {
    
    it('pending: установить loading = true', () => {
      const action = getVacancy.pending('requestId', '1');
      
      const nextState = vacanciesReducer(initialState, action);

      expect(nextState.loading).toBe(true);
      expect(nextState.error).toBe(null);
    });

    it('fulfilled: сохранить currentVacancy', () => {
      const action = getVacancy.fulfilled(
        mockVacancy,
        'requestId', 
        '1'
      ) as unknown as ReturnType<typeof getVacancy.fulfilled>;

      const nextState = vacanciesReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.currentVacancy).toEqual(mockVacancy);
    });

    it('rejected: записать ошибку', () => {
      const action = getVacancy.rejected(
        new Error('Not found'),
        'requestId',
        '1',
        'Ошибка загрузки описания вакансии'
      );

      const nextState = vacanciesReducer(initialState, action);

      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Ошибка загрузки описания вакансии');
    });
  });

  describe('getVacancies thunk logic', () => {
    it('вызывает API с правильными параметрами', async () => {
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
          currentVacancy: null,
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

    it('преобразует city="all" в undefined', async () => {
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
          currentVacancy: null,
          loading: false,
          error: null,
        },
      } as RootState));

      await getVacancies()(dispatch, getState, undefined);

      expect(fetchVacancies).toHaveBeenCalledWith(expect.objectContaining({
        area: undefined,
      }));
    });
  });

  describe('getVacancy thunk logic', () => {
    it('вызывает fetchVacancyById с правильным id', async () => {
      (fetchVacancyById as unknown as { mockResolvedValue: (val: unknown) => void }).mockResolvedValue(mockVacancy);

      const dispatch = vi.fn();
      const getState = vi.fn(() => ({} as RootState));

      await getVacancy('1')(dispatch, getState, undefined);

      expect(fetchVacancyById).toHaveBeenCalledTimes(1);
      expect(fetchVacancyById).toHaveBeenCalledWith('1');
    });

    it('диспатчит rejected при ошибке API', async () => {
      (fetchVacancyById as unknown as { mockRejectedValue: (val: unknown) => void }).mockRejectedValue(new Error('Not found'));
      
      const dispatch = vi.fn();
      const getState = vi.fn(() => ({} as RootState));

      await getVacancy('999')(dispatch, getState, undefined);

      const rejectedCall = dispatch.mock.calls.find(
        (call) => (call[0] as { type: string }).type === 'vacancies/getVacancy/rejected'
      )?.[0] as { type: string; payload?: unknown };
      
      expect(rejectedCall?.type).toBe('vacancies/getVacancy/rejected');
      expect(rejectedCall?.payload).toBe('Ошибка загрузки описания вакансии');
    });
  });
});