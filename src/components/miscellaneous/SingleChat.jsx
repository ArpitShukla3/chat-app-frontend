import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../Config/ChatLogic";
import UpdateGroupModel from "./UpdateGroupModel";
import ProfileModel from "./ProfileModel";

function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat } = ChatState();
    return (
        <>
            {
                selectedChat ? (<Box
                    width={"100%"}
                    height={"100%"}
                >
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        width={"100%"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat()}

                        />
                        {!(selectedChat.isGroupChat) ?
                            (<>{getSender(user, selectedChat.users).toUpperCase()}
                                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
                            </>) :
                            (<>{selectedChat.chatName.toUpperCase()}
                                <UpdateGroupModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} name={selectedChat.chatName.toUpperCase()} />
                            </>)}
                    </Text>
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        p={3}
                        bg={"#E8E8E8"}
                        width={"100%"}
                        height={"100%"}
                        borderRadius={"lg"}
                        overflowY={"hidden"}
                    >
                    </Box>
                </Box >) : (
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"100%"}>
                        <Text
                            fontSize={"3xl"}
                            pb={3}
                            fontFamily={"Work sans"}
                        >
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}
export default SingleChat;