import React, { useEffect } from 'react';
import logo from './logo.svg';
import PeerConnection from './pages/GameRoom';
import './App.css';
import CreateRoom from './pages/CreateRoom';
import { Route } from "wouter";
import GetUserName from './pages/GetUserName';
import Snackbar from "./components/Snackbar"
import Layout from './components/Layout';

function App() {
  return <>
        <Layout>
          <Route path='/' >
            <CreateRoom />
          </Route>
          <Route path='/room/:id'>
            <GetUserName />
          </Route>
        </Layout>
  </>
}


export default App;
