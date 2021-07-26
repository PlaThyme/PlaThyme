# PlaThyme FrontEnd

* This `README` provides information about `file structure of frontend client folder`, `how to add you game Front End` to this project when you contribute to this Repo, `Discription of Games` and some `additional notes and Rules`.

# File Structure

# How to add your Game Frontend to this Project.

__To integrate new game in this project. Follow these steps.__

1. Create New Folder with your `Game_Name` in `Games` folder. *All game logic goes here. make sure this returns the game component to be displayed in GameRoom.*

2. Import your Game component in `App.js`.

3. Add the Game Info in `listofGames` Dictionary present in `App.js`.

4. Call your Game component inside `renderGame` switch case, present in `App.js`.

# Description of Games

## __Draw the Word__ 
will be a game where one player will use a virtual canvas to draw a secret word given to them. Other players will then guess the word in a chat module. String recognition will watch for the correct answer, and award a point to the player whose guessed it correctly. This will require the following things to be made:
* Shared virtual canvas, which one player at a time may modify.
* Chat integration.
* String recognition for awarding points.
* Scoreboard.
* Create multiple rooms based on shareable code.
* Handle new player join / exit.
* Game encapsulation, so adding additional games will be easier.
* Writing documentation on game creation process.

## __Future game ideas__
## __Draw the word, down the line__
A version of draw the word where players alternately draw, and guess the content of other people's drawings.

## __Enigma Breaker__
A word game where teams of players try to pass secret message codes while the other team listens.
# Additional Note, to keep the code clean.

1. Keep the `CSS` files within the Game folder you created. *Do Not add your game CSS inside `app.css` or `index.css` or any other file* 
2. Add documentation to your code, remove unessisary code lines, un-used code or commented code.