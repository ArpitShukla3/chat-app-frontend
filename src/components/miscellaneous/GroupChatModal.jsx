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
    useToast,
    FormControl,
    Input,
    Spinner,
    Box,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { createGroupChat, searchUser } from '../../../apiList';
import axios from 'axios';
import UserListItem from '../Avatar/UserListItem.jsx';
import UserBadgeItem from '../Avatar/UserBadgeItem.jsx';
function GroupChatModal({ children }) {
    const { user, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setloading] = useState(false);
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
                description: "Failed to load search results",
                status: 'error',
                duration: 1000,
                position: "bottom-left",
                isClosable: true,
            })
        }
    }
    const handleSubmit = async () => {
        if (!groupChatName) {
            toast({
                title: 'Group Name missing',
                description: "Add Group Chat Name",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        if (!(selectedUsers.length > 2)) {
            toast({
                title: 'Group member lacking',
                description: "Add atleast two group members ",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        //remove  user from frontend because in backend user will get added
        setSelectedUsers(selectedUsers.filter(element => element !== user));
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(createGroupChat, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);
            setChats([data, ...chats]);
            setSelectedUsers([user]);
            setGroupChatName("");
            toast({
                title: 'New Group Chat Created!',
                description: "Group Chat created successfully",
                status: 'success',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            onClose();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
        }
    }
    const handleAddUser = (userToAdd) => {
        if (!(selectedUsers.includes(user))) {
            setSelectedUsers([user, ...selectedUsers])
        }
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'Already added',
                description: "User already added",
                status: 'warning',
                duration: 1000,
                position: "bottom-left",
                isClosable: true,
            })
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleDelete = (userToDelete) => {
        if (userToDelete === user) {
            toast({
                title: 'Unauthorized action',
                description: "Admin can be deleted by another admin only",
                status: 'warning',
                duration: 1000,
                position: "top",
                isClosable: true,
            })
            return;
        }
        setSelectedUsers([...selectedUsers.slice(0, selectedUsers.indexOf(userToDelete)), ...selectedUsers.slice(selectedUsers.indexOf(userToDelete) + 1)]);

    }
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        height={"100%"}
                    >
                        <FormControl>
                            <Input
                                type='text'
                                placeholder={"Enter the group name"}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                value={groupChatName}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                type='text'
                                placeholder={"Add Users eg. Arpit, Astut, Ramesh"}
                                onChange={(e) => handleSearch(e.target.value)}
                                mb={1}
                            />
                        </FormControl>
                        <Box
                            display={"flex"}
                        >
                            {selectedUsers?.map(t =>
                                <UserBadgeItem key={t._id} user={t} handleFunction={() => handleDelete(t)} />
                            )}
                        </Box>
                        {!loading ? (
                            searchResult?.slice(0, 4).map((resultUser) => (
                                <UserListItem key={resultUser._id} user={resultUser} admin={user} handelFunction={() => { handleAddUser(resultUser) }} />
                            ))
                        ) : (
                            <Spinner emptyColor='gray.200' color='blue'>Loading</Spinner>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

}
export default GroupChatModal;