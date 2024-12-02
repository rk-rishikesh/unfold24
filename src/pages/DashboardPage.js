import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coins, ShieldPlus, RefreshCw } from "lucide-react";
import mapboxgl from "mapbox-gl";
import carddata from "../data/cards";
import GameLoader from "./GameLoader";
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
  const [bank, setBank] = useState(false);
  const [pos, setPosition] = useState(0);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoanCard, setShowLoanCard] = useState(false);

  const handleLoanClick = () => {
    setShowLoanCard(!showLoanCard);
  };

  // Replace these with your contract details
  const RPC_URL =
    "https://polygon-amoy.g.alchemy.com/v2/BAdEZyuBRoUZJXxgJpKpe_USdCsARC7I"; // Polygon Mumbai RPC URL from Infura or Alchemy
  const CONTRACT_ADDRESS = "0xc2e0e1e1Fc70db7bc10A6A237c3A0ad3F38E26Fc"; // Replace with your contract's address
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
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
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
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
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
      const pos = await contract.getPlayerPosition(wallets);
      console.log("Hello: ", pos);
      setCard(carddata.cards[pos]);
      if (result <= 800) {
        setBank(true);
      }
      setPosition(pos);
      console.log("cd", result);
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
    setCard(carddata.cards[pos]);
    fetchWallets();
    readFromContract();
  }, []);

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

  const handleMintCardClick = async () => {
    const token = localStorage.getItem("authToken");
    const address = localStorage.getItem("address");
    try {
      setIsLoading(true);
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
              from: address,
              to: "0xc2e0e1e1Fc70db7bc10A6A237c3A0ad3F38E26Fc",
              data:
                "0x55117385000000000000000000000000" +
                address.toLowerCase().trim().slice(2),
              value: "0x",
            },
          }),
        }
      );

      // Check if the response is okay (status code 200-299)
      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        // Handle the API response (for example, update state based on the response)
      } else {
        setIsLoading(false);
        console.error("API error:", response.statusText);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error calling API:", error);
    }

    // Call your other functions after the API call
    rollDiceAndMove();
    setRemainingTime(10);
    setShowMintCard(false);
    setShowCardDetails(true);
  };

  const monopolyLocations = carddata.cards;

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

    const iconUrl = icons[placeType] || "/images/club.png";

    markerElement.style.backgroundImage = `url('${iconUrl}')`;

    return markerElement;
  };

  const handleLoanAccept = async () => {
    setIsLoading(true);
    try {
      const Reqbody = {
        model: "meta-llama/Meta-Llama-3-8B-Instruct-Turbo",
        messages: [
          {
            role: "user",
            content:
              "The player wants to use Bank to get loan, the max loan value is 500, the player has 1 property, how much loan can the player get based on the property count whose base value is 100 and rent 250. Just give me the final value in integers no text",
          },
        ],
      };

      const response = await fetch(
        "https://dev.beyondnetwork.xyz/api/chat/completions",
        {
          method: "POST",
          headers: {
            "x-api-key": "7b4a2c8e-5678-8765-9d2f-1a3b5c7e9d8f",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Reqbody),
        }
      );

      if (!response.ok) {
        throw new Error("Loan application failed");
      }

      const data = await response.json();
      console.log(data.id);
      if (data && data.choices && data.choices[0]?.message?.content) {
        setShowLoanCard(true);
      }
    } catch (error) {
      console.error("Loan application error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <GameLoader />}
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

      <div className="absolute top-28 left-5 max-w-[300px] p-2 bg-indigo-800 rounded-full items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex cursor-pointer">
        <span
          className={`font-semibold mr-2 text-left flex-auto text-sm ${
            !showLoanCard
              ? "bg-indigo-500 rounded-full px-2 py-1 text-white"
              : "text-indigo-100"
          }`}
          onClick={() => {
            setShowLoanCard(false);
          }}
        >
          BANK AI AGENT
        </span>
        <span
          className={`font-semibold mr-2 text-left flex-auto ${
            showLoanCard
              ? "bg-indigo-500 rounded-full px-2 py-1 text-white"
              : "text-indigo-100"
          }`}
          onClick={handleLoanAccept}
        >
          Loan Available
        </span>
        <svg
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-current opacity-75 h-4 w-4"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"></path>
        </svg>
      </div>

      {showLoanCard && (
        <div className="absolute top-44 left-5 bg-gradient-to-br from-purple-800 to-indigo-900 shadow-2xl rounded-xl p-6 text-white border-4 border-yellow-400 transform transition-all duration-300 hover:scale-[1.02]">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-yellow-300 tracking-wider uppercase">
                Power-Up Loan
              </h2>
            </div>

            <div className="space-y-2 bg-purple-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-yellow-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  Loan Amount
                </span>
                <span className="text-yellow-300 font-bold text-xl">
                  $50,000
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Powered by bullieverse beyond API.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex space-x-2">
            <button className="text-center flex-1 bg-yellow-400 text-purple-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors uppercase tracking-wider shadow-lg">
              Accept
            </button>
            <button
              className="text-center flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors uppercase tracking-wider shadow-lg"
              onClick={handleLoanClick}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div
        className="absolute bottom-10 left-5 
        bg-gradient-to-br from-indigo-800 to-purple-900 
        text-white 
        p-4 
        rounded-xl 
        shadow-2xl 
        border-2 
        border-yellow-500 
        w-1/5 
        h-auto 
        min-h-[150px]
        flex 
        flex-col 
        space-y-4 
        transform 
        transition-all 
        hover:scale-105 
        hover:shadow-3xl"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coins className="text-yellow-400 animate-bounce" size={32} />
            <h2 className="text-2xl font-bold text-yellow-300 uppercase tracking-wider">
              Balance
            </h2>
          </div>
          <ShieldPlus className="text-green-400 animate-pulse" size={28} />
        </div>

        <div className="flex-grow flex items-center justify-center gap-8">
          <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
            <button
              onClick={() => readFromContract()}
              className="absolute top-2 left-2 text-white hover:bg-indigo-600 rounded-full p-1 transition-colors"
            ></button>

            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
              {bal.toLocaleString()}
            </span>
            <span className="block text-sm text-gray-300 mt-1">Game Coins</span>
          </div>

          <div className="bg-indigo-700/50 rounded-lg p-3 w-full text-center relative">
            <button
              onClick={() => readFromContract()}
              className="absolute top-2 left-2 text-white hover:bg-indigo-600 rounded-full p-1 transition-colors"
            ></button>

            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
              {pos.toLocaleString()}
            </span>
            <span className="block text-sm text-gray-300 mt-1">Position</span>
          </div>
        </div>
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
