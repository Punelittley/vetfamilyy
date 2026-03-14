import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import styles from './DoctorScheduleTab.module.css';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';

const DoctorScheduleTab = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      const response = await axiosInstance.get(`/visits/schedule?${params.toString()}`);
      if (response.data.success) {
        setVisits(response.data.visits || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleCreatePlanned = async (patientId) => {
    if (!patientId) return;
    const date = window.prompt('Введите дату записи (ГГГГ-ММ-ДД):');
    if (!date) return;
    const time = window.prompt('Введите время (например, 14:30):') || null;
    try {
      await axiosInstance.post('/visits/schedule', { patientId, date, time });
      await loadSchedule();
      alert('Запись создана');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка создания записи');
    }
  };

  return (
    <div className={styles.scheduleTab}>
      <p className={styles.header}>Записи</p>

      <SearchBar
        role="doctor"
        placeholder="Поиск"
        onSelect={(patient) => handleCreatePlanned(patient.id)}
      />

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>С</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className={styles.filterGroup}>
          <label>По</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button className={styles.reloadButton} onClick={loadSchedule} disabled={loading}>
          {loading ? 'Загрузка...' : 'Обновить'}
        </button>
      </div>

      {visits.length === 0 && !loading && (
        <div className={styles.empty}>Записей на выбранный период нет</div>
      )}

      <div className={styles.list}>
        {visits.map((visit) => (
          <div
            key={visit.id}
            className={styles.item}
            onClick={() => visit.patient && navigate(`/doctor/patient/${visit.patient.id}`)}
          >
            <div className={styles.row}>
              <span className={styles.date}>
                {new Date(visit.date).toLocaleDateString('ru-RU')}
                {visit.time && `, ${visit.time}`}
              </span>
            </div>
            {visit.patient && (
              <div className={styles.row}>
                <span className={styles.pet}>{visit.patient.name}</span>
                <span className={styles.owner}>{visit.patient.ownerName}</span>
              </div>
            )}
            {visit.complaints && (
              <div className={styles.complaints}>{visit.complaints}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorScheduleTab;

