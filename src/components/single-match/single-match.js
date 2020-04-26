import React from 'react';

import EyePath from '../../media/svg/eye-solid.svg';

const SingleMatch = (props) => {
  return (
    <div className='match-wrapper'>
      <div className='match-container std-border'>
        <div className={`success-indicator std-border ` + props.success}></div> {/* Indicator of win or loss, changes to red or green or grey on remake */}
        <img className='champ-icon std-border' src='http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/-1.png'></img>
        <div className='match-chosen-spells'>
          <div className='match-summoner-spells'>
            {/* Source for all summ icons http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/ */}
            <img className='match-summoner-spell upper-spell std-border' src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_flash.png'></img>
            <img className='match-summoner-spell lower-spell std-border' src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/summoner_exhaust.png'></img>
          </div>
          <div className='match-masteries'>
            <img className='match-keystone std-border' src='https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Domination/Electrocute/Electrocute.png'></img>
            <img className='match-secondary std-border' src='https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/7203_Whimsy.png'></img>
          </div>
        </div>
        <div className='match-report-wrapper'>
          <div className='match-report-upper'>
            {/* <p>K/D/A: 6/14/21</p>
            <div className='match-vision-stats'>
              <img className='match-vision-icon' src={EyePath}></img>
              <p>27</p>
              <img className='match-trinket' src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/3341_redtrinket.png'></img>
            </div> */}
          </div>
          <div className='match-report-lower'>
            <img src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/1001_boots_of_speed.png'></img>
            <img src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/1001_boots_of_speed.png'></img>
            <img src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/1001_boots_of_speed.png'></img>
            <img src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/1001_boots_of_speed.png'></img>
            <img src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/1001_boots_of_speed.png'></img>
            <img src='http://raw.communitydragon.org/pbe/plugins/rcp-be-lol-game-data/global/default/data/items/icons2d/1001_boots_of_speed.png'></img>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleMatch;