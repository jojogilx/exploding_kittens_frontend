import { useEffect, useState } from "react";
import { Bury, Card, PromptType } from "../../types";
import { getURL } from "../../utils";
import { Draggable } from "react-drag-reorder";
import { arrayMoveImmutable } from "array-move";

type Props = {
    prompt: PromptType | null;
    submitPrompt: (s: string) => void;
};

type Wrapper = { card: Card; index: number };

export function PromptComponent({ prompt, submitPrompt }: Props) {
    const [nextcards, setNextCards] = useState([] as Wrapper[]);

    useEffect(() => {
        if (prompt?.event === "alter_the_future") {
            const wrapped = prompt.next_cards.map(
                (card, index) => ({ card: card, index } as Wrapper)
            );
            setNextCards(wrapped);
        }
    }, [prompt]);

    useEffect(() => {
        console.log("prompt", prompt);
    }, [prompt]);

    const [answer, setAnswer] = useState("");

    const getChangedPos = (currentPos: number, newPos: number) => {
        console.log(currentPos, newPos);
        setNextCards(arrayMoveImmutable(nextcards, currentPos, newPos));
    };

    useEffect(() => {
        console.log(
            "next cards are ",
            nextcards.map((a) => a.card.name)
        );
    }, [nextcards]);

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
                    <div className="flex-row" id="drag">
                        <Draggable onPosChange={getChangedPos}>
                            {nextcards.map(({ card, index }) => (
                                <div key={index} className={`next-cards`}>
                                    <img
                                        src={getURL(
                                            "cards/",
                                            card.name,
                                            ".jpeg"
                                        )}
                                        alt=""
                                    />
                                </div>
                            ))}
                        </Draggable>
                    </div>
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