import cardback from "../../assets/images/cards/back.svg";
import { getURL } from "../../utils";
import { useEffect } from "react";
import { Card } from "../../types";

type Props = {
    drawDeck: number;
    lastPlayedCard: Card | null;
    sendMessage: (s: string) => void;
    currentPlayer: string;
};

export function PilesComponent({
    drawDeck,
    lastPlayedCard,
    sendMessage,
    currentPlayer,
}: Props) {
    const user = localStorage.getItem("userId");

    const handlePass = () => {
        if (user !== currentPlayer) return;
        sendMessage("n");
    };

    return (
        <div className="decks">
            {drawDeck > 0 && (
                <div
                    id="draw-deck"
                    className={user === currentPlayer ? "can-draw" : ""}
                    onClick={() => handlePass()}
                >
                    <div id="deck-length">{drawDeck}</div>
                    <img src={cardback} alt="" />
                </div>
            )}
            {lastPlayedCard && (
                <img
                    src={getURL("cards/", lastPlayedCard.name, ".svg", ".jpeg")}
                    alt=""
                    id="last-played"
                />
            )}
        </div>
    );
}
