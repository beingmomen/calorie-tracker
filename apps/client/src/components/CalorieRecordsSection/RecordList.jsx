import { useContext } from 'react';
import AppContext from '../../app-context';

import CalorieRecords from './CalorieRecords';

function RecordList(props) {
  const { totalCalories } = useContext(AppContext);

  return (
    <div className="flex flex-col gap-y-4 w-fit mx-auto border-2 border-blue-300 rounded-lg p-4 bg-blue-100 min-w-[625px]">
      {props.records.map(record => (
        <CalorieRecords
          key={record.id}
          id={record.id}
          date={record.date}
          meal={record.meal}
          content={record.content}
          calories={record.calories}
          type={record.type}
          onDelete={props.onDelete}
        />
      ))}
      <div>Total Calories : {totalCalories}</div>
    </div>
  );
}

export default RecordList;
