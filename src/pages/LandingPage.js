import React from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";

const LandingPage = ({ setAuthToken, authToken, handleLogout }) => {
  console.log("LoginPage component rendered: ", authToken);
  const navigate = useNavigate();
  const { authenticate } = useOkto();

  const handleGoogleLogin = async (credentialResponse) => {
    console.log("Google login response:", credentialResponse);
    const idToken = credentialResponse.credential;
    console.log("google idtoken: ", idToken);
    authenticate(idToken, async (authResponse, error) => {
      if (authResponse) {
        console.log("Authentication check: ", authResponse);
        setAuthToken(authResponse.auth_token);
        localStorage.setItem("authToken", authResponse.auth_token);
        console.log("auth token received", authToken);
        navigate("/events");
      }
      if (error) {
        console.error("Authentication error:", error);
      }
    });
  };

  const onLogoutClick = () => {
    handleLogout(); // Clear the authToken
    navigate("/"); // Navigate back to the login page
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black to-gray-900">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/videos/opener.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#F44336] via-[#ccd8f3] to-[#EF5350] text-shadow-lg">
          Bull Run
        </h1>
        <p className="text-lg md:text-xl font-semibold opacity-90 text-gray-800">
          Stay Bullish, Play Stylish!
        </p>

        {!authToken ? (
          <div className="mt-8">
            <a
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#F44336] via-[#ccd8f3] to-[#EF5350] text-white text-lg font-semibold rounded-xl shadow-xl px-8 py-4 transform transition duration-200 ease-in-out hover:scale-105"
              href="#"
            >
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={(error) => {
                  console.log("Login Failed", error);
                }}
                useOneTap
                promptMomentNotification={(notification) =>
                  console.log("Prompt moment notification:", notification)
                }
              />
            </a>
          </div>
        ) : (
          <div className="mt-8">
            <button
              onClick={onLogoutClick}
              className="explore bg-black text-white px-6 py-3 text-xl font-semibold rounded-xl shadow-xl transition duration-200 ease-in-out hover:bg-gray-800 hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
