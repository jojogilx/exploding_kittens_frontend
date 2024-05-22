import { useEffect, useState } from "react";
import { Bury, Card, PromptType } from "../../types";
import { getURL } from "../../utils";

type Props = {
    prompt: PromptType | null;
    submitPrompt: (s: string) => void;
};

export function PromptComponent({ prompt, submitPrompt }: Props) {
    useEffect(() => {
        console.log("prompt", prompt);
    }, [prompt]);

    const [answer, setAnswer] = useState("");
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [cards, setCard] = useState<Card[] | null>(null);

    function getPromptDescription() {
        switch (prompt?.event) {
            case "bury_card":
                return `Where do you want to bury ${
                    prompt.card ? prompt.card.name : "this card"
                }?`;
            case "alter_the_future":
                return `Drag to reorder the cards`;
            case "target_player":
                return `Choose a player`;
            case "choose_card":
                return `Choose a card`;
            case "garbage_collection":
                return `Choose a card to shuffle back into the deck`;
            default:
                break;
        }
    }

    function getBody() {
        switch (prompt?.event) {
            case "target_player":
                return (
                    <ul className="flex-row">
                        {prompt.players.map((player, index) => (
                            <li
                                key={index}
                                className={`next-cards`}
                                onClick={() => submitPrompt(index.toString())}
                            >
                                <p className="player-tag-choose">{player}</p>
                            </li>
                        ))}
                    </ul>
                );
            case "bury_card":
                return (
                    <div className="flex-column field-create">
                        <p>
                            Choose an index from {prompt!.min} to {prompt!.max}
                        </p>
                        <input
                            type="text"
                            min={prompt!.min}
                            max={prompt!.max}
                            placeholder="Index..."
                            className="input pop2"
                            onChange={(e) => {
                                setAnswer(e.target.value);
                            }}
                        />
                        <button
                            className="flame-button"
                            onClick={() => submitPrompt(answer)}
                        >
                            BURY
                        </button>
                    </div>
                );
            case "choose_card" || "garbage_collection":
                return (
                    <ul className="flex-row">
                        {prompt.cards.map((card, index) => (
                            <li
                                key={index}
                                className={`next-cards`}
                                onClick={() => submitPrompt(index.toString())}
                            >
                                <img
                                    src={getURL("cards/", card.name, ".jpeg")}
                                    alt=""
                                />
                            </li>
                        ))}
                    </ul>
                );
            case "alter_the_future":
                return (
                    <ul className="flex-row">
                        {prompt.next_cards.map((card, index) => (
                            <li key={index} className={`next-cards`}>
                                <img
                                    src={getURL("cards/", card.name, ".jpeg")}
                                    alt=""
                                />
                            </li>
                        ))}
                    </ul>
                );
        }
    }

    return (
        prompt && (
            <div className="popup">
                <h3>{prompt?.event.split("_").join(" ").toUpperCase()}</h3>
                <p>{getPromptDescription()}</p>
                {getBody()}
            </div>
        )
    );
}
