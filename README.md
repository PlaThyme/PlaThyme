# Team Names
* Sree Vandana Nadipalli
* Zachariah Santangelo
* Michael Fulton

# PlaThyme
It is a multiplayer web game hosting site. We are aiming to create a website where users can select a game, create a private room and start playing games. The site shall be able to host open source games created by contributors. Initially we are aiming on making 3 games, each with each of the games being created individually by each of the initial contributors.

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
* able to set a server and client communications
* create private rooms and play multiplayer game

# Project Roadmap
* Repository creation and initial commit -- Done
* Landing page and game selection menu / lobby + Private Room & game container.
* Server API, Socket.io implementation.
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
