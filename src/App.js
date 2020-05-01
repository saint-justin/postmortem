import React, { useState, useEffect } from "react";
// import TestForm from './components/test-form/test-form.js'
import Search from "./components/search/search.js";
import SingleMatch from "./components/single-match/single-match.js";
import Map from "./components/map/map.js";

import logo from "./logo.svg";
import "./App.scss";

function App() {
  const [summonerData, setSummonerData] = useState({});
  // const [summonerHistory, setSummonerHistory] = useState({});
  const [matches, setMatches] = useState([]);
  const [champFromId, setChampFromId] = useState();
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
        let fixedIconPath = perk.iconPath.split('/');
        for (let i = 0; i < 4; i++)
         fixedIconPath.shift();
        obj[perk.id] = fixedIconPath.join('/').toLowerCase();
      }

      setGenericPerks(obj);
    }

    async function getPerkRoots() {
      let url = `http://raw.communitydragon.org/9.19/plugins/rcp-be-lol-game-data/global/default/v1/perkstyles.json`;
      let response = await fetch(url);
      let json = await response.json();

      let obj = {};
      for (let type of json.styles) {
        let path = type.iconPath.split('/').pop().toLowerCase();
        obj[type.id] = path;
      }
      setParentPerks(obj);
    }

    getChampsFromId();
    getPerks();
    getPerkRoots();
  }, []);

  async function getSummonerInfo(e, summoner, region) {
    e.preventDefault();


    // TODO: Add regional support ------------------------
    const url = `http://jvaughn.org/postmortem/passthrough_core.php?summoner=${summoner}&dir=_lol_summoner_v4_summoners_by-name_`;
    let response = await fetch(url);
    let json = await response.json();

    setSummonerData(json);

    getSummonerMatchHistory(json.accountId);
  }

  async function getSummonerMatchHistory(accountId) {
    const url = `http://jvaughn.org/postmortem/passthrough_core.php?account_id=${accountId}&dir=_lol_match_v4_matchlists_by-account_`;
    let response = await fetch(url);
    let json = await response.json();
 
    let generatedMatches = [];
    for (let i = 0; i < 10; i++){
      matches.push(await getSingleMatch(json.matches[i]));
    }
    console.log('Match Array: ');
    console.log(matches);
    setMatches(generatedMatches);
  }

  async function getSingleMatch(match) {
    const url = `https://jvaughn.org/postmortem/passthrough_core.php?match_id=${match.gameId}&dir=_lol_match_v4_matches_`;

    let response = await fetch(url);
    let json = await response.json();

    let generatedMatch = await generateSingleMatch(json, match);
    // console.log('MATCHES ------------------');
    // console.log(matches);
    // console.log('GENERATED MATCH ----------');
    // console.log(generatedMatch);
    // let matchList = [...matches, generatedMatch];
    // matchList.push(generatedMatch);
    // console.log(matchList);
    // let matchList = JSON.parse(JSON.stringify(matches));
    // matchList.push(generatedMatch);
    // setMatches([...matches, generatedMatch]);
    // let newMatchCopy = matches;
    // newMatchCopy.push(generatedMatch);
    // setMatches(matches);
    // console.log(matches);
    return generatedMatch;
  }

  // Match generation from the info that we pulled -----------------------------
  function generateSingleMatch(matchData, generalData) {
    let participantList = {};
    for (let player of matchData.participantIdentities) {
      participantList[player.participantId] = player.player.summonerName;
    }

    let data = {};
    data["matchId"] = matchData.gameId;
    data["champion"] = generalData.champion;

    let playerInfo;
    for (let i = 0; i < matchData.participants.length; i++) {
      if (matchData.participants[i].championId === generalData.champion)
        playerInfo = matchData.participants[i];
    }
    let stats = playerInfo.stats;

    data["summonerSpells"] = {
      upper: playerInfo.spell1Id,
      lower: playerInfo.spell2Id,
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

    return (
      <SingleMatch
        data={data}
        champFromId={champFromId}
        perks={genericPerks}
        parentPerks={parentPerks}
        key={`match_${matchData.gameId}`}
      ></SingleMatch>
    );
  }

  function displayMatches(matchArr) {
    console.log('beep')
    return <>{matchArr}</>;
  }

  return (
    <div className="App" id="app">
      {/* <TestForm /> */}
      <div id="content-wrapper" className="std-border">
        <h1>POSTMORTEM</h1>
        <Search getSummonerInfo={getSummonerInfo} />
        {/* <SingleMatch /> */}
        {<>{matches}</>}
        {/* {displayMatches(matches)} */}
      </div>
      {/* <Map /> */}
    </div>
  );
}

export default App;
