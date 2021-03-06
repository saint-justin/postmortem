import React, { useState } from "react";

// SVG imports
import IconSearch from "../../media/svg/search-solid.svg";

const Search = (props) => {
  const [summoner, setSummoner] = useState("");
  // const [region, setRegion] = useState('NA1');   // TODO: Implement regional control

  // const regions = [
  //   "NA1",
  //   "BR1",
  //   "EUN1",
  //   "EUW1",
  //   "JP1",
  //   "KR",
  //   "LA1",
  //   "LA2",
  //   "OC1",
  //   "TR1",
  //   "RU1",
  // ];

  // function formatRegionInputs(regionArr) {
  //   return regionArr.map((e) => {
  //     return (
  //       <option value={e} key={`region-${e}`}>
  //         {e}
  //       </option>
  //     );
  //   });
  // }

  function formatRateLimit(limits) {
    return limits.map((e) => {
      return (
        <option value={e} key={`region-${e}`}>
          {e}
        </option>
      );
    });
  }

  return (
    <div id="search-wrapper">
      {/* <select id="search-region" className="std-border search-component">
        {formatRegionInputs(regions)}
      </select> */}
      <button
        className="std-border search-component"
        id="clear-btn"
        onClick={() => props.clearFunction()}
      >
        Clear
      </button>
      <input
        id="search-input"
        className="std-border"
        placeholder="Search for a summoner... "
        value={summoner}
        onChange={(e) => setSummoner(e.target.value)}
      ></input>
      <button
        id="search-btn"
        className="std-border search-component"
        onClick={(e) => {
          props.getSummonerInfo(e, summoner);
        }}
      >
        <img src={IconSearch} id="icon-search" alt="search icon"></img>
      </button>
      <select id="rate-limit" className="std-border search-component" onChange={(e) => props.updateRate(e.target.value)}>
        {formatRateLimit([5, 3, 10, 20])}
      </select>
    </div>
  );
};

export default Search;
