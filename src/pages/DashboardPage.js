import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";

const DashboardPage = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const playerMarkerRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [remainingTime, setRemainingTime] = useState(100);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowMintCard(true);
    }
  }, [remainingTime]);

  const handleMintCardClick = () => {
    setShowMintCard(false);
    setShowCardDetails(true);
  };

  const monopolyLocations = [
    {
      type: "railway",
      name: "Whitefield Railway Station",
      details: "Connects Whitefield to major cities.",
      coordinates: [77.7508, 12.9697],
    },
    {
      type: "railway",
      name: "KR Puram Railway Station",
      details: "A prominent railway station near Whitefield.",
      coordinates: [77.6835, 12.9916],
    },
    {
      type: "club",
      name: "Prestige Ozone Clubhouse",
      details: "A luxurious clubhouse for recreation.",
      coordinates: [77.7492, 12.9605],
    },
    {
      type: "club",
      name: "Whitefield Club",
      details: "A popular gathering place in Whitefield.",
      coordinates: [77.7425, 12.9758],
    },
    {
      type: "utility",
      name: "BESCOM Utility Office",
      details: "Electricity utility service provider.",
      coordinates: [77.7504, 12.9672],
    },
    {
      type: "utility",
      name: "Whitefield Water Supply Office",
      details: "Local water supply management office.",
      coordinates: [77.7531, 12.968],
    },
    {
      type: "house",
      name: "Prestige Shantiniketan",
      details: "A premium residential township.",
      coordinates: [77.7252, 12.9926],
    },
    {
      type: "house",
      name: "Brigade Cosmopolis",
      details: "Luxurious apartments in Whitefield.",
      coordinates: [77.7412, 12.9743],
    },
    {
      type: "house",
      name: "Sobha Dream Acres",
      details: "Modern housing complex with excellent amenities.",
      coordinates: [77.7518, 12.9589],
    },
    {
      type: "house",
      name: "Godrej Air NXT",
      details: "Green housing property with eco-friendly features.",
      coordinates: [77.7399, 12.9661],
    },
    {
      type: "jail",
      name: "Marathahalli Police Station",
      details: "Facility for detaining suspects.",
      coordinates: [77.6992, 12.9485],
    },
    {
      type: "jail",
      name: "Whitefield Police Station",
      details: "Provides security and justice in Whitefield.",
      coordinates: [77.752, 12.9674],
    },
    {
      type: "landmark",
      name: "Forum Shantiniketan Mall",
      details: "Popular shopping and leisure destination.",
      coordinates: [77.726, 12.9924],
    },
    {
      type: "landmark",
      name: "International Tech Park Bangalore (ITPB)",
      details: "One of the largest IT parks in Bangalore.",
      coordinates: [77.7375, 12.9906],
    },
    {
      type: "market",
      name: "Inorbit Mall Whitefield",
      details: "A vibrant shopping and entertainment destination.",
      coordinates: [77.7356, 12.9699],
    },
  ];

  const rollDiceAndMove = () => {
    if (rolling) return;

    const newDiceRoll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(newDiceRoll);
    setRolling(true);

    let currentStep = playerLocation;
    let stepsRemaining = newDiceRoll;

    const movePlayer = () => {
      if (stepsRemaining > 0) {
        currentStep = (currentStep + 1) % monopolyLocations.length;
        setPlayerLocation(currentStep);

        stepsRemaining--;
        setTimeout(movePlayer, 1000);
      } else {
        setRolling(false);
      }
    };

    movePlayer();
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWltaW8iLCJhIjoiY2l6ZjJoenBvMDA4eDJxbWVkd2IzZjR0ZCJ9.ppwGNP_-LS2K4jUvgXG2pA";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: monopolyLocations[playerLocation].coordinates,
      zoom: 16.5,
      pitch: 40,
      bearing: 53,
      style: "mapbox://styles/mapbox/standard",
      minZoom: 15,
      maxZoom: 17,
    });

    mapRef.current.on("load", () => {
      mapRef.current.setConfigProperty("basemap", "lightPreset", "dusk");
    });

    playerMarkerRef.current = new mapboxgl.Marker({
      color: "red",
    })
      .setLngLat(monopolyLocations[playerLocation].coordinates)
      .addTo(mapRef.current);

    // Add custom markers for Monopoly locations and attach click events
    monopolyLocations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({
        element: createCustomMarkerElement(location.type), // Use the custom marker for each type of place
      })
        .setLngLat(location.coordinates)
        .addTo(mapRef.current);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3 style="cursor:pointer; color:blue;" id="location-${location.name}">
            ${location.name}
          </h3>
          <p>${location.details}</p>
        `);

      marker.setPopup(popup);
      marker.getElement().addEventListener("click", () => {
        marker.togglePopup();
        navigate(`/location/${location.name}`, {
          state: { location },
        });
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (playerMarkerRef.current) {
      playerMarkerRef.current.setLngLat(
        monopolyLocations[playerLocation].coordinates
      );
    }
  }, [playerLocation]);

  const createCustomMarkerElement = (placeType) => {
    const markerElement = document.createElement("div");
    markerElement.style.width = "30px";
    markerElement.style.height = "30px";
    markerElement.style.borderRadius = "50%";
    markerElement.style.backgroundSize = "cover";

    // Match these keys with your monopolyLocations types
    const icons = {
      jail: "/images/jail.png",
      road: "/images/road.png",
      city: "/images/city.png",
      area: "/images/area.png",
      brewery: "/images/brewery.png",
      pub: "/images/pub.png",
      market: "/images/market.png",
      landmark: "/images/landmark.png",
      club: "/images/club.png",
      museum: "/images/museum.png",
      prison: "/images/prison.png",
      bank: "/images/bank.png",
    };

    const iconUrl = icons[placeType] || "/images/user.png";

    markerElement.style.backgroundImage = `url('${iconUrl}')`;

    return markerElement;
  };

  return (
    <div>
      <div
        id="map"
        style={{ height: "100vh", width: "100%" }}
        ref={mapContainerRef}
      />
      <button
        onClick={rollDiceAndMove}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 20px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Roll Dice
      </button>
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "20px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        Dice Roll: {diceRoll}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
          left: "20px",
          width: "20%",
          height: "30%",
        }}
      >
        card details
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          right: "20px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        Next Chance In: {Math.floor(remainingTime / 60)}:
        {String(remainingTime % 60).padStart(2, "0")}
      </div>
      {showMintCard && (
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            right: "20px",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={handleMintCardClick}
        >
          MINT Card
        </div>
      )}
      {showCardDetails && (
        <div
          style={{
            position: "absolute",
            bottom: "200px",
            right: "20px",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Card Details
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "200px",
          right: "20px",
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
        }}
      >
        Card Details
      </div>
    </div>
  );
};

export default DashboardPage;
