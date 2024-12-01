import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EventsPage from "./pages/EventsPage";
import DashboardPage from "./pages/DashboardPage";
import LocationDetails from "./pages/LocationDetails";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/location/:name" element={<LocationDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
