# Deployed URL
https://plathyme.herokuapp.com/

# Team Names
* Sree Vandana Nadipalli
* Zachariah Santangelo
* Michael Fulton

# PlaThyme
It is a multiplayer web game hosting site. We are aiming to create a website where users can select a game, create a private room and start playing games. The site shall be able to host open source games created by other contributors. 

# Why PlaThyme
Remote working made many of us start playing online games with our collegues or friends. We observed for different games we use different sites. We wanted to create a single site that can host multiple multiplayer games. So we are developing a Website that makes it easy for other developers to contribute and easily integrate their games into this project.

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
  3 __Slapjack__

# Description of Games

Description of each game can be found [here](https://github.com/PlaThyme/PlaThyme/tree/main/client/README.md)

# How to set up your environment and run tests

## Set-Up Environment

## Testing Strategy
Unit tests have been created for the back end code. More should continue to be made as code is created. Ideally, front end unit tests should be created too, but due to time constraints haven't been made yet. Unit tests for any game back end is required due to the potential for crashing the server. We're using Mocha for the unit testing framework, and Chai for the assert library.

In addition to unit tests, all code is required to be reviewed by someone else before it may be pulled into the dev branch. Then after general functionality testing has been complete and the code is deemed acceptable it may be then pulled to main.

# How to Contribute
 To integrate your Game into this platform. You need to add `frontend` part of your code to `client` folder and `backend` part of your code to `server` folder. 

 Detailed instructions of how to `contribute your code`, `How to file a bug report` and `How to suggest a new feature` can be found [here](https://github.com/PlaThyme/PlaThyme/blob/main/CONTRIBUTING.md)

# Where can I get more help, if I need it?

Primary goal of `PlaThyme` is to be inclusive to the largest number of contributors, with the most varied and diverse backgrounds possible.
We are trying to create a safe and friendly community where you can share your thoughts freely. 

If you need more help, we highly encorage you to post your question or concern in [`Discussions`](https://github.com/PlaThyme/PlaThyme/discussions)

you can also send email to <plathymegames@gmail.com>

 # Code of Conduct

This project and everyone participating in it is governed by PlaThyme [Code of Conduct](https://github.com/PlaThyme/PlaThyme/blob/main/CODE_OF_CONDUCT.md). All contributors are required to follow it.

# Licence

[MIT Licence](https://github.com/PlaThyme/PlaThyme/blob/main/LICENSE)

