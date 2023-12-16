import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer.jsx";
import MyChats from "../components/miscellaneous/MyChats.jsx";
import ChatBox from "../components/miscellaneous/ChatBox.jsx";

function ChatPage() {
    const { user } = ChatState();
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box display={"flex"} justifyContent={"space-between"} w={"100%"} height={"91vh"}>
                {user && <MyChats />}
                {user && <ChatBox />}
            </Box>
        </div>
    )
}
export default ChatPage;
