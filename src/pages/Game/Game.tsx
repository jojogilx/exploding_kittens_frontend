import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Recipe, RoomEvent, Card, Player, Bury, HandCount } from "../../types";
import "./Game.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import seatImage from "../../assets/images/Seat.svg";
import Popup from "reactjs-popup";
import tableImage from "../../assets/images/table.svg";
import { getURL } from "../../utils";

type PromptType =
    | "target_player"
    | "bury_card"
    | "choose_card"
    | "alter_the_future"
    | "garbage_collection";

export function Game() {
    const { roomName } = useParams();
    const [playersSeatings, setPlayersSeatings] = useState([] as Player[]);

    const [recipe, setRecipe] = useState<Recipe | null>(null);

    const [isStarted, setIsStarted] = useState(false);

    const [hand, setHand] = useState([] as Card[]);
    const [drawnCard, setDrawnCard] = useState<Card | null>(null);
    const [showDrawnCard, setShowDrawnCard] = useState(false);
    const [prompt, setPrompt] = useState<null | PromptType>(null);

    const [currentPlayer, setCurrentPlayer] = useState("");
    const [info, setInfo] = useState("");
    const [error, setError] = useState("");

    const [winner, setWinner] = useState("");

    const [deckLength, setDeckLength] = useState(0);
    const [lastPlayedCard, setLastPlayedCard] = useState<Card | null>(null);

    const [playersHands, setPlayerHands] = useState<[string, HandCount][]>([]);

    const user = localStorage.getItem("userId");

    const [bury, setBury] = useState<Bury | null>(null);

    const WS_PLAYER_ROOM =
        "ws://127.0.0.1:8080/join/" + roomName?.trim() + "/" + user;

    const { lastJsonMessage, readyState, sendMessage } = useWebSocket(
        WS_PLAYER_ROOM,
        {
            share: true,
            shouldReconnect: () => true,
        }
    );

    // Connection status monitoring
    useEffect(() => {
        switch (readyState) {
            case ReadyState.CONNECTING:
                console.log("WebSocket connecting...");
                break;
            case ReadyState.OPEN:
                console.log("WebSocket connected");
                break;
            case ReadyState.CLOSING:
                console.log("WebSocket closing...");
                break;
            case ReadyState.CLOSED:
                console.log("WebSocket closed");
                // Additional actions after the connection is closed
                // reconnect logic here if needed
                break;
            default:
                break;
        }
    }, [readyState]);

    useEffect(() => {
        try {
            if (lastJsonMessage === null) return;
            const jsonString = JSON.stringify(lastJsonMessage);

            const event = JSON.parse(jsonString) as RoomEvent;
            console.log(`Got a new message:`, event);

            switch (event.event) {
                case "joined":
                    setPlayersSeatings(event.player_list as Player[]);
                    break;

                case "left":
                    setPlayersSeatings(event.player_list as Player[]);
                    break;
                case "started":
                    setIsStarted(true);
                    break;
                case "room_state":
                    setPlayersSeatings(event.player_list as Player[]);
                    setRecipe(event.recipe as Recipe);
                    break;
                case "information":
                    setInfo(event.information);
                    break;
                case "error":
                    setError(event.error);
                    break;
                case "new_turn":
                    setCurrentPlayer(event.player);
                    break;
                case "winner":
                    setWinner(event.player);
                    break;
                case "died":
                    // triggerOverlay(event.player); TODO
                    break;
                case "hand":
                    setHand(event.player_hand);
                    break;
                case "piles":
                    setDeckLength(event.draw_size);
                    break;
                case "players_hands":
                    setPlayerHands(event.hands);
                    break;
                case "draw_card":
                    const card = event.card as Card;
                    setDrawnCard(card);
                    setHand([...hand, card]);
                    //trigger exploding overlay TODO
                    break;
                case "play_card":
                    setLastPlayedCard(event.card as Card);
                    // trigger defuse animation
                    break;
                case "target_player":
                    setPrompt("target_player");
                    break;
                case "bury_card": //todo change
                    setBury({
                        card: event.card,
                        min: event.min,
                        max: event.max,
                    });
                    setPrompt("bury_card");
                    break;
                case "garbage_collection":
                    setPrompt("garbage_collection");
                    break;
                case "alter_the_future":
                    setPrompt("alter_the_future");
                    break;
                case "see_the_future":
                    //todo trigger  cards overlay
                    break;
                case "choose_card":
                    setPrompt("choose_card");
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error parsing JSON message:`, error);
        }
    }, [lastJsonMessage]);

    const handleSkip = () => {
        sendMessage("n");
    };

    const notifyBackendOnUnload = () => {
        sendMessage("left");
    };

    const PromptComponent = () => {
        return (
            <Popup
                open={prompt !== null}
                onClose={() => {
                    setPrompt(null);
                }}
            >
                <div className="popup">
                    <h3>BURY CARD</h3>
                    <div>
                        <div className="flex-row field-create">
                            <h5 className="label">
                                Where do you want to bury{" "}
                                {bury!.card ? bury?.card.name : "this card"}?
                            </h5>
                            <p>
                                Choose an index from {bury!.min} to {bury!.max}
                            </p>
                            <input
                                type="text"
                                min={bury!.min}
                                max={bury!.max}
                                placeholder="Index..."
                                className="input pop2"
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                </div>
            </Popup>
        );
    };

    const handleStart = () => {
        const url = "http://127.0.0.1:8080/start/" + roomName?.trim();

        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };

        fetch(url, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Failed to start room: " + response.statusText
                    );
                }
                return response;
            })
            .then((_) => {
                console.log("sent start");
            })
            .catch((error) => {
                console.error("Error creating room:", error);
            });
    };

    window.addEventListener("beforeunload", notifyBackendOnUnload);

    const handlePlayCard = (i: number) => {
        if (user !== currentPlayer) return;

        sendMessage(i.toString());

        const cards = hand.filter((_, ind) => i !== ind);
        setHand(cards);
    };

    return (
        <div className="game-container">
            <div className="side-game flex-column">
                <div>
                    <h4>Players</h4>
                    <div>
                        {playersSeatings?.length ? (
                            <ul className="">
                                {playersSeatings.map(({ playerID }) => (
                                    <div className="player-display">
                                        {playerID}
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <div>No players </div>
                        )}
                    </div>
                </div>
                <div className="flex-column">
                    <h4>Recipe Details</h4>
                    {recipe ? (
                        <img
                            id="recipe-card"
                            src={getURL("recipes/", recipe!.name, ".png")}
                            alt=""
                            draggable="false"
                        />
                    ) : (
                        <></>
                    )}

                    {drawnCard && (
                        <div className="shadow overlay middle">
                            <div>
                                <h4>DRAWN CARD:</h4>
                                <img
                                    src={getURL(
                                        "cards/",
                                        drawnCard!.name,
                                        ".jpeg"
                                    )}
                                    alt=""
                                    className="card-drawn"
                                    draggable="false"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    {!isStarted ? (
                        <button
                            className="flame-button"
                            onClick={() => handleStart()}
                        >
                            START GAME
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <div className="game">
                <PromptComponent />
                <div className="table-seatings overlay middle">
                    <img src={tableImage} alt="" id="table" draggable="false" />
                    {playersSeatings.map(({ playerID, seat }) => {
                        return (
                            <div
                                className="seat"
                                id={"seat" + seat}
                                key={"seat" + seat}
                            >
                                <img
                                    src={seatImage}
                                    className="seat-image"
                                    draggable="false"
                                />
                                <div
                                    className={
                                        "tag " +
                                        (currentPlayer === playerID
                                            ? "current-player"
                                            : "")
                                    }
                                >
                                    {playerID}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div id="hand-container" className="flex-row">
                    {info && (
                        <div className="header-information">
                            Information: {info}
                        </div>
                    )}
                    {hand.map((c, i) => {
                        return (
                            <div
                                className={
                                    "card" +
                                    (user === currentPlayer ? "" : " grey")
                                }
                                onClick={() => handlePlayCard(i)}
                            >
                                <img
                                    src={getURL(
                                        "./images/cards/",
                                        c.name,
                                        ".jpeg"
                                    )}
                                    alt=""
                                    className={"recipe-face"}
                                    draggable="false"
                                />
                            </div>
                        );
                    })}
                    {user === currentPlayer ? (
                        <button onClick={() => handleSkip()}>Skip</button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}
