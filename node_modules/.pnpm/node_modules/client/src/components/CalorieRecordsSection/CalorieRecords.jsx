import CalorieRecordsDate from "./CalorieRecordsDate";
import StyleRecordCell from "../common/StyleRecordCell";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TypedCell = styled.li.attrs((props) => ({
  className: `flex-1 text-center uppercase font-bold ${
    props.children === "pending"
      ? "text-orange-500"
      : props.children === "approved"
      ? "text-green-500"
      : props.children === "rejected"
      ? "text-red-500"
      : "text-red-500"
  }`,
}))``;

function CalorieRecords(props) {
  return (
    <Link to={`/track/${props.id}`}>
      <ul className="flex items-center gap-x-10 bg-blue-300 p-5 rounded-lg">
        <li className="flex-1 text-center">
          <CalorieRecordsDate date={props.date} />
        </li>
        <li className="flex-1 text-center">{props.meal}</li>
        <li className="flex-1 text-center">{props.content}</li>
        <li className="flex-1 text-center">
          <StyleRecordCell>{props.calories}</StyleRecordCell>
        </li>
        <TypedCell>{props.type}</TypedCell>
        <li className="flex-1 text-center">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded-md"
            onClick={() => props.onDelete(props.id)}
          >
            Delete
          </button>
        </li>
        {/* {typeCell} */}
      </ul>
    </Link>
  );
}

export default CalorieRecords;
