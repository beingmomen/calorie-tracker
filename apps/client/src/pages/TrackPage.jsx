import axios from 'axios';

import RecordList from '../components/CalorieRecordsSection/RecordList';
import CalorieRecordEdit from '../components/edit/CalorieRecordEdit';
// import Counter from "./Counter";
import { useState, useEffect } from 'react';
import styles from './TrackPage.module.css';
import AppContext from '../app-context';

const INITIAL_RECORDS = [];

export function TrackPage() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [totalCalories, setTotalCalories] = useState(0);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const total = records.reduce((acc, cur) => {
      return acc + parseInt(cur.calories);
    }, 0);
    setTotalCalories(total);
  }, [records]);

  const fetchAllRecords = async () => {
    const { data } = await axios.get('/api/v1/records');
    setRecords(
      data.data.map(record => ({
        ...record,
        date: new Date(record.date)
      }))
    );
  };

  useEffect(() => {
    fetchAllRecords();
  }, []);

  const getFormRecordHandler = async record => {
    try {
      const newRecord = {
        ...record,
        date: new Date(record.date)
      };

      const { data } = await axios.post('/api/v1/records', newRecord);

      setSuccess(data.message);

      setTimeout(() => {
        setSuccess('');
      }, 2000);

      setRecords(prevRecords => [
        ...prevRecords,
        { ...data.data.data, date: new Date(data.data.data.date) }
      ]);
    } catch (error) {
      const errors = [];

      const errorData = error.response.data.errors;

      for (const key in errorData) {
        errorData[key].forEach(element => {
          errors.push(element);
        });
      }

      setErrors(errors);

      setTimeout(() => {
        setErrors([]);
      }, 2000 * errors.length);
    }

    // setRecords(prevRecords => [...prevRecords, newRecord]);
  };

  const deleteRecordHandler = async (event, id) => {
    event.stopPropagation();
    event.preventDefault();

    const { data } = await axios.delete(`/api/v1/records/${id}`);

    setSuccess(data.message);

    setTimeout(() => {
      setSuccess('');
    }, 2000);

    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
  };

  return (
    <div className={styles['my-container']}>
      <h1 className={styles['h1']}>Calorie Tracker</h1>

      {/* <Counter /> */}

      <div className={styles['my-content']}>
        <AppContext.Provider
          value={{
            totalCalories,
            errors,
            success
          }}
        >
          <CalorieRecordEdit onFormSubmit={getFormRecordHandler} />
          <RecordList records={records} onDelete={deleteRecordHandler} />
        </AppContext.Provider>
      </div>
    </div>
  );
}
