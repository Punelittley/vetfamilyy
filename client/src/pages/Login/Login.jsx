import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/doctor');
        }
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Ошибка при входе'
      });
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Header удален, так как он теперь в App.jsx */}
      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <p className={styles.welcomeTitle}>Добрый день!</p>
          <p className={styles.welcomeText}>Авторизуйтесь для доступа к данным клиники.</p>
        </div>

        <div className={styles.authForm}>
          <p className={styles.formTitle}>Войдите в личный кабинет</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Логин</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Login ID"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              />
            </div>
            {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
            <div className={styles.but}>
              <button type="submit" className={styles.submitButton}>Войти</button>
            </div>
          </form>
          <div className={styles.switchForm}>
            <button type="button" className={styles.switchButton} onClick={() => navigate('/register')}>
              <p>Еще нет аккаунта? <span style={{color:"#00547E", fontWeight:"600"}}>Зарегистрироваться</span></p>
            </button>
          </div>
        </div>
      </main>
      {/* Footer удален, если ты перенесешь его в App.jsx */}
    </div>
  );
};

export default Login;