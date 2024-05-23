import { OverlayType } from "../../types";
import { getURL } from "../../utils";
import grave from "../../assets/images/grave.png";
import win from "../../assets/images/winner.png";

type Props = {
    overlay: OverlayType | null;
};

export function OverlayComponent({ overlay }: Props) {
    const user = localStorage.getItem("userId");

    function getBody() {
        switch (overlay?.event) {
            case "draw_card":
                return (
                    <>
                        <h3>DRAWN CARD</h3>
                        <img
                            src={getURL(
                                "cards/",
                                overlay.card.name,
                                ".svg",
                                ".jpeg"
                            )}
                            alt=""
                            className="card-drawn"
                            draggable="false"
                        />
                    </>
                );

            case "died":
                return overlay.player === user ? (
                    <>
                        <h1>YOU DIED</h1>
                        <img
                            src={grave}
                            alt=""
                            className="card-drawn"
                            draggable="false"
                        />
                    </>
                ) : (
                    <>
                        <h3>{overlay.player.toUpperCase()} DIED</h3>
                        <img
                            src={grave}
                            alt=""
                            className="card-drawn"
                            draggable="false"
                        />
                    </>
                );
            case "winner":
                return overlay.player === user ? (
                    <>
                        <h1>YOU WON!</h1>
                        <img
                            src={win}
                            alt=""
                            id="winner-pic"
                            draggable="false"
                        />
                    </>
                ) : (
                    <>
                        <h3>{overlay.player.toUpperCase()} WON</h3>
                        <img
                            src={win}
                            alt=""
                            id="winner-pic"
                            draggable="false"
                        />
                    </>
                );

            default:
                return <></>;
        }
    }

    return (
        overlay && (
            <div className="shadow overlay middle" id="drawn-card-shadow">
                {getBody()}
            </div>
        )
    );
}
