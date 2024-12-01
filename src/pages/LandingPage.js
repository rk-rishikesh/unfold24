import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    // <div
    //     className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
    //     style={{ backgroundImage: "url('/images/landing-page.jpg')" }}
    // >
    //     <button
    //         onClick={() => navigate('/events')}
    //         className="px-8 py-4 bg-black text-white font-bold text-xl rounded-lg shadow-lg hover:bg-gray-700 transition"
    //     >
    //         Explore
    //     </button>
    // </div>
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/videos/opener.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold">Welcome to React</h1>
        <p className="mt-4 text-lg">
          This is an example of a video background in React with Tailwind CSS.
        </p>
        <button
        class="buttonexplore"
            onClick={() => navigate('/events')}
            // className="px-8 py-4 bg-black text-white font-bold text-xl rounded-lg shadow-lg hover:bg-gray-700 transition"
        >
            Explore
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
