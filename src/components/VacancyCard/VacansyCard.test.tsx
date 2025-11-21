import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, it, expect } from 'vitest';
import VacancyCard from './VacancyCard';
import type { Vacancy } from '../../types/vacancy';

const renderWithMantine = (component: React.ReactNode) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

const baseVacancy: Vacancy = {
  id: '1',
  name: 'Frontend Developer',
  salary: { from: 100000, to: 150000, currency: 'RUR' },
  schedule: { id: 'remote', name: 'remote' },
  experience: { name: '3–6 лет' },
  employer: { name: 'Tech Corp' },
  area: { name: 'Москва' },
  url: 'https://hh.ru/vacancy/123456',
};

describe('VacancyCard Component', () => {
  it('рендерит основную информацию (название, работодатель, город)', () => {
    renderWithMantine(<VacancyCard vacancy={baseVacancy} />);

    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Москва')).toBeInTheDocument();
    expect(screen.getByText(/• 3–6 лет/)).toBeInTheDocument();
  });

  it('отображает "Доход не указан", если зарплаты нет', () => {
    const noSalaryVacancy: Vacancy = { ...baseVacancy, salary: undefined };

    renderWithMantine(<VacancyCard vacancy={noSalaryVacancy} />);

    expect(screen.getByText('Доход не указан')).toBeInTheDocument();
  });

  it('отображает правильный бейдж для удаленки (remote)', () => {
    const remoteVacancy: Vacancy = {
      ...baseVacancy,
      schedule: { id: 'remote', name: 'remote' },
    };

    renderWithMantine(<VacancyCard vacancy={remoteVacancy} />);

    expect(screen.getByText('МОЖНО УДАЛЁННО')).toBeInTheDocument();
  });

  it('отображает правильный бейдж для гибрида (hybrid)', () => {
    const hybridVacancy: Vacancy = {
      ...baseVacancy,
      schedule: { id: 'hybrid', name: 'hybrid' },
    };

    renderWithMantine(<VacancyCard vacancy={hybridVacancy} />);
    expect(screen.getByText('ГИБРИД')).toBeInTheDocument();
  });

  it('отображает стандартный бейдж для офиса', () => {
    const officeVacancy: Vacancy = {
      ...baseVacancy,
      schedule: { id: 'office', name: 'office' },
    };

    renderWithMantine(<VacancyCard vacancy={officeVacancy} />);

    expect(screen.getByText('офис')).toBeInTheDocument();
  });

});