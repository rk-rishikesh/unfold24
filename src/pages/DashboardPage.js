import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxExample = () => {
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

  const generateRandomCoordinates = (baseLng, baseLat, range = 0.0005) => {
    const randomLng = baseLng + (Math.random() - 0.5) * range;
    const randomLat = baseLat + (Math.random() - 0.5) * range;
    return [randomLng, randomLat];
  };

  const baseLng = 77.75;
  const baseLat = 12.9698;
  const monopolyLocations = [
    {
      type: "house",
      name: "MG Road",
      details: "A popular street",
      coordinates: [77.619, 12.9742],
    },
    {
      type: "road",
      name: "Brigade Road",
      details: "Bustling shopping area",
      coordinates: [77.6114, 12.9739],
    },
    {
      type: "city",
      name: "UB City",
      details: "Luxury commercial complex",
      coordinates: [77.5952, 12.9719],
    },
    {
      type: "area",
      name: "Koramangala",
      details: "Residential & commercial area",
      coordinates: [77.6245, 12.9352],
    },
    {
      type: "area",
      name: "Whitefield",
      details: "IT hub & residential area",
      coordinates: [77.7499, 12.9698],
    },
    {
      type: "area",
      name: "Indiranagar",
      details: "Trendy neighborhood",
      coordinates: [77.6408, 12.9716],
    },
    {
      type: "area",
      name: "Jayanagar",
      details: "Historic neighborhood",
      coordinates: [77.5938, 12.926],
    },
    {
      type: "brewery",
      name: "Toit Brewery",
      details: "Famous brewery",
      coordinates: [77.64, 12.9791],
    },
    {
      type: "pub",
      name: "Social",
      details: "Popular hangout spot",
      coordinates: [77.5946, 12.9718],
    },
    {
      type: "market",
      name: "Chikpet",
      details: "Traditional marketplace",
      coordinates: [77.5733, 12.967],
    },
    {
      type: "landmark",
      name: "Bangalore Palace",
      details: "Historic palace",
      coordinates: [77.5922, 12.9987],
    },
    {
      type: "landmark",
      name: "Vidhana Soudha",
      details: "State legislature building",
      coordinates: [77.5908, 12.9794],
    },
    {
      type: "club",
      name: "Loft 38",
      details: "Popular club",
      coordinates: [77.6436, 12.9653],
    },
    {
      type: "brewery",
      name: "Byg Brewski",
      details: "Brewery & restaurant",
      coordinates: [77.6444, 13.0095],
    },
    {
      type: "pub",
      name: "Church Street Social",
      details: "Trendy pub",
      coordinates: [77.6083, 12.9756],
    },
    {
      type: "museum",
      name: "Central Jail Museum",
      details: "Historical site",
      coordinates: [77.5913, 12.9724],
    },
    {
      type: "prison",
      name: "Parappana Agrahara Central Prison",
      details: "Modern jail",
      coordinates: [77.6452, 12.8671],
    },
    {
      type: "bank",
      name: "State Bank of India (MG Road Branch)",
      details: "Historic bank branch",
      coordinates: [77.6174, 12.974],
    },
    {
      type: "bank",
      name: "Canara Bank Headquarters",
      details: "Major banking HQ",
      coordinates: [77.593, 12.975],
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
      zoom: 25,
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

      // Create a popup and associate it with the marker
      const popup = new mapboxgl.Popup({ offset: 25 }) // Set offset if needed
        .setHTML(` 
          <h3>${location.name}</h3>
          <p>${location.details}</p>
        `);

      // Attach the popup to the marker
      marker.setPopup(popup);

      // Optional: you can also open the popup automatically when the marker is clicked
      marker.getElement().addEventListener("click", () => {
        marker.togglePopup(); // Toggle pop-up on click
      });
    });

    // Cleanup on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Move the player marker to the new location after the dice roll
    if (playerMarkerRef.current) {
      playerMarkerRef.current.setLngLat(
        monopolyLocations[playerLocation].coordinates
      );
    }
  }, [playerLocation]); // Re-run the effect when playerLocation changes

  // Helper function to create custom marker elements based on the place type
  const createCustomMarkerElement = (placeType) => {
    const markerElement = document.createElement("div");
    markerElement.style.width = "30px";
    markerElement.style.height = "30px";
    markerElement.style.borderRadius = "50%";
    markerElement.style.backgroundSize = "cover";

    const icons = {
      cafe: "/images/cafe.png",
      bus: "/images/jail.png",
      school: "/images/hospital.png",
      temple: "https://example.com/icons/temple-icon.png",
      powerhouse: "https://example.com/icons/powerhouse-icon.png",
      library: "https://example.com/icons/library-icon.png",
    };

    markerElement.style.backgroundImage = `url('${icons[placeType]}')`;

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

export default MapboxExample;
