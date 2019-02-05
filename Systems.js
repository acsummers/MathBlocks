import Matter from "matter-js";
import _ from "lodash";

const distance = ([x1, y1], [x2, y2]) => Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const centerFromCorner = (x, y, width, height) => [x, y + height/2]
const cornerFromCenter = (x, y, width, height) => [x - width/2, y - height/2] 



const Physics = (entities, {time}) => {
  let engine = entities["physics"].engine;

  Matter.Engine.update(engine, time.delta);
  return entities;
};


const AssignFingerToBox = (state, {touches}) => {
  let allBoxes = Object.keys(state).filter(k => state[k].hasOwnProperty('number')).map(key => ({
    id: key,
    components: state[key]
  }));

  touches.filter(x => x.type === "start").forEach(t => {
    let touchOrigin = [t.event.pageX, t.event.pageY];
    let closestBox = _.minBy(
        allBoxes
            .filter(w => !w.components.touchId && w.components.body != undefined)
            .map(w =>

              Object.assign(w, {
                  distance: distance(touchOrigin, [w.components.body.position["x"], w.components.body.position["y"]])
                })

            ),
        "distance"
    );
    let closestBoxPosition = [closestBox.components.body.position["x"], closestBox.components.body.position["y"]]
    if (closestBox && distance(touchOrigin, closestBoxPosition) < 100) {
      closestBox.components.touchId = t.id;



    closestBox['collisionCallback'] = (event) => {
        var pairs = event.pairs;
          for (var i = 0, j = pairs.length; i != j; ++i) {
             var pair = pairs[i];


             var subordinateKey = null



              if (pair.bodyA.id === closestBox.components.body.id) {
                 subordinateKey = Object.keys(state).find(k => state[k] && state[k].body && state[k].body.id && state[k].body.id === pair.bodyB.id)

             } else if (pair.bodyB.id === closestBox.components.body.id) {
                 subordinateKey = Object.keys(state).find(k => state[k] && state[k].body && state[k].body.id && state[k].body.id === pair.bodyA.id)
             }


             //Breaks to avoid collision glitch
             if (!subordinateKey || !state[subordinateKey].number) {
                    continue
              }

            if (state[subordinateKey].number + closestBox.components.number < 10) {
              Matter.World.remove(state['physics']['world'], state[subordinateKey].body)
              closestBox.components.number = state[subordinateKey].number + closestBox.components.number
              delete state[subordinateKey]
            }
            else {
              var onesDigit = (state[subordinateKey].number + closestBox.components.number)%10
              var tensDigit = 1

              state[subordinateKey].number = tensDigit
              closestBox.components.number = onesDigit
            } 
          }
     }

     Matter.Events.on(state["physics"].engine, 'collisionStart', closestBox['collisionCallback']);
    }


  });

  return state;
};

const MoveBox = (state, {touches}) => {
  touches.filter(t => t.type === "move").forEach(t => {
    let boxId = Object.keys(state).find(
        key => state[key].touchId === t.id
    );
    let box = state[boxId];
    if (box && box.body && box.body.position) {

      var xVelocityToSet = t.delta.pageX
      var yVelocityToSet = t.delta.pageY

      var boxLeft = box.body.position["x"] - box.body.width/2
      var boxRight = box.body.position["x"] + box.body.width/2

      var boxTop = box.body.position["y"] - box.body.height/2
      var boxBottom = box.body.position["y"] + box.body.height/2


      Matter.Body.translate(box.body, Matter.Vector.create(xVelocityToSet, yVelocityToSet))


      /*Object.keys(state).filter(potentialSubordinate => state[potentialSubordinate].hasOwnProperty("number") && state[potentialSubordinate].opacity < 1).forEach( (potentialSubordinate) => {
            var key = boxId

            var subLeft = state[potentialSubordinate].body.position.x - state[potentialSubordinate].size[0]/2
            var subTop = state[potentialSubordinate].body.position.y - state[potentialSubordinate].size[1]/2

            var subRight = state[potentialSubordinate].body.position.x + state[potentialSubordinate].size[0]/2
            var subBot = state[potentialSubordinate].body.position.y + state[potentialSubordinate].size[1]/2


            var mainLeft = state[key].body.position.x - state[key].size[0]/2
            var mainTop = state[key].body.position.y - state[key].size[1]/2

            var mainRight = state[key].body.position.x + state[key].size[0]/2
            var mainBot = state[key].body.position.y + state[key].size[1]/2


            


      })*/

    }
  });

  return state;
};

const ReleaseFingerFromBox = (state, {touches}) => {
  touches.filter(t => t.type === "end").forEach(t => {
    Object.keys(state)
      .filter(key => state[key].touchId === t.id)
      .forEach(key => 
        {

          Matter.Events.off(state["physics"].engine, 'collisionStart', state[key]['collisionCallback'])
          delete state[key]["collisionCallback"]
          delete state[key]["touchId"]
        }
        );
  });

  


  return state;
}


const FindTouchCollision = (state, {touches}) => {
  /*touches.filter(t => t.type === "move").forEach(t => {
    let boxId = Object.keys(state).find(
        key => state[key].touchId === t.id
    );
    let mainBox = state[boxId];
    
    
    //Find all possible pairs with the main body
    let potentialPairs = Object.keys(state).filter(k => state[k].number).map(k => 
      {return {bodyA: mainBox.body, bodyB: state[k].body} }
    )

    console.warn(potentialPairs)

    //Find collisions given a list of pairs
    let collisions = Matter.Detector.collisions(potentialPairs, state["physics"].engine)

    if (collisions.length > 0) {
      console.warn(collisions[0])
    }



  });*/
  return state;
}


const CheckForWinner = (state) => {
  var potentialDigits = Object.keys(state).filter(k => state[k].number && Math.abs((state['floor'].body.position.y - state['floor'].size[1]/2) - (state[k].body.position.y)) < 50)
  var winner = potentialDigits.sort((a,b) => state[b].body.position.x - state[a].body.position.x)
  var final = 0
  for (var i = 0; i<winner.length; i++) {
    final = final + winner[i] * Math.pow(10, i)
  }

  if (final == state['winningNumber']['num']) {
    console.warn("won")
  }
  return state
}

export {Physics, AssignFingerToBox, MoveBox, ReleaseFingerFromBox, FindTouchCollision, CheckForWinner}