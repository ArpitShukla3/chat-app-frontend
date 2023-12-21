import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from '@chakra-ui/react';
import axios from "axios";
import { pushChats, registrationApi } from "../../../apiList";
import { useNavigate } from "react-router-dom"
function Signup() {
  const [show, setShow] = useState(false);
  const [showCnfPassword, setShowCnfPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setloading] = useState(false);
  const navigateTo = useNavigate();
  const toast = useToast();
  const handleClick = () => {
    setShow(!show)
  }
  const handleClickShowCnf = () => {
    setShowCnfPassword(!showCnfPassword)
  }
  const postDetails = async (pics) => {
    setloading(true);
    if (pics === undefined) {
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    const data = new FormData()
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dksi17o87");
    }
    else {
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'error',
        position: "top",
        duration: 9000,
        isClosable: true,
      })
      setloading(false);
    }

    var FETCH_URL = "https://api.cloudinary.com/v1_1/" + "dksi17o87" + "/" + "/upload";
    await axios.post(FETCH_URL, data).then(res => {
      const val = res.data["secure_url"]
      setPic(val);
      setloading(false);
      console.log(val);
    }).catch((err) => {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 1000,
        isClosable: true,
      })
      setloading(false);
    })
  }
  const submitHandler = async () => {
    setloading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'All fields are compulsory',
        description: "Enter all details",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      setloading(false)
      return;
    }
    if (password != confirmPassword) {
      toast({
        title: 'Correct password',
        description: "Cofirm Password and Password are not same",
        status: 'warning',
        duration: 9000,
        isClosable: true,
      })
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': "application/json"
        },
      };
      // console.log("reaching here")
      const { data } = await axios.post(registrationApi, { name, email, password, pic }, config);
      toast({
        title: 'Done',
        description: "Account Created successfully",
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      // localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigateTo("/");

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
  return (<VStack>
    <FormControl>
      <FormLabel>Name</FormLabel>
      <Input placeholder="Enter you Name"
        onChange={(e) => setName(e.target.value)}
      />
    </FormControl>
    <FormControl>
      <FormLabel>Email</FormLabel>
      <Input placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>
    <FormControl>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input type={show ? "password" : "text"} placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement>
          <Button
            h={"1.75rem"}
            size={"sm"}
            onClick={handleClick}>
            {show ? "show" : "hide"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl>
      <FormLabel>Confirm-Password</FormLabel>
      <InputGroup>
        <Input type={showCnfPassword ? "password" : "text"} placeholder="Re-enter password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <InputRightElement>
          <Button
            h={"1.75rem"}
            size={"sm"}
            onClick={handleClickShowCnf}>
            {showCnfPassword ? "show" : "hide"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>
    <FormControl id="pic">
      <Input type="file"
        p="1.5"
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
      />
    </FormControl>
    <Button
      colorScheme="blue"
      width={"100%"}
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
    >
      Signup
    </Button>
  </VStack>)
}
export default Signup;