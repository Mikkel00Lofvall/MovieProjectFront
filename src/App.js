
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/CustomerPages/Home";
import NoPage from "./pages/NoPage";
import ReadMorePage from "./pages/CustomerPages/ReadMore";
import AdminMoviePage from "./pages/AdminPages/AdminMoviePage";
import SeatPage from "./pages/CustomerPages/SeatPage";
import AdminRoomPage from "./pages/AdminPages/AdminRoomPage";
import AdminThemesPage from "./pages/AdminPages/AdminThemePage";
import AdminSchedulePage from "./pages/AdminPages/AdminSchedulePage";
import ErrorPage from "./pages/ErrorPage";
import AdminUserPage from "./pages/AdminPages/AdminUserPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="read-more/:id" element={<ReadMorePage />} />
          <Route path="seat-selector/:scheduleID" element={<SeatPage />} />
          <Route path="*" element={<NoPage />} />

          <Route path="/error/:errorCode" element={<ErrorPage />}></Route>

          
          <Route path="admin" element={<AdminMoviePage/>} />
          <Route path="admin/RoomPanel" element={<AdminRoomPage/>} />
          <Route path="admin/themes" element={<AdminThemesPage/>} />
          <Route path="admin/schedule/:id" element={<AdminSchedulePage/>} />
          <Route path="admin/users" element={<AdminUserPage/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}




