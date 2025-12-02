import { Card, Text, Badge, Button, Group } from '@mantine/core';
import type { Vacancy } from '../../types/vacancy';
import style from './VacancyCard.module.css';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface VacancyCardProps {
  vacancy: Vacancy;
  hideActions?: boolean; 
  children?: ReactNode;  
}

function VacancyCard({ vacancy, hideActions = false, children }: VacancyCardProps) {

  const salary =
    vacancy.salary?.from || vacancy.salary?.to
      ? `${vacancy.salary?.from?.toLocaleString() ?? ''} – ${vacancy.salary?.to?.toLocaleString() ?? ''} ${vacancy.salary?.currency ?? '₽'}`
      : 'Доход не указан';

  let badgeProps = { color: 'gray', variant: 'light', c: 'dark' };
  
  if (vacancy.schedule?.name === 'remote' || vacancy.schedule?.id === 'remote') {
    badgeProps = { color: 'blue', variant: 'filled', c: 'white' };
  } else if (vacancy.schedule?.name === 'hybrid' || vacancy.schedule?.id === 'hybrid') {
    badgeProps = { color: 'dark', variant: 'filled', c: 'white' }; 
  } else {
    badgeProps = { color: 'gray', variant: 'light', c: 'dimmed' };
  }

  const scheduleText = 
    vacancy.schedule?.name === 'remote' ? 'можно удалённо' : 
    vacancy.schedule?.name === 'hybrid' ? 'гибрид' : 
    vacancy.schedule?.name === 'office' ? 'офис' : 
    vacancy.schedule?.name;

  return (
    <Card padding="lg" radius="md" shadow="xs" withBorder={false} mb="md">

      <Text size="xl" fw={600} c="blue" mb={4}>
        {vacancy.name}
      </Text>

      <Group gap="xs" mb="xs" align="center">
        <Text fw={700} size="md">
          {salary}
        </Text>
        <Text size="sm" c="dimmed">
          {vacancy.experience?.name ? `• ${vacancy.experience.name}` : ''}
        </Text>
      </Group>

      <Text size="sm" c="dimmed" mb="sm">
        {vacancy.employer?.name}
      </Text>

      <Group gap="xs" mb="sm">
         <Badge 
            color={badgeProps.color} 
            variant={badgeProps.variant} 
            c={badgeProps.c}
            radius="sm" 
            tt="none" 
         >
            {scheduleText}
         </Badge>
      </Group>
      
      <Text size="sm" mb="lg">
        {vacancy.area?.name}
      </Text>

      <Group>
        {!hideActions && (
          <>
            <Button 
              radius="md" 
              color="dark"
              size="md"
              px="xl"
              className={style.buttonLook}
            >
            <Link to={`/vacancy/${vacancy.id}`}>
            Смотреть вакансию
            </Link>
            </Button>
            
            <Button
              radius="md"
              variant="default"
              size="md"
              px="xl"
              className={style.button}
            >
              <Link to={`/vacancy/${vacancy.id}`}>
                Откликнуться
              </Link>
            </Button>
          </>
        )}
        {children}
      </Group>
    </Card>
  );
}

export default VacancyCard;