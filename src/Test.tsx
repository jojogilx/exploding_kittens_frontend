import VirtualList from "react-virtual-drag-list";
import { PromptComponent } from "./pages/Game/PromptComponent";
import { Card } from "./types";
import { getURL } from "./utils";
import { useEffect, useState } from "react";
import { Draggable } from "react-drag-reorder";
import { arrayMoveImmutable } from "array-move";

type Wrapper = { card: Card; id: number };

export const Test = () => {
    const [cards, setCards] = useState([
        { card: { name: "nope", description: "" } as Card, id: 0 } as Wrapper,
        {
            card: { name: "alter the future (3X)", description: "" } as Card,
            id: 1,
        } as Wrapper,
        { card: { name: "defuse", description: "" } as Card, id: 2 } as Wrapper,
    ]);

    const getChangedPos = (currentPos: number, newPos: number) => {
        console.log(currentPos, newPos);

        const newcards = arrayMoveImmutable(cards, currentPos, newPos);
        setCards(newcards);
    };

    useEffect(() => {
        console.log(cards.map((a) => a.card.name));
    }, [cards]);

    return (
        <div className="flex-row" id="drag">
            <Draggable onPosChange={getChangedPos}>
                {cards.map((card, index) => (
                    <div key={index} className={`next-cards`}>
                        <img
                            src={getURL("cards/", card.card.name, ".jpeg")}
                            alt=""
                        />
                    </div>
                ))}
            </Draggable>
        </div>
    );
};
