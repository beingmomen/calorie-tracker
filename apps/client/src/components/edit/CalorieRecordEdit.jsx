import { useState, useReducer, useEffect, useContext } from 'react';
import AppContext from '../../app-context';

const INITIAL_RECORD = {
  date: { value: '', valid: false },
  meal: { value: 'Breakfast', valid: true },
  content: { value: '', valid: false },
  calories: { value: '', valid: false },
  type: { value: '', valid: false }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SUBMIT':
      return INITIAL_RECORD;
    case 'INPUT_CHANGE':
      return {
        ...state,
        [action.key]: { value: action.value, valid: !!action.value }
      };

    case 'INPUT_VALIDATE':
      if (action.key === 'content') {
        if (action.value === 'sport' && Number(state.calories.value) < 0) {
          return {
            ...state,
            calories: { value: state.calories.value, valid: true }
          };
        } else if (
          action.value !== 'sport' &&
          Number(state.calories.value) > 0
        ) {
          return {
            ...state,
            calories: { value: state.calories.value, valid: true }
          };
        } else {
          return {
            ...state,
            calories: { value: state.calories.value, valid: false }
          };
        }
      }

      if (action.key === 'calories') {
        if (state.content.value === 'sport' && Number(action.value) < 0) {
          return {
            ...state,
            calories: { value: action.value, valid: true }
          };
        } else if (
          state.content.value !== 'sport' &&
          Number(action.value) > 0
        ) {
          return {
            ...state,
            calories: { value: action.value, valid: true }
          };
        } else {
          return {
            ...state,
            calories: { value: action.value, valid: false }
          };
        }
      }

      return state;

    default:
      return state;
  }
};

function CalorieRecordEdit(props) {
  const { totalCalories, errors, success } = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, INITIAL_RECORD);
  const [isFormValid, setIsFormValid] = useState(false);

  const { date, meal, content, calories, type } = state;

  useEffect(() => {
    const isValid =
      date.valid && meal.valid && content.valid && calories.valid && type.valid;
    setIsFormValid(isValid);
  }, [date.valid, meal.valid, content.valid, calories.valid, type.valid]);

  const inputChangeHandler = e => {
    const key = e.target.name;
    dispatch({
      type: 'INPUT_CHANGE',
      value: e.target.value,
      key
    });

    if (key === 'content' || key === 'calories') {
      dispatch({
        type: 'INPUT_VALIDATE',
        value: e.target.value,
        key
      });
    }
  };

  const submitHandler = e => {
    e.preventDefault();
    props.onFormSubmit(
      Object.keys(state).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: state[cur].value
        }),
        {}
      )
    );
    dispatch({ type: 'SUBMIT' });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <div>{totalCalories}</div>
      {errors.map(error => (
        <div className="bg-red-500 p-2 rounded-md" key={error}>
          <p className="text-white">{error}</p>
        </div>
      ))}
      {success && (
        <div className="bg-green-500 p-2 rounded-md">
          <p className="text-white">{success}</p>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Add Calorie Record
      </h2>

      <form className="space-y-4" onSubmit={submitHandler}>
        <div className="flex flex-col">
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              state.date.valid
                ? 'focus:ring-blue-500'
                : 'focus:ring-red-500 border-red-500'
            }`}
            value={state.date.value}
            onChange={inputChangeHandler}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="meal"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Meal Type
          </label>
          <select
            id="meal"
            name="meal"
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              state.meal.valid
                ? 'focus:ring-blue-500'
                : 'focus:ring-red-500 border-red-500'
            }`}
            value={state.meal.value}
            onChange={inputChangeHandler}
          >
            <option value="">Select meal type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="content"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Food Content
          </label>
          <textarea
            id="content"
            name="content"
            rows="3"
            placeholder="What did you eat?"
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              state.content.valid
                ? 'focus:ring-blue-500'
                : 'focus:ring-red-500 border-red-500'
            }`}
            value={state.content.value}
            onChange={inputChangeHandler}
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="calories"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              state.calories.valid
                ? 'focus:ring-blue-500'
                : 'focus:ring-red-500 border-red-500'
            }`}
            value={state.calories.value}
            onChange={inputChangeHandler}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              state.type.valid
                ? 'focus:ring-blue-500'
                : 'focus:ring-red-500 border-red-500'
            }`}
            value={state.type.value}
            onChange={inputChangeHandler}
          >
            <option value="">Select type</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          className={
            !isFormValid
              ? 'bg-gray-400 cursor-not-allowed w-full text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
              : ' w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
          }
          disabled={!isFormValid}
        >
          Save Record
        </button>
      </form>
    </div>
  );
}

export default CalorieRecordEdit;
