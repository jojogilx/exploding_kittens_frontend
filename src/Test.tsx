import VirtualList from "react-virtual-drag-list";
import { PromptComponent } from "./pages/Game/PromptComponent";
import { Card, Wrapper } from "./types";
import { getURL } from "./utils";
import { useEffect, useState } from "react";
import "./Test.css";
export const Test = () => {
    const handJson =
        '[{"name":"Reverse","description":"Reverse the order of play and end your turn without drawing a card"},{"name":"Skip","description":"End turn without drawing a card"},{"name":"Nope","description":"Stop the action of another player. You can play this at any time"},{"name":"Shuffle","description":"Shuffle the draw pile"},{"name":"Nope","description":"Stop the action of another player. You can play this at any time"},{"name":"Skip","description":"End turn without drawing a card"},{"name":"Alter The Future (3X)","description":"Privately view and rearrange the top three cards of the draw pile"},{"name":"Defuse","description":"Instead of exploding, put your last drawn card back into the deck"}]';

    const [cards, setCards] = useState([] as Wrapper[][]);

    useEffect(() => {
        const hand = JSON.parse(handJson) as Card[];

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
    }, []);

    return (
        <div id="hand-container2">
            {cards.map((w) => (
                <div className="flex-column hand-column">
                    {w.map(({ card, index }) => {
                        return (
                            <div className="card">
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
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
