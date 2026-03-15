import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('user'); 
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection} onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="VetFamily Logo" className={styles.logoImg} />
          <span className={styles.clinicName}>VetFamily</span>
        </div>

        <nav className={styles.nav}>
          {user ? (
            <>
              {user.role === 'doctor' && (
                <>
                  <Link to="/doctor" className={styles.navLink}>Пациенты</Link>
                  <Link to="/doctor/patient/new" className={styles.navLink}>Новый пациент</Link>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className={styles.navLink}>Управление врачами</Link>
                  <Link to="/admin" className={styles.navLink}>Отчеты</Link>
                </>
              )}

              <div className={styles.userSection}>
                <span className={styles.userName}>{user.fullName}</span>
                <button onClick={handleLogout} className={styles.logoutButton}>Выйти</button>
              </div>
            </>
          ) : (
            <Link to="/login" className={styles.loginLink}>Войти</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;