# Deployed URL
https://plathyme.herokuapp.com/

# Team Names
* Sree Vandana Nadipalli
* Zachariah Santangelo
* Michael Fulton

# PlaThyme
It is a multiplayer web game hosting site. We are aiming to create a website where users can select a game from the list of games (currently 3 games) and create a private room and start playing the game. The site will be able to host open source games created by other contributors ([learn how to integrate your game into Plathyme](https://github.com/PlaThyme/PlaThyme/blob/main/CONTRIBUTING.md)). 

# Why PlaThyme
Remote working made many of us start playing online games with our colleagues or friends. We observed for different games we use different sites. We wanted to create a single site that can host multiple multiplayer games. So we are developing a Website that makes it easy for other developers to contribute and easily integrate their games into this project.

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
* Repository creation, basic project structure and initial commit  __DONE__
* Landing page and game selection menu / lobby + Private Room & game container. __DONE__
* set up a server and client communications (Server API, Socket.io implementation) __DONE__
* create private rooms and play multiplayer game __DONE__
* first game creation: [__Draw the Word__](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/DrawTheWord) __DONE__
* Additional game ideas: 
  1. __[Enigma Breaker](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/EnigmaBreaker) -- DONE__
  2. __Slapjack__

  3. __[U-Know It](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/UKnowIt) -- DONE__
  4. __Synchronize__ A game about crazy comparisons and clever references.
* Future Features
  * Dynamic URLs for sharable game rooms.
  * User created room codes.

# Games in PlaThyme

## [Draw the Word](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/DrawTheWord)

![DeawTheWord Game](https://github.com/PlaThyme/PlaThyme/blob/main/client/src/images/drawing.gif)

## [Enigma Breaker](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/EnigmaBreaker)

![Enigma Breaker Game](https://github.com/PlaThyme/PlaThyme/blob/main/client/src/images/notfound.gif)

## [U-Know It](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/UKnowIt)

![U-Know It](https://github.com/PlaThyme/PlaThyme/blob/Dev/client/src/images/UKnowIt.gif)

# How to set up your environment and run tests

## Set-Up Environment
To install and run locally, follow these steps:
* Clone the repository locally. *(You need to have node, and NPM installed)*
```
    git clone https://github.com/PlaThyme/PlaThyme.git
```
* From a terminal, `cd` into root of the repository and do this *(both in client, and the server folder)*
```
    cd server
    npm install
```
```
    cd ..
    cd client
    npm install
 ```
* you can start running it locally in 2 ways.

  __a. From the base directory run the following command and the website should be available from `localhost:3001`__
     ```
     npm run buildnrun
     ```
    *In the package.json there are additional scripts for starting with different options.*

  __b. Another way is to run the following commands from root folder.__
  
    *(To start the server, listens at 3001)*
    ```
      cd server
      nodemon index.js
    ```
     *(To start react frontend, open localhost:3000)*
    ```
      cd client
      npm run
    ```
 
* To run unit tests, make sure you have `mocha` installed in the `server` directory. Then from there run 
```
  npm run test
```

## Testing Strategy
`Unit tests` have been created for the `back end` code. More should continue to be made as code is created. Ideally, front end unit tests should be created too, but due to time constraints haven't been made yet. We're using Mocha for the unit testing framework, and Chai for the assert library.

In addition to unit tests, all code is required to be reviewed by someone else before it may be pulled into the dev branch. Then after general functionality testing has been complete and the code is deemed acceptable it may be then pulled to main.

# How to Contribute
 To integrate your Game into this platform. You need to add `frontend` part of your code to `client` folder and `backend` part of your code to `server` folder. 

 Detailed instructions of how to `contribute your code`, `How to file a bug report` and `How to suggest a new feature` can be found [here](https://github.com/PlaThyme/PlaThyme/blob/main/CONTRIBUTING.md)

# Where can I get more help, if I need it?

Primary goal of `PlaThyme` is to be inclusive to the largest number of contributors, with the most varied and diverse backgrounds possible.
We are trying to create a safe and friendly community where you can share your thoughts freely. 

If you need more help, we highly encourage you to post your question or concern in [`Discussions`](https://github.com/PlaThyme/PlaThyme/discussions)

you can also send email to <plathymegames@gmail.com>

# Code of Conduct

This project and everyone participating in it is governed by PlaThyme [Code of Conduct](https://github.com/PlaThyme/PlaThyme/blob/main/CODE_OF_CONDUCT.md). All contributors are required to follow it.

# Work Summary
Who did what? Here's a list of things each of us worked on:
## Michael Fulton
* Built server back end for the website 
  * Made base server routing, socket creation and base events: Including, but not limited to the creation of communication channels, and managing of data for game rooms. Creating game objects and designing layout for front - back end communications.
  * Built Game API: Designed game object for each game to extend along with its base methods. So each game when made past the first one would have an easy interface with the front ends using socket.io, and keeping the index.js file clean of game specific code.
* Built the game room components, along with the player tracker, score tracker, and chat room, both front and back end for these parts.
* Draw The Word: Built out the majority of the back end / event structure for the game, as well as the front end logic to sync the events with the back end across clients. Also built the scoring / chat detection components. Made unit tests for back end events.
* Enigma Breaker: Built the entire game from scratch, both front end and back end. The one exception is the CSS for the graph paper which was created by a friend, Ken. Did get some troubleshooting and playtesting help from some of my co-workers, as described in the game's readme. The game is inspired by illeo's Decrypto, but none of their assets, materials, or terminology were used in its creation.
* Documentation: Helped write the base readme. Created the documentation for how to build a game's back end and integrate it into our project.
* Testing:
  * Created the unit testing structure as well as the actual tests in the server folder.
  * Performed extensive playtesting of EnigmaBreaker, and the Draw The Word game, as well as the landing page. This assisted in creating many of the issues found in the tracker, as real user experience, and feedback was taken to inform decisions.
* Deployment: Handled prepping the project for deploying, as well as actually did the deploying to Heroku.


## Zach Santangelo
* Contributed Random word selection logic for draw the word and the Status message functionality. 
* Made carousel component for game selection screen.
* Added draggable/animated deck of cards to project for slapjack and any other card game that use a standard deck. 

## Sree Vandana Nadipalli
* Modified the README and set up the git repo as per the [open source guide](https://opensource.guide/starting-a-project/) (opened discussions tab, contributing guidelines, and Code of Conduct. Added template for issues, bug report and new feature request). 
* created the `New Game`, `Join Game` form and `game drop down` on landing page.
* Created the White Board, colour pallet, and other tools for canvas and created grid structure for `Draw The Word` game for the placement of timer, word selected and canvas, along with socket events that transfer data of what the user draws on canvas to other players and added score handling based on word difficulty in the backend.
* Added waiting room feature. Game wont start till all players (minimum required players) join the room.
* Integrated `Mattle UNO` game into PlaThyme. Modified the code which I got from [here](https://github.com/mizanxali/uno-online) to correctly fit into this platform and fixed few bugs. (Also contacted the owner of the [repo which conatins code](https://github.com/mizanxali/uno-online) and developer of [game assets](https://alexder.itch.io/uno-card-game-asset-pack) to confirm that I could use their content in PlaThyme).
* Periodically worked on and helped with code cleaning, code documentations and refactoring.

# Acknowledgement
* Thank you [`Bart Massey`](https://github.com/BartMassey) for teaching us about Open Source. We enjoyed developing this project. 

* Each game in this platform is developed using help and support from different sources and we thank them for it. Each source used in a game is mentioned in the README of that game folder. ([Enigma Breaker](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/EnigmaBreaker), [U-Know It](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/UKnowIt), [Draw the Word](https://github.com/PlaThyme/PlaThyme/tree/main/client/src/Games/DrawTheWord)).

# Licence

[MIT Licence](https://github.com/PlaThyme/PlaThyme/blob/main/LICENSE)
