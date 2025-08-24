import RecordList from "../components/CalorieRecordsSection/RecordList";
import CalorieRecordEdit from "../components/edit/CalorieRecordEdit";
// import Counter from "./Counter";
import { useState, useEffect } from "react";
import styles from "./TrackPage.module.css";
import AppContext from "../app-context";
const INITIAL_RECORDS = [
  {
    id: 1,
    date: new Date(2023, 2, 1),
    meal: "Breakfast",
    content: "Eggs",
    calories: "600",
    type: "pending",
  },
  {
    id: 2,
    date: new Date(2023, 2, 2),
    meal: "Lunch",
    content: "Chicken Salad",
    calories: "400",
    type: "approved",
  },
  {
    id: 3,
    date: new Date(2023, 2, 3),
    meal: "Dinner",
    content: "Steak",
    calories: "700",
    type: "rejected",
  },
  {
    id: 4,
    date: new Date(2023, 2, 4),
    meal: "Snack",
    content: "Protein Bar",
    calories: "200",
    type: "pending",
  },
];

export function TrackPage() {
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const total = records.reduce((acc, cur) => {
      return acc + parseInt(cur.calories);
    }, 0);
    setTotalCalories(total);
  }, [records]);

  const getFormRecordHandler = (record) => {
    const newRecord = {
      ...record,
      date: new Date(record.date),
      id: new Date().getTime(),
    };

    setRecords((prevRecords) => [...prevRecords, newRecord]);
  };

  const deleteRecordHandler = (id) => {
    console.warn("id", id);
    setRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    );
  };

  return (
    <div className={styles["my-container"]}>
      <h1 className={styles["h1"]}>Calorie Tracker</h1>

      {/* <Counter /> */}

      <div className={styles["my-content"]}>
        <AppContext.Provider
          value={{
            totalCalories,
          }}
        >
          <CalorieRecordEdit onFormSubmit={getFormRecordHandler} />
          <RecordList records={records} onDelete={deleteRecordHandler} />
        </AppContext.Provider>
      </div>
    </div>
  );
}
