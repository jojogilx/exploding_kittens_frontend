import { HandCount } from "../../types";
import cardback from "../../assets/images/cards/back.svg";
import { getURL } from "../../utils";
import { useEffect, useState } from "react";

type Props = {
    playersHands: [string, HandCount][];
    player: string;
    currentPlayer: string;
    index: number;
};

export function HandsComponent({
    playersHands,
    player,
    currentPlayer,
    index,
}: Props) {
    const user = localStorage.getItem("userId");
    const [hand, setHand] = useState<HandCount | null>(null);

    useEffect(() => {
        const pHand = playersHands.find(([s, _]) => s === player)?.[1] ?? null;
        setHand(pHand);
    }, [playersHands]);

    return (
        <div
            className="tags-wrapper"
            style={
                {
                    "--index": index,
                    "--nPlayers": playersHands.length,
                } as React.CSSProperties
            }
        >
            <div
                className={
                    "player-tag " +
                    (currentPlayer === player ? "current-player" : "")
                }
            >
                <span>{player}</span>

                {user !== player && hand && (
                    <ul key={`hand-${player}`} className="hand-player">
                        {Array.from({ length: hand.hidden }).map((_) => (
                            <li>
                                <img
                                    src={cardback}
                                    alt=""
                                    className="card-hand"
                                />
                            </li>
                        ))}
                        {hand.shown.map((card) => (
                            <li>
                                <img
                                    src={getURL(
                                        "cards/",
                                        card.name,
                                        ".svg",
                                        ".jpeg"
                                    )}
                                    alt=""
                                    className="card-hand"
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
