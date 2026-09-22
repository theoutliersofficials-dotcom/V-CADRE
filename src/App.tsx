import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo.png";

import map from "./assets/hblock-3d.png";
import Property3D from "./components/Property3D";
import VCadre3DMap from "./components/VCadre3DMap";

type Screen =
  | "home"
  | "login"
  | "register"
  | "dashboard"
  | "about"
  | "helpdesk";

type ChatMessage = {
  sender: "bot" | "user";
  text: string;
};

function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const [selectedProperty, setSelectedProperty] =
    useState<any>(null);

  const [showProperty3D, setShowProperty3D] =
    useState(false);

  // ================= FLOOR / MAP STATES =================

  const [selectedFloor, setSelectedFloor] =
    useState<number | null>(null);

  const [, setShowFloors] =
    useState(false);

  const [mapResetSignal] = useState(0);

  // ================= API / DATABASE STATES =================

  const [apiStatus, setApiStatus] =
    useState("checking");

  const [, setBuildings] =
    useState<any[]>([]);

  const [, setSpaces] =
    useState<any[]>([]);

  const [allSpaces, setAllSpaces] =
    useState<any[]>([]);

  const [assets, setAssets] =
    useState<any[]>([]);

  const [floors, setFloors] =
    useState<any[]>([]);

  const [selectedSpace, setSelectedSpace] =
    useState<any | null>(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  // ================= LOGIN STATES =================

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [usernameError, setUsernameError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [registerUsername, setRegisterUsername] =
    useState("");

  const [registerPassword, setRegisterPassword] =
    useState("");

  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState("");

  const [registerError, setRegisterError] =
    useState("");

  const [isRegistering, setIsRegistering] =
    useState(false);

  // ================= TOPOLOGY =================

  const [topologyResult, setTopologyResult] =
    useState<any>(null);

  const [isValidatingTopology, setIsValidatingTopology] =
    useState(false);

  const [showTopology, setShowTopology] =
    useState(false);

  // ================= RISK SCORE =================

  const [showRiskScore, setShowRiskScore] =
    useState(false);

  const [selectedRiskPreference, setSelectedRiskPreference] =
    useState<string | null>(null);

  const [riskInput, setRiskInput] =
    useState("");

  const [riskScoreData, setRiskScoreData] =
    useState<any>(null);

  const [isLoadingRiskScore, setIsLoadingRiskScore] =
    useState(false);

  const [riskScoreError, setRiskScoreError] =
    useState("");

  const [projectedRiskData, setProjectedRiskData] =
    useState<any>(null);
    
  const [reliefEligibility, setReliefEligibility] =
  useState<any>(null);

  const [ownershipStatus] =
  useState("Verified");

  const [selectedBuilding, setSelectedBuilding] =
  useState("BLG-001");

  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>([
      {
        sender: "bot",
        text:
          "Hello! I am the Risk Score Assistant. What change are you planning?",
      },
    ]);

  // ================= RISK PREFERENCES =================

  const riskPreferences = [
    "Add a new floor",
    "Extend water line connection",
    "Extend electrical connection",
    "Add elevator / lift",
    "Improve fire safety",
    "Add / modify rooms",
    "Expand parking",
    "Renovation / maintenance",
    "Construct road between buildings",
  ];

  // ================= TOPOLOGY VALIDATION =================

  const handleTopologyValidation = async () => {
    try {
      setIsValidatingTopology(true);

      // Open dedicated topology view
      setShowTopology(true);

      // Close other dashboard views
      setShowRiskScore(false);
      setShowProperty3D(false);
      setSelectedProperty(null);

      const response = await fetch(
        "https://v-cadre.onrender.com/topology/validate"
      );

      if (!response.ok) {
        throw new Error(
          "Topology validation failed"
        );
      }

      const data = await response.json();

      setTopologyResult(data);
    } catch (error) {
      console.error(
        "Topology validation error:",
        error
      );

      setTopologyResult({
        status: "ERROR",
        message:
          "Could not connect to the topology validation service.",
        conflicts: [
          {
            type: "SERVICE_ERROR",
            severity: "HIGH",
            message:
              "Could not connect to validation service.",
            affected_property: null,
            related_property: null,
          },
        ],
        summary: {
          buildings_checked: 0,
          floors_checked: 0,
          spaces_checked: 0,
          assets_checked: 0,
          conflicts_detected: 1,
        },
        validation_scope:
          "Analytical topology and data-quality validation",
        authoritative_cadastral_accuracy: false,
      });
    } finally {
      setIsValidatingTopology(false);
    }
  };

  // ================= RISK SCORE =================

  const loadRiskScore = () => {
  setIsLoadingRiskScore(true);
  setRiskScoreError("");

  try {
    // Prototype base risk score
    const data = {
      propertyId: "PROP-001",
      riskScore: 32,
      riskLevel: "Moderate",
      assessmentType: "Prototype Risk Index",
      message:
        "This is a demonstration risk score based on predefined prototype rules.",
    };

    setRiskScoreData(data);
  } catch (error) {
    console.error(
      "Risk score error:",
      error
    );

    setRiskScoreError(
      "Could not calculate the prototype risk score."
    );
  } finally {
    setIsLoadingRiskScore(false);
  }
};

  const calculatePrototypeRisk = (
  plannedChange: string,
  details: string,
  buildingId: string = "BLG-001"
) => {
  let riskScore = 20;
  console.log(
  "Risk calculation building:",
  buildingId
);

  if (buildingId === "BLG-002") {
  riskScore += 50;
} else if (buildingId === "BLG-003") {
  riskScore += 70;
}

  const lowerChange =
    plannedChange.toLowerCase();

  // Infrastructure change
  if (lowerChange.includes("road")) {
    riskScore += 20;
  } else if (lowerChange.includes("floor")) {
    riskScore += 15;
  } else if (
    lowerChange.includes("elevator") ||
    lowerChange.includes("lift")
  ) {
    riskScore += 10;
  } else if (lowerChange.includes("electrical")) {
    riskScore += 8;
  } else if (lowerChange.includes("water")) {
    riskScore += 7;
  } else if (lowerChange.includes("renovation")) {
    riskScore += 5;
  }

  // Distance from building
  const distanceMatch = details.match(
    /(\d+(?:\.\d+)?)\s*(?:m|meter|meters)/i
  );

  if (distanceMatch) {
    const distance =
      Number(distanceMatch[1]);

    if (distance < 2) {
      riskScore += 30;
    } else if (distance < 5) {
      riskScore += 20;
    } else if (distance < 10) {
      riskScore += 10;
    } else {
      riskScore += 3;
    }
  }

  // Existing building damage
  if (
    /major|severe|large cracks|structural damage/i.test(
      details
    )
  ) {
    riskScore += 20;
  } else if (
    /minor|small cracks|existing cracks/i.test(
      details
    )
  ) {
    riskScore += 10;
  }

  // Soil and drainage
  if (
    /poor drainage|waterlogging|loose soil|unstable soil/i.test(
      details
    )
  ) {
    riskScore += 15;
  }

  // Keep score between 0 and 100
  riskScore = Math.min(
    Math.max(riskScore, 0),
    100
  );

  let riskLevel = "Low";

  if (riskScore >= 70) {
    riskLevel = "High";
  } else if (riskScore >= 40) {
    riskLevel = "Moderate";
  }

  return {
    plannedChange,
    riskScore,
    riskLevel,
    assessmentType:
      "Prototype Risk Index",
    factors: [
      "Infrastructure proximity",
      "Building vulnerability",
      "Existing damage",
      "Soil and drainage conditions",
    ],
  };
};

const calculateReliefEligibility = (
  riskScore: number,
  ownershipStatus: string
) => {
  if (ownershipStatus !== "Verified") {
    return {
      status: "Ownership Verification Required",
      reason: "Property ownership must be verified before relief assessment.",
    };
  }

  if (riskScore >= 70) {
    return {
      status: "Priority Assessment",
      reason: "High prototype risk requires detailed damage assessment.",
    };
  }

  if (riskScore >= 40) {
    return {
      status: "Requires Assessment",
      reason: "Moderate prototype risk requires further damage verification.",
    };
  }

  return {
    status: "No Immediate Relief Flag",
    reason: "Low prototype risk detected; no immediate relief flag is generated.",
  };
};

  const handleRiskPreference = async (
  preference: string
) => {
  setSelectedRiskPreference(preference);

  setChatMessages((previous) => [
    ...previous,
    {
      sender: "user",
      text: preference,
    },
  ]);

  // Special flow for road construction
  if (
    preference ===
    "Construct road between buildings"
  ) {
    setChatMessages((previous) => [
      ...previous,
      {
        sender: "bot",
        text:
          "I can estimate the infrastructure risk for this proposed road. " +
          "Please provide the approximate distance between the proposed road " +
          "and the nearest building in meters.",
      },
    ]);

    return;
  }

  console.log(
  "Selected Building:",
  selectedBuilding
);
  // Prototype risk calculation
 const currentBuilding =
  selectedBuilding;

const projectedRisk =
  calculatePrototypeRisk(
    preference,
    "",
    currentBuilding
  );

  setProjectedRiskData(
    projectedRisk
  );

  console.log(
  "FINAL:",
  currentBuilding,
  projectedRisk.riskScore
);

  const eligibility =
  calculateReliefEligibility(
    projectedRisk.riskScore,
    ownershipStatus
  );

setReliefEligibility(
  eligibility
);

  setChatMessages((previous) => [
    ...previous,
    {
      sender: "bot",
      text:
        "Prototype risk assessment calculated. " +
        "The projected Risk Index is shown below.",
    },
  ]);
};

  const handleRiskMessage = async () => {
  const message = riskInput.trim();

  if (!message) return;

  // Show user's message in chatbot
  setChatMessages((previous) => [
    ...previous,
    {
      sender: "user",
      text: message,
    },
  ]);

  // Clear input
  setRiskInput("");

  try {
    const data = calculatePrototypeRisk(
  selectedRiskPreference ||
    "General infrastructure change",
  message,
  selectedBuilding
);

    // Save calculated risk
    setProjectedRiskData(data);

    // Bot response
    setChatMessages((previous) => [
      ...previous,
      {
        sender: "bot",
        text:
          `Prototype risk assessment completed. ` +
          `The projected Risk Index is ${data.riskScore}/100 ` +
          `(${data.riskLevel}).`,
      },
    ]);
  } catch (error) {
    console.error(
      "Prototype risk calculation error:",
      error
    );

    setChatMessages((previous) => [
      ...previous,
      {
        sender: "bot",
        text:
          "I could not calculate the prototype risk assessment.",
      },
    ]);
  }
};

  const handleRiskScoreClick = () => {
    setShowTopology(false);
    setTopologyResult(null);

    setShowRiskScore((previous) => {
      const nextValue = !previous;

      if (nextValue) {
        loadRiskScore();
      }

      return nextValue;
    });
  };

  // ================= LOAD API DATA =================

  useEffect(() => {
    const loadData = async () => {
      try {
        const healthResponse =
          await fetch(
            "https://v-cadre.onrender.com/health"
          );

        if (!healthResponse.ok) {
          throw new Error(
            "API unavailable"
          );
        }

        setApiStatus("connected");

        const buildingsResponse =
          await fetch(
            "https://v-cadre.onrender.com/buildings"
          );

        const buildingsData =
          await buildingsResponse.json();

        setBuildings(buildingsData);

        const floorsResponse =
          await fetch(
            "https://v-cadre.onrender.com/buildings/1/floors"
          );

        const floorsData =
          await floorsResponse.json();

        setFloors(floorsData);
      } catch (error) {
        console.error(
          "API error:",
          error
        );

        setApiStatus(
          "disconnected"
        );
      }
    };

    loadData();
  }, []);

  // ================= LOAD FLOOR DATA =================

  useEffect(() => {
    const loadFloorData = async () => {
      if (selectedFloor === null) {
        setSpaces([]);
        setAssets([]);
        return;
      }

      try {
        const floor =
          floors.find(
            (item) =>
              Number(
                item.floor_number
              ) ===
              Number(selectedFloor)
          );

        if (!floor) {
          setSpaces([]);
          setAssets([]);
          setSelectedSpace(null);
          return;
        }

        const spacesResponse =
          await fetch(
            `https://v-cadre.onrender.com/buildings/floors/${floor.id}/spaces`
          );

        if (!spacesResponse.ok) {
          throw new Error(
            "Could not load spaces"
          );
        }

        const spacesData =
          await spacesResponse.json();

        setSpaces(spacesData);

        setSelectedSpace(null);
        setAssets([]);
      } catch (error) {
        console.error(
          "Floor data error:",
          error
        );

        setSpaces([]);
        setAssets([]);
        setSelectedSpace(null);
      }
    };

    if (floors.length > 0) {
      loadFloorData();
    }
  }, [
    selectedFloor,
    floors,
  ]);

  // ================= LOAD ALL SPACES =================

  useEffect(() => {
    const loadAllSpaces = async () => {
      if (floors.length === 0) {
        return;
      }

      try {
        const results =
          await Promise.all(
            floors.map(
              async (floor) => {
                const response =
                  await fetch(
                    `https://v-cadre.onrender.com/buildings/floors/${floor.id}/spaces`
                  );

                if (!response.ok) {
                  throw new Error(
                    `Could not load spaces for floor ${floor.id}`
                  );
                }

                const data =
                  await response.json();

                return data.map(
                  (space: any) => ({
                    ...space,
                    floor_number:
                      floor.floor_number,
                  })
                );
              }
            )
          );

        setAllSpaces(
          results.flat()
        );
      } catch (error) {
        console.error(
          "Global search error:",
          error
        );
      }
    };

    loadAllSpaces();
  }, [floors]);

  // ================= SEARCH =================

  const filteredSpaces =
    allSpaces.filter((space) => {
      const query =
        searchQuery
          .toLowerCase()
          .trim();

      const matchesFloor =
        selectedFloor === null ||
        Number(
          space.floor_number
        ) === selectedFloor;

      const matchesSearch =
        !query ||
        space.space_code
          ?.toLowerCase()
          .includes(query) ||
        space.name
          ?.toLowerCase()
          .includes(query) ||
        space.space_type
          ?.toLowerCase()
          .includes(query);

      return (
        matchesFloor &&
        matchesSearch
      );
    });

  // ================= SELECT SPACE =================

  const handleSpaceSelect =
    async (space: any) => {
      try {
        if (
          selectedFloor === null ||
          Number(selectedFloor) !==
            Number(space.floor_number)
        ) {
          setSelectedFloor(
            Number(
              space.floor_number
            )
          );
        }

        setSelectedSpace(space);

        console.log(
          "SELECTED SPACE:",
          space
        );

        const response =
          await fetch(
            `https://v-cadre.onrender.com/buildings/spaces/${space.id}/assets`
          );

        if (!response.ok) {
          throw new Error(
            "Could not load assets"
          );
        }

        const data =
          await response.json();

        setAssets(data);
      } catch (error) {
        console.error(
          "Space selection error:",
          error
        );

        setAssets([]);
      }
    };

  // ================= LOGIN =================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");

    if (!username.trim()) {
      setUsernameError(
        "Please enter your username."
      );
      return;
    }

    if (!password) {
      setPasswordError(
        "Please enter your password."
      );
      return;
    }

    try {
      const response =
        await fetch(
          "https://v-cadre.onrender.com/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username:
                username.trim(),
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          setPasswordError(
            "Invalid username or password."
          );
        } else {
          setPasswordError(
            data.detail ||
              "Login failed. Please try again."
          );
        }

        return;
      }

      console.log(
        "Login successful:",
        data
      );

      setSelectedProperty(null);
      setShowProperty3D(false);
      setShowFloors(false);
      setSelectedFloor(null);
      setSelectedSpace(null);
      setAssets([]);
      setSearchQuery("");
      setShowRiskScore(false);
      setTopologyResult(null);
      setShowTopology(false);

      setScreen("dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setPasswordError(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  // ================= REGISTER =================

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setRegisterError("");

    if (!registerUsername.trim()) {
      setRegisterError(
        "Please enter a username."
      );
      return;
    }

    if (!registerPassword) {
      setRegisterError(
        "Please enter a password."
      );
      return;
    }

    if (
      registerPassword !==
      registerConfirmPassword
    ) {
      setRegisterError(
        "Passwords do not match."
      );
      return;
    }

    setIsRegistering(true);

    try {
      const response =
        await fetch(
          "https://v-cadre.onrender.com/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username:
                registerUsername.trim(),
              password:
                registerPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setRegisterError(
          data.detail ||
            "Account creation failed. Please try again."
        );
        return;
      }

      alert(
        "Account created successfully. Please sign in."
      );

      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");

      setScreen("login");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setRegisterError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setIsRegistering(false);
    }
  };

  // ================= MAP RESET =================

 

  // ================= HOME RESET =================

  const handleHome = () => {
    setSelectedProperty(null);
    setShowProperty3D(false);

    setShowFloors(false);

    setShowRiskScore(false);
    setTopologyResult(null);
    setShowTopology(false);

    setSelectedFloor(null);
    setSelectedSpace(null);
    setAssets([]);
    setSpaces([]);
    setSearchQuery("");

    setScreen("home");
  };

  // ================= TOPOLOGY BACK TO MAP =================

  const handleBackToMap = () => {
    setShowTopology(false);
    setTopologyResult(null);
    setShowRiskScore(false);
    setShowProperty3D(false);
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="app">

      {/* ====================================================== */}
      {/* HOME */}
      {/* ====================================================== */}

      {screen === "home" && (
        <div className="home-screen">

          <header className="top-header">

            <div className="brand">
              <img
                src={logo}
                alt="V-CADRE Logo"
              />
              <span>-CADRE</span>
            </div>

            <nav>

              <button
                onClick={() =>
                  setScreen("home")
                }
              >
                Home
              </button>

              <button
                onClick={() =>
                  setScreen("about")
                }
              >
                About
              </button>

              <button
                onClick={() =>
                  setScreen("helpdesk")
                }
              >
                help desk
              </button>

            </nav>

          </header>

          <main className="welcome-content">

            <h1>Welcome</h1>

            <img
              className="city-image"
              src={map}
              alt="3D Urban Map"
            />

            <button
              className="dark-button login-button"
              onClick={() =>
                setScreen("login")
              }
            >
              login
            </button>

            <p className="authorized-text">
              access for authorized users only
            </p>

          </main>

        </div>
      )}

      {/* ====================================================== */}
      {/* ABOUT */}
      {/* ====================================================== */}

      {screen === "about" && (
        <div className="about-screen">

          <header className="top-header">

            <div className="brand">
              <img
                src={logo}
                alt="V-CADRE Logo"
              />
              <span>-CADRE</span>
            </div>

            <nav>

              <button
                onClick={() =>
                  setScreen("home")
                }
              >
                Home
              </button>

              <button
                onClick={() =>
                  setScreen("about")
                }
              >
                About
              </button>

              <button
                onClick={() =>
                  setScreen("helpdesk")
                }
              >
                help desk
              </button>

            </nav>

          </header>

          <main className="about-content">

            <h1>About V-CADRE</h1>

            <p className="about-intro">
              V-CADRE is a digital property and
              risk intelligence system developed
              for managing the physical spaces,
              properties, assets, inspections,
              and risks of H Block.
            </p>

            <div className="about-grid">

              <div className="about-item">
                <span>01</span>

                <h2>3D Mapping</h2>

                <p>
                  Digitally represent H Block
                  and connect its physical spaces
                  with corresponding digital
                  records.
                </p>
              </div>

              <div className="about-item">
                <span>02</span>

                <h2>
                  Property Identification
                </h2>

                <p>
                  Provide each property with a
                  persistent V-CADRE identifier
                  for searching and tracking.
                </p>
              </div>

              <div className="about-item">
                <span>03</span>

                <h2>
                  Risk Identification
                </h2>

                <p>
                  Record and visualize verified
                  risks associated with properties
                  and assets.
                </p>
              </div>

              <div className="about-item">
                <span>04</span>

                <h2>
                  Inspection & Maintenance
                </h2>

                <p>
                  Connect inspection observations
                  and maintenance activities to
                  the relevant property records.
                </p>
              </div>

            </div>

            <button
              className="dark-button about-back-button"
              onClick={() =>
                setScreen("home")
              }
            >
              back to home
            </button>
            
            <div className="about-note">
  <div className="about-note-icon">ⓘ</div>

  <div className="about-note-content">
    <h3>Note</h3>

    <p>
      Since <strong>ULPIN (Unique Land Parcel Identification Number)</strong>{" "}
      is confidential and not publicly accessible to everyone, this prototype
      uses a <strong>Property ID</strong> as a substitute for ULPIN to uniquely
      identify and manage properties within the system.
    </p>
  </div>
</div>
          </main>

        </div>

        
      )}

      {/* ====================================================== */}
      {/* HELP DESK */}
      {/* ====================================================== */}

      {screen === "helpdesk" && (
        <div className="helpdesk-screen">

          <header className="top-header">

            <div className="brand">
              <img
                src={logo}
                alt="V-CADRE Logo"
              />
              <span>-CADRE</span>
            </div>

            <nav>

              <button
                onClick={() =>
                  setScreen("home")
                }
              >
                Home
              </button>

              <button
                onClick={() =>
                  setScreen("about")
                }
              >
                About
              </button>

              <button
                onClick={() =>
                  setScreen("helpdesk")
                }
              >
                help desk
              </button>

            </nav>

          </header>

          <main className="helpdesk-content">

            <h1>Help Desk</h1>

            <p>
              Need assistance with V-CADRE?
            </p>

            <div className="helpdesk-box">

              <h2>System Access</h2>

              <p>
                V-CADRE is an authorized-user
                system. If you cannot access the
                system, contact the administrator
                responsible for your account.
              </p>

            </div>

            <div className="helpdesk-box">

              <h2>
                Property & Inspection Support
              </h2>

              <p>
                For issues related to property
                records, risk information,
                inspections, assets, or
                maintenance, contact the
                responsible V-CADRE administrator
                or authorized department.
              </p>

            </div>

            <button
              className="dark-button"
              onClick={() =>
                setScreen("home")
              }
            >
              back to home
            </button>

          </main>

        </div>
      )}

      {/* ====================================================== */}
      {/* LOGIN */}
      {/* ====================================================== */}

      {screen === "login" && (
        <div className="login-screen">

          <div className="login-background">

            <div className="login-overlay">

              <div className="login-logo">

                <img
                  src={logo}
                  alt="V-CADRE Logo"
                />

                <span>-CADRE</span>

              </div>

              <form
                onSubmit={handleLogin}
                className="login-form"
              >

                <label>
                  user name
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(
                      e.target.value
                    );
                    setUsernameError("");
                  }}
                />

                {usernameError && (
                  <p className="login-error">
                    {usernameError}
                  </p>
                )}

                <label>
                  password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(
                      e.target.value
                    );
                    setPasswordError("");
                  }}
                />

                {passwordError && (
                  <p className="login-error">
                    {passwordError}
                  </p>
                )}

                <button
                  type="button"
                  className="forgot-password"
                >
                  forgot password?
                </button>

                <button
                  type="submit"
                  className="dark-button sign-in-button"
                >
                  sign in
                </button>

                <br />

                <button
                  type="button"
                  className="create-account-button"
                  onClick={() =>
                    setScreen("register")
                  }
                >
                  Create New Account
                </button>

                <p className="authorized-text">
                  access for authorized users only
                </p>

              </form>

            </div>

          </div>

        </div>
      )}

      {/* ====================================================== */}
      {/* REGISTER */}
      {/* ====================================================== */}

      {screen === "register" && (
        <div
          className="login-page"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <div
            className="login-card"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >

            <h1>
              create new account
            </h1>

            <p className="login-subtitle">
              Register for V-CADRE access
            </p>

            <form
              onSubmit={handleRegister}
              className="login-form"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              <label>
                user name
              </label>

              <input
                type="text"
                value={registerUsername}
                onChange={(e) => {
                  setRegisterUsername(
                    e.target.value
                  );
                  setRegisterError("");
                }}
                style={{
                  textAlign: "center",
                }}
              />

              <label>
                password
              </label>

              <input
                type="password"
                value={registerPassword}
                onChange={(e) => {
                  setRegisterPassword(
                    e.target.value
                  );
                  setRegisterError("");
                }}
                style={{
                  textAlign: "center",
                }}
              />

              <label>
                confirm password
              </label>

              <input
                type="password"
                value={
                  registerConfirmPassword
                }
                onChange={(e) => {
                  setRegisterConfirmPassword(
                    e.target.value
                  );
                  setRegisterError("");
                }}
                style={{
                  textAlign: "center",
                }}
              />

              {registerError && (
                <p className="login-error">
                  {registerError}
                </p>
              )}

              <button
                type="submit"
                className="dark-button sign-in-button"
                disabled={isRegistering}
              >
                {isRegistering
                  ? "creating account..."
                  : "create account"}
              </button>

              <button
                type="button"
                className="create-account-button"
                onClick={() =>
                  setScreen("login")
                }
                style={{
                  marginTop: "12px",
                }}
              >
                Back to Login
              </button>

            </form>

          </div>

        </div>
      )}

      {/* ====================================================== */}
      {/* DASHBOARD */}
      {/* ====================================================== */}

      {screen === "dashboard" && (
        <div
          className="dashboard-screen"
          style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >

          {/* ================= HEADER ================= */}

          <header
            className="dashboard-header"
            style={{
              height: "72px",
              boxSizing: "border-box",
            }}
          >

            <div className="brand">

              <img
                src={logo}
                alt="V-CADRE Logo"
              />

              <span>-CADRE</span>

            </div>

            <div className="dashboard-navigation">

              <span className="dashboard-navigation-badge-dot" />

              <span className="api-status">
                API: {apiStatus}
              </span>

              {/* ================= TOPOLOGY ================= */}

              <button
                className="dashboard-home"
                onClick={
                  handleTopologyValidation
                }
                disabled={
                  isValidatingTopology
                }
              >
                {isValidatingTopology
                  ? "Validating..."
                  : "Topology"}
              </button>

              {/* ================= RISK SCORE ================= */}

              <button
                className="dashboard-home"
                onClick={
                  handleRiskScoreClick
                }
              >
                Risk Score
              </button>

              {/* ================= HOME ================= */}

              <button
                className="dashboard-home"
                onClick={handleHome}
              >
                Home
              </button>

              <div className="user-area">

                <span>
                  Mr.user
                </span>

                <div className="user-icon">

                  <div className="user-head"></div>

                  <div className="user-body"></div>

                </div>

              </div>

            </div>

          </header>

          {/* ================= DASHBOARD BODY ================= */}

          <div
            className="dashboard-body"
            style={{
              width: "100%",
              height:
                "calc(100vh - 72px)",
              margin: 0,
              padding: 0,
              display: "block",
            }}
          >

           <main
              className="dashboard-main"
              style={{
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0,
                minWidth: 0,
                position: "relative",
              }}
            >

              {/* ================================================== */}
              {/* RISK SCORE */}
              {/* ================================================== */}

              {showRiskScore ? (

                <div
                  className="risk-score-panel"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    padding: "28px",
                    boxSizing:
                      "border-box",
                    background:
                      "#f8fafc",
                  }}
                >

                  <div
                    style={{
                      maxWidth:
                        "1000px",
                      margin: "0 auto",
                      background:
                        "#ffffff",
                      borderRadius:
                        "16px",
                      padding:
                        "28px",
                      boxSizing:
                        "border-box",
                      boxShadow:
                        "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        marginBottom:
                          "24px",
                      }}
                    >

                      <div>

                        <h1
                          style={{
                            margin: 0,
                            color:
                              "#172b46",
                            fontSize:
                              "26px",
                          }}
                        >
                          Risk Score Assistant
                        </h1>

                        <p
                          style={{
                            marginTop:
                              "6px",
                            color:
                              "#64748b",
                            fontSize:
                              "14px",
                          }}
                        >
                          Plan infrastructure
                          changes and identify
                          potential risk factors.
                        </p>

                      </div>

                      <button
                        onClick={() => {
                          setShowRiskScore(
                            false
                          );
                        }}
                        style={{
                          border:
                            "none",
                          background:
                            "#f1f5f9",
                          color:
                            "#172b46",
                          borderRadius:
                            "8px",
                          padding:
                            "9px 14px",
                          cursor:
                            "pointer",
                          fontWeight:
                            600,
                        }}
                      >
                        Back to Map
                      </button>

                    </div>

                    {/* PREFERENCES */}

                    <div
                      style={{
                        marginBottom:
                          "24px",
                      }}
                    >

                      <h2
                        style={{
                          color:
                            "#172b46",
                          fontSize:
                            "19px",
                          marginBottom:
                            "14px",
                        }}
                      >
                        What are you planning?
                      </h2>

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "12px",
                        }}
                      >

                        {riskPreferences.map(
                          (
                            preference
                          ) => (
                            <button
                              key={
                                preference
                              }
                              onClick={() =>
                                handleRiskPreference(
                                  preference
                                )
                              }
                              style={{
                                padding:
                                  "14px 16px",
                                borderRadius:
                                  "10px",
                                border:
                                  selectedRiskPreference ===
                                  preference
                                    ? "2px solid #172b46"
                                    : "1px solid #d1d5db",
                                background:
                                  selectedRiskPreference ===
                                  preference
                                    ? "#eef3f8"
                                    : "#ffffff",
                                color:
                                  "#172b46",
                                cursor:
                                  "pointer",
                                fontSize:
                                  "14px",
                                fontWeight:
                                  600,
                                textAlign:
                                  "left",
                              }}
                            >
                              {
                                preference
                              }
                            </button>
                          )
                        )}

                      </div>

                    </div>

                    {/* CHAT */}

                    <div
                      style={{
                        border:
                          "1px solid #e2e8f0",
                        borderRadius:
                          "12px",
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          background:
                            "#172b46",
                          color:
                            "#ffffff",
                          padding:
                            "15px 18px",
                          fontWeight:
                            700,
                        }}
                      >
                        🤖 Risk Score Assistant
                      </div>

                      <div
                        style={{
                          height:
                            "300px",
                          overflowY:
                            "auto",
                          padding:
                            "18px",
                          background:
                            "#f8fafc",
                        }}
                      >

                        {chatMessages.map(
                          (
                            message,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  message.sender ===
                                  "user"
                                    ? "flex-end"
                                    : "flex-start",
                                marginBottom:
                                  "12px",
                              }}
                            >

                              <div
                                style={{
                                  maxWidth:
                                    "75%",
                                  padding:
                                    "11px 14px",
                                  borderRadius:
                                    "12px",
                                  background:
                                    message.sender ===
                                    "user"
                                      ? "#172b46"
                                      : "#ffffff",
                                  color:
                                    message.sender ===
                                    "user"
                                      ? "#ffffff"
                                      : "#172b46",
                                  border:
                                    message.sender ===
                                    "bot"
                                      ? "1px solid #e2e8f0"
                                      : "none",
                                  fontSize:
                                    "14px",
                                  lineHeight:
                                    1.5,
                                }}
                              >
                                {
                                  message.text
                                }
                              </div>

                            </div>
                          )
                        )}

                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "10px",
                          padding:
                            "14px",
                          background:
                            "#ffffff",
                          borderTop:
                            "1px solid #e2e8f0",
                        }}
                      >

                        <input
  type="text"
  value={riskInput}
  placeholder={
    selectedRiskPreference ===
    "Construct road between buildings"
      ? "e.g. Road will be 3 meters from the building..."
      : "Type your requirement..."
  }
  onChange={(e) =>
    setRiskInput(e.target.value)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleRiskMessage();
    }
  }}
  style={{
    flex: 1,
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  }}
/>

                        <button
                          onClick={
                            handleRiskMessage
                          }
                          className="dark-button"
                          style={{
                            padding:
                              "10px 22px",
                            minWidth:
                              "80px",
                          }}
                        >
                          Send
                        </button>

                      </div>

                    </div>

                    <div
  style={{
    marginBottom: "18px",
    padding: "16px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  }}
>
  <div
    style={{
      fontSize: "13px",
      fontWeight: "600",
      color: "#172b46",
      marginBottom: "8px",
    }}
  >
    Select Building
  </div>

  <select
  value={selectedBuilding}
  onChange={(e) => {
    setSelectedBuilding(e.target.value);
  }}
    style={{
      width: "100%",
      padding: "11px 12px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      color: "#334155",
      background: "#ffffff",
    }}
  >
    <option>Building A — BLG-001</option>
    <option>Building B — BLG-002</option>
    <option>Building C — BLG-003</option>
  </select>
</div>

                    {/* RISK ASSESSMENT */}

                    <div
                      style={{
                        marginTop:
                          "20px",
                        padding:
                          "20px",
                        borderRadius:
                          "12px",
                        background:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >

                      <h2
                        style={{
                          margin:
                            "0 0 18px 0",
                          color:
                            "#172b46",
                          fontSize:
                            "20px",
                        }}
                      >
                        Property Risk Assessment & Impact
                      </h2>

                      {projectedRiskData ? (
  <div
    style={{
      border: "1px solid #dbe4ee",
      borderRadius: "12px",
      padding: "20px",
      background: "#f8fafc",
    }}
  >
    {/* Risk Score Comparison */}
     <div
    style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  {/* Current Risk */}
  <div
    style={{
      padding: "16px",
      borderRadius: "10px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    
    <div
  style={{
    fontSize: "13px",
    fontWeight: "600",
    color: "#172b46",
    marginBottom: "12px",
  }}
>
  Selected Building: {selectedBuilding}
</div>

    <div
      style={{
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "6px",
      }}
    >
      Current Risk
    </div>

    <div
      style={{
        fontSize: "26px",
        fontWeight: "700",
        color: "#172b46",
      }}
    >
      {riskScoreData?.riskScore ?? 32}
      <span
        style={{
          fontSize: "14px",
          color: "#64748b",
          fontWeight: "500",
        }}
      >
        {" "}
        / 100
      </span>
    </div>
  </div>

  {/* Projected Risk */}
  <div
    style={{
      padding: "16px",
      borderRadius: "10px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "6px",
      }}
    >
      Projected Risk
    </div>

    <div
      style={{
        fontSize: "26px",
        fontWeight: "700",
        color: "#172b46",
      }}
    >
      {projectedRiskData.riskScore}
      <span
        style={{
          fontSize: "14px",
          color: "#64748b",
          fontWeight: "500",
        }}
      >
        {" "}
        / 100
      </span>
    </div>
  </div>

  {/* Risk Change */}
  <div
    style={{
      padding: "16px",
      borderRadius: "10px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <div
      style={{
        fontSize: "12px",
        color: "#64748b",
        marginBottom: "6px",
      }}
    >
      Risk Change
    </div>

    <div
      style={{
        fontSize: "26px",
        fontWeight: "700",
        color:
          projectedRiskData.riskScore -
            (riskScoreData?.riskScore ?? 32) >
          0
            ? "#dc2626"
            : "#16a34a",
      }}
    >
      {projectedRiskData.riskScore -
        (riskScoreData?.riskScore ?? 32) >
      0
        ? "+"
        : ""}
      {projectedRiskData.riskScore -
        (riskScoreData?.riskScore ?? 32)}

      <span
        style={{
          fontSize: "14px",
          color: "#64748b",
          fontWeight: "500",
        }}
      >
        {" "}
        points
      </span>
    </div>
  </div>
</div>

{/* Projected Risk Level */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  }}
>
  <div
    style={{
      fontSize: "14px",
      color: "#64748b",
    }}
  >
    Projected Risk Level
  </div>

  <div
    style={{
      padding: "8px 14px",
      borderRadius: "20px",
      background:
        projectedRiskData.riskLevel === "High"
          ? "#fee2e2"
          : projectedRiskData.riskLevel === "Moderate"
          ? "#fef3c7"
          : "#dcfce7",
      color:
        projectedRiskData.riskLevel === "High"
          ? "#b91c1c"
          : projectedRiskData.riskLevel === "Moderate"
          ? "#92400e"
          : "#166534",
      fontWeight: "600",
      fontSize: "13px",
    }}
  >
    {projectedRiskData.riskLevel}
  </div>
</div>

     {/* Planned Change */}
    <div
      style={{
        marginBottom: "18px",
        paddingBottom: "15px",
        borderBottom:
          "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          marginBottom: "5px",
        }}
      >
        Planned Change
      </div>

      <div
        style={{
          fontSize: "15px",
          fontWeight: "600",
          color: "#334155",
        }}
      >
        {projectedRiskData.plannedChange}
      </div>
    </div>

    {/* Contributing Factors */}
    <div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#172b46",
          marginBottom: "10px",
        }}
      >
        Contributing Factors
      </div>

      {projectedRiskData.factors?.map(
        (
          factor: string,
          index: number
        ) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "7px",
              fontSize: "13px",
              color: "#475569",
            }}
          >
            <span
              style={{
                color: "#2563eb",
                fontWeight: "700",
              }}
            >
              •
            </span>

            {factor}
          </div>
        )
      )}
    </div>

    {/* Prototype Note */}
    <div
      style={{
        marginTop: "18px",
        padding: "12px",
        borderRadius: "8px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        fontSize: "12px",
        lineHeight: "1.5",
        color: "#1e40af",
      }}
    >
      <strong>Prototype Risk Index:</strong>{" "}
      This score is generated using
      predefined prototype rules. It is
      not a statistically validated
      probability of damage or a
      professional structural assessment.
    </div>
  </div>
) : (
  <div
    style={{
      padding: "30px 20px",
      textAlign: "center",
      border: "1px dashed #cbd5e1",
      borderRadius: "12px",
      color: "#64748b",
      fontSize: "14px",
    }}
  >
    Select a planned change or enter
    details in the Risk Score Assistant
    to generate a projected risk
    assessment.
  </div>
)}

                      {isLoadingRiskScore && (
                        <p
                          style={{
                            color:
                              "#64748b",
                          }}
                        >
                          Calculating risk score from property data...
                        </p>
                      )}

                      {riskScoreError && (
                        <p
                          style={{
                            color:
                              "#dc2626",
                          }}
                        >
                          {riskScoreError}
                        </p>
                      )}

                    </div>

                                        {/* PROPERTY OWNERSHIP */}

                    <h2
                      style={{
                        margin: "28px 0 18px 0",
                        color: "#172b46",
                        fontSize: "20px",
                      }}
                    >
                      Property Ownership & Relief Verification
                    </h2>

                                        <div
                      style={{
                        padding: "18px",
                        borderRadius: "10px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        marginBottom: "18px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#172b46",
                          marginBottom: "14px",
                        }}
                      >
                        Property Ownership Details
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(2, 1fr)",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "5px",
                            }}
                          >
                            Property ID
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#334155",
                            }}
                          >
                            {selectedBuilding}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "5px",
                            }}
                          >
                            Ownership Status
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#166534",
                            }}
                          >
                            {ownershipStatus}
                          </div>
                        </div>
                      </div>
                    </div>

                                        <div
                      style={{
                        padding: "18px",
                        borderRadius: "10px",
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#172b46",
                          marginBottom: "14px",
                        }}
                      >
                        Relief Eligibility
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 14px",
                          borderRadius: "8px",
                          background: "#f8fafc",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginBottom: "4px",
                            }}
                          >
                            Eligibility Status
                          </div>

                          <div
  style={{
    fontSize: "15px",
    fontWeight: "700",
    color: "#92400e",
  }}
