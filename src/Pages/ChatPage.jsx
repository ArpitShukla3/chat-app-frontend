import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer.jsx";
import MyChats from "../components/miscellaneous/MyChats.jsx";
import ChatBox from "../components/miscellaneous/ChatBox.jsx";
import { useState } from "react";

function ChatPage() {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false)
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display={"flex"} justifyContent={"space-between"} w={"100%"} height={"90vh"}>
                {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}
export default ChatPage;
