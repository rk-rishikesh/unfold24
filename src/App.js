import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EventsPage from "./pages/EventsPage";
import DashboardPage from "./pages/DashboardPage";
import LocationDetails from "./pages/LocationDetails";
import { OktoProvider, BuildType } from "okto-sdk-react";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

const OKTO_CLIENT_API_KEY = process.env.REACT_APP_OKTO_CLIENT_API_KEY;
const App = () => {
  const [authToken, setAuthToken] = useState(null);
  const handleLogout = () => {
    console.log("setting auth token to null");
    setAuthToken(null); // Clear the authToken
  };
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
  return (
    <Router>
      <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
        <Routes>
          <Route path="/" element={<LandingPage setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout}/>} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/location/:name" element={<LocationDetails />} />
        </Routes>
      </OktoProvider>
    </Router>
  );
};
// element={authToken ? <HomePage authToken={authToken} handleLogout={handleLogout}/> : <Navigate to="/" />} />
export default App;
