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
    const [playedCards, setPlayedCards] = useState([] as number[]);
    const [cardsToPlay, setCardsToPlay] = useState([] as Wrapper[]);
    const [triggeredAnimation, setTriggeredAnimation] = useState(false);

    const canPlay = (card: Card) => {
        return (
            (noping &&
                card.name.trim().toLowerCase() === "nope" &&
                user !== currentPlayer) ||
            playing
        );
    };

    useEffect(() => {
        setTimeout(() => {
            setCardsToPlay([]);
            setTriggeredAnimation(false);
        }, 1000);
    }, [playing]);

    useEffect(() => {
        console.log("hand");
        console.log(hand);
        setPlayedCards([]);
    }, [hand]);

    const handlePlayCard = () => {
        const message = cardsToPlay.map(({ index }) => index).join(",");
        console.log(message);
        send(message);
        setPlayedCards(cardsToPlay.map(({ index }) => index));

        setTriggeredAnimation(true);
        setTimeout(() => {
            setPlayedCards([]);
        }, 1000);
    };

    const handleClickCard = (wrapper: Wrapper) => {
        if (!canPlay(wrapper.card)) return;

        console.log(`clicked ${wrapper.index}`);

        if (cardsToPlay.find((w) => w.index === wrapper.index)) {
            setCardsToPlay([
                ...cardsToPlay.filter((w) => w.index !== wrapper.index),
            ]);
        } else {
            setCardsToPlay([...cardsToPlay, wrapper]);
        }
    };

    useEffect(() => {
        console.log(cardsToPlay);
    }, [cardsToPlay]);

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
            {cardsToPlay.length && (
                <button
                    className="flame-button"
                    id="play-button"
                    onClick={() => handlePlayCard()}
                >
                    PLAY CARDS
                </button>
            )}
            <div id="hand-container" className="flex-row">
                {cards.map((w, ind) => (
                    <div className="hand-column">
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
                                        (playedCards.find((i) => i === index)
                                            ? " played"
                                            : "") +
                                        (cardsToPlay.find(
                                            (w) => w.index === index
                                        ) && !triggeredAnimation
                                            ? " to-play"
                                            : "")
                                    }
                                    onClick={() =>
                                        handleClickCard({ card, index })
                                    }
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
