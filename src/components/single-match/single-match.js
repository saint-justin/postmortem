import React, { useState, useEffect } from "react";

import IconEye from "../../media/svg/eye-solid.svg";
import IconGold from "../../media/svg/scoreboardicon_gold.png";
import IconMinion from "../../media/svg/scoreboardicon_minion.png";

import Divider from "../../media/svg/divider.png";

const SingleMatch = (props) => {
  const [state, setState] = useState({
    matchId: props.data.matchId,
    champIcon: formatChampIcon(props.data.champion),
    summonerSpells: {
      upper:
        "http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_flash.png",
      lower:
        "http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_exhaust.png",
    },
    runes: {
      keystone:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png",
      secondary:
        "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png",
    },
    items: formatItemLinks(props.data.items),
    trinket: "https://ddragon.leagueoflegends.com/cdn/10.8.1/img/item/3364.png",
    myStats: props.data.myStats,
    teams: props.data.teams,
    win: props.data.win   //TODO: Check up on this
  });

  function generateItems(items) {
    let itemJsx = [];
    for (let i = 0; i < 6; i++)
      itemJsx.push(
        <img
          className={`match-item match-item-${i + 1}`}
          src={items[i] ? items[i] : ""}
          key={`match_${state.matchId}_item_${i}`}
        ></img>
      );
    return <>{itemJsx}</>;
  }

  function formatItemLinks(items) {
    let arr = [];
    for (let i = 0; i < items.length; i++){
      arr.push(`http://ddragon.leagueoflegends.com/cdn/10.8.1/img/item/${items[i]}.png`)
    }
    return arr;
  }

  function formatChampIcon(champId){
    return `http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champId}.png`
  }
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  function formatTeam(players, teamNumber) {
    let playerJsx = [];
    for (let i = 0; i < players.length; i++) {
      console.log(players[i].champion)
      playerJsx.push(
        <div key={`match_${state.matchId}_team_${teamNumber}_player_${i}`}>
          <img src={formatChampIcon(players[i].champion)}></img>
          <p>{players[i].name}</p>
        </div>
      );
    }
    return <div className={`${teamNumber === 0 ? 'match-report-blue' : 'match-report-red'} match-report-team`}>{playerJsx}</div>
  }

  return (
    <div className="match-wrapper">
      <div className="match-container std-border">
        <div className={`success-indicator right-border ${ state.win ? 'success-true' : 'success-false'}`}></div>{" "}
        {/* Indicator of win or loss, changes to red or green or grey on remake */}
        <img className="champ-icon std-border" src={state.champIcon}></img>
        <div className="match-chosen-spells">
          <div className="match-summoner-spells">
            {/* Source for all summ icons http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/ */}
            <img
              className="match-summoner-spell upper-spell std-border"
              src={state.summonerSpells.upper}
            ></img>
            <img
              className="match-summoner-spell lower-spell std-border"
              src={state.summonerSpells.lower}
            ></img>
          </div>
          <div className="match-masteries">
            <img
              className="match-keystone std-border"
              src={state.runes.keystone}
            ></img>
            <img
              className="match-secondary std-border"
              src={state.runes.secondary}
            ></img>
          </div>
        </div>
        <div className="match-report-wrapper">
          <div className="match-report-items">{generateItems(state.items)}</div>
          <img
            className="match-report-trinket"
            src={state.trinket ? state.trinket : null}
          ></img>
        </div>
        <div className="match-report-stats">
          <h3 className="match-report-kda">
            {state.myStats.kills}/{state.myStats.deaths}/{state.myStats.assists}
          </h3>
          <div className="match-report-side-by-side">
            <div className="match-report-stat-numbers match-report-column">
              <p>{formatNumber(state.myStats.gold)}</p>
              <p>{state.myStats.minions}</p>
              <p>{state.myStats.vision}</p>
            </div>
            <div className="match-report-stat-icons">
              <img src={IconGold}></img>
              <img src={IconMinion}></img>
              <img
                src={IconEye}
                className="stat-icon-eye match-report-column"
              ></img>
            </div>
          </div>
        </div>
        <div className="match-report-players">
          {formatTeam(state.teams[1], 0)}
          <img src={Divider} className="match-report-divider"></img>
          {formatTeam(state.teams[2], 1)}
        </div>
      </div>
    </div>
  );
};

export default SingleMatch;
