import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

import BlockEngine from './BlockEngine'
import { Font } from 'expo';


import _ from "lodash";


const {width, height} = Dimensions.get("screen")



export default class App extends React.Component {
  async componentDidMount() {
    await Font.loadAsync({
      'kalam-bold': require('./assets/fonts/Kalam-Bold.ttf'),
      'kalam-regular': require('./assets/fonts/Kalam-Regular.ttf'),
      'kalam-light': require('./assets/fonts/Kalam-Light.ttf'),
      'opensans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
      'opensans-semibold': require('./assets/fonts/OpenSans-SemiBold.ttf')
    })
    this.setState({fontLoaded:true})
  }
  render() {
    return (
      this.state && this.state.fontLoaded == true ? 
        <BlockEngine style={styles.container} width={width} height={height}/>
      :
        <View/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
