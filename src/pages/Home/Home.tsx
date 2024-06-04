import cat from "../../assets/images/catlighter.png";
import scalaIcon from "../../assets/images/scalaIcoWhite.png";
import reactIcon from "../../assets/images/reactico.svg";
import { useNavigate } from "react-router-dom";
import { TryPing } from "../../App";
import { ButtonWithSound } from "../../components/ButtonWithSound";
import "./Home.css";
export const Home = () => {
    const navigate = useNavigate();

    const handlePrompt = () => {
        TryPing()
            .then(() => {
                const userInput = window.prompt("Please enter your name:");

                if (userInput !== null) {
                    localStorage.setItem("userId", userInput.trim());
                    navigate("/rooms/");
                }
            })
            .catch((error) => window.alert(error));
    };

    return (
        <div className="content">
            <div id="Logo">
                <h1 id="main-title">
                    <span className="exploding-text bold">EXPLODING </span>
                    <span className="white-text bold">KITTENS</span>
                </h1>
                <div id="edition">
                    Scala
                    <img
                        src={scalaIcon}
                        className="fwIcons"
                        alt=""
                        draggable="false"
                    />
                    + React
                    <img
                        src={reactIcon}
                        className="fwIcons"
                        alt=""
                        draggable="false"
                    />
                    Edition
                </div>
            </div>
            <ButtonWithSound
                className="start-button button"
                onClick={() => handlePrompt()}
                name="START"
                soundName="tacClick.mp3"
            />

            <img src={cat} id="cat-lighter" alt="" draggable="false" />
        </div>
    );
};
