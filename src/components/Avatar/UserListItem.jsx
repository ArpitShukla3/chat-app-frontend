import { Avatar, Box, Text } from "@chakra-ui/react";

function UserListItem({ user, handelFunction }) {
    return (
        <Box
            onClick={handelFunction}
            cursor={"pointer"}
            bg={"#E8E8E8E"}
            _hover={{
                background: "green",
                color: "white",
            }}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            color={"black"}
            px={3}
            py={2}
            mb={2}
            borderRadius={"lg"}
        >
            <Avatar
                mr={2}
                size={"sm"}
                cursor={"pointer"}
                src={user.pic}
                alt={user.name}
            />
            <Box>
                <Text>
                    {user.name}
                </Text>
                <Text
                    fontSize={"xs"}
                >
                    <b>Email: </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    )
}
export default UserListItem;