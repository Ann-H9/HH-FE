import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card,  Container, Loader, Text, Title, Box, Button } from '@mantine/core';
import VacancyCard from '../../components/VacancyCard/VacancyCard';
import { getVacancy, clearCurrentVacancy } from '../../features/vacancies/vacanciesSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';


function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentVacancy, loading, error } = useAppSelector((state) => state.vacancies);

  useEffect(() => {
    if (id) {
      dispatch(getVacancy(id));
    }
    return () => {
      dispatch(clearCurrentVacancy());
    };
  }, [dispatch, id]);

  if (loading) return <Container><Loader /></Container>;
  if (error) return <Container><Text c="red">Ошибка: {error}</Text></Container>;
  if (!currentVacancy) return <Container><Text>Вакансия не найдена</Text></Container>;

  return (
    <Container size="md" py="xl">
      <VacancyCard vacancy={currentVacancy} hideActions>
         <Button
          component="a" 
          href={currentVacancy.alternate_url} 
          target="_blank" 
          radius="md"
          size="md"
          px="xl"
          color='black'
        >
          Откликнуться на hh.ru
        </Button>
      </VacancyCard>

      <Card shadow="xs" padding="lg" radius="md" withBorder mt="md">
        <Title order={3} mb="md">О компании</Title>
        
        <Box 
          dangerouslySetInnerHTML={{ __html: currentVacancy.description }} 
          style={{ lineHeight: 1.6, fontSize: '16px' }}
        />
      </Card>
    </Container>
  );
}

export default VacancyPage;