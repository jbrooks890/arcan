import { Routes, Route } from "react-router-dom";
import DBContextProvider from "../contexts/DBContext";
import About from "../pages/About";
import DatabaseView from "../pages/admin/DatabaseView";
import Sandbox from "../pages/admin/Sandbox";
import Gallery from "../pages/Gallery";
import Home from "../pages/Home";
import Lore from "../pages/Lore";
import NotFound from "../pages/NotFound";
import Read from "../pages/Read";

export default function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/lore" element={<Lore />} />
      <Route path="/read" element={<Read />} />
      <Route path="/test" element={<Sandbox />} />
      {/* <Route path="/database" element={<DatabaseView />} /> */}
      <Route path="/database">
        <Route
          index
          element={
            <DBContextProvider>
              <DatabaseView />
            </DBContextProvider>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
