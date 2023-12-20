import { Box, Container, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup.jsx";
import { useEffect } from "react";
function HomePage() {
    const navigateTo = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
            navigateTo("/chats")
        }
    }, [navigateTo])
    return (
        <>
            <Container maxW="xl" align='center'>
                <Box
                    d="flex"
                    justifyContent="center"
                    p={3}
                    bg={"white"}
                    w="100%"
                    m="40px 0 15px 0"
                    borderRadius="lg"
                    borderWidth="lpx"
                    alignContent="center"
                >
                    <Text fontSize="4xl" fontFamily="work sans" color="black">
                        Talk-a-tive
                    </Text>
                </Box>
                <Box bg={"white"} borderRadius={"1rem"} p={"1rem"}>
                    <Tabs variant="soft-rounded" colorScheme="green" color="black" mb="1em">
                        <TabList>
                            <Tab width="50%"> Login</Tab>
                            <Tab width="50%" >Signup</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Login />
                            </TabPanel>
                            <TabPanel>
                                <Signup />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>

        </>
    )
}
export default HomePage;