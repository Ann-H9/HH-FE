import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SearchBar from './SearchBar';



const mockDispatch = vi.fn();

type MockState = {
  filters: {
    searchText: string;
  };
};


vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: MockState) => unknown) => 
    selector({
      filters: { searchText: '' } 
    }),
}));

vi.mock('../../features/filters/filtersSlice', () => ({
  setSearchText: (text: string) => ({ type: 'filters/setSearchText', payload: text }),
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


describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерится корректно (инпут и кнопка)', () => {
    renderWithMantine(<SearchBar />);

    const input = screen.getByPlaceholderText(/Должность или название компании/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');

    const button = screen.getByRole('button', { name: /Найти/i });
    expect(button).toBeInTheDocument();
  });

  it('диспатчит getVacancies при клике на кнопку "Найти"', async () => {
    const user = userEvent.setup();
    renderWithMantine(<SearchBar />);

    const button = screen.getByRole('button', { name: /Найти/i });
    
    await user.click(button);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'vacancies/getVacancies',
    });
  });

  it('диспатчит getVacancies при нажатии Enter в поле ввода', async () => {
    const user = userEvent.setup();
    renderWithMantine(<SearchBar />);

    const input = screen.getByPlaceholderText(/Должность или название компании/i);
    
    await user.type(input, '{enter}');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'vacancies/getVacancies',
    });
  });
});