import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';


import { useAppSelector } from '../../store/hooks';
import SkillTags from './SkillTags';


type MockState = {
  filters: {
    skills: string[];
  };
};

const mockDispatch = vi.fn();

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
}));

vi.mock('../../features/filters/filtersSlice', () => ({
  addSkill: (skill: string) => ({ type: 'filters/addSkill', payload: skill }),
  removeSkill: (skill: string) => ({ type: 'filters/removeSkill', payload: skill }),
}));

vi.mock('../../features/vacancies/vacanciesSlice', () => ({
  getVacancies: () => ({ type: 'vacancies/getVacancies' }),
}));

const renderWithMantine = (component: React.ReactNode) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('SkillTags Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAppSelector as Mock).mockImplementation((selector: (state: MockState) => unknown) => 
      selector({
        filters: { skills: [] }
      })
    );
  });

  it('рендерится корректно (поле ввода и заголовок)', () => {
    renderWithMantine(<SkillTags />);

    expect(screen.getByText('Ключевые навыки')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Навык')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить навык' })).toBeInTheDocument();
  });

  it('отображает список навыков из стейта', () => {
    (useAppSelector as Mock).mockImplementation(
      (selector: (state: MockState) => unknown) => 
        selector({ filters: { skills: ['React', 'TypeScript'] } })
    );

    renderWithMantine(<SkillTags />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('добавляет навык при клике на кнопку "+" и очищает инпут', async () => {
    const user = userEvent.setup();
    renderWithMantine(<SkillTags />);

    const input = screen.getByPlaceholderText('Навык');
    const addButton = screen.getByRole('button', { name: 'Добавить навык' });

    await user.type(input, 'Docker');
    await user.click(addButton);

    expect(mockDispatch).toHaveBeenCalledTimes(2); 
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'filters/addSkill', 
      payload: 'Docker' 
    });
    
    expect(input).toHaveValue('');
  });

  it('добавляет навык при нажатии Enter', async () => {
    const user = userEvent.setup();
    renderWithMantine(<SkillTags />);

    const input = screen.getByPlaceholderText('Навык');
    
    await user.type(input, 'Vite{enter}');

    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'filters/addSkill', 
      payload: 'Vite' 
    });
    expect(input).toHaveValue('');
  });

  it('не добавляет пустой навык или пробелы', async () => {
    const user = userEvent.setup();
    renderWithMantine(<SkillTags />);

    const input = screen.getByPlaceholderText('Навык');
    const addButton = screen.getByRole('button', { name: 'Добавить навык' });

    await user.type(input, '   ');
    await user.click(addButton);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

});