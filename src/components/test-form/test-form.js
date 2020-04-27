import React, { useState } from "react";

const TestForm = (props) => {
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState('No user data');
  const [matchData, setMatchData] = useState('No match data');
  const [recentGames, setRecentGames] = useState('');

  const BASE_URL = `https://people.rit.edu/jtv6445/330/projects/p3/`;

  async function getSummonerData(e, summoner) {
    e.preventDefault();

    let searchURL = `${BASE_URL}passthrough.php?summoner=${summoner ? summoner : 'Dyrus' }`;
    let response = await fetch(searchURL);
    let data = await response.json();
    setUserData(data);

    console.log('Summoner Data: ');
    console.log(data);

    getMatchHistory(data.accountId);
  }

  async function getMatchHistory(accountId) {
    let searchURL = `${BASE_URL}match_passthrough.php?id=${accountId}`;
    let response = await fetch(searchURL);
    let data = await response.json();
    setMatchData(data)

    makeEntriesFromMatchData(data);

    console.log('Match history data');
    console.log(data);
  }

  const makeEntriesFromMatchData = (data) => {
    let matches = data.matches;
    let matchArr = [];
    for (let i = 0; i < matches.length; i++){
      let newMatch = <p>Game played {new Date(matches[i].timestamp).toString()}: Champion ID: {matches[i].champion} GameID: {matches[i].gameId}, Played: {matches[i].role} {matches[i].lane}</p>;
      matchArr.push(newMatch);
    }

    setRecentGames(<>{matchArr}</>)
  }

  return (
    <>
      <form>
        <button
          onClick={(e) => {
            getSummonerData(e, user);
          }}
        >
          click me you coward
        </button>
        <input
          placeholder="text"
          onChange={(e) => {
            setUser(e.target.value);
          }}
        ></input>
        <div id='output'>
          <h1>User Data:</h1>
          <p>Username: {userData.name}</p>
          <p>Player Level: {userData.summonerLevel}</p>
          <p>ID: {userData.id}</p>
          <p>Account ID: {userData.accountId}</p>
          <p>PUUID: {userData.puuid}</p>

          <h1>Match Data:</h1>
          <p>Recent Matches: {matchData.totalGames}</p>
          {recentGames}
        </div>
      </form>
    </>
  );
};

export default TestForm;
