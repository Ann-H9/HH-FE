import style from './Header.module.css'
import logo from '../../assets/Frame3.png';
import ellipse from '../../assets/Ellipse2.png';
import user_circle from '../../assets/user-circle.png';

function Header() {
  return (
    <header className={style.header}>
      <div className={style.header__logo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={style.header__about_me}>
        <span>Вакансии FE <img  src={ellipse}/> </span>
        <span className={style.header__text_grey}> <img src={user_circle}/> Обо мне </span>
      </div>
    </header>
  );
}

export default Header;