import axios from 'axios';
import type { Vacancy } from '../types/vacancy';

const API_URL = 'https://api.hh.ru/vacancies';

interface VacanciesResponse {
  items: Vacancy[];
  found: number;
  pages: number;
  per_page: number;
  page: number;
}

interface FetchParams {
  text?: string;
  area?: string;
  skills?: string[];
  page?: number;
  per_page?: number;
}


export async function fetchVacancies(params: FetchParams = {}): Promise<VacanciesResponse> {
  const { text, area, skills, page = 0, per_page = 10 } = params;

 
  const searchText = skills?.length ? `${text || ''} ${skills.join(' ')}`.trim() : text;

  const response = await axios.get<VacanciesResponse>(API_URL, {
    params: {
      industry: 7, // IT
      professional_role: 96,
      text: searchText,
      area,
      page,
      per_page,
    },
  });

  return response.data;
}

export async function fetchVacancyById(id: string): Promise<Vacancy> {
  const response = await axios.get<Vacancy>(`${API_URL}/${id}`);
  return response.data;
}