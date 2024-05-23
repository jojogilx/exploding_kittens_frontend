import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Recipe,
    RoomEvent,
    Card,
    Player,
    Bury,
    HandCount,
    PromptType,
} from "../../types";
import "./Game.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import seatImage from "../../assets/images/Seat.svg";
import Popup from "reactjs-popup";
import tableImage from "../../assets/images/table.svg";
import { getURL } from "../../utils";
import { HandsComponent } from "./PlayerHandsComponent";
import { PilesComponent } from "./PilesComponent";
import { PromptComponent } from "./PromptComponent";
import { HandComponent } from "./HandComponent";

export function Game() {
    const RADIUS = 300;
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

    const [noping, setNoping] = useState(false);

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
                    setTimeout(() => {
                        setInfo("");
                    }, 3000);
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

                    setTimeout(() => {
                        setDrawnCard(null);
                    }, 3000);
                    setDrawnCard(card);

                    //trigger exploding overlay TODO
                    break;
                case "play_card":
                    setLastPlayedCard(event.card as Card);
                    // trigger defuse animation
                    break;
                case "target_player":
                    setPrompt(event);
                    break;
                case "bury_card": //todo change
                    setBury({
                        card: event.card,
                        min: event.min,
                        max: event.max,
                    });
                    setPrompt(event);
                    break;
                case "garbage_collection":
                    setPrompt(event);
                    break;
                case "alter_the_future":
                    setPrompt(event);
                    break;
                case "see_the_future":
                    //todo trigger  cards overlay
                    break;
                case "choose_card":
                    setPrompt(event);
                    break;
                case "nope_card":
                    setNoping(true);
                    break;
                case "end_nope":
                    setNoping(false);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error parsing JSON message:`, error);
        }
    }, [lastJsonMessage]);

    const notifyBackendOnUnload = () => {
        sendMessage("left");
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

    const handleSubmitPrompt = (response: string) => {
        sendMessage(response);
        setPrompt(null);
    };

    return (
        <div className="game-container">
            {drawnCard && (
                <div className="shadow overlay middle" id="drawn-card-shadow">
                    <h3>DRAWN CARD</h3>
                    <img
                        src={getURL("cards/", drawnCard!.name, ".svg", ".jpeg")}
                        alt=""
                        className="card-drawn"
                        draggable="false"
                    />
                </div>
            )}

            <div className="game">
                <PromptComponent
                    prompt={prompt}
                    submitPrompt={handleSubmitPrompt}
                />
                <div id="game-header">
                    <p>
                        <strong>Recipe: </strong>
                        {recipe?.name}
                    </p>
                    <p>{info}</p>
                </div>
                <div className="table-seatings overlay middle">
                    {!isStarted ? (
                        <button
                            className="flame-button"
                            id="start-button"
                            onClick={() => handleStart()}
                        >
                            START GAME
                        </button>
                    ) : (
                        <></>
                    )}
                    <PilesComponent
                        drawDeck={deckLength}
                        lastPlayedCard={lastPlayedCard}
                    />

                    {playersSeatings.map(({ playerID, seat }) => {
                        return (
                            <div
                                className="seat-wrapper"
                                style={
                                    {
                                        "--seatIndex": seat,
                                        "--numberPlayers":
                                            playersSeatings.length,
                                    } as React.CSSProperties
                                }
                            >
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
                            </div>
                        );
                    })}
                    <img src={tableImage} alt="" id="table" draggable="false" />
                    <HandsComponent playersHands={playersHands} />
                </div>

                <HandComponent
                    hand={hand}
                    setHand={setHand}
                    send={sendMessage}
                    currentPlayer={currentPlayer}
                    noping={noping}
                />
            </div>
        </div>
    );
}
