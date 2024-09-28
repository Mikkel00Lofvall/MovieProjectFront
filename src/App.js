
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/CustomerPages/Home";
import NoPage from "./pages/NoPage";
import ReadMorePage from "./pages/CustomerPages/ReadMore";
import AdminMoviePage from "./pages/AdminPages/AdminMoviePage";
import SeatPage from "./pages/CustomerPages/SeatPage";
import AdminRoomPage from "./pages/AdminPages/AdminRoomPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="read-more/:id" element={<ReadMorePage />} />
          <Route path="seat-selector/:scheduleID" element={<SeatPage />} />
          <Route path="*" element={<NoPage />} />

          
          <Route path="admin" element={<AdminMoviePage/>} />
          <Route path="admin/RoomPanel" element={<AdminRoomPage/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}




