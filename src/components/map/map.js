import React, { useState, useEffect } from 'react';
import LoLMap from "../../media/png/lol-map.png";
import IconPath from "../../media/svg/search-solid.svg";

class Map extends React.Component {

  constructor(deaths) {
    super();
    this.deaths = deaths; // Array of death locations
  }

  componentDidMount() {
    this.canvas = this.refs.canvas
    this.ctx = this.canvas.getContext("2d")
    this.img = this.refs.image
    
    this.img.onload = () => {
      this.ctx.drawImage(this.img, -40, 0)
      // ctx.font = "40px Courier"
      // ctx.fillText(this.props.text, 210, 75)
    }
  }

  updateDrawing(drawType) {
    if(drawType == "kills") {
      console.log("kills button clicked!");
      this.ctx.drawImage(this.img, -40, 0);
      // for (const [index, value] of deaths.entries()) {
        this.drawMarker(8000, 8000, drawType);
      // }
    } else if(drawType == "wards") {
      this.ctx.drawImage(this.img, -40, 0);
      console.log("wards button clicked!");
    } else {
      console.log("unknown button clicked?");
    }
  }

  drawMarker(xPos, yPos, drawType) {
    // The arena is roughly 160m on each side, and 1 cm per unit
    const xPercent = xPos / 16000;
    const yPercent = (16000 - yPos) / 16000;
    this.ctx.save();
    this.ctx.fillStyle = "#FFF";
    this.ctx.beginPath();
    this.ctx.arc(xPercent * 320, yPercent * 285, 10, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={320} height={285} />
        <img ref="image" src={LoLMap} className="hidden" />
        <div>
          <button onClick={() => this.updateDrawing("kills")}>Draw kills</button>
          <button onClick={() => this.updateDrawing("wards")}>Draw wards</button>
          <input type="range" min="1" max="60" value="1" step="1" ref="sliderMins" onChange={() => {console.log("Value changed");}}></input>
        </div>
      </div>
    )
  }
}

export default Map;