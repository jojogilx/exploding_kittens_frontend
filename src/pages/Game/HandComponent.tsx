import { Card, Wrapper } from "../../types";
import { getURL } from "../../utils";
import bomb from "../../assets/images/cards/explodingkitten.svg";
import { useEffect, useState } from "react";

type Props = {
    hand: Card[];
    setHand: React.Dispatch<React.SetStateAction<Card[]>>;
    currentPlayer: string;
    send: (s: string) => void;
    noping: boolean;
};

export function HandComponent({
    hand,
    send,
    currentPlayer,
    setHand,
    noping,
}: Props) {
    const user = localStorage.getItem("userId");
    const [cards, setCards] = useState([] as Wrapper[][]);

    const canPlay = (card: Card) => {
        return (
            (noping &&
                card.name.trim().toLowerCase() === "nope" &&
                user !== currentPlayer) ||
            user === currentPlayer
        );
    };

    const handlePlayCard = (card: Card, i: number) => {
        if (!canPlay(card)) return;

        send(i.toString());

        const cards = hand.filter((_, ind) => i !== ind);
        setHand(cards);
    };

    useEffect(() => {
        console.log(JSON.stringify(hand));
        const wrapped = hand.map(
            (card, index) => ({ card: card, index } as Wrapper)
        );

        const grouped = wrapped.reduce((acc, { card, index }) => {
            if (!acc[card.name]) {
                acc[card.name] = [];
            }
            acc[card.name].push({ card, index });
            return acc;
        }, {} as { [key: string]: Wrapper[] });

        const result = Object.values(grouped);

        setCards(result);
    }, [hand]);

    const handleSkip = () => {
        send("n");
    };

    return (
        <div id="hand-container" className="flex-row">
            {cards.map((w) => (
                <div className="flex-column" id="hand-column">
                    {w.map(({ card, index }) => {
                        return (
                            <div
                                className={
                                    "card " +
                                    (user === currentPlayer ||
                                    (noping &&
                                        card.name.trim().toLowerCase() ==
                                            "nope")
                                        ? ""
                                        : " grey")
                                }
                                onClick={() => handlePlayCard(card, index)}
                            >
                                <img
                                    src={getURL(
                                        "cards/",
                                        card.name,
                                        ".svg",
                                        ".jpeg"
                                    )}
                                    alt=""
                                    className={"recipe-face"}
                                    draggable="false"
                                />
                                {/* <img
                            src={bomb}
                            alt=""
                            className={"recipe-face"}
                            draggable="false"
                        /> */}
                            </div>
                        );
                    })}
                </div>
            ))}
            {user === currentPlayer ? (
                <button onClick={() => handleSkip()}>Skip</button>
            ) : (
                <></>
            )}
        </div>
    );
}
