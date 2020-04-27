import React, { useState, useEffect } from 'react';
import LoLMap from "../../media/lol-map.png";

/*const Map = (props) => {
  // Any functions or state can go here
  const [myNumber, setMyNumber] = useState(0);
  const [notMyNumber, setNotMyNumber] = useState(-34);
  const [ctx, setCtx] = useState(null);

  // const []
  function draw() {
    ctx = this.refs.canvas;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 100);
    ctx.closePath();
    ctx.stroke();
  }

  useEffect(() => {
    draw();
  }, []);

  // Instantiate the function as drawing the league map
  // draw();

  return (
    <div className='match-map'>
      {myNumber}
      {notMyNumber}
      <button onClick={(e) => {setMyNumber(myNumber+1)}}>
        click me
      </button>
      <canvas ref="canvas" width={300} height={250}></canvas>
      <img ref="image" src={LoLMap} style="hidden"></img>
    </div>
  )
}*/

class Map extends React.Component {
  
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const img = this.refs.image
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      // ctx.font = "40px Courier"
      // ctx.fillText(this.props.text, 210, 75)
    }
  }

  updateDrawing(drawType) {
    if(drawType == "kills") {
      console.log("kills button clicked!");
    } else if(drawType == "wards") {
      console.log("wards button clicked!");
    } else {
      console.log("unknown button clicked?");
    }
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={400} height={285} />
        <img ref="image" src={LoLMap} className="hidden" />
        <div>
          <button onClick={this.updateDrawing("kills")}>Draw kills</button>
          <button onClick={this.updateDrawing("wards")}>Draw wards</button>
        </div>
      </div>
    )
  }
}

export default Map;