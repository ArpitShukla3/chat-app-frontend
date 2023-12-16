import { Route, Routes } from "react-router-dom";
import ChatPage from "../Pages/ChatPage.jsx";
import HomePage from "../Pages/HomePage.jsx";
function CustomRoutes() {
    return (
        <>
            <Routes>
                <Route path="/chats" element={<ChatPage />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </>)
}
export default CustomRoutes;    