import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CitySelect from './CitySelect';


const mockDispatch = vi.fn();


vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: { filters: { city: string | null } }) => unknown) => 
    selector({
      filters: { city: null }
    }),
}));

vi.mock('../../features/filters/filtersSlice', () => ({
  setCity: (value: string) => ({ type: 'filters/setCity', payload: value }),
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


describe('CitySelect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерится с дефолтным значением "Все города"', () => {
    renderWithMantine(<CitySelect />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Все города');
  });

  it('вызывает dispatch с правильными экшенами при смене города', async () => {
    const user = userEvent.setup();
    renderWithMantine(<CitySelect />);


    const input = screen.getByRole('textbox');
    await user.click(input);

    const moscowOption = await screen.findByText('Москва');
    await user.click(moscowOption);

  
    expect(mockDispatch).toHaveBeenCalledTimes(2);

    expect(mockDispatch).toHaveBeenNthCalledWith(1, { 
      type: 'filters/setCity', 
      payload: '1' 
    });
    
    expect(mockDispatch).toHaveBeenNthCalledWith(2, { 
      type: 'vacancies/getVacancies' 
    });
  });

});