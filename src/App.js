// Libraries
import React, { useState, useEffect } from "react";
import Noty from "noty";

// Components
import Search from "./components/search/search.js";
import SingleMatch from "./components/single-match/single-match.js";

// Assets
import loadingWheel from "./media/png/arrow.png";
import "./App.scss";
import "../node_modules/noty/lib/noty.css";  
import "../node_modules/noty/lib/themes/mint.css";  

function App() {
  const [matches, setMatches] = useState();
  const [spells, setSpells] = useState();
  const [champFromId, setChampFromId] = useState();
  const [loading, setLoading] = useState(false);
  const [genericPerks, setGenericPerks] = useState();
  const [parentPerks, setParentPerks] = useState();

  useEffect(() => {
    async function getChampsFromId() {
      let url = `http://jvaughn.org/postmortem/passthrough_ray.php`;
      let response = await fetch(url);
      let json = await response.json();

      setChampFromId(json);
    }

    async function getPerks() {
      let url = `http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json`;
      let response = await fetch(url);
      let json = await response.json();

      let obj = {};

      // Reformat the end url that they gave us as the json file we're using is out of date but still helpful
      for (let perk of json) {
        let fixedIconPath = perk.iconPath.split("/");
        for (let i = 0; i < 4; i++) fixedIconPath.shift();
        obj[perk.id] = fixedIconPath.join("/").toLowerCase();
      }

      setGenericPerks(obj);
    }

    async function getPerkRoots() {
      let url = `http://raw.communitydragon.org/9.19/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json`;
      let response = await fetch(url);
      let json = await response.json();

      let obj = {};
      for (let type of json.styles) {
        let path = type.iconPath.split("/").pop().toLowerCase();
        obj[type.id] = path;
      }
      setParentPerks(obj);
    }

    async function getSummonerSpells() {
      let url =
        "http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/summoner.json";
      let response = await fetch(url);
      let json = await response.json();
      let data = json.data;

      let obj = {};
      for (let spell in data) {
        obj[data[spell].key] = data[spell].id;
      }

      setSpells(obj);
    }

    getChampsFromId();
    getPerks();
    getPerkRoots();
    getSummonerSpells();

    new Noty({
      text: "Don't play League? Try searching for the name of the pro player 'Dyrus'!"
    }).show();
  }, []);

  async function getSummonerInfo(e, summoner, region) {
    e.preventDefault();
    setLoading(true);

    // TODO: Add regional support ------------------------
    const url = `http://jvaughn.org/postmortem/passthrough_core.php?summoner=${summoner}&dir=_lol_summoner_v4_summoners_by-name_`;
    let response = await fetch(url);
    console.log(response);
    let json = await response.json();

    if (response.status !== 200) {
      notify(`Error ${response.status}: ${response.message}`);
    }
    else {
      getSummonerMatchHistory(json.accountId);
    }
    
  }

  async function getSummonerMatchHistory(accountId) {
    const url = `http://jvaughn.org/postmortem/passthrough_core.php?account_id=${accountId}&dir=_lol_match_v4_matchlists_by-account_`;
    let response = await fetch(url);
    let json = await response.json();

    let generatedMatches = [];
    for (let i = 0; i < 2; i++) {
      generatedMatches.push(await getSingleMatch(json.matches[i], accountId));
    }

    let allGeneratedMatches = await Promise.all(generatedMatches);

    setMatches(allGeneratedMatches);
    setLoading(false);
  }

  async function getSingleMatch(match, accountId) {
    const url = `https://jvaughn.org/postmortem/passthrough_core.php?match_id=${match.gameId}&dir=_lol_match_v4_matches_`;
    let response = await fetch(url);
    let json = await response.json();
    let generatedMatch = await generateSingleMatch(json, match, accountId);
    return generatedMatch;
  }

  // Match generation from the info that we pulled -----------------------------
  function generateSingleMatch(matchData, generalData, accountId) {
    let participantList = {};
    for (let player of matchData.participantIdentities) {
      participantList[player.participantId] = player.player.summonerName;
    }

    let data = {};
    data["matchId"] = matchData.gameId;
    data["champion"] = generalData.champion;

    let playerInfo, playerId;

    // Get the participantId of the person who searched to get their data
    for (let participant of matchData.participantIdentities) {
      if (participant.player.accountId === accountId) {
        playerId = participant.participantId;
      }
    }

    // Update to pull from playerData
    for (let participant of matchData.participants) {
      if (participant.participantId === playerId) {
        playerInfo = participant;
      }
    }

    // Pull all of the stats neccesary from the game to populate our SingleMatch component
    let stats = playerInfo.stats;

    data["summonerSpells"] = {
      spell1: playerInfo.spell1Id,
      spell2: playerInfo.spell2Id,
    };

    data["runes"] = {
      keystone: stats["perk0"],
      secondary: stats["perkSubStyle"],
    };

    data["items"] = [
      stats["item0"],
      stats["item1"],
      stats["item2"],
      stats["item3"],
      stats["item4"],
      stats["item5"],
      stats["item6"],
    ];

    data["myStats"] = {
      kills: stats.kills,
      deaths: stats.deaths,
      assists: stats.assists,
      gold: stats.goldEarned,
      minions: stats.totalMinionsKilled,
      vision: stats.visionScore,
    };

    let team1 = [];
    let team2 = [];
    for (let i = 0; i < matchData.participants.length; i++) {
      let playerProfile = {
        name: participantList[matchData.participants[i].participantId],
        champion: matchData.participants[i].championId,
      };

      if (matchData.participants[i].teamId === 100) team1.push(playerProfile);
      else team2.push(playerProfile);
    }

    data["teams"] = {
      1: team1,
      2: team2,
    };

    data["win"] = playerInfo.stats.win;

    // return the SingleMatch component with the data collected
    return (
      <SingleMatch
        data={data}
        champFromId={champFromId}
        perks={genericPerks}
        parentPerks={parentPerks}
        spells={spells}
        key={`match_${matchData.gameId}`}
      ></SingleMatch>
    );
  }

  // Error handling
  function notify(_text, _timeout = 2500) {
    new Noty({
      text: _text,
      timeout: _timeout,
    }).show();
  }

  return (
    <div className="App" id="app">
      <div id="content-wrapper" className="std-border">
        <h1>POSTMORTEM</h1>
        <Search getSummonerInfo={getSummonerInfo} />
        {loading && (
          <div id="loading-bar">
            <p>Sit tight while we load your matches...</p>
            <img id="loading-wheel" src={loadingWheel} alt="Loading..."></img>
          </div>
        )}
        {matches && <div id="match-container">{matches}</div>}
      </div>
    </div>
  );
}

export default App;
