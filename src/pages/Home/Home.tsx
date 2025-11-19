import { Container, Grid, Title, Text, Paper, Box, Stack, Group } from '@mantine/core';
import SearchBar from '../../components/SearchBar/SearchBar';
import CitySelect from '../../components/CitySelect/CitySelect';
import SkillTags from '../../components/SkillTags/SkillTags';
import VacanciesPagination from '../../components/Pagination/Pagination';
import VacancyCard from '../../components/VacancyCard/VacancyCard';
import { useAppSelector } from '../../store/hooks';

function Home() {
  const { items, loading, error } = useAppSelector((state) => state.vacancies);

  return (
    <Box bg="#F5F5F6" mih="100vh" pt="xl">
      <Container size="xl" pb="xl">
        <Grid gutter="lg">
          
        
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xl">
             
              <Box>
                <Title order={1} fw={700} size={32} lh={1.1}>
                  Список вакансий
                </Title>
                <Text c="dimmed" size="md" mt={4}>
                  по профессии Frontend-разработчик
                </Text>
              </Box>

              <Stack gap="md" maw={350} w="100%">
                <Paper p="md" radius="md" shadow="xs" withBorder={false}>
                  <SkillTags />
                </Paper>
                <CitySelect />
              </Stack>
            </Stack>
          </Grid.Col>

          
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="xl">
              
      
              <Group justify="flex-end" w="100%">
        
                <Box w={{ base: '100%', sm: 508 }}>
                  <SearchBar />
                </Box>
              </Group>

             
              <Stack gap="md">
                {loading && <Text>Загрузка...</Text>}
                {error && <Text c="red">{error}</Text>}

                {!loading && !error && items.map((vacancy) => (
                  <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}

                 <Group justify="center">
                  <VacanciesPagination />
                </Group>
              </Stack>

            </Stack>
          </Grid.Col>

        </Grid>
      </Container>
    </Box>
  );
}

export default Home;