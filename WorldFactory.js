import Matter from "matter-js";

import NumberBox from './NumberBox'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var createWorld = (width, height) => {
	const boxSize = Math.trunc(Math.max(width, height) * 0.075);

	const floor = Matter.Bodies.rectangle(width/2, height - boxSize / 2, width, boxSize, {isStatic: true})
	const engine = Matter.Engine.create({enableSleeping: false});

	const world = engine.world;

	//Note 107 comes from NonGameUI
	const topBoundary = Matter.Bodies.rectangle(width/2, 107, width, 1, {isStatic: true});
	const leftBoundary = Matter.Bodies.rectangle(0, 107+height/2, 1, height, {isStatic: true})
	const rightBoundary = Matter.Bodies.rectangle(width-1, 107+height/2, 1, height, {isStatic: true})

	world.gravity.y = 0
	world.gravity.x = 0
	Matter.World.add(world, [floor, topBoundary, leftBoundary,rightBoundary]);


	return {
		"world": world, 
		"boxSize": boxSize, 
		"engine": engine,
		"floor": floor,
		"topBoundary": topBoundary,
		"leftBoundary": leftBoundary,
		"rightBoundary": rightBoundary
	}
}

var addBox = (entities, world, boxIds, boxSize, x, y, number, color) => {
	let body = Matter.Bodies.rectangle(x, y, boxSize, boxSize, {frictionAir: 0.025})
	Matter.World.add(world, [body]);
	entities[boxIds+1] = {
		body: body,
        size: [boxSize, boxSize],
        color: color,
        renderer: NumberBox,
        number: number,
        opacity: 1.0
	}
	return boxIds+1
}

var createNewNum = () => {
	var firstNum = [getRandomInt(10), getRandomInt(10), getRandomInt(10)]
    var secondNum = [getRandomInt(10), getRandomInt(10), getRandomInt(10)]

    var firstActualNum = 0
  	for (var i = 0; i<firstNum.length; i++) {
    	firstActualNum = firstActualNum + firstNum[i] * Math.pow(10, i)
  	}

  	var secondActualNum = 0
  	for (var i = 0; i<firstNum.length; i++) {
    	secondActualNum = secondActualNum + secondNum[i] * Math.pow(10, i)
  	}

    return [{'digits':firstNum, 'num':firstActualNum}, {'digits':secondNum, 'num': secondActualNum}]
}

export { createWorld, addBox, createNewNum }