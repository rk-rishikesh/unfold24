import React from "react";
import { ChevronLeft } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const LocationDetails = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const location = useLocation();
  const gameCards = [
    {
      title: "Virtual Reality Arena",
      description: "Immerse yourself in cutting-edge VR experiences",
      color: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      title: "Multiplayer Zones",
      description: "Team up and compete in epic multiplayer challenges",
      color: "bg-green-100",
      textColor: "text-green-800",
    },
    {
      title: "Esports Corner",
      description: "Professional gaming setups for competitive players",
      color: "bg-purple-100",
      textColor: "text-purple-800",
    },
    {
      title: "Casual Gaming Lounge",
      description: "Relax and enjoy classic and modern games",
      color: "bg-red-100",
      textColor: "text-red-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            navigate("/dashboard");
          }}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h1>Location Details for {name}</h1>
          <p>{location.state?.location.details}</p>{" "}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} ${card.textColor} rounded-lg p-6 shadow-md transform hover:scale-105 transition-transform`}
            >
              <h3 className="text-xl font-semibold mb-3">{card.title}</h3>
              <p className="text-opacity-80">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;
