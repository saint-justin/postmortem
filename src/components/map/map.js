import React, { useState, useEffect } from 'react';
import LoLMap from "../../media/png/lol-map.png";
import IconPath from "../../media/svg/search-solid.svg";


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

  constructor(deaths) {
    this.deaths = deaths; // Array of death locations
  }

  componentDidMount() {
    this.canvas = this.refs.canvas
    this.ctx = this.canvas.getContext("2d")
    this.img = this.refs.image
    
    this.img.onload = () => {
      this.ctx.drawImage(this.img, 0, 0)
      // ctx.font = "40px Courier"
      // ctx.fillText(this.props.text, 210, 75)
    }
  }

  updateDrawing(drawType) {
    if(drawType == "kills") {
      // for (const [index, value] of deaths.entries()) {
        this.drawMarker(6000, 6000, drawType);
      // }
    } else if(drawType == "wards") {
      console.log("wards button clicked!");
    } else {
      console.log("unknown button clicked?");
    }
  }

  drawMarker(xPos, yPos, drawType) {
    // The arena is roughly 160m on each side, and 1 cm per unit
    const xPercent = xPos / 16000;
    const yPercent = yPos / 16000;
    this.ctx.save();
    this.ctx.fillStyle = "#FFF";
    this.ctx.beginPath();
    this.ctx.arc(xPercent * 400, yPercent * 285, 10, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
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