import { Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Authentication />} />
    </Routes>
  );
}

export default App;
