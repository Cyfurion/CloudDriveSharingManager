import './App.css';
import React from 'react';
import { useEffect } from 'react';
import LoginButton from "./components/login";
import { gapi } from 'gapi-script';

const clientId = "51282406360-evee6rmf1ttv4ni30be7l0dhme9p61ou.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    function start(){
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  });
  return(
    <LoginButton/>
  )
}

export default App;
