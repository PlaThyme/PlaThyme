# U-Know Card game
This is similar to the Mattel game UNO™. This is a 2 player game. The UI is failrly intutive to understand. There is a `Draw Card` button which is used to draw a random card and there is `UNO` button which you need to press when you which to say it. you will be able to watch what cards you got and not the other player crads.

# UI
![game-interface](https://github.com/Sree-Vandana/PlaThyme/blob/main/client/src/images/UKnowGameUI.png)

# Game Rules
1. Each player will be randomly distributed 7 cards. Any each player will get alternate turns to drop one or more cards. current player dropping the card, need to match either the number or the colour of the card.
2. If you dont have a matching card, you need to draw a new card.
3. How to use +4 and +2 cards:
    * if you drop the +4 card the other players deck will be populated with additional 4 cards. (you get to choose the colour you want to continue).
    * if you drop the +2 card (of any colour), the other players deck will be populated with additional 2 cards. (what ever +2 card colour is, will be continued).
  *After dropping these cards ythe player dropping that card will get next turn.*
4. Wild Card (a card which has 4 colours on it), will help the player to switch to their desired colour, in upcoming turn.
5. when the player have 2 cards left, before dropping a card, press `UNO` button, else the player will be get a penality (2 more additional card will be added to the players deck, whoc misses it)
6. The first player with 0 cards will be the winner.

# Sources and Thanks to
1. https://github.com/mizanxali/uno-online (Mizan Ali, thank you for letting us use and modify the code).
2. https://alexder.itch.io/uno-card-game-asset-pack (Alex Der, thank you for card assets).
3. https://codepen.io/3mil1/details/eYYQbwb (Buttons Design, License info inside link).
4. Sounds from [mixkit](https://mixkit.co/) and its [License Info here](https://mixkit.co/license/#sfxFree)
    * [bell sounds](https://mixkit.co/free-sound-effects/bell/) (for draw2Cards, 4 cards, gameover and skip) : 
    * [magic notification](https://mixkit.co/free-sound-effects/magic/  ) (for wlid card)
    * [paper](https://mixkit.co/free-sound-effects/paper/) (for card shuffle)
    * [back ground music](https://mixkit.co/free-sound-effects/music/)
