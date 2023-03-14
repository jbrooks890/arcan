import "../../styles/Home.css";
import { ReactComponent as ARCAN_LOGO } from "../../assets/images/arcan-logo.svg";

export default function Home() {
  return (
    <div id="home-page" className="flex col middle">
      <h1 className="logo-main">
        <ARCAN_LOGO />
        <img
          src="http://localhost:3005/api/assets/images/books/Book Design-02.jpg"
          width={360}
        />
      </h1>
    </div>
  );
}
