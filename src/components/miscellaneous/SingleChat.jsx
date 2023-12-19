import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../Config/ChatLogic";
import UpdateGroupModel from "./UpdateGroupModel";
import ProfileModel from "./ProfileModel";
import { useEffect, useState } from "react";
import axios from "axios";
import { END_POINT, fetchAllChats, sendMessageAPI } from "../../../apiList";
import './style.css'
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
import { faL } from "@fortawesome/free-solid-svg-icons";
import animationData from "../../animations/animationData.json"
import Lottie from 'react-lottie';
var socket, selectedChatCompare;
function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
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
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: 'Error',
                description: "Failed to load messages ",
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
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
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
                socket.emit("new message", data)
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
                return;
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // typing indicator logic 
        if (!socketConnected) {
            return;
        }
        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        var lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff > timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength)
    }
    useEffect(() => {
        socket = io(END_POINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])
    useEffect(() => {
        fetchAllMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])
    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    })


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
                        <div>   {isTyping ?
                            <Lottie options={defaultOptions} height={90} width={90} />
                            : <></>}
                        </div>
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