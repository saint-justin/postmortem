import React, { useState } from 'react';

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
    </div>
  )
}

export default Map;