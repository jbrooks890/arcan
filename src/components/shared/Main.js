import { Routes, Route } from "react-router-dom";
import About from "../pages/About";
import Gallery from "../pages/Gallery";
import Home from "../pages/Home";
import Lore from "../pages/Lore";
import Read from "../pages/Read";

export default function Main() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/lore" element={<Lore />} />
        <Route path="/read" element={<Read />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}
