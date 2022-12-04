import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  return (
    <div id="notFound-page">
      <h1>404</h1>
      <h2>Not Found</h2>
      <a>Back</a>
      <Link to="/">Home</Link>
    </div>
  );
}
