import { Button, Flex, TextInput } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSearchText } from '../../features/filters/filtersSlice';
import { getVacancies } from '../../features/vacancies/vacanciesSlice';
import  style  from './SearchBar.module.css';

function SearchBar() {
  const dispatch = useAppDispatch();
  const searchText = useAppSelector((state) => state.filters.searchText);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchText(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(getVacancies());
  };

  return (
    <form onSubmit={handleSubmit} >
      <Flex gap="sm" w={508} >
        <TextInput
          value={searchText}
          onChange={handleChange}
          placeholder="Должность или название компании"
          radius="md"
          size="md"
          className={style.searchInput}
        />
        <Button type="submit" color='#1565C0' radius="md" size="md">
          Найти
        </Button>
      </Flex>
    </form>
  );
}

export default SearchBar;
