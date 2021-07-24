# Deployed URL
https://plathyme.herokuapp.com/

# Team Names
* Sree Vandana Nadipalli
* Zachariah Santangelo
* Michael Fulton

# PlaThyme
It is a multiplayer web game hosting site. We are aiming to create a website where users can select a game, create a private room and start playing games. The site shall be able to host open source games created by other contributors. 

# Technologies and Environment
* [React](https://reactjs.org/docs/getting-started.html)
* [NodeJS](https://nodejs.org/en/docs/)
* [Socket.io](https://socket.io/docs/v4)
* [Heroku](https://www.heroku.com/) 
* [VS Code](https://code.visualstudio.com/)
* [TailwindCSS](https://tailwindcss.com/docs/guides/create-react-app)
* [Mocha](https://mochajs.org/)

# Programming Languages
* JavaScript
* CSS
* HTML
* JSX

# Project Goals
We are planning to do this in `2 steps`. 
1. Initially we are aiming on making one game collaboratively. This will help us nail down the creation process, Developing a Game API which will handle integrating new games, and create documentation for it. 
2. Following this, additional games will be created individually by each of the initial contributors, using the Game API developed in `step 1`.

# Project Roadmap
* Repository creation and initial commit -- Done
* Landing page and game selection menu / lobby + Private Room & game container.
* set up a server and client communications (Server API, Socket.io implementation)
* create private rooms and play multiplayer game
* first game creation: __Draw the Word__
* Future work: Additional game ideas: 
  1 __Draw the word, down the line__
  2 __Enigma Breaker__

# Testing Strategy
Unit tests have been created for the back end code. More should continue to be made as code is created. Ideally, front end unit tests should be created too, but due to time constraints haven't been made yet. Unit tests for any game back end is required due to the potential for crashing the server. We're using Mocha for the unit testing framework, and Chai for the assert library.

In addition to unit tests, all code is required to be reviewed by someone else before it may be pulled into the dev branch. Then after general functionality testing has been complete and the code is deemed acceptable it may be then pulled to main.

# __How to Contribute__
 To integrate your Game into this platform. You need to add `frontend` part of your code to `client` folder and `backend` part of your code to `server` folder.  
## __Build Your Game's Front End__
Your game will certainly will have a frontend part to it. 

__The information about how to add your frontend to this project is [here](https://github.com/PlaThyme/PlaThyme/tree/Dev/client/README.md).__

## __Build Your Game’s Back End__
If your game is multiplayer, or requires a server to make decisions, keep score, relay messages between players, etc, you’ll need to build out a back end. For ease of game creation, we’ve made a class that your game can extend which you can use to encapsulate your game’s needs, as well as keeping our own server code clean. So I’ll cover all the changes each game must put in, and then I’ll cover the functionality of the __Game__ class.

__A step by step guide to build Backend is provided [here](https://github.com/PlaThyme/PlaThyme/tree/Dev/server/README.md).__

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

