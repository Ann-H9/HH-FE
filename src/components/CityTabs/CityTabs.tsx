import { Tabs } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';

function CityTabs() {
  const navigate = useNavigate();
  const { citySlug } = useParams<{ citySlug: string }>();
  const activeTab = citySlug === 'petersburg' ? 'petersburg' : 'moscow';

  const handleTabChange = (value: string | null) => {
    if (value) {
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