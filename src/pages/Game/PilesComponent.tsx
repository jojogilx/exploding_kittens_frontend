import cardback from "../../assets/images/cards/back.svg";
import { getURL } from "../../utils";
import { useEffect } from "react";
import { Card } from "../../types";

type Props = {
    drawDeck: number;
    lastPlayedCard: Card | null;
};

export function PilesComponent({ drawDeck, lastPlayedCard }: Props) {
    useEffect(() => {
        console.log("piles", drawDeck, " last ", lastPlayedCard);
    }, [drawDeck, lastPlayedCard]);

    return (
        <div className="decks">
            {drawDeck > 0 && (
                <div id="draw-deck">
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
