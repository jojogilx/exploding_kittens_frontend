import React, { useState, useEffect, memo } from "react";
import "./RoomList.css";
import closeIcon from "../../assets/images/closeIcon.webp";
import catNotFound from "../../assets/images/CatNoutFound.svg";
import Popup from "reactjs-popup";
import { Recipe, Room } from "../../types";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { useNavigate } from "react-router-dom";
import { RecipeChooserComponent } from "./components/RecipeChooserComponent";

export const RoomList = () => {
    const navigate = useNavigate();

    let user = localStorage.getItem("userId");

    const [roomList, setRoomList] = useState([] as Room[]);

    const WS_ROOM_LIST_URL = "ws://127.0.0.1:8080/rooms";
    const { lastJsonMessage, readyState } = useWebSocket(WS_ROOM_LIST_URL, {
        share: false,
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            console.log("conn");
        }
    }, [readyState]);

    useEffect(() => {
        try {
            const jsonString = JSON.stringify(lastJsonMessage);
            const decodedRooms = JSON.parse(jsonString) as Room[];

            setRoomList(decodedRooms);
            console.log(`Got a new message:`, decodedRooms);
        } catch (error) {
            console.error(`Error parsing JSON message:`, error);
        }
    }, [lastJsonMessage]);

    const [popupCreateShown, setPopupCreateShown] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isChoosingRecipe, setIsChoosingRecipe] = useState(false);
    const [error, setError] = useState("");

    const joinable = (r: Room) => {
        return r.started || r.players.length == r.recipe?.max_players;
    };

    const askNameChange = () => {
        const userInput = window.prompt("Please enter your name:");
        if (userInput !== null && userInput !== "") {
            localStorage.setItem("userId", userInput.trim());
            user = userInput.trim();
        }
    };

    const handleRoomNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    };

    const handleJoinRoom = (room: string) => {
        navigate("/rooms/" + room);
    };

    const handleCreateRoom = () => {
        while (user === null) {
            askNameChange();
        }

        const url = "http://127.0.0.1:8080/create";

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomName: roomName,
                playerName: user,
                recipeName: recipe?.name,
            }),
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to create room: " + response.statusText
                    );
                }
                return response;
            })
            .then((_) => {
                console.log("Room created successfully");
                setPopupCreateShown(false);
                handleJoinRoom(roomName);
            })
            .catch((error) => {
                console.error("Error creating room:", error);
                setError(error.message); // Set error message state
            });
    };

    const handleResetRoom = (roomName: String) => {
        const url = "http://127.0.0.1:8080/reset/" + roomName;

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch(url, requestOptions)
            .then((_) => {
                console.log("Room reset successfully");
            })
            .catch((error) => {
                console.error("Error resetting room:", error);
            });
    };

    const CreateRoomPopup = memo(() => {
        return (
            <Popup
                open={popupCreateShown}
                onClose={() => {
                    setPopupCreateShown(false);
                    setError("");
                }}
            >
                <div className="popup">
                    <img
                        src={closeIcon}
                        alt="close"
                        className="icons-close clickable"
                        onClick={() => {
                            setPopupCreateShown(false);
                            setError("");
                        }}
                        draggable="false"
                    />
                    <h3>CREATE GAME </h3>
                    <div>
                        <div className="flex-row field-create">
                            <h5 className="label">GAME NAME</h5>
                            <input
                                type="text"
                                maxLength={20}
                                value={roomName}
                                placeholder="Room name..."
                                className="input pop2"
                                onChange={handleRoomNameChange}
                            />
                        </div>
                    </div>
                    {recipe ? (
                        <div className="flex-row">
                            <div className="bold">Recipe: </div>
                            <div id="recipe-name">{recipe?.name}</div>
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="flex-row">
                        <button
                            className="flame-button  create-row"
                            onClick={() => setIsChoosingRecipe(true)}
                        >
                            {recipe ? "CHANGE RECIPE" : "CHOOSE RECIPE"}
                        </button>

                        <button
                            className="flame-button create-row"
                            disabled={recipe === null}
                            onClick={() => {
                                handleCreateRoom();
                                //   handleJoinRoom(roomName!);
                            }}
                        >
                            CREATE
                        </button>
                    </div>
                    {error && <div className="error">{error}</div>}
                </div>
            </Popup>
        );
    });

    const RoomList = () => {
        return (
            <div className="content">
                <div className="header-rooms">
                    <h2 className="room-list-title">
                        <span className="white-text bold head2">GAMES </span>
                        <span className="exploding-text bold">LIST</span>
                    </h2>
                    <button
                        className="button create-room-button"
                        id="create-room"
                        onClick={() => {
                            setPopupCreateShown(true);
                        }}
                    >
                        CREATE GAME
                    </button>
                    <CreateRoomPopup />
                </div>

                <div className="pages">
                    {roomList?.length > 0 ? (
                        <ul className="rooms-list bottom-border">
                            {roomList.map((r) => (
                                <li className="room flex-row" key={r.name}>
                                    <div className="flex-row">
                                        <div
                                            id="ball"
                                            className={
                                                joinable(r)
                                                    ? "joinable"
                                                    : "not-joinable"
                                            }
                                        ></div>
                                        <span className="room-name bold">
                                            {r.name}
                                        </span>
                                        {/* <span className="status">
                {r.started
                  ? "Game started"
                  : r.players.length === r.recipe?.maxPlayers
                    ? "Game full"
                    : ""}
              </span> */}
                                    </div>
                                    <span className="recipe">
                                        <span className="bold">Recipe:</span>{" "}
                                        {r.recipe.name}
                                    </span>
                                    <span className="players-list">
                                        <span className="bold">
                                            Players {r.players.length}/
                                            {r.recipe.max_players}:
                                        </span>{" "}
                                        {r.players.toString()}
                                    </span>
                                    <button
                                        className="flame-button"
                                        id="join-button"
                                        onClick={() => {
                                            handleResetRoom(r.name);
                                        }}
                                    >
                                        RESET (DEV)
                                    </button>
                                    <button
                                        className="flame-button"
                                        id="join-button"
                                        disabled={joinable(r)}
                                        onClick={() => {
                                            handleJoinRoom(r.name);
                                        }}
                                    >
                                        JOIN ROOM
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex-row" id="no-rooms">
                            <img
                                src={catNotFound}
                                draggable="false"
                                id="cat-not-found"
                            />
                            <h3>No games to display!</h3>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return isChoosingRecipe ? (
        <RecipeChooserComponent
            recipe={recipe}
            setRecipe={(r: Recipe) => setRecipe(r)}
            goBack={() => setIsChoosingRecipe(false)}
        />
    ) : (
        <RoomList />
    );
};
