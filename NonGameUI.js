import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, TouchableHighlight } from 'react-native';



//Format
/*
[
	[
		{
			digit: number,
			backgroundColor: 'blue'
		},
		{
			digit: number,
			backgroundColor: 'green'
		}
	],
	[
	...
	]
]
*/



export default class NonGameUI extends React.Component {
  render() {
  	if (this.props.swap) {
  		console.warn(this.props.swap)
  	}
    return (
      <View style={{backgroundColor:'white', height: 105, paddingTop:20, width:this.props.width, borderColor:'black', paddingBottom: 5, borderBottomWidth: 2}}>
      	<Text style={{fontFamily: 'kalam-regular', fontSize:24, textAlign:'center'}}>MathBlocks</Text>
      	<View style={styles.digitContainer}>
      			{this.props.numberInfo[0].map((elem) => 
      				<TouchableHighlight onPress={() => this.props.addNumberBox(this.props.width/2, this.props.height/2, elem.digit, elem.backgroundColor)} underlayColor={elem.backgroundColor}>
      					<Text style={styles.digitText}>
      					{" " + elem.digit + " "}
      					</Text>
      				</TouchableHighlight>
      				)}
      			 <Text style={styles.digitText}>{"  + "}</Text>
      			 {this.props.numberInfo[1].map((elem) => 
      			 		<TouchableHighlight onPress={() => this.props.addNumberBox(this.props.width/2, this.props.height/2, elem.digit, elem.backgroundColor)} underlayColor={elem.backgroundColor}>
      						<Text style={styles.digitText}>
      						{" " + elem.digit + " "}
      						</Text>
      					</TouchableHighlight>
      				)}
      			<Text style={styles.digitText}>{" =  ?"}</Text>
      	</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  digitText: {
    fontFamily: 'opensans-semibold', 
    fontSize:36,
  },
  digitContainer: {
  	flexDirection: 'row',
  	flexWrap: 'wrap',
  	justifyContent: 'center'
  }
});
