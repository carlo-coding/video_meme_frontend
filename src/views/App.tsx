import React, { useEffect } from 'react';
import logo from './logo.svg';
import PeerConnection from './pages/GameRoom';
import './App.css';
import CreateRoom from './pages/CreateRoom';
import { Route } from "wouter";
import Game from './pages/Game';
import Modal from "./components/Modal"

function App() {
  return (
    <div className="App">
        <Modal />
        <Route path='/' >
          <CreateRoom />
        </Route>
        <Route path='/room/:id'>
          <Game />
        </Route>
    </div>
  );
}


export default App;
