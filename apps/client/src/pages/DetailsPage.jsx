import { Link, useParams } from "react-router-dom";
export function DetailsPage() {
  const params = useParams();
  return (
    <div>
      <h1>
        Details Page the id is{" "}
        <span className="id text-red-500">{params.id}</span>
      </h1>
    </div>
  );
}
