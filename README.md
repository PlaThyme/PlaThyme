# Team Names
* Sree Vandana Nadipalli
* Zachariah Santangelo
* Michael Fulton

# PlaThyme
It is a multiplayer web game hosting site. We are aiming to create a website where users can select a game, create a private room and start playing games. The site shall be able to host open source games created by contributors. 

# Technologies and Environment
* [React](https://reactjs.org/docs/getting-started.html)
* [NodeJS](https://nodejs.org/en/docs/)
* [Socket.io](https://socket.io/docs/v4)
* [Heroku](https://www.heroku.com/) 
* [VS Code](https://code.visualstudio.com/)
* [TailwindCSS](https://tailwindcss.com/docs/guides/create-react-app)

# Programming Languages
* JavaScript
* CSS
* HTML
* JSX

# Project Goals
We are planning to do this in `2 steps`. 
1. Initially we are aiming on making one game collaboratively. This will help us nail down the creation process, Developing a Game API which will handle integrating new games, and create documentation for it. 
2. Following this, additional games will be created individually by each of the initial contributors, using the Game API developed in step 1.

# Project Roadmap
* Repository creation and initial commit -- Done
* Landing page and game selection menu / lobby + Private Room & game container.
* set up a server and client communications (Server API, Socket.io implementation)
* create private rooms and play multiplayer game

* first game creation: __Draw the Word__
* Future work: Additional game ideas: 
  1 __Draw the word, down the line__
  2 __Enigma Breaker__


# __Draw the Word__ 
will be a game where one player will use a virtual canvas to draw a secret word given to them. Other players will then guess the word in a chat module. String recognition will watch for the correct answer, and award a point to the player whose guessed it correctly. This will require the following things to be made:
* Shared virtual canvas, which one player at a time may modify.
* Chat integration.
* String recognition for awarding points.
* Scoreboard.
* Create multiple rooms based on shareable code.
* Handle new player join / exit.
* Game encapsulation, so adding additional games will be easier.
* Writing documentation on game creation process.

# __Future game ideas__
## __Draw the word, down the line__
A version of draw the word where players alternately draw, and guess the content of other people's drawings.

## __Enigma Breaker__
A word game where teams of players try to pass secret message codes while the other team listens.

# __How to Contribute__
## __Build Your Game's Front End__
Information about how to build the front end into the website goes here.

## __Build Your Game’s Back End__
If your game is multiplayer, or requires a server to make decisions, keep score, relay messages between players, etc, you’ll need to build out a back end. For ease of game creation, we’ve made a class that your game can extend which you can use to encapsulate your game’s needs, as well as keeping our own server code clean. So I’ll cover all the changes each game must put in, and then I’ll cover the functionality of the __Game__ class.

### __Back End Checklist__
Below are the things required to be included in your game's back end.
* __./server/index.js__
There are only two changes you should make to this file. The first is to include your game's class from its javascript file. Which should be located in ./server/Games/ So in the include statements in the index.js file you sould include your file as such:
```javascript
  const MyGame = require("./Games/MyGame");
```
The second is to add your game to the object creation switch statement. In the handleCreateGame function there is a switch statement where all game instances have their object created on the server side. So when someone creates a new instance of your game, the server creates an object and adds it to its tracking object. So what do you need to do? Using the gameId number that was created in the app.js file in the front end, switching on that gameId, create your game object. Example:
```javascript
case 5:
  games[roomCode] = new MyGameName(roomCode, socket, io, [data.name]);
  break;
```
The only thing you need to change about this statement is the case number (gameId), and the MyGameName must match the name of your game class. Of course, if you have additional parameters that need to be fed into your constructor, this is where that would be done.
* __./server/Games/YourGame.js__
Here's where you need to actually implement your back end. This class must extend the Game class. So your first few lines should look like this:
```javascript
const Game = require("./Game");
class MyGame extends Game {
  constructor(roomCode, socket, io, players) {
    super(roomCode, socket, io, players);
  }
  //add my game methods here
}
module.exports = MyGame
```
So as you can see above, the MyGame class is extending the Game class, and calls its contructor. The rest of the actual game creation is up to you. To aid you, the Game class has functionality to simplify communications, and integration with the rest of the site. The methods for that are described in the next section.

### __Using Game.js__
The Game class has a number of built in functions for your game to use, as well as a number of methods which the server will call when specific events occur that could be useful in your game. Default properties of a game are its roomCode (the code players type in to join the room), players (an array of the player names in the room), socket, and io. The last two, the socket, and io are used for communications between the server and the client. You don't need to mess with those last two if you don't want to. Their functionailty is included in some of the methods below. 
* __startGame()__ This method is called when when the minimum number of players, as defined in the App.js file is reached. This function is not implemented by default, so your game will need to implement it if this could be useful to you.
* __newPlayer(playerName)__ When a new player joins a game room, this method is called by the server, with their name as a string passed in as a parameter. By default this adds the new player to the this.players array.
* __disconnection(playerName)__ When a player disconnects from the room this methods is called by the server. By default it only removes that player from the this.players array.
* __recieveData(data)__ When the server gets a "game-data" event, it checks to see what game room its associated with. Then it calls the recieveData function for that game, and passes the data it recieved to it. To use this, its suggested that you create events within the data to distinguish what to do when it arrives. Here's an example of what that could look like:
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
These events are created on the front end, and their contents will need to be correctly created there. You can of course handle the contents of the data however its needed for your game. This function is not implemented by default.
* __sendGameData(data)__ When you need to send out data to the front end of all clients connected to an instance of the game, use this function. You don't need to modify the implemenation of it, you can simply call the parent classes version of it, and the data that's passed in will be sent out to all players. Here's an example:
```javascript
somethingCoolHappens(dataToSend){
  super.sendGameData({event:"something-cool", contents: dataToSend});
}
```
More information about how the front end will handle this is found in the front end documentation. Above we've sent a json with the event property set to "something-cool" and the contents of it as dataToSend. Take a look at the code of some of the other games for ideas on how to use this.
* __sendDataToPlayer(playerName, data)__ This function is the same as the above one, but you need to pass in a player's name, and the data will be sent to their front end alone. This is useful for when sending information that should only go to a single client. Note: each room can only have one unique player name.
* __sendChat({sender, text})__ Call this function to send a chat message to the room from the game server. This can be for status updates, or whatever you want. The sender parameter and the text fields will be filled out as such. Example:
```javascript
fellInPit(playerName){
  super.sendChat({sender:"MyGame", text:`${playerName} fell in a pit! Respawning in 10 seconds`});
  //other stuff
}
```
* __chatMessage({sender, message})__ Rather than sending messages, this function is called by the server whenever a player in the room sends a chat message. The chat messages and who sent them are all exposed to the game here. The sender maps to the player's name in the players array. The contents of their message is in the message. This can be used by the game in whatever way is useful to you. For example in "Draw The Word" the chat is how players make guesses about what's being drawn. This function is not implemented by default.
* __updatePlayerScore(playerName, score)__ if your game has a score that needs to be kept track of, and displayed, this is one option. In the player list in the sidebar in the game room the score will be displayed beside each player name. It starts out as zero by default, and when this function is called it will update the score to the value passed in.
