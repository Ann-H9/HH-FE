import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useAppSelector } from '../../store/hooks';
import Home from './Home';


interface MockVacancy {
  id: string;
  name: string;
}

interface MockState {
  vacancies: {
    items: MockVacancy[];
    loading: boolean;
    error: string | null;
  };
}


const mockDispatch = vi.fn();


vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
}));


vi.mock('../../features/vacancies/vacanciesSlice', () => ({
  getVacancies: () => ({ type: 'vacancies/getVacancies' }),
}));




vi.mock('../../components/SearchBar/SearchBar', () => ({
  default: () => <div data-testid="mock-search-bar" />
}));

vi.mock('../../components/CitySelect/CitySelect', () => ({
  default: () => <div data-testid="mock-city-select" />
}));

vi.mock('../../components/SkillTags/SkillTags', () => ({
  default: () => <div data-testid="mock-skill-tags" />
}));

vi.mock('../../components/Pagination/Pagination', () => ({
  default: () => <div data-testid="mock-pagination" />
}));

vi.mock('../../components/VacancyCard/VacancyCard', () => ({
  default: ({ vacancy }: { vacancy: MockVacancy }) => (
    <div data-testid="mock-vacancy-card">{vacancy.name}</div>
  )
}));


const renderWithMantine = (component: React.ReactNode) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};


describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('диспатчит getVacancies при первом рендере (useEffect)', () => {
    (useAppSelector as Mock).mockImplementation((selector: (state: MockState) => unknown) => 
      selector({
        vacancies: { items: [], loading: false, error: null }
      })
    );

    renderWithMantine(<Home />);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'vacancies/getVacancies' });
  });

  it('рендерит основные элементы верстки и дочерние компоненты', () => {
    (useAppSelector as Mock).mockImplementation((selector: (state: MockState) => unknown) => 
      selector({
        vacancies: { items: [], loading: false, error: null }
      })
    );

    renderWithMantine(<Home />);

    expect(screen.getByText('Список вакансий')).toBeInTheDocument();
    expect(screen.getByText(/Frontend-разработчик/i)).toBeInTheDocument();

    expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-city-select')).toBeInTheDocument();
    expect(screen.getByTestId('mock-skill-tags')).toBeInTheDocument();
    expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();
  });

  it('отображает индикатор загрузки, если loading=true', () => {
    (useAppSelector as Mock).mockImplementation((selector: (state: MockState) => unknown) => 
      selector({
        vacancies: { items: [], loading: true, error: null }
      })
    );

    renderWithMantine(<Home />);

    expect(screen.getByText('Загрузка...')).toBeInTheDocument();

    expect(screen.queryByTestId('mock-vacancy-card')).not.toBeInTheDocument();
  });

  it('отображает ошибку, если error не null', () => {
    (useAppSelector as Mock).mockImplementation((selector: (state: MockState) => unknown) => 
      selector({
        vacancies: { items: [], loading: false, error: 'Ошибка сервера' }
      })
    );

    renderWithMantine(<Home />);

    expect(screen.getByText('Ошибка сервера')).toBeInTheDocument();
  });

  it('рендерит список карточек вакансий, когда есть items', () => {
    const mockItems = [
      { id: '1', name: 'Junior React Dev' },
      { id: '2', name: 'Senior Vue Dev' },
    ];

    (useAppSelector as Mock).mockImplementation((selector: (state: MockState) => unknown) => 
      selector({
        vacancies: { items: mockItems, loading: false, error: null }
      })
    );

    renderWithMantine(<Home />);

    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    expect(screen.queryByText('Ошибка сервера')).not.toBeInTheDocument();

  
    const cards = screen.getAllByTestId('mock-vacancy-card');
    expect(cards).toHaveLength(2);

    expect(screen.getByText('Junior React Dev')).toBeInTheDocument();
    expect(screen.getByText('Senior Vue Dev')).toBeInTheDocument();
  });
});