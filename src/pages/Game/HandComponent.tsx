import { Card } from "../../types";
import { getURL } from "../../utils";

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

    const handleSkip = () => {
        send("n");
    };

    return (
        <div id="hand-container" className="flex-row">
            {hand.map((c, i) => {
                return (
                    <div
                        className={
                            "card" +
                            (user === currentPlayer ||
                            (noping && c.name.trim().toLowerCase() == "nope")
                                ? ""
                                : " grey")
                        }
                        onClick={() => handlePlayCard(c, i)}
                    >
                        <img
                            src={getURL("cards/", c.name, ".jpeg")}
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
    );
}
