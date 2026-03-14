import React, { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import styles from './ProfileTab.module.css';

const ProfileTab = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    gender: user?.gender || '',
    birthDate: user?.birthDate || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatDateForServer = (dateString) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('.');
    return `${year}-${month}-${day}`;
  };

  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('8')) numbers = '7' + numbers.slice(1);
    if (!numbers.startsWith('7')) numbers = '7' + numbers;
    numbers = numbers.slice(0, 11);

    if (numbers.length === 0) return '';
    if (numbers.length === 1) return `+${numbers}`;
    if (numbers.length <= 4) return `+7 (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'birthDate') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) formattedValue = numbers;
      else if (numbers.length <= 4) formattedValue = `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      else if (numbers.length <= 8) formattedValue = `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
      else formattedValue = `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name] || errors.submit) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: '', 
        submit: '' 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Введите ФИО';
    if (!formData.gender) newErrors.gender = 'Выберите пол';
    if (!formData.birthDate) newErrors.birthDate = 'Введите дату рождения';
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 11) {
      newErrors.phone = 'Введите корректный номер';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put('/doctor/profile', {
        fullName: formData.fullName,
        gender: formData.gender,
        birthDate: formatDateForServer(formData.birthDate),
        phone: formData.phone,
        email: formData.email
      });

      if (response.data.success) {
        onUpdate();
        setIsEditing(false);
        setErrors({});
        alert('Данные успешно обновлены!');
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Ошибка при обновлении'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      gender: user?.gender || '',
      birthDate: formatDateForInput(user?.birthDate),
      phone: user?.phone || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className={styles.profileTab}>
      <p className={styles.header}>Карточка сотрудника</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Логин</label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className={`${styles.input} ${styles.disabled}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>ФИО</label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
              />
            ) : (
              <input type="text" value={user?.fullName || ''} disabled className={`${styles.input} ${styles.disabled}`} />
            )}
            {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Пол</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${styles.input} ${styles.select} ${errors.gender ? styles.inputError : ''}`}
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            ) : (
              <input
                type="text"
                value={user?.gender === 'male' ? 'Мужской' : 'Женский'}
                disabled
                className={`${styles.input} ${styles.disabled}`}
              />
            )}
            {errors.gender && <span className={styles.errorText}>{errors.gender}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Дата рождения</label>
            {isEditing ? (
              <input
                type="text"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                placeholder="дд.мм.гггг"
                maxLength="10"
                className={`${styles.input} ${errors.birthDate ? styles.inputError : ''}`}
              />
            ) : (
              <input type="text" value={formatDateForInput(user?.birthDate)} disabled className={`${styles.input} ${styles.disabled}`} />
            )}
            {errors.birthDate && <span className={styles.errorText}>{errors.birthDate}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Номер телефона</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (xxx) xxx-xx-xx"
                maxLength="18"
                className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
              />
            ) : (
              <input type="tel" value={user?.phone || ''} disabled className={`${styles.input} ${styles.disabled}`} />
            )}
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Электронная почта</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
            ) : (
              <input type="email" value={user?.email || ''} disabled className={`${styles.input} ${styles.disabled}`} />
            )}
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>

          {!isEditing && (
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              Редактировать
            </button>
          )}

          {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

          {
            isEditing && (
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton} disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                  Отмена
                </button>
              </div>
            )
          }
        </div>
      </form >
    </div>
  );
};

export default ProfileTab;