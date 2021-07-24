# __How to Contribute to PlaThyme__
 To integrate your Game into this platform. You need to add `frontend` part of your code to `client` folder and `backend` part of your code to `server` folder.  

## __Build Your Game's Front End__
Your game will certainly will have a frontend part to it. 
__To integrate new game in this project. Follow these steps.__

1. Create New Folder with your `Game_Name` in `Games` folder. *All game logic goes here. make sure this returns the game component to be displayed in GameRoom.*

2. Import your Game component in `App.js`.

3. Add the Game Info in `listofGames` Dictionary present in `App.js`.

4. Call your Game component inside `renderGame` switch case, present in `App.js`.


## __Build Your Game’s Back End__
If your game is multiplayer, or requires a server to make decisions, keep score, relay messages between players, etc, you’ll need to build out a back end. For ease of game creation, we’ve made a class that your game can extend which you can use to encapsulate your game’s needs, as well as keeping our own server code clean. So I’ll cover all the changes each game must put in, and then I’ll cover the functionality of the __Game__ class.

__Below are the things required to be included in your game's back end.__

### 1) __./server/index.js__
There are only `two changes` you should make to this file. _(For Example consider your game name is `MyGame`)_

* The first is to include your game's class from its javascript file. Which should be located in `./server/Games/` So in the include statements in the index.js file you sould include your file as such:

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

### 2) __./server/Games/MyGame.js__
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

__Detailed discription of `Game.js` methods is provided [here](https://github.com/PlaThyme/PlaThyme/tree/Dev/server/README.md).__

#  Issues and Pull Requests
# How to file a bug report?

# How to suggest a new feature?

# Code of Conduct

This project and everyone participating in it is governed by PlaThyme [Code of Conduct](https://github.com/PlaThyme/PlaThyme/blob/main/CODE_OF_CONDUCT.md). All contributors are required to follow it.