>
  {reliefEligibility?.status ||
    "Awaiting assessment"}
</div>

                        </div>

                        <div
  style={{
    fontSize: "12px",
    color: "#64748b",
    textAlign: "right",
  }}
>
  {reliefEligibility?.reason ||
    "Complete the risk assessment to determine the prototype relief status."}
</div>
                      </div>
                    </div>

                                        <div
                      style={{
                        marginTop: "18px",
                        padding: "14px",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        fontSize: "12px",
                        lineHeight: "1.5",
                        color: "#1e40af",
                      }}
                    >
                      <strong>Prototype Relief Guidance:</strong>{" "}
                      If the property is affected by a verified
                      disaster or infrastructure-related damage,
                      the case can be forwarded for authorized
                      assessment and relief processing.
                    </div>

                    {selectedRiskPreference && (
                      <div
                        style={{
                          marginTop:
                            "18px",
                          padding:
                            "14px 16px",
                          borderRadius:
                            "10px",
                          background:
                            "#f1f5f9",
                          color:
                            "#172b46",
                        }}
                      >
                        <strong>
                          Selected preference:
                        </strong>{" "}
                        {
                          selectedRiskPreference
                        }
                      </div>
                    )}

                  </div>

                </div>

              ) : showTopology ? (

                /* ================================================== */
                /* TOPOLOGY / QUALITY ENGINE                         */
                /* ================================================== */

                <div
                  className="topology-page"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    boxSizing: "border-box",
                    padding: "28px",
                    background: "#f8fafc",
                  }}
                >

                  <div
                    style={{
                      maxWidth: "1100px",
                      margin: "0 auto",
                    }}
                  >

                    {/* ================= TOPOLOGY HEADER ================= */}

                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "26px 28px",
                        boxShadow:
                          "0 4px 20px rgba(0,0,0,0.08)",
                        marginBottom: "18px",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "flex-start",
                          gap: "20px",
                          flexWrap: "wrap",
                        }}
                      >

                        <div>

                          <span
                            style={{
                              display: "inline-block",
                              fontSize: "12px",
                              fontWeight: 800,
                              letterSpacing:
                                "0.12em",
                              color: "#64748b",
                              marginBottom: "8px",
                            }}
                          >
                            TOPOLOGY / QUALITY ENGINE
                          </span>

                          <h1
                            style={{
                              margin: 0,
                              color: "#172b46",
                              fontSize: "28px",
                            }}
                          >
                            Topology Validation
                          </h1>

                          <p
                            style={{
                              margin:
                                "8px 0 0 0",
                              color: "#64748b",
                              fontSize: "14px",
                              lineHeight: 1.6,
                            }}
                          >
                            Analytical validation of
                            Building → Floor → Space →
                            Asset relationships and
                            data quality.
                          </p>

                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >

                          <div
                            style={{
                              padding:
                                "9px 14px",
                              borderRadius:
                                "999px",
                              fontSize: "13px",
                              fontWeight: 800,
                              background:
                                topologyResult?.status ===
                                "VALID"
                                  ? "#ecfdf5"
                                  : topologyResult?.status ===
                                    "CONFLICT DETECTED"
                                  ? "#fff7ed"
                                  : "#fef2f2",
                              color:
                                topologyResult?.status ===
                                "VALID"
                                  ? "#15803d"
                                  : topologyResult?.status ===
                                    "CONFLICT DETECTED"
                                  ? "#c2410c"
                                  : "#dc2626",
                            }}
                          >
                            {topologyResult?.status ===
                            "VALID"
                              ? "✓ VALID"
                              : topologyResult?.status ===
                                "CONFLICT DETECTED"
                              ? "⚠ CONFLICT DETECTED"
                              : "✕ ERROR"}
                          </div>

                        </div>

                      </div>

                      {/* ================= MESSAGE ================= */}

                      {topologyResult && (
                        <div
                          style={{
                            marginTop: "20px",
                            padding: "15px 17px",
                            borderRadius: "10px",
                            background:
                              "#f8fafc",
                            border:
                              "1px solid #e2e8f0",
                            color: "#334155",
                            lineHeight: 1.6,
                            fontSize: "14px",
                          }}
                        >
                          {topologyResult.message ||
                            "Topology validation completed."}
                        </div>
                      )}

                    </div>

                    {/* ================= SUMMARY ================= */}

                    {topologyResult?.summary && (
                      <div
                        style={{
                          background: "#ffffff",
                          borderRadius: "16px",
                          padding: "24px",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,0.08)",
                          marginBottom: "18px",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "center",
                            marginBottom: "18px",
                          }}
                        >

                          <h2
                            style={{
                              margin: 0,
                              color: "#172b46",
                              fontSize: "19px",
                            }}
                          >
                            Validation Summary
                          </h2>

                          <span
                            style={{
                              fontSize: "13px",
                              color: "#64748b",
                            }}
                          >
                            Current database snapshot
                          </span>

                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "12px",
                          }}
                        >

                          <div
                            style={{
                              padding: "18px",
                              borderRadius: "12px",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: 800,
                                color:
                                  "#172b46",
                              }}
                            >
                              {
                                topologyResult.summary
                                  .buildings_checked
                              }
                            </div>

                            <div
                              style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              Buildings
                            </div>

                          </div>

                          <div
                            style={{
                              padding: "18px",
                              borderRadius: "12px",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: 800,
                                color:
                                  "#172b46",
                              }}
                            >
                              {
                                topologyResult.summary
                                  .floors_checked
                              }
                            </div>

                            <div
                              style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              Floors
                            </div>

                          </div>

                          <div
                            style={{
                              padding: "18px",
                              borderRadius: "12px",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: 800,
                                color:
                                  "#172b46",
                              }}
                            >
                              {
                                topologyResult.summary
                                  .spaces_checked
                              }
                            </div>

                            <div
                              style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              Spaces
                            </div>

                          </div>

                          <div
                            style={{
                              padding: "18px",
                              borderRadius: "12px",
                              background:
                                "#f8fafc",
                              border:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: 800,
                                color:
                                  "#172b46",
                              }}
                            >
                              {
                                topologyResult.summary
                                  .assets_checked
                              }
                            </div>

                            <div
                              style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              Assets
                            </div>

                          </div>

                          <div
                            style={{
                              padding: "18px",
                              borderRadius: "12px",
                              background:
                                topologyResult.summary
                                  .conflicts_detected > 0
                                  ? "#fff7ed"
                                  : "#ecfdf5",
                              border:
                                topologyResult.summary
                                  .conflicts_detected > 0
                                  ? "1px solid #fed7aa"
                                  : "1px solid #bbf7d0",
                            }}
                          >

                            <div
                              style={{
                                fontSize: "30px",
                                fontWeight: 800,
                                color:
                                  topologyResult.summary
                                    .conflicts_detected > 0
                                    ? "#c2410c"
                                    : "#15803d",
                              }}
                            >
                              {
                                topologyResult.summary
                                  .conflicts_detected ?? 0
                              }
                            </div>

                            <div
                              style={{
                                color:
                                  topologyResult.summary
                                    .conflicts_detected > 0
                                    ? "#9a3412"
                                    : "#166534",
                                fontSize: "13px",
                                marginTop: "4px",
                              }}
                            >
                              Conflicts
                            </div>

                          </div>

                        </div>

                      </div>
                    )}

                    {/* ================= CONFLICTS ================= */}

                    {topologyResult?.conflicts?.length > 0 && (
                      <div
                        style={{
                          background: "#ffffff",
                          borderRadius: "16px",
                          padding: "24px",
                          boxShadow:
                            "0 4px 20px rgba(0,0,0,0.08)",
                          marginBottom: "18px",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "center",
                            marginBottom: "18px",
                          }}
                        >

                          <div>

                            <h2
                              style={{
                                margin: 0,
                                color:
                                  "#172b46",
                                fontSize: "20px",
                              }}
                            >
                              Detected Issues
                            </h2>

                            <p
                              style={{
                                margin:
                                  "5px 0 0 0",
                                color:
                                  "#64748b",
                                fontSize:
                                  "13px",
                              }}
                            >
                              Potential topology and
                              data-quality issues
                              requiring review.
                            </p>

                          </div>

                          <span
                            style={{
                              padding:
                                "7px 11px",
                              borderRadius:
                                "999px",
                              background:
                                "#f1f5f9",
                              color:
                                "#475569",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                            }}
                          >
                            {
                              topologyResult.conflicts
                                .length
                            }{" "}
                            issue
                            {topologyResult.conflicts
                              .length !== 1
                              ? "s"
                              : ""}
                          </span>

                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection:
                              "column",
                            gap: "12px",
                          }}
                        >

                          {topologyResult.conflicts.map(
                            (
                              conflict: any,
                              index: number
                            ) => {

                              const severity =
                                conflict.severity ||
                                "INFO";

                              const severityBackground =
                                severity === "HIGH"
                                  ? "#fef2f2"
                                  : severity ===
                                    "MEDIUM"
                                  ? "#fff7ed"
                                  : "#f8fafc";

                              const severityColor =
                                severity === "HIGH"
                                  ? "#dc2626"
                                  : severity ===
                                    "MEDIUM"
                                  ? "#d97706"
                                  : "#64748b";

                              return (
                                <div
                                  key={index}
                                  style={{
                                    border:
                                      "1px solid #e2e8f0",
                                    borderRadius:
                                      "12px",
                                    padding:
                                      "18px",
                                    background:
                                      "#ffffff",
                                  }}
                                >

                                  {/* CARD TOP */}

                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      justifyContent:
                                        "space-between",
                                      alignItems:
                                        "center",
                                      gap:
                                        "12px",
                                      flexWrap:
                                        "wrap",
                                    }}
                                  >

                                    <div
                                      style={{
                                        display:
                                          "flex",
                                        gap:
                                          "8px",
                                        alignItems:
                                          "center",
                                        flexWrap:
                                          "wrap",
                                      }}
                                    >

                                      <span
                                        style={{
                                          display:
                                            "inline-flex",
                                          alignItems:
                                            "center",
                                          padding:
                                            "5px 9px",
                                          borderRadius:
                                            "999px",
                                          background:
                                            severityBackground,
                                          color:
                                            severityColor,
                                          fontSize:
                                            "11px",
                                          fontWeight:
                                            800,
                                          letterSpacing:
                                            "0.04em",
                                        }}
                                      >
                                        {severity}
                                      </span>

                                      <span
                                        style={{
                                          display:
                                            "inline-flex",
                                          alignItems:
                                            "center",
                                          padding:
                                            "5px 9px",
                                          borderRadius:
                                            "999px",
                                          background:
                                            "#f1f5f9",
                                          color:
                                            "#475569",
                                          fontSize:
                                            "11px",
                                          fontWeight:
                                            700,
                                        }}
                                      >
                                        {
                                          conflict.type ||
                                          "VALIDATION ISSUE"
                                        }
                                      </span>

                                    </div>

                                    <span
                                      style={{
                                        fontSize:
                                          "12px",
                                        color:
                                          "#94a3b8",
                                      }}
                                    >
                                      Issue #
                                      {index +
                                        1}
                                    </span>

                                  </div>

                                  {/* MESSAGE */}

                                  <p
                                    style={{
                                      margin:
                                        "14px 0",
                                      color:
                                        "#334155",
                                      fontSize:
                                        "14px",
                                      lineHeight:
                                        1.6,
                                    }}
                                  >
                                    {
                                      conflict.message
                                    }
                                  </p>

                                  {/* PROPERTIES */}

                                  <div
                                    style={{
                                      display:
                                        "grid",
                                      gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                      gap:
                                        "10px",
                                    }}
                                  >

                                    <div
                                      style={{
                                        padding:
                                          "12px 14px",
                                        borderRadius:
                                          "9px",
                                        background:
                                          "#f8fafc",
                                        border:
                                          "1px solid #e2e8f0",
                                      }}
                                    >

                                      <div
                                        style={{
                                          fontSize:
                                            "11px",
                                          color:
                                            "#64748b",
                                          fontWeight:
                                            700,
                                          textTransform:
                                            "uppercase",
                                          letterSpacing:
                                            "0.05em",
                                          marginBottom:
                                            "5px",
                                        }}
                                      >
                                        Affected Property
                                      </div>

                                      <strong
                                        style={{
                                          color:
                                            "#172b46",
                                          fontSize:
                                            "13px",
                                        }}
                                      >
                                        {conflict.affected_property ||
                                          "—"}
                                      </strong>

                                    </div>

                                    <div
                                      style={{
                                        padding:
                                          "12px 14px",
                                        borderRadius:
                                          "9px",
                                        background:
                                          "#f8fafc",
                                        border:
                                          "1px solid #e2e8f0",
                                      }}
                                    >

                                      <div
                                        style={{
                                          fontSize:
                                            "11px",
                                          color:
                                            "#64748b",
                                          fontWeight:
                                            700,
                                          textTransform:
                                            "uppercase",
                                          letterSpacing:
                                            "0.05em",
                                          marginBottom:
                                            "5px",
                                        }}
                                      >
                                        Related Property
                                      </div>

                                      <strong
                                        style={{
                                          color:
                                            "#172b46",
                                          fontSize:
                                            "13px",
                                        }}
                                      >
                                        {conflict.related_property ||
                                          "—"}
                                      </strong>

                                    </div>

                                  </div>

                                </div>
                              );
                            }
                          )}

                        </div>

                      </div>
                    )}

                    {/* ================= VALID STATE ================= */}

                    {topologyResult?.status ===
                      "VALID" && (
                      <div
                        style={{
                          background:
                            "#ecfdf5",
                          border:
                            "1px solid #bbf7d0",
                          borderRadius:
                            "16px",
                          padding:
                            "20px",
                          display:
                            "flex",
                          alignItems:
                            "flex-start",
                          gap:
                            "14px",
                          marginBottom:
                            "18px",
                        }}
                      >

                        <div
                          style={{
                            width:
                              "38px",
                            height:
                              "38px",
                            borderRadius:
                              "50%",
                            background:
                              "#dcfce7",
                            color:
                              "#15803d",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize:
                              "20px",
                            fontWeight:
                              800,
                            flexShrink:
                              0,
                          }}
                        >
                          ✓
                        </div>

                        <div>

                          <strong
                            style={{
                              color:
                                "#166534",
                              fontSize:
                                "15px",
                            }}
                          >
                            No topology conflicts detected
                          </strong>

                          <p
                            style={{
                              margin:
                                "5px 0 0 0",
                              color:
                                "#166534",
                              fontSize:
                                "13px",
                              lineHeight:
                                1.6,
                            }}
                          >
                            The current
                            Building →
                            Floor →
                            Space →
                            Asset hierarchy
                            passed the
                            available
                            analytical
                            validation
                            checks.
                          </p>

                        </div>

                      </div>
                    )}

                    {/* ================= VALIDATION SCOPE ================= */}

                    {topologyResult && (
                      <div
                        style={{
                          background:
                            "#ffffff",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "16px",
                          padding:
                            "20px 22px",
                          marginBottom:
                            "18px",
                        }}
                      >

                        <div
                          style={{
                            fontSize:
                              "12px",
                            fontWeight:
                              800,
                            color:
                              "#64748b",
                            letterSpacing:
                              "0.08em",
                            textTransform:
                              "uppercase",
                            marginBottom:
                              "8px",
                          }}
                        >
                          Validation Scope
                        </div>

                        <p
                          style={{
                            margin:
                              "0 0 10px 0",
                            color:
                              "#334155",
                            fontSize:
                              "14px",
                          }}
                        >
                          {topologyResult.validation_scope ||
                            "Analytical topology and data-quality validation"}
                        </p>

                        <div
                          style={{
                            padding:
                              "12px 14px",
                            borderRadius:
                              "9px",
                            background:
                              "#f8fafc",
                            color:
                              "#64748b",
                            fontSize:
                              "12px",
                            lineHeight:
                              1.6,
                          }}
                        >
                          This validation identifies
                          potential structural and
                          data-quality issues. It does
                          not determine legal ownership,
                          cadastral title, or legal
                          disputes.
                        </div>

                      </div>
                    )}

                    {/* ================= ACTIONS ================= */}

                    <div
                      style={{
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        gap:
                          "12px",
                        flexWrap:
                          "wrap",
                        paddingBottom:
                          "20px",
                      }}
                    >

                      <button
                        className="back-to-map-button"
                        onClick={
                          handleBackToMap
                        }
                        style={{
                          padding:
                            "11px 18px",
                          border:
                            "none",
                          borderRadius:
                            "9px",
                          background:
                            "#f1f5f9",
                          color:
                            "#172b46",
                          cursor:
                            "pointer",
                          fontWeight:
                            700,
                        }}
                      >
                        ← Back to Map
                      </button>

                      <button
                        className="dashboard-home"
                        onClick={
                          handleTopologyValidation
                        }
                        disabled={
                          isValidatingTopology
                        }
                        style={{
                          padding:
                            "11px 18px",
                          borderRadius:
                            "9px",
                        }}
                      >
                        {isValidatingTopology
                          ? "Validating..."
                          : "Run Validation Again"}
                      </button>

                    </div>

                  </div>

                </div>

              ) : (

                <>
                  {/* ================================================== */}
                  {/* 3D PROPERTY VIEW */}
                  {/* ================================================== */}

                  {showProperty3D &&
                  selectedProperty ? (

                    <div
                      className="property-3d-view"
                      style={{
                        width:
                          "100%",
                        height:
                          "100%",
                        overflow:
                          "auto",
                      }}
                    >

                      <div className="property-3d-header">

                        <div>

                          <span className="property-3d-label">
                            3D PROPERTY VIEW
                          </span>

                          <h2>
                            {
                              selectedProperty.name
                            }
                          </h2>

                          <p>
                            {
                              selectedProperty.id
                            }{" "}
                            •{" "}
                            {
                              selectedProperty.type
                            }
                          </p>

                        </div>

                        <button
                          className="back-to-map-button"
                          onClick={() => {
                            setShowProperty3D(
                              false
                            );
                            setShowFloors(
                              false
                            );
                            setSelectedFloor(
                              null
                            );
                            setSelectedSpace(
                              null
                            );
                            setAssets([]);
                          }}
                        >
                          ← Back to Map
                        </button>

                      </div>

                      <div className="property-3d-content">

                        <Property3D
                          property={
                            selectedProperty
                          }
                          selectedFloor={
                            selectedFloor
                          }
                          onFloorSelect={(
                            floor
                          ) => {
                            setSelectedFloor(
                              floor
                            );
                            setShowFloors(
                              false
                            );
                          }}
                          resetSignal={
                            mapResetSignal
                          }
                        />

                      </div>

                    </div>

                  ) : (

                    /* ================================================= */
                    /* FULL MAP AREA                                     */
                    /* ================================================= */

                    <div
                      className="map-container"
                      style={{
                        width:
                          "100%",
                        height:
                          "100%",
                        minHeight:
                          0,
                        margin: 0,
                        padding: 0,
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        className="map-content"
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          margin: 0,
                          padding: 0,
                          display:
                            "flex",
                          position:
                            "relative",
                          overflow:
                            "hidden",
                        }}
                      >

                        {/* ================================================= */}
                        {/* MAP                                               */}
                        {/* ================================================= */}

                        <div
                          className="property-map-wrapper"
                          style={{
                            flex:
                              selectedProperty
                                ? "1 1 auto"
                                : "1 1 100%",
                            width:
                              "100%",
                            height:
                              "100%",
                            minWidth: 0,
                            minHeight: 0,
                            margin: 0,
                            padding: 0,
                            position:
                              "relative",
                          }}
                        >

                          <VCadre3DMap
                            onPropertySelect={(
                              property
                            ) => {

                              console.log(
                                "PROPERTY FROM MAP:",
                                property
                              );

                              const coordinates =
                                property?.coordinates;

                              const normalizedProperty =
                                {
                                  ...property,
                                  coordinates,
                                };

                              console.log(
                                "NORMALIZED PROPERTY:",
                                normalizedProperty
                              );

                              setSelectedProperty(
                                normalizedProperty
                              );

                              setShowProperty3D(
                                false
                              );

                              setSelectedFloor(
                                null
                              );

                              setSelectedSpace(
                                null
                              );

                              setAssets([]);

                              setShowFloors(
                                false
                              );

                              setShowRiskScore(
                                false
                              );

                              setShowTopology(
                                false
                              );

                              setTopologyResult(
                                null
                              );

                              setSearchQuery(
                                ""
                              );
                            }}
                          />

                        </div>

                        {/* ================================================= */}
                        {/* PROPERTY INFORMATION                              */}
                        {/* ================================================= */}

                        {selectedProperty && (

                          <div
                            className="property-info-panel"
                            style={{
                              position:
                                "absolute",
                              top: 0,
                              left: 0,
                              width:
                                "350px",
                              height:
                                "100%",
                              boxSizing:
                                "border-box",
                              background:
                                "#ffffff",
                              zIndex: 100,
                              overflowY:
                                "auto",
                              padding:
                                "28px 24px",
                              boxShadow:
                                "4px 0 18px rgba(0,0,0,0.15)",
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "space-between",
                                alignItems:
                                  "center",
                                marginBottom:
                                  "20px",
                              }}
                            >

                              <span
                                style={{
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    800,
                                  letterSpacing:
                                    "0.08em",
                                  color:
                                    "#64748b",
                                }}
                              >
                                PROPERTY INFORMATION
                              </span>

                              <button
                                onClick={() =>
                                  setSelectedProperty(
                                    null
                                  )
                                }
                                style={{
                                  border:
                                    "none",
                                  background:
                                    "#f1f5f9",
                                  borderRadius:
                                    "6px",
                                  padding:
                                    "6px 9px",
                                  cursor:
                                    "pointer",
                                  color:
                                    "#172b46",
                                  fontWeight:
                                    700,
                                }}
                              >
                                ✕
                              </button>

                            </div>

                            <h2
                              style={{
                                margin:
                                  "0 0 24px 0",
                                color:
                                  "#172b46",
                                fontSize:
                                  "23px",
                                lineHeight:
                                  1.25,
                              }}
                            >
                              {
                                selectedProperty.name
                              }
                            </h2>

                            <div className="property-details-list">

                              <div className="property-detail">

                                <span>
                                  Property ID
                                </span>

                                <strong>
                                  {
                                    selectedProperty.id ??
                                    "-"
                                  }
                                </strong>

                              </div>

                              <div className="property-detail">

                                <span>
                                  Type
                                </span>

                                <strong>
                                  {
                                    selectedProperty.type ??
                                    "-"
                                  }
                                </strong>

                              </div>

                              <div className="property-detail">

                                <span>
                                  Floors
                                </span>

                                <strong>
                                  {
                                    selectedProperty.floors ??
                                    "-"
                                  }
                                </strong>

                              </div>

                              {/* LATITUDE */}

                              <div className="property-detail">

                                <span>
                                  Latitude
                                </span>

                                <strong>
                                  {Array.isArray(
                                    selectedProperty.coordinates
                                  ) &&
                                  selectedProperty.coordinates
                                    .length >= 2
                                    ? Number(
                                        selectedProperty
                                          .coordinates[1]
                                      ).toFixed(6)
                                    : "Not available"}
                                </strong>

                              </div>

                              {/* LONGITUDE */}

                              <div className="property-detail">

                                <span>
                                  Longitude
                                </span>

                                <strong>
                                  {Array.isArray(
                                    selectedProperty.coordinates
                                  ) &&
                                  selectedProperty.coordinates
                                    .length >= 2
                                    ? Number(
                                        selectedProperty
                                          .coordinates[0]
                                      ).toFixed(6)
                                    : "Not available"}
                                </strong>

                              </div>

                            </div>

                            <button
                              className="view-3d-button"
                              style={{
                                width:
                                  "100%",
                                marginTop:
                                  "24px",
                              }}
                              onClick={() => {
                                setShowProperty3D(
                                  true
                                );

                                setShowRiskScore(
                                  false
                                );

                                setShowTopology(
                                  false
                                );

                                setTopologyResult(
                                  null
                                );
                              }}
                            >
                              View 3D
                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                  )}

                  {/* ================================================== */}
                  {/* ROOMS / ASSETS PANEL */}
                  {/* ================================================== */}

                  <div className="property-panel">

                    <div className="rooms-section">

                      <h2>
                        Rooms
                      </h2>

                      {filteredSpaces.length ===
                      0 ? (

                        searchQuery.trim() ? (
                          <p className="empty-message">
                            No rooms match "
                            {
                              searchQuery
                            }".
                          </p>
                        ) : null

                      ) : (

                        <div className="room-list">

                          {filteredSpaces.map(
                            (space) => (

                              <button
                                key={
                                  space.id
                                }
                                className={`room-card ${
                                  selectedSpace?.id ===
                                  space.id
                                    ? "selected-room"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSpaceSelect(
                                    space
                                  )
                                }
                              >

                                <strong>
                                  {
                                    space.space_code
                                  }
                                </strong>

                                <span>
                                  {
                                    space.name
                                  }
                                </span>

                                <small>
                                  {
                                    space.space_type
                                  }
                                </small>

                              </button>

                            )
                          )}

                        </div>

                      )}

                    </div>

                    {selectedSpace && (

                      <div className="property-details">

                        <h2>
                          Property Information
                        </h2>

                        <div className="property-row">
                          <span>
                            Code
                          </span>

                          <strong>
                            {
                              selectedSpace.space_code
                            }
                          </strong>
                        </div>

                        <div className="property-row">
                          <span>
                            Name
                          </span>

                          <strong>
                            {
                              selectedSpace.name
                            }
                          </strong>
                        </div>

                        <div className="property-row">
                          <span>
                            Type
                          </span>

                          <strong>
                            {
                              selectedSpace.space_type
                            }
                          </strong>
                        </div>

                        <div className="property-row">
                          <span>
                            Floor
                          </span>

                          <strong>
                            Floor{" "}
                            {
                              selectedSpace.floor_number ??
                              selectedFloor
                            }
                          </strong>
                        </div>

                        <div className="property-row">
                          <span>
                            Description
                          </span>

                          <strong>
                            {
                              selectedSpace.description ||
                              "—"
                            }
                          </strong>
                        </div>

                        <h3>
                          Assets
                        </h3>

                        {assets.length ===
                        0 ? (

                          <p className="empty-message">
                            No assets registered.
                          </p>

                        ) : (

                          <div className="asset-list">

                            {assets.map(
                              (asset) => (

                                <div
                                  className="asset-card"
                                  key={
                                    asset.id
                                  }
                                >

                                  <div>

                                    <strong>
                                      {
                                        asset.name
                                      }
                                    </strong>

                                    <span>
                                      {
                                        asset.asset_type
                                      }
                                    </span>

                                  </div>

                                  <span className="asset-condition">
                                    {
                                      asset.condition ||
                                      "Unknown"
                                    }
                                  </span>

                                </div>

                              )
                            )}

                          </div>

                        )}

                      </div>

                    )}

                  </div>

                </>

              )}

            </main>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;
