import { Link } from "react-router-dom";
export function LandingPage() {
  return (
    <div>
      <h1>Welcome to Calorie Tracker</h1>
      <p>
        Track your calories and stay on top of your fitness goals{" "}
        <Link to="/track">Track Now</Link>
      </p>
    </div>
  );
}
