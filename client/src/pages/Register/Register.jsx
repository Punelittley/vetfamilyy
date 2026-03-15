import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // ... (твои функции валидации: isRussianFullName, formatBirthDate, validateBirthDate, formatPhone оставляем без изменений)
  const isRussianFullName = (value) => /^[А-Яа-яЁё\s-]+$/.test(value);
  const formatBirthDate = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
  };
  
  const validateBirthDate = (birthDate) => {
    if (!birthDate || birthDate.length !== 10) return { valid: false, message: 'Введите дату в формате дд.мм.гггг' };
    const [day, month, year] = birthDate.split('.').map(Number);
    const today = new Date();
    const birth = new Date(year, month - 1, day);
    const age = today.getFullYear() - birth.getFullYear();
    if (age < 18) return { valid: false, message: 'Врач должен быть старше 18 лет' };
    return { valid: true };
  };

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('8')) numbers = '7' + numbers.slice(1);
    if (!numbers.startsWith('7')) numbers = '7' + numbers;
    numbers = numbers.slice(0, 11);
    if (numbers.length <= 1) return `+${numbers}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'birthDate') formattedValue = formatBirthDate(value);
    else if (name === 'phone') formattedValue = formatPhone(value);
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // (логика валидации перед отправкой остается как у тебя)
    try {
      const response = await axiosInstance.post('/auth/register', {
        ...formData,
        birthDate: formData.birthDate.split('.').reverse().join('-')
      });
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/doctor');
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Ошибка при регистрации' });
    }
  };

  return (
    <div className={styles.authContainer}>
      {/* Header удален */}
      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <p className={styles.welcomeTitle}>Добрый день!</p>
          <p className={styles.welcomeText}>Авторизуйтесь для доступа к данным клиники.</p>
        </div>

        <div className={styles.authForm}>
          <p className={styles.formTitle}>Создайте аккаунт</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ... все твои поля ввода оставляем ... */}
            <div className={styles.formGroup}>
              <label className={styles.label}>ФИО</label>
              <input name="fullName" value={formData.fullName} onChange={handleChange} className={styles.input} />
            </div>
            {/* (Повтори для остальных полей: gender, birthDate, phone, email, password) */}
            
            <div className={styles.but}>
              <button type="submit" className={styles.submitButton}>Создать аккаунт</button>
            </div>
          </form>
          <div className={styles.switchForm}>
            <button type="button" className={styles.switchButton} onClick={() => navigate('/login')}>
              <p>Уже есть аккаунт? <span style={{color:"#00547E", fontWeight:"600"}}>Войти</span></p>
            </button>
          </div>
        </div>
      </main>
      {/* Footer удален */}
    </div>
  );
};

export default Register;