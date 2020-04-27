import React, { useState, useEffect } from "react";
// import TestForm from './components/test-form/test-form.js'
import Search from "./components/search/search.js";
import SingleMatch from "./components/single-match/single-match.js";
import Map from "./components/map/map.js";

import logo from "./logo.svg";
import "./App.scss";

function App() {
  const [summonerData, setSummonerData] = useState({});
  const [summonerHistory, setSummonerHistory] = useState({});
  const [matches, setMatches] = useState([])
  const [champFromId, setChampFromId] = useState();
  const [perks, setPerks] = useState();
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

      for (let perk of json) {
        // console.log(perk.id);
        obj[perk.id] = perk.name.replace(/ /g, "");
      }

      console.log("STD PERKS -------------------------")
      console.log(obj);
      setPerks(json);
    }

    async function getPerkRoots() {
      let url = `http://ddragon.leagueoflegends.com/cdn/10.8.1/data/en_US/runesReforged.json`;
      let response = await fetch(url);
      let json = await response.json();


      let obj = {};
      for (let group of json) {
        let key = group.key;

        for (let subgroup of group.slots[0].runes) {
          obj[subgroup.key] = key;
        }
      }

      console.log("PARENT PERKS ----------------------")
      console.log(obj);
      setParentPerks(obj);
    }

    getChampsFromId();
    getPerks();
    getPerkRoots();
  }, [])

  async function getSummonerInfo(e, summoner, region) {
    e.preventDefault();

    console.log("Searching...");

    // TODO: Add regional support ------------------------
    const url = `http://jvaughn.org/postmortem/passthrough_core.php?summoner=${summoner}&dir=_lol_summoner_v4_summoners_by-name_`;
    let response = await fetch(url);
    let json = await response.json();

    setSummonerData(json);

    getSummonerMatchHistory(json.accountId);
  }

  async function getSummonerMatchHistory(accountId) {
    const url = `http://jvaughn.org/postmortem/passthrough_core.php?account_id=${accountId}&dir=_lol_match_v4_matchlists_by-account_`;
    // console.log(`Match history url: ${url}`);
    let response = await fetch(url);
    let json = await response.json();

    getSingleMatch(json.matches[0]);
  }

  async function getSingleMatch(match) {
    const url = `https://jvaughn.org/postmortem/passthrough_core.php?match_id=${match.gameId}&dir=_lol_match_v4_matches_`;
    // console.log(`Single match url: ${url}`);

    let response = await fetch(url);
    let json = await response.json();
    // console.log(json);

    setMatches(generateSingleMatch(json, match));
  }

  // Match generation from the info that we pulled -----------------------------
  function generateSingleMatch(matchData, generalData) {
    let participantList = {};
    for (let player of matchData.participantIdentities) {
      // console.log(player);
      participantList[player.participantId] = player.player.summonerName;
    }
    // console.log('Participant list:')
    // console.log(participantList);

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
      stats['item0'],
      stats['item1'],
      stats['item2'],
      stats['item3'],
      stats['item4'],
      stats['item5'],
      stats['item6']
    ]

    data["myStats"] = {
      kills: stats.kills,
      deaths: stats.deaths,
      assists: stats.assists,
      gold: stats.goldEarned,
      minions: stats.totalMinionsKilled,
      vision: stats.visionScore,
    }

    let team1 = [];
    let team2 = [];
    for (let i = 0; i < matchData.participants.length; i++){
      let playerProfile = {
        name: participantList[matchData.participants[i].participantId],
        champion: matchData.participants[i].championId
      }

      if (matchData.participants[i].teamId === 100) 
        team1.push(playerProfile);
      else
        team2.push(playerProfile);
    }

    data["teams"] = {
      1: team1,
      2: team2
    }

    return <SingleMatch data={data} champFromId={champFromId} perks={perks} parentPerks={parentPerks}/>
  }

  return (
    <div className="App" id="app">
      {/* <TestForm /> */}
      <div id="content-wrapper" className="std-border">
        <h1>POSTMORTEM</h1>
        <Search getSummonerInfo={getSummonerInfo} />
        {/* <SingleMatch /> */}
        {matches}
      </div> 
      {/* <Map /> */}
    </div>
  );
}

export default App;
