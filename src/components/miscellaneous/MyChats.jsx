import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Button, Stack, useToast, Text, VStack } from '@chakra-ui/react';
import { fetchChats } from '../../../apiList';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import getSender from "../../Config/ChatLogic.js"
import GroupChatModal from './GroupChatModal.jsx';
const MyChats = () => {
  let stockSelectedChatId = "";
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, setUser, notification, setNotification, chats, setChats, } = ChatState();
  async function loadChats() {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
    const { data } = await axios.get(fetchChats, config);
    setChats(data);
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    loadChats();
  }, [])
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"F8F8F8"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {
          chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) =>
                <Box
                  onClick={() => { setSelectedChat(chat) }}
                  cursor={"pointer"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                  color={selectedChat === chat ? "white" : "black"}
                  bg={selectedChat === chat ? "#38B2AC" : "E8E8E8"}
                >
                  {chat.isGroupChat ?
                    <Text>{chat.chatName}</Text>
                    : <Text>{getSender(loggedUser, chat.users)}</Text>
                  }
                </Box>)}
            </Stack>
          )
            : <ChatLoading />
        }
      </Box>
    </Box>
  )
}

export default MyChats