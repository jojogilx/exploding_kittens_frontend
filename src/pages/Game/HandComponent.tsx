import { Card, Wrapper } from "../../types";
import { getURL } from "../../utils";
import bomb from "../../assets/images/cards/explodingkitten.svg";
import { useEffect, useState } from "react";
import "./HandComponent.css";

type Props = {
    hand: Card[];
    setHand: React.Dispatch<React.SetStateAction<Card[]>>;
    currentPlayer: string;
    send: (s: string) => void;
    noping: boolean;
    playing: boolean;
};

export function HandComponent({
    hand,
    send,
    currentPlayer,
    setHand,
    noping,
    playing,
}: Props) {
    const user = localStorage.getItem("userId");
    const [cards, setCards] = useState([] as Wrapper[][]);
    const [playedCardIndex, setPlayedCardIndex] = useState(-1);

    const canPlay = (card: Card) => {
        return (
            (noping &&
                card.name.trim().toLowerCase() === "nope" &&
                user !== currentPlayer) ||
            playing
        );
    };

    const handlePlayCard = (card: Card, i: number) => {
        if (!canPlay(card)) return;

        send(i.toString());

        setPlayedCardIndex(i);
        setTimeout(() => {
            setPlayedCardIndex(-1);
        }, 1000);
        // const cards = hand.filter((_, ind) => i !== ind);
        //  setHand(cards);
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

    return (
        <>
            <div id="hand-container" className="flex-row">
                {cards.map((w) => (
                    <div className="flex-column hand-column">
                        {w.map(({ card, index }) => {
                            return (
                                <div
                                    className={
                                        "card " +
                                        (playing ||
                                        (noping &&
                                            card.name.trim().toLowerCase() ==
                                                "nope")
                                            ? " can-play"
                                            : " cant-play") +
                                        (playedCardIndex === index
                                            ? " played"
                                            : "")
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
            </div>
        </>
    );
}
