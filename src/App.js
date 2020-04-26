import React, { useState } from "react";
// import TestForm from './components/test-form/test-form.js'
import Search from "./components/search/search.js";
import SingleMatch from "./components/single-match/single-match.js";

import logo from "./logo.svg";
import "./App.scss";

function App() {
  const [summonerData, setSummonerData] = useState({});

  async function getSummonerInfo(e, summoner, region) {
    e.preventDefault();

    // TODO: Add regional support ------------------------
    const URL = `http://jvaughn.org/postmortem/passthrough_core.php?summoner=${summoner}&dir=lol_summoner_v4_summoners_by-name_`;
    let response = await fetch(URL);
    let json = await response.json();

    setSummonerData(json);
  }

  return (
    <div className="App" id="app">
      {/* <TestForm /> */}
      <div id="content-wrapper" className="std-border">
        <h1>POSTMORTEM</h1>
        <Search getSummonerInfo={getSummonerInfo} />
        <SingleMatch />
      </div>
    </div>
  );
}

export default App;
