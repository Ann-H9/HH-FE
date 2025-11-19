import { Paper, Select } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCity } from '../../features/filters/filtersSlice';
import { getVacancies } from '../../features/vacancies/vacanciesSlice';

function CitySelect() {
  const dispatch = useAppDispatch();
  const city = useAppSelector((state) => state.filters.city);

  const handleChange = (value: string | null) => {
    if (value) {
      dispatch(setCity(value));
      dispatch(getVacancies());
    }
  };


  const cities = [
    { value: 'all', label: 'Все города' },
    { value: '1', label: 'Москва' },
    { value: '2', label: 'Санкт-Петербург' },
  ];

  return (
    <Paper p="md" radius="md" shadow="xs" withBorder={false}>
      <Select
        value={city || 'all'}
        onChange={handleChange}
        data={cities}
        leftSection={<IconMapPin size={16} />}
        allowDeselect={false}
        rightSectionWidth={30}
        radius="md"
        variant="default"
        styles={{
          input: { border: '1px solid #E0E0E0' }
        }}
      />
    </Paper>
  );
}

export default CitySelect;