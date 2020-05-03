import React, { useState, useEffect } from 'react';
import LoLMap from "../../media/png/lol-map.png";
import IconPath from "../../media/svg/search-solid.svg";

class Map extends React.Component {

  constructor(props) {
    super(props);
    console.log(props.timeline);
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

  updateDrawing(killEvents, userId) {
    for(const killEvent of killEvents) {
      if(killEvent.killerId == userId) {
        this.drawMarker(killEvent.position.x, killEvent.position.y, "kill");
      } else if(killEvent.victimId == userId) {
        this.drawMarker(killEvent.position.x, killEvent.position.y, "death");
      }
    }
  }

  drawMarker(xPos, yPos, drawType) {
    // The arena is roughly 160m on each side, and 1 cm per unit
    const xPercent = xPos / 16000;
    const yPercent = (16000 - yPos) / 16000;
    this.ctx.save();
    
    if(drawType == "kill")
      this.ctx.fillStyle = "#FFF";
    else if(drawType == "death")
      this.ctx.fillStyle = "#888";
    else
      this.ctx.fillStyle = "#000";

    this.ctx.beginPath();
    this.ctx.arc(xPercent * this.canvas.width, yPercent * this.canvas.height, 10, 0, Math.PI * 2, false);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={320} height={285} />
        <img ref="image" src={LoLMap} className="hidden" />
      </div>
    )
  }
}

export default Map;