# PlaThyme FrontEnd

* This `README` provides information about how to add you `game *Front End*` to this project when you contribute to this Repo and some additional notes and Rules.

## How to add your Game Frontend to this Project.

__To integrate new game in this project. Follow these steps.__

1. Create New Folder with your `Game Name` in `Games` folder. *All game logic goes here. make sure this returns the game component to be displayed in GameRoom.*

2. Add the Game Info in `listofGames` Dictionary present in `App.js`.

3. Import your Game component in `App.js`.

4. Add your Game component as a child component to `<GameRoom />` along with remaining games with an `if condition`. *(like, if user selected you game, provide your game component)*

## Additional Note, to keep the code clean.

1. Keep the `CSS` files within the Game folder you created. *Do Not add your game CSS inside `app.css` or `index.css` or any other file* 
2. Add documentation to your code, remove unessisary code lines, un-used code or commented code.