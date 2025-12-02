import style from './Header.module.css';
import logo from '../../assets/Frame3.png';
import ellipse from '../../assets/Ellipse2.png';
import user_circle from '../../assets/user-circle.png';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const isVacanciesActive = location.pathname === '/' || location.pathname.includes('vacanc');
  
  const isAboutMeActive = location.pathname === '/about_me';

  return (
    <header className={style.header}>
      <div className={style.header__logo}>
        <img src={logo} alt="Logo" />
      </div>

      <nav className={style.header__nav}>
        <Link 
          to="/vacancies/moscow" 
          className={`${style.nav_link} ${isVacanciesActive ? style.active : style.inactive}`}
        >
          Вакансии FE
          {isVacanciesActive && <img src={ellipse} className={style.dot} alt="active" />}
        </Link>

        <Link 
          to="/about_me" 
          className={`${style.nav_link} ${isAboutMeActive ? style.active : style.inactive}`}
        >
          <img src={user_circle} className={style.user_icon} alt="user" />
          Обо мне
          {isAboutMeActive && <img src={ellipse} className={style.dot} alt="active" />}
        </Link>
      </nav>
    </header>
  );
}

export default Header;