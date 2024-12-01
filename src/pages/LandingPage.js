import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div
            className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/images/landing-page.jpg')" }}
        >
            <button
                onClick={() => navigate('/events')}
                className="px-8 py-4 bg-black text-white font-bold text-xl rounded-lg shadow-lg hover:bg-gray-700 transition"
            >
                Explore
            </button>
        </div>
    );
};

export default LandingPage;
