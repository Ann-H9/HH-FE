import { Tabs } from '@mantine/core';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setPage, getVacancies } from '../../features/vacancies/vacanciesSlice';

function CityTabs() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { citySlug } = useParams<{ citySlug: string }>();
  const [, setSearchParams] = useSearchParams();
  const activeTab = citySlug === 'petersburg' ? 'petersburg' : 'moscow';

  const handleTabChange = (value: string | null) => {
    if (value) {
      dispatch(setPage(0));
      setSearchParams(new URLSearchParams());
      dispatch(getVacancies());
      navigate(`/vacancies/${value}`);
    }
  };

  return (
    <Tabs 
      value={activeTab} 
      onChange={handleTabChange} 
      variant="default" 
      radius="md"
      mb="md" 
    >
      <Tabs.List>
        <Tabs.Tab value="moscow" fz="md">Москва</Tabs.Tab>
        <Tabs.Tab value="petersburg" fz="md">Санкт-Петербург</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

export default CityTabs;