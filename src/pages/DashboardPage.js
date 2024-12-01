import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamingTokenDisplay from "./GamingTokenDisplay";
import mapboxgl from "mapbox-gl";
import data from "../data/cards";

const DashboardPage = () => {

  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const playerMarkerRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [remainingTime, setRemainingTime] = useState(10);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [card, setCard] = useState();

  useEffect(() => {
    setCard(data.cards[diceRoll])
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
    setRemainingTime(10);
    setShowMintCard(false);
    setShowCardDetails(true);
  };

  const monopolyLocations = [
    {
      type: "loc",
      name: "Bengaluru Marriott Hotel Whitefield",
      coordinates: [77.72850028345637, 12.979162217880553],
    },
    {
      type: "loc",
      name: "Sri Sathya Sai Institute of Higher Medical Sciences",
      coordinates: [77.72927102316055, 12.981543699078502],
    },
    {
      type: "loc",
      name: "Optique",
      coordinates: [77.72875864093628, 12.979551689963426],
    },

    {
      type: "loc",
      name: "Bank Of India",
      coordinates: [77.73029243415138, 12.979057168410783],
    },

    {
      type: "loc",
      name: "TCS",
      coordinates: [77.72758747094632, 12.97787570675477],
    },

    {
      type: "loc",
      name: "SEZ Bhavan",
      coordinates: [77.72644614657483, 12.97986740928199],
    },

    {
      type: "loc",
      name: "New Udupi Delicacy Veg",
      coordinates: [77.72704748905618, 12.98001557758769],
    },
    {
      type: "loc",
      name: "Schneider Electric India Private Limited",
      coordinates: [77.72848951096566, 12.985931001136603],
    },
    {
      type: "loc",
      name: "Vydehi Girls Hostel",
      coordinates: [77.7300684148707, 12.978039577664617],
    },
    {
      type: "loc",
      name: "Sowmya Residency",
      coordinates: [77.73079510283848, 12.978516184123382],
    },
    {
      type: "loc",
      name: "Sowmya Residency",
      coordinates: [77.73143029725426, 12.978578927153732],
    },
  ];

  console.log(monopolyLocations);

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

      mapRef.current.setConfigProperty("basemap", "showPlaceLabels", false);
      mapRef.current.setConfigProperty(
        "basemap",
        "showPointOfInterestLabels",
        false
      );
      mapRef.current.setLayoutProperty("poi-label", "visibility", "none");
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
    markerElement.style.backgroundSize = "cover";

    const icons = {
      loc: "/images/club.png",
    };

    const iconUrl = icons[placeType] || "/images/mystery.png";

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
      <GamingTokenDisplay />
      <button
        onClick={rollDiceAndMove}
        style={{
          position: "absolute",
          top: "120px",
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
          top: "180px",
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
      {!showMintCard && (
        <div
          class="explore"
          style={{
            position: "absolute",
            bottom: "40px",
            right: "20px",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Next Chance In: {Math.floor(remainingTime / 60)}:
          {String(remainingTime % 60).padStart(2, "0")}
        </div>
      )}
      {showMintCard && (
        <div
          class="explore"
          style={{
            position: "absolute",
            bottom: "40px",
            right: "20px",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "16px",
          }}
          onClick={handleMintCardClick}
        >
          MAKE MOVE
        </div>
      )}
      {showCardDetails && (
        <div
          style={{
            position: "absolute",
            bottom: "450px",
            right: "250px",
          }}
        >
          <div className="w-60 h-80 bg-neutral-800 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow absolute">
            <div className="w-52 h-36 bg-sky-300 rounded-2xl">
              <img className="w-52 h-36 roundex-2xl" src={card.image}/>
            </div>
            <div className="">
              <p className="font-extrabold">{card.name}</p>
              <p className="">{card.description}</p>
            </div>
            {/* <button className="bg-sky-700 font-extrabold p-2 px-6 rounded-xl hover:bg-sky-500 transition-colors">
              See more
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
