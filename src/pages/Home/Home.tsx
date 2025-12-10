import { Container, Grid, Title, Text, Paper, Box, Stack, Group } from '@mantine/core';
import SearchBar from '../../components/SearchBar/SearchBar';
import CityTabs from '../../components/CityTabs/CityTabs'; 
import SkillTags from '../../components/SkillTags/SkillTags';
import VacanciesPagination from '../../components/Pagination/Pagination';
import VacancyCard from '../../components/VacancyCard/VacancyCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect } from 'react';
import { getVacancies, setPage } from '../../features/vacancies/vacanciesSlice';
import { setCity, setSearchText, setSkills } from '../../features/filters/filtersSlice';
import { useParams, useSearchParams } from 'react-router-dom';

const CITY_IDS: Record<string, string> = {
  moscow: '1',
  petersburg: '2',
};

function Home() {
  const { items, loading, error, page } = useAppSelector((state) => state.vacancies);
  const { searchText, skills } = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();
  const { citySlug } = useParams<{ citySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchText) params.set('search', searchText);
    if (page > 0) params.set('page', String(page));
    if (skills.length > 0) params.set('skills', skills.join(','));

    setSearchParams(params);
  }, [searchText, page, skills, setSearchParams]);

  useEffect(() => {
    const currentCityId = citySlug && CITY_IDS[citySlug] ? CITY_IDS[citySlug] : '1';
    dispatch(setCity(currentCityId));

    const searchFromUrl = searchParams.get('search');
    const pageFromUrl = searchParams.get('page');
    const skillsFromUrl = searchParams.get('skills');

    if (searchFromUrl) {
      dispatch(setSearchText(searchFromUrl));
    }
    if (pageFromUrl) {
      dispatch(setPage(parseInt(pageFromUrl, 10)));
    }
    if (skillsFromUrl) {
      const skillsArray = skillsFromUrl.split(',');
      dispatch(setSkills(skillsArray));
    }

    dispatch(getVacancies());
  }, [dispatch, citySlug, searchParams]);

  return (
    <Box bg="#F5F5F6" mih="100vh" pt="xl">
      <Container size="xl" pb="xl">
        <Group justify="space-between" align="flex-start" mb="xl">
          <Box>
            <Title order={1} fw={700} size={32} lh={1.1}>
              Список вакансий
            </Title>
            <Text c="dimmed" size="md" mt={4}>
              по профессии Frontend-разработчик
            </Text>
          </Box>
          
          <Box w={{ base: '100%', sm: 400, md: 500 }}>
             <SearchBar />
          </Box>
        </Group>

        <Grid gutter="lg">

          <Grid.Col span={{ base: 12, md: 4 }}>
             <Stack gap="md" w="100%">
                <Paper p="md" radius="md" shadow="xs" withBorder={false}>
                  <SkillTags />
                </Paper>
             </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
          
            <CityTabs />

            <Stack gap="md">
              {loading && <Text>Загрузка...</Text>}
              {error && <Text c="red">{error}</Text>}

              {!loading && !error && (
                <>
                  {items.map((vacancy) => (
                    <VacancyCard key={vacancy.id} vacancy={vacancy} />
                  ))}

                  <Group justify="center" mt="xl">
                    <VacanciesPagination />
                  </Group>
                </>
              )}
            </Stack>
          </Grid.Col>

        </Grid>
      </Container>
    </Box>
  );
}

export default Home;