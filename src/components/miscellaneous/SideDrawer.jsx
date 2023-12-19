import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, MenuIcon, MenuItem, MenuDivider, useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { faBell, faChevronDown, faL, faMagnifyingGlass, faSortAmountAsc } from '@fortawesome/free-solid-svg-icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Input } from '@chakra-ui/react'
import axios from 'axios';
import { createChat, searchUser } from '../../../apiList';
import ChatLoading from './ChatLoading';
import UserListItem from '../Avatar/UserListItem';
import { getSender } from '../../Config/ChatLogic';
const SideDrawer = () => {
    const { selectedChat, setSelectedChat, chats, setChats, notification, setNotification, } = ChatState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [loading, setloading] = useState(false);
    const [loadingChat, setLaodingChat] = useState();
    const { user } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigateTo = useNavigate();
    const toast = useToast();
    const logOutHandler = () => {
        localStorage.removeItem("userInfo");
        navigateTo("/");
    }
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Empty Search',
                description: "Enter email or username to search",
                status: 'warning',
                duration: 1000,
                position: "top-left",
                isClosable: true,
            })
            return;
        }

        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const something = await axios.get(`${searchUser}/?search=${search}`, config);
            const { results } = something.data;
            setloading(false);
            setSearchResult(results);
        } catch (error) {
            toast({
                title: 'Error occurred',
                description: "Failed to load search results",
                status: 'error',
                duration: 1000,
                position: "bottom-left",
                isClosable: true,
            })
        }
    }
    const accessChat = async (userId) => {
        setLaodingChat(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(createChat, { userId }, config);
            setSelectedChat(data);
            setLaodingChat(false);
            if (!chats.find(c => c._id === data._id)) {
                setChats([data, ...chats]);
            }

            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: "Failed to create Chat",
                status: 'error',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
        }
    }
    return (
        <div>
            <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                width={"100%"}
                padding={"5px 10px 5px 10px"}
                borderWidth={"5px"}
            >
                <Tooltip hasArrow label="Search Users" placement='bottom-end'>
                    <Button onClick={onOpen}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <Text display={{ base: "none", md: "flex" }} px={4}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize={"2xl"} fontFamily={"Work sans"}>
                    chat App
                </Text>
                <div>
                    {!(notification.length == 0) &&
                        <Menu>
                            <MenuButton padding={"1"}>

                                <FontAwesomeIcon icon={faBell} style={{ color: "#1a1c1e", }} fontSize="2xl" />

                            </MenuButton>
                            <MenuList pl={2}>
                                {notification.map((notif) => (
                                    <MenuItem key={notif._id} height={"20px"}
                                        onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(notification.filter((n) => n !== notif))
                                        }}
                                    >
                                        {notif.chat.isGroupChat ? `message form ${notif.chat.chatName}` : `message from ${getSender(user, notif.chat.users)}`}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    }
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModel user={user}>
                                <MenuItem>Profile</MenuItem>
                            </ProfileModel>
                            <MenuDivider />
                            <MenuItem onClick={logOutHandler}>LogOut</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box >
            <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? <ChatLoading /> :
                            <>
                                {searchResult?.map((resultItem) =>
                                    <UserListItem
                                        key={resultItem._id}
                                        user={resultItem}
                                        handelFunction={() => accessChat(resultItem._id)}
                                    ></UserListItem>)}
                            </>
                        }
                        {
                            loadingChat && <Spinner ml={"auto"} display={"flex"} />
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div >
    )
}

export default SideDrawer