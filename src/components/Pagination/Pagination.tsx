import { Pagination } from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPage, getVacancies } from '../../features/vacancies/vacanciesSlice';
import style from './Pagination.module.css'

function VacanciesPagination() {
  const dispatch = useAppDispatch();
  const { total, page } = useAppSelector((state) => state.vacancies);

  
  const totalPages = Math.ceil(total / 10);

  const handleChange = (newPage: number) => {
    dispatch(setPage(newPage - 1)); 
    dispatch(getVacancies());
  };

  return (
    <Pagination
      value={page + 1}
      onChange={handleChange}
      total={totalPages}
      mt="lg"
      siblings={3}
     classNames={{ dots: style.hiddenDots }}
    />
  );
}

export default VacanciesPagination;
