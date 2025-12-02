
import styles from "./AboutMe.module.css";

const AboutMe = () => {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Обо мне</h1>

      <p className={styles.paragraph}>
        Привет! Меня зовут Анастасия, я фронтенд‑разработчик с опытом создания
        современных веб‑приложений. Моя цель — проектировать интерфейсы, которые
        сочетают функциональность, эстетику и удобство использования.
      </p>

      <p className={styles.skillsTitle}>Ключевые навыки:</p>
      <ul className={styles.skillsList}>
        <li className={styles.skillItem}>HTML, CSS, JavaScript</li>
        <li className={styles.skillItem}>React, Redux</li>
        <li className={styles.skillItem}>TypeScript</li>
        <li className={styles.skillItem}>
          Адаптивный дизайн и кроссбраузерная совместимость
        </li>
      </ul>

      <p className={styles.paragraph}>
        Я постоянно развиваюсь и открыта для новых вызовов в сфере фронтенда.
        Если вы хотите обсудить сотрудничество или узнать больше обо мне —
        буду рада вашему отклику.
      </p>
    </section>
  );
};

export default AboutMe;
