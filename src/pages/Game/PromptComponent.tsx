import { useCallback, useEffect, useState } from "react";
import { Card, PromptType, Wrapper } from "../../types";
import { getURL } from "../../utils";
import { Draggable } from "react-drag-reorder";
import { arrayMoveImmutable } from "array-move";

type Props = {
    prompt: PromptType | null;
    submitPrompt: (s: string) => void;
};

export function PromptComponent({ prompt, submitPrompt }: Props) {
    const cards = [
        {
            card: { name: "nope", description: "" } as Card,
            index: 0,
        } as Wrapper,
        {
            card: { name: "alter the future (3X)", description: "" } as Card,
            index: 1,
        } as Wrapper,
        {
            card: { name: "defuse", description: "" } as Card,
            index: 2,
        } as Wrapper,
    ];

    const [nextcards, setNextCards] = useState([] as Wrapper[]);

    useEffect(() => {
        setNextCards(cards);
        if (prompt?.event === "alter_the_future") {
            console.log("here lol");
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
        const newcards = arrayMoveImmutable(nextcards, currentPos, newPos);
        setNextCards(newcards);
        const positions = nextcards
            .map(({ index }) => index.toString())
            .join("");
        setAnswer(positions);
    };

    const DraggableRender = useCallback(() => {
        return (
            <>
                <div className="flex-row" id="drag">
                    <Draggable onPosChange={getChangedPos}>
                        {nextcards.map(({ card }) => (
                            <div key={card.name} className={`next-cards`}>
                                <img
                                    src={getURL(
                                        "cards/",
                                        card.name,
                                        ".svg",
                                        ".jpeg"
                                    )}
                                    alt=""
                                />
                            </div>
                        ))}
                    </Draggable>
                </div>
                <button
                    onClick={() => submitPrompt(answer)}
                    className="flame-button"
                >
                    Submit
                </button>
            </>
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
                return <></>;
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
            case "choose_card":
                return (
                    <ul className="flex-row wrap">
                        {prompt.cards.map((card, index) => (
                            <li
                                key={index}
                                className={`next-cards`}
                                onClick={() => submitPrompt(index.toString())}
                            >
                                <img
                                    src={getURL(
                                        "cards/",
                                        card.name,
                                        ".svg",
                                        ".jpeg"
                                    )}
                                    alt=""
                                />
                            </li>
                        ))}
                    </ul>
                );
            case "garbage_collection":
                return (
                    <ul className="flex-row wrap">
                        {prompt.cards.map((card, index) => (
                            <li
                                key={index}
                                className={`next-cards`}
                                onClick={() => submitPrompt(index.toString())}
                            >
                                <img
                                    src={getURL(
                                        "cards/",
                                        card.name,
                                        ".svg",
                                        ".jpeg"
                                    )}
                                    alt=""
                                />
                            </li>
                        ))}
                    </ul>
                );
            case "alter_the_future":
                return <DraggableRender />;
            case "see_the_future":
                return (
                    <ul className="flex-row">
                        {prompt.cards.map((card, index) => (
                            <li key={index} className={`next-cards`}>
                                <img
                                    src={getURL(
                                        "cards/",
                                        card.name,
                                        ".svg",
                                        ".jpeg"
                                    )}
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
            <div className="prompt popup">
                <h3>{prompt?.event.split("_").join(" ").toUpperCase()}</h3>
                <p>{getPromptDescription()}</p>
                {getBody()}
            </div>
        )
    );
}
