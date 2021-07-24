# PlaThyme Backend

This `README` provides information about `how to add New games` to backend of this Repo.

If your game is multiplayer, or requires a server to make decisions, keep score, relay messages between players, etc, you’ll need to build out a back end. For ease of game creation, we’ve made a class that your game can extend which you can use to encapsulate your game’s needs, as well as keeping our own server code clean. So I’ll cover all the changes each game must put in, and then I’ll cover the functionality of the __Game__ class.

## How to add your Game BackEnd to this Project.

__Below are the things required to be included in your game's back end.__

### 1) __./server/index.js__
There are only two changes you should make to this file.
* The first is to include your game's class from its javascript file. Which should be located in ./server/Games/ So in the include statements in the index.js file you sould include your file as such:

```javascript
  const MyGame = require("./Games/MyGame");
```

* The second is to add your game to the object creation switch statement. In the handleCreateGame function there is a switch statement where all game instances have their object created on the server side. So when someone creates a new instance of your game, the server creates an object and adds it to its tracking object. So what do you need to do? Using the gameId number that was created in the app.js file in the front end, switching on that gameId, create your game object. Example:

```javascript
case 5:
  games[roomCode] = new MyGameName(roomCode, socket, io, [data.name]);
  break;
```
_The only thing you need to change about this statement is the case number (gameId), and the MyGameName must match the name of your game class. Of course, if you have additional parameters that need to be fed into your constructor, this is where that would be done._

### 2) __./server/Games/YourGame.js__
Here's where you need to actually implement your back end. 
* This class must extend the Game class. So your first few lines should look like this:

```javascript
const Game = require("./Game");
class MyGame extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
  }
  //add my game methods here
}
module.exports = MyGame;
```

So as you can see above, the MyGame class is extending the Game class, and calls its contructor. The rest of the actual game creation is up to you. 

To aid you, the Game class has functionality to simplify communications, and integration with the rest of the site. The methods for that are described in the next section.

## __How to use `Game.js`__

The Game class has a number of built in functions for your game to use, as well as a number of methods which the server will call when specific events occur that could be useful in your game. 

_Default properties of a game are:_
* roomCode _(the code players type in to join the room)_, 
* players _(an array of the player names in the room)_, 
* socket 
* io

_*The last two, the `socket`, and `io` are used for communications between the server and the client.*_ 
You don't need to mess with those last two if you don't want to. 

### The `functionailty` of each method is included below. 

### 1. __startGame()__ 

* This method is called when when the minimum number of players, as defined in the App.js file is reached. This function is not implemented by default, so your game will need to implement it if this could be useful to you.

### 2. __newPlayer(playerName)__ 

* When a new player joins a game room, this method is called by the server, with their name as a string passed in as a parameter. By default this adds the new player to the this.players array.

### 3. __disconnection(playerName)__ 

* When a player disconnects from the room this methods is called by the server. By default it only removes that player from the this.players array.

### 4. __recieveData(data)__ 

* When the server gets a "game-data" event, it checks to see what game room its associated with. Then it calls the recieveData function for that game, and passes the data it recieved to it. To use this, its suggested that you create events within the data to distinguish what to do when it arrives. Here's an example of what that could look like:

```javascript
recieveData(data) {
  if (data.event === "event-name") {
    somethingCoolHappens(data.contents);
  }
  if (data.event === "other-event") {
    somethingElseHappens(data.differentContents);
  }
}
```

_*These events are created on the front end, and their contents will need to be correctly created there. You can of course handle the contents of the data however its needed for your game. This function is not implemented by default.*_

### 5. __sendGameData(data)__ 

* When you need to send out data to the front end of all clients connected to an instance of the game, use this function. You don't need to modify the implemenation of it, you can simply call the parent classes version of it, and the data that's passed in will be sent out to all players. Here's an example:

```javascript
somethingCoolHappens(dataToSend){
  super.sendGameData({event:"something-cool", contents: dataToSend});
}
```

_*More information about how the front end will handle this is found in the front end documentation. Above we've sent a json with the event property set to "something-cool" and the contents of it as dataToSend. Take a look at the code of some of the other games for ideas on how to use this.*_

### 6. __sendDataToPlayer(playerName, data)__ 

* This function is the same as the above one, but you need to pass in a player's name, and the data will be sent to their front end alone. This is useful for when sending information that should only go to a single client. Note: each room can only have one unique player name.

### 7. __sendChat({sender, text})__ 

* Call this function to send a chat message to the room from the game server. This can be for status updates, or whatever you want. The sender parameter and the text fields will be filled out as such. Example:

```javascript
fellInPit(playerName){
  super.sendChat({sender:"MyGame", text:`${playerName} fell in a pit! Respawning in 10 seconds`});
  //other stuff
}
```

### 8. __chatMessage({sender, message})__ 

* Rather than sending messages, this function is called by the server whenever a player in the room sends a chat message. The chat messages and who sent them are all exposed to the game here. The sender maps to the player's name in the players array. The contents of their message is in the message. This can be used by the game in whatever way is useful to you. For example in "Draw The Word" the chat is how players make guesses about what's being drawn. This function is not implemented by default.

### 9. __updatePlayerScore(playerName, score)__ 

* if your game has a score that needs to be kept track of, and displayed, this is one option. In the player list in the sidebar in the game room the score will be displayed beside each player name. It starts out as zero by default, and when this function is called it will update the score to the value passed in.
