
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import SecretPage from "./pages/BonusPage"
import ReadMorePage from "./pages/ReadMore";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="Secret-Page" element={<SecretPage />} />
          <Route path="read-more/:id" element={<ReadMorePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}




