import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import GamingTokenDisplay from "./GamingTokenDisplay";
import mapboxgl from "mapbox-gl";
import carddata from "../data/cards";
import { ethers } from "ethers";
import { useOkto } from "okto-sdk-react";
import { Leaf, Target } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const playerMarkerRef = useRef(null);
  const [playerLocation, setPlayerLocation] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5);
  const [showMintCard, setShowMintCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [card, setCard] = useState();
  const { createWallet } = useOkto();
  const [wallets, setWallets] = useState("");
  const [bal, setBal] = useState(0);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace these with your contract details
  const RPC_URL =
    "https://polygon-amoy.g.alchemy.com/v2/BAdEZyuBRoUZJXxgJpKpe_USdCsARC7I"; // Polygon Mumbai RPC URL from Infura or Alchemy
  const CONTRACT_ADDRESS = "0xE8CB9364327DeA515B6E67AdEfa5fC2489Fdc675"; // Replace with your contract's address
  const CONTRACT_ABI = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "loanAmount",
          type: "uint256",
        },
      ],
      name: "getLoan",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "hotspotAmount",
          type: "uint256",
        },
      ],
      name: "hotspotBenefit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "nextMove",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "player",
          type: "address",
        },
      ],
      name: "PlayerJailed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "player",
          type: "address",
        },
      ],
      name: "PlayerRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "player",
          type: "address",
        },
      ],
      name: "PropertiesSeized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "player",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "cardId",
          type: "uint256",
        },
      ],
      name: "PropertyPurchased",
      type: "event",
    },
    {
      inputs: [],
      name: "register",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "tenant",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "landlord",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "RentPaid",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "gameCards",
      outputs: [
        {
          internalType: "uint256",
          name: "cardId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "bool",
          name: "isOwned",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "playerAddress",
          type: "address",
        },
      ],
      name: "getPlayerCards",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "playerAddress",
          type: "address",
        },
      ],
      name: "getPlayerCurrency",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "playerAddress",
          type: "address",
        },
      ],
      name: "getPlayerPosition",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "JAIL_FINE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_BOARD_SPACES",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "players",
      outputs: [
        {
          internalType: "address",
          name: "playerAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "currentPosition",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "currencyPoints",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PROPERTY_PRICE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "RENT_PRICES",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "STARTING_BALANCE",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const fetchWallets = async () => {
    try {
      const walletsData = await createWallet();
      console.log(walletsData.wallets[0].address);
      setWallets(walletsData.wallets[0].address);
      setActiveSection("wallets");
    } catch (error) {
      setError(`Failed to fetch wallets: ${error.message}`);
    }
  };

  const readFromContract = async () => {
    try {
      setLoading(true);
      setError(null);

      // Connect to the Polygon Mumbai Testnet using ethers
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      console.log(contract);

      const result = await contract.getPlayerCurrency(wallets);
      console.log(result);
      setBal(result);
      setData(result);
    } catch (err) {
      console.error("Error reading from contract:", err);
      setError("Failed to fetch data from the contract.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCard(carddata.cards[diceRoll]);
    fetchWallets();
    readFromContract();
  }, []);

  useEffect(() => {
    setCard(carddata.cards[diceRoll]);
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowMintCard(true);
    }
  }, [remainingTime]);

  const handleMintCardClick = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await fetch(
        "https://sandbox-api.okto.tech/api/v1/rawtransaction/execute",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            network_name: "POLYGON_TESTNET_AMOY",
            transaction: {
              from: "0xE8a3180dD5c7a6417bc7a82D2C9Db52e0E0a22a2",
              to: "0xf5e491f0772d7dc4f9df91d8bec8642ab97b6de0",
              data: "0x82df5242",
              value: "0x",
            },
          }),
        }
      );

      // Check if the response is okay (status code 200-299)
      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        // Handle the API response (for example, update state based on the response)
      } else {
        console.error("API error:", response.statusText);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }

    // Call your other functions after the API call
    rollDiceAndMove();
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

    monopolyLocations.forEach((location, index) => {
      const marker = new mapboxgl.Marker({
        element: createCustomMarkerElement(location.type),
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
      <div className="absolute top-4 left-5 bg-gradient-to-br from-green-800 to-emerald-900 text-lime-100 p-4 rounded-xl shadow-lg border-2 border-green-500">
        <div className="flex items-center space-x-4">
          <Leaf className="w-10 h-10 text-green-300 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-green-200 opacity-80">
              Game Zone Token
            </span>
            <code className="text-md font-mono bg-green-900/50 px-3 py-2 rounded-md tracking-wider border border-green-600">
              {wallets}
            </code>
          </div>
          <Target className="w-10 h-10 text-lime-400 animate-spin" />
        </div>
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          🎮
        </div>
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
        bal: {bal}
      </div>
      {!showMintCard && (
        <div
          className="explore"
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
          className="explore"
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
          <div
            style={{ backgroundImage: `url(${card.image})` }}
            className="bg-cover bg-center w-60 h-80 bg-neutral-800 rounded-3xl text-neutral-300 p-4 flex flex-col items-start justify-center gap-3 hover:bg-gray-900 hover:shadow-2xl hover:shadow-sky-400 transition-shadow absolute"
          >
            <div className="absolute bottom-0 left-0 w-full bg-opacity-60 p-3 rounded-b-3xl">
              <p className="font-extrabold text-white">{card.name}</p>
              <p className="text-neutral-300">{card.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
