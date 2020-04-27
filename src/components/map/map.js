import React, { useState } from 'react';
import IconPath from "../../media/svg/search-solid.svg";


const Map = (props) => {
  // Any functions or state can go here
  const [myNumber, setMyNumber] = useState(0);
  const [notMyNumber, setNotMyNumber] = useState(-34);

  return (
    <div className='match-map'>
      {myNumber}
      {notMyNumber}
      <button onClick={(e) => {setMyNumber(myNumber+1)}}>
        click me
      </button>

      <img src={IconPath}></img>
    </div>
  )
}

export default Map;