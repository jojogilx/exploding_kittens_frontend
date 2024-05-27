import cardback from "../../assets/images/cards/back.svg";
import { getURL } from "../../utils";
import { useEffect, useState } from "react";
import { Card } from "../../types";
import useSound from "../../useSound";
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

    const cardDrawSound = useSound("drawCard.mp3");
    const playSound = useSound("playCard.mp3");

    const [lastPlayed, setLastPlayed] = useState<Card | null>(null);

    const [nowPlayed, setNowPlayed] = useState<Card | null>(null);
    const [playedTiming, setPlayedTiming] = useState(false);
    const [drawnTiming, setDrawnTiming] = useState(false);

    const handlePass = () => {
        if (user !== currentPlayer) return;
        cardDrawSound.play();
        sendMessage("n");

        setDrawnTiming(true);
        const timer = setTimeout(() => setDrawnTiming(false), 1000);
        return () => clearTimeout(timer);
    };

    useEffect(() => {
        if (lastPlayedCard !== null) playSound.play();
        setLastPlayed(nowPlayed);
        setNowPlayed(lastPlayedCard);
        setPlayedTiming(true);
        const timer = setTimeout(() => setPlayedTiming(false), 1000);
        return () => clearTimeout(timer);
    }, [lastPlayedCard]);

    return (
        <div className="decks">
            <div className="overlayed">
                {drawDeck > 1 && <img src={cardback} alt="" className="" />}
                <div id="deck-length">{drawDeck}</div>
            </div>
            {drawDeck > 0 && (
                <div
                    id="draw-deck"
                    className={
                        "overlayed " +
                        (user === currentPlayer ? " can-draw " : "") +
                        (drawnTiming ? " drawn" : "")
                    }
                    onClick={() => handlePass()}
                >
                    <img draggable="false" src={cardback} alt="" />
                </div>
            )}
            <div>
                {lastPlayed && (
                    <img
                        draggable="false"
                        className="overlayed"
                        src={getURL("cards/", lastPlayed.name, ".svg", ".jpeg")}
                        alt=""
                    />
                )}
                {nowPlayed && (
                    <img
                        draggable="false"
                        className={`overlayed ${
                            playedTiming ? "played-card-deck" : ""
                        }`}
                        src={getURL("cards/", nowPlayed.name, ".svg", ".jpeg")}
                        alt=""
                    />
                )}
            </div>
        </div>
    );
}
