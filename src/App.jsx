import { useState } from 'react'
import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react';
import CustomRoutes from './Routes/CustomRoutes';
import ChatPage from './Pages/ChatPage';
function App() {
  return (
    <div className='app'>
      <CustomRoutes/>
    </div>
  )
}

export default App
