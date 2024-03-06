import {Container, Row, Col} from 'react-bootstrap'
import './App.css';
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import WaitingRoom from './components/waitingroom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter } from "react-router-dom";
import Room from './components/room';
import {Route, Routes} from "react-router-dom"
import Home from './components/home';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/room/:id" element={<Room></Room>}></Route>
    </Routes>
  );
}

export default App;
