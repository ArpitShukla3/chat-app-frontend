import { FormControl, FormLabel, VStack,Input, InputGroup, InputRightElement,Button } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { loginApi } from "../../../apiList";
import { useNavigate } from "react-router-dom";
function Login(){
    const [show,setShow] = useState(false);
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [loading,setloading] = useState(false);
    const toast = useToast();
    const navigateTo = useNavigate();
    const handleClick = ()=>{
            setShow(!show )
    }
    const submitHandler= async()=>{
         setloading(true);
        if(!email|| !password)
        {
          toast({
          title: 'All fields are compulsory',
          description: "Enter all details",
          status: 'warning',
          duration: 9000,
          isClosable: true,
        })
        setloading(false);
        return;
        }
         try {
                 const config={
                 headers:{
                        'Content-type':"application/json"
                         },
            };
          const {data} = await axios.post(loginApi,{email,password},config);
          toast({
          title: 'Done',
          description: "Logged in..",
          status: 'success',
          duration: 9000,
          isClosable: true,
              }) 
           localStorage.setItem("userInfo",JSON.stringify(data));
           setloading(false);
           navigateTo("/chats");
            } catch (error) {
                toast({
                 title: 'error',
                 description: error.response.data.message,
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
               }) 
               setloading(false);
            }
    }
    return(<VStack>
        <FormControl>
            <FormLabel>Email</FormLabel>
            <Input placeholder="Enter email" 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input  type={show? "password":"text"} placeholder="Enter password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement>
             <Button 
             h={"1.75rem"} 
             size={"sm" } 
             onClick={handleClick}>
            {show? "show":"hide"}
            </Button>
            </InputRightElement>
              </InputGroup>
        </FormControl>
        <Button
        colorScheme="blue"
        width={"100%"}
        style={{marginTop: 15}}
        onClick={submitHandler}
        isLoading={loading}
        >
            Login
        </Button>
        <Button
        colorScheme="red"
        width={"100%"}
        style={{marginTop: 15}}
        onClick={(e)=>{setEmail("guest@example.com"); setPassword("123456");}}
        >
            Get guest user credentials
        </Button>
    </VStack>)
}
export default Login;