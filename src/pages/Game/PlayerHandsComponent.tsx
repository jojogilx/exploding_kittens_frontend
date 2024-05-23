import { HandCount } from "../../types";
import cardback from "../../assets/images/cards/back.svg";
import { getURL } from "../../utils";
import { useEffect } from "react";

type Props = {
    playersHands: [string, HandCount][];
};

export function HandsComponent({ playersHands }: Props) {
    const user = localStorage.getItem("userId");

    return (
        <div className="hands flex-row">
            {playersHands.map(([player, { shown, hidden }], index) => (
                <div className="player-tag">
                    <span>{player}</span>

                    {user !== player && (
                        <ul key={`hand${index}`} className="hand-player">
                            {Array.from({ length: hidden }).map((_) => (
                                <li>
                                    <img
                                        src={cardback}
                                        alt=""
                                        className="card-hand"
                                    />
                                </li>
                            ))}
                            {shown.map((card) => (
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
            ))}
        </div>
    );
}
