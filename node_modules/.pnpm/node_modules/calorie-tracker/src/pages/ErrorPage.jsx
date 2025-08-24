import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function ErrorPage() {
  const [counter, setCounter] = useState(10);
  const interval = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (counter === 0) {
      clearInterval(interval.current);
      navigate("/");
    }
  }, [counter]);

  useEffect(() => {
    interval.current = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Error Page</h1>
      <p className="mb-4">Oops! Something went wrong.</p>
      <p className="mb-4">Please try again later.</p>
      <p className="mb-4">Or.</p>
      <p className="mb-4">Redirect to home page in {counter} seconds.</p>

      <p className="mb-4">Or.</p>
      <Link to="/" className="text-red-500">
        Go back to home
      </Link>
      <p className="mt-4">Or contact support if the problem persists.</p>
      <p className="mt-4">Contact support: support@example.com</p>
    </div>
  );
}
