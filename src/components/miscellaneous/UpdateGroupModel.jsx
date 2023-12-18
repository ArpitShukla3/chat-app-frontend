import { EditIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    IconButton,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import UserBadgeItem from "../Avatar/UserBadgeItem";
import UserListItem from "../Avatar/UserListItem";
import { addUsersInGroup, removeGroupUser, searchUser, updateGroupName } from "../../../apiList";
import axios from "axios";
function UpdateGroupModel({ fetchAgain, setFetchAgain, name, fetchAllMessages }) {
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setloading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const handleSearch = async (query) => {
        if (!query) {
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
            const something = await axios.get(`${searchUser}/?search=${query}`, config);
            const { results } = something.data;
            setSearchResult(results);
            setloading(false);
        } catch (error) {
            toast({
                title: 'Error occurred',
                description: error.message,
                status: 'error',
                duration: 1000,
                position: "bottom-left",
                isClosable: true,
            })
        }
    }
    async function removeUser(userToRemove) {
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: 'Warning',
                description: "Only Admins can remove the user",
                status: 'warning',
                duration: 1000,
                position: "top-left",
                isClosable: true,
            })
        }
        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(removeGroupUser, {
                chatId: selectedChat._id,
                userId: userToRemove._id
            }, config);
            (userToRemove._id === user) ? setSelectedChat() : setSelectedChat(data);
            fetchAllMessages();
            setFetchAgain(!fetchAgain);
            setloading(false)
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
        return;
    }
    async function handleRename() {
        if (!groupChatName) {
            toast({
                title: 'Error',
                description: "group name cannot be empty",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        setRenameLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(updateGroupName, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 1000,
                position: "top-left",
                isClosable: true,
            })
            setRenameLoading(false);
            return;
        }
    }
    async function handleAddUser(userToAdd) {
        if (!userToAdd) {
            toast({
                title: 'Error',
                description: "group name cannot be empty",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: 'Warning',
                description: "User alreday exists",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Warning',
                description: "Only admins can add",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put(addUsersInGroup, {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
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
    return (<>
        <IconButton icon={<EditIcon />} onClick={onOpen} display={{ base: "flex" }}>Open Modal</IconButton>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                        {selectedChat.users.map(t => <UserBadgeItem user={t} key={t._id} handleFunction={() => removeUser(t)} admin={user} />)}
                    </Box>
                    <FormControl display={"flex"}>
                        <Input
                            placeholder="Chat Name"
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant={"solid"}
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            type='text'
                            placeholder={"Add Users to group"}
                            onChange={(e) => handleSearch(e.target.value)}
                            mb={1}
                        />

                        {/* {render the search results } */}
                        {!loading ? (
                            searchResult?.slice(0, 4).map((resultUser) => (
                                <UserListItem key={resultUser._id} user={resultUser} admin={user} handelFunction={() => { handleAddUser(resultUser) }} />
                            ))
                        ) : (
                            <Spinner emptyColor='gray.200' color='blue'>Loading</Spinner>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={() => { removeUser(user); onClose(); }}>
                        Leave Group
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </>)
}
export default UpdateGroupModel;