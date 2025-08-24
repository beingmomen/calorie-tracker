import StyleRecordCell from "../common/StyleRecordCell";

function CalorieRecordsDate(props) {
  const month = props.date.toLocaleString("default", { month: "long" });
  const day = props.date.getDate();
  const year = props.date.getFullYear();

  return (
    <StyleRecordCell>
      <div>{month}</div>
      <div>{day}</div>
      <div>{year}</div>
    </StyleRecordCell>
  );
}

export default CalorieRecordsDate;
