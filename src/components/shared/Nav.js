import "../../styles/Nav.css";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="flex">
      <Link to="/">Home</Link>
      <Link to="/read">Read</Link>
      <Link to="/lore">Lore</Link>
      <Link to="/gallery">Gallery</Link>
      <Link to="/about">About</Link>
      <a>Sign In</a>
    </nav>
  );
}
