import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css"; // MUST
import LandingPage from "./LandingPage";
import SessionBooking from "./SessionBooking";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/session-booking" element={<SessionBooking />} />
    </Routes>
  </BrowserRouter>
);
