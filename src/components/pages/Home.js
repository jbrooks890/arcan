import "../../styles/Home.css";
import { ReactComponent as ARCAN_LOGO } from "../../assets/images/arcan-logo.svg";

export default function Home() {
  return (
    <div id="home-page" className="flex col middle">
      <h1 className="logo-main">
        <ARCAN_LOGO />
      </h1>
    </div>
  );
}
