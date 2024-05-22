import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { RoomList } from "./pages/RoomList/RoomList";
import { Game } from "./pages/Game/Game";
import { Test } from "./Test";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/:roomName" element={<Game />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    );
}

export default App;

export const TryPing = () => {
    const url = "http://127.0.0.1:8080/ping";

    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };

    return fetch(url, requestOptions).then((response) => {
        if (!response.ok) {
            throw new Error("Failed to connect:" + response.statusText);
        }
        return response;
    });
};
