import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main id="notFound-page">
      <h1>404</h1>
      <h2>Not Found</h2>
      <p>
        You appear to have had a misadventure and have wandered into a region
        beyond the map.
      </p>
      <a onClick={navigate("/")}>Back</a>
      <Link to="/">Home</Link>
    </main>
  );
}
