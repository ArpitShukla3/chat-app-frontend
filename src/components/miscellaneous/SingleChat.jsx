import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../Config/ChatLogic";
import UpdateGroupModel from "./UpdateGroupModel";
import ProfileModel from "./ProfileModel";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAllChats, sendMessageAPI } from "../../../apiList";
import './style.css'
import ScrollableChat from "./ScrollableChat";
function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const toast = useToast();
    const fetchAllMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${fetchAllChats}/${selectedChat._id}`, config);
            setLoading(false)
            setMessages(data.messages);
        } catch (error) {
            toast({
                title: 'Error',
                description: "Failed to load messages",
                status: 'error',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            setLoading(false)
            return;
        }
    }
    const sendMessage = async (event) => {
        if (event.key !== "Enter") {
            return;
        }
        if (!newMessage) {
            toast({
                title: 'Warning',
                description: "Empty messages cannot be sent",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: false,
            })
        }
        try {
            // setLoading(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }

            setNewMessage("");
            const { data } = await axios.post(sendMessageAPI, {
                content: newMessage,
                chatId: selectedChat._id
            }, config);
            // setLoading(false)
            setMessages([...messages, data])

        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 1000,
                position: "top-left",
                isClosable: true,
            })
            setLoading(false)
            return;
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // typing indicator logic 
    }
    useEffect(() => { fetchAllMessages(); }, [selectedChat])
    return (
        <>
            {
                selectedChat ? (<>
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
                                <UpdateGroupModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} name={selectedChat.chatName.toUpperCase()} fetchAllMessages={fetchAllMessages} />
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
                        {loading ? <><Spinner size={"xl"} h={20} w={20} alignSelf={"center"} margin={"auto"} /></> :
                            <div
                                className="messages"
                            >
                                <ScrollableChat messages={messages} />
                            </div>}
                    </Box>
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        <Input
                            variant={"filled"}
                            bg={"#E0E0E0"}
                            placeholder="Enter a message ..."
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </ >) : (
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