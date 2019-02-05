import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';

import { GameEngine } from "react-native-game-engine";

import Box from "./Box";
import NumberBox from "./NumberBox"

import {Physics, AssignFingerToBox, MoveBox, ReleaseFingerFromBox, CheckForWinner} from "./Systems";
import { createWorld, addBox, createNewNum } from "./WorldFactory";

import NonGameUI from './NonGameUI';

var boxIds = 0

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


export default class BlockEngine extends React.Component {

  swapEntities = (toSwap) => {
    this._root.swap(toSwap)
  }
  addEntities = (toAddObject) => {
    this._root.swap({...this._root.entities, ...toAddObject})
  }

  addNumberBoxEntity = (x, y, number, color) => {
    boxIds = addBox(this.entities, this.world, boxIds, this.boxSize, x, y, number, color)
  }
  constructor(props) {
    super(props);

    var {world, boxSize, engine, floor, topBoundary, leftBoundary, rightBoundary} = createWorld(this.props.width, this.props.height)
    this.world = world
    this.boxSize = boxSize
    this.engine = engine
    this.floor = floor
    this.topBoundary = topBoundary
    this.leftBoundary = leftBoundary
    this.rightBoundary = rightBoundary


    this.numInfo = createNewNum()

    this.numInfoToPass = [
  [
    {
      digit: this.numInfo[0].digits[2],
      backgroundColor: 'blue'
    },
    {
      digit: this.numInfo[0].digits[1],
      backgroundColor: 'yellow'
    },
    {
      digit: this.numInfo[0].digits[0],
      backgroundColor: 'purple'
    },
  ],
  [
    {
      digit: this.numInfo[1].digits[2],
      backgroundColor: 'green'
    },
    {
      digit: this.numInfo[1].digits[1],
      backgroundColor: 'yellow'
    },
    {
      digit: this.numInfo[1].digits[0],
      backgroundColor: 'red'
    },
  ]
]        


    this.entities = {

        physics: {
          engine: this.engine,
          world: this.world
        },
        floor: {
          body: this.floor,
          size: [this.props.width, this.boxSize],
          color: "green", 
          renderer: Box
        },
        topBoundary: {
          body: this.topBoundary,
          size: [this.props.width, 1],
          color: "#fff",
          renderer: Box
        },
        leftBoundary: {
          body: this.leftBoundary,
          size: [1, this.props.height],
          color:"#fff",
          renderer: Box
        },
        rightBoundary: {
          body: this.leftBoundary,
          size: [1, this.props.height],
          color:"#fff",
          renderer: Box
        },
        winningNumber: {
          num: this.numInfo[0]['num'] + this.numInfo[1]['num']
        }

      }
  }


  render() {
    return (
      <GameEngine style={this.props.style}
      systems={[
        Physics,
        AssignFingerToBox,
        MoveBox,
        ReleaseFingerFromBox,
        CheckForWinner
        ]}
        ref={(node) => {this._root = node}}
      entities = {this.entities}>
        <NonGameUI numberInfo={this.numInfoToPass} addNumberBox={this.addNumberBoxEntity} width={this.props.width} height ={this.props.height}/>
      </GameEngine>
    );
  }
}

/*BlockEngine.propTypes = {
    width: number,
    height: number
}*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

