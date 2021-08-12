# PlaThyme FrontEnd

* This `README` provides information about `file structure of frontend client folder`, `how to add you game Front End` to this project when you contribute to this Repo, `Discription of Games` and some `additional notes and Rules`.

# How to add your Game Frontend to this Project.

__To integrate new game in this project. Follow these steps.__

1. Create New Folder with your `Game_Name` in `Games` folder. *All game logic goes here. make sure this returns the game component to be displayed in GameRoom.*

2. Import your Game component in `App.js`.

3. Add the Game Info in `listofGames` Dictionary present in `App.js`.

4. Call your Game component inside `renderGame` switch case, present in `App.js`.

# Additional Note, to keep the code clean.

1. Place all `assets` related to your game within the `Game Folder` you created inside `client/Games` 
2. Keep the `CSS` files (if any) within the Game folder you created. *Do Not add your game CSS inside `app.css` or `index.css` or any other file*. PlaThyme uses `Tailwind` CSS framework you can use it if you want.
2. Add documentation to your code, remove unessisary code lines, un-used code or commented code.
