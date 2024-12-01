import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Trophy, Rocket, Filter } from "lucide-react";

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const events = [
    {
      id: 1,
      name: "Monopoly Tournament",
      isActive: true,
      category: "Gaming",
      description: "Epic board game showdown with killer strategies!",
      participants: 42,
      prize: "$500 Cash",
      icon: <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />,
    },
    {
      id: 2,
      name: "Strategy Workshop",
      isActive: false,
      category: "Learning",
      description: "Level up your game planning skills",
      participants: 0,
      prize: "Exclusive Mentorship",
      icon: <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />,
    },
    {
      id: 3,
      name: "Multiplayer Event",
      isActive: false,
      category: "Community",
      description: "Connect, compete, and create memories",
      participants: 0,
      prize: "Mystery Reward",
      icon: <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />,
    },
  ];

  const filteredEvents =
    activeFilter === "all"
      ? events
      : events.filter((event) =>
          activeFilter === "active" ? event.isActive : !event.isActive
        );

  return (
    <div className="min-h-screen bg-[#0a0a2a] text-white overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)",
          backgroundSize: "4px 4px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-blue-500/20 via-purple-500/50 to-pink-500/20"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-4 sm:px-6 lg:px-12 py-6 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            Game Zone Events
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-200 max-w-2xl mx-auto opacity-80">
            Unlock Challenges, Claim Rewards, Elevate Your Gaming Experience
          </p>
        </div>

        <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
          {["all", "active", "upcoming"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ease-in-out transform flex items-center space-x-2 ${
                activeFilter === filter
                  ? "bg-blue-600 text-white scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  : "bg-blue-900/50 text-blue-300 hover:bg-blue-800/70 hover:scale-105"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{filter}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-2xl p-6 relative overflow-hidden border-2 border-transparent ${
                event.isActive
                  ? "bg-gradient-to-tr from-blue-900/70 to-purple-900/70 hover:border-blue-500"
                  : "bg-gradient-to-tr from-gray-900/70 to-gray-800/70 hover:border-gray-600"
              } transform transition duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] group cursor-pointer`}
            >
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    event.isActive ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {event.isActive ? "🎮 Live" : "⏳ Upcoming"}
                </span>
              </div>

              <div className="flex items-center mb-4">
                <div className="mr-4 opacity-80 group-hover:opacity-100 transition">
                  {event.icon}
                </div>
                <h2 className="text-lg sm:text-xl font-bold">{event.name}</h2>
              </div>

              <p className="text-sm opacity-70 mb-4">{event.description}</p>

              <div className="flex justify-between items-center text-sm mb-4">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">
                  {event.category}
                </span>
                <span className="flex items-center">
                  👥 {event.participants} Participants
                </span>
              </div>

              {event.isActive ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition group relative overflow-hidden"
                >
                  <span className="relative z-10">Join Now</span>
                  <div className="absolute inset-0 bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="ml-2 group-hover:translate-x-1 transition">
                    →
                  </span>
                </button>
              ) : (
                <div className="bg-blue-500/10 py-3 rounded-lg text-center">
                  {event.prize} Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <img
        src="/images/mono.png"
        alt="Man Standing"
        className="absolute bottom-0 left-0 w-40 sm:w-64 h-[30rem] sm:h-[48rem] transform scale-75"
      />
    </div>
  );
};

export default EventsPage;
