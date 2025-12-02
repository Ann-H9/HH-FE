import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Image,
  Box,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import catImage from '../../assets/cat-404.gif';
import classes from './NotFoundPage.module.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box bg="gray.0" py={80} className={classes.wrapper}>
      <Container size="sm">
        <Paper shadow="sm" radius="lg" p={40} withBorder>
          <Group justify="space-between" align="flex-start" mb={30}>
            <Stack gap={5} className={classes.stack}>
              <Title order={2} className={classes.title}>
                Упс! Такой страницы <br /> не существует
              </Title>
              <Text c="dimmed" size="md">
                Давайте перейдём к началу.
              </Text>
            </Stack>

            <Button
              onClick={() => navigate('/')}
              size="md"
              radius="md"
              color="blue"
            >
              На главную
            </Button>
          </Group>

          <Image
            src={catImage}
            alt="404 Cat"
            radius="md"
            h={320}
            w="100%"
            fit="cover"
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
