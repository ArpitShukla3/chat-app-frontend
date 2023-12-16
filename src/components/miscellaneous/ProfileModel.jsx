import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { Image } from "@chakra-ui/react"
function ProfileModel({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <div>
            {children ? <span onClick={onOpen}>{children}</span> : <ViewIcon onClick={onOpen} display={{ base: "flex" }} />}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size={"lg"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"40px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Image
                            borderRadius={"full"}
                            boxSize={"150px"}
                            src={user.pic}
                            alt={user.name}
                        />
                        {user.email}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}
export default ProfileModel;