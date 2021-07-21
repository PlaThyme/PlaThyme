const Game = require("./Game");
class DrawTheWord extends Game {
  constructor(roomCode, socket, io, players, minPlayers) {
    super(roomCode, socket, io, players, minPlayers);
    this.turnOrder = players;
    this.minPlayers = minPlayers;
    this.selectedWord = null;
    this.selectedWordLength = 0;
    this.turnStarted = false;
    this.gameStarted = false;
    this.scores = {};
    this.scores[this.turnOrder[0]] = 0;
    this.selectedWordDifficulty = null;
    this.handleEndOfTurn();
    this.scoreValues = { easyPoint: 100, mediumPoint: 200, hardPoint: 300 };
  }

  recieveData(data) {
    if (data.event === "canvas-data") {
      super.sendGameData(data);
    }
    if (data.event === "clear-canvas-data") {
      super.sendGameData(data);
    }
    if (data.event === "end-turn") {
      this.handleEndOfTurn();
    }
    if (data.event === "word-selection") {
      this.selectedWord = data.word;
      this.selectedWordLength = data.wordLength;
      this.selectedWordDifficulty = data.wordDifficulty;
      super.sendGameData({ event: "begin-round", timer: data.timer });
      super.sendGameData({
        event: "show-blank-word",
        wordLength: this.selectedWordLength,
      });
      this.turnStarted = true;
    }
    if (data.event === "time-out") {
      super.sendChat({
        sender: "Score Keeper",
        text: "No one got it correct, time ran out!",
      });
      this.handleEndOfTurn();
    }
  }

  startGame() {
    // console.log("inside startgame method --> ", this.players, this.players.length, this.minPlayers);
    super.sendGameData({ event: "start-game" });
    this.gameStarted = true;
    //Send a request for the current player to select their word.
    if (this.turnOrder.length === this.minPlayers) {
      let words = this.generateWords();
      const theirTurn = { event: "your-turn", words };
      super.sendDataToPlayer(this.turnOrder[0], theirTurn);
    }
    if (this.gameStarted === true && this.turnOrder.length > this.minPlayers) {
      super.sendGameData({
        event: "show-blank-word",
        wordLength: this.selectedWordLength,
      });
    }
  }

  newPlayer(playerName) {
    if (playerName) {
      this.turnOrder.push(playerName);
      this.scores[playerName] = 0;
    }
  }

  disconnection(playerName) {
    if (playerName === this.turnOrder[0]) {
      //Do something about current player disconnection.
      this.turnStarted = false;
      if (this.turnOrder.length === 1) {
        this.turnOrder = this.turnOrder.filter(
          (player) => player !== playerName
        );
        return;
      }
      this.advanceTurnOrder();
    }

    //Remove from turnorder, reset score.
    this.turnOrder = this.turnOrder.filter((player) => player !== playerName);
    this.scores[playerName] = 0;

    //Start a new turn
    super.sendGameData({ event: "new-turn" });

    //Send a request for the current player to select their word.
    let words = this.generateWords();
    const theirTurn = { event: "your-turn", words };
    super.sendDataToPlayer(this.turnOrder[0], theirTurn);
  }

  advanceTurnOrder() {
    const lastPlayer = this.turnOrder.shift();
    this.turnOrder.push(lastPlayer);
  }

  handleEndOfTurn() {
    this.turnStarted = false;
    this.advanceTurnOrder();
    super.sendGameData({ event: "new-turn" });
    // super.sendChat({
    //   sender: "GameKeeper",
    //   text: `${this.turnOrder[0]}'s turn.`,
    // });
    let words = this.generateWords(); //three words plz.
    const theirTurn = { event: "your-turn", words };
    super.sendDataToPlayer(this.turnOrder[0], theirTurn);
  }

  chatMessage(messageData) {
    if (messageData.sender !== this.turnOrder[0]) {
      if (this.turnStarted) {
        if (this.selectedWord !== null) {
          const splitWords = messageData.text.split(" ");
          splitWords.forEach((word) => {
            if (word.toLowerCase() === this.selectedWord.toLowerCase()) {
              let pts;
              if (this.selectedWordDifficulty === "easy") {
                pts = this.scoreValues["easyPoint"];
              }
              if (this.selectedWordDifficulty === "medium") {
                pts = this.scoreValues["mediumPoint"];
              }
              if (this.selectedWordDifficulty === "hard") {
                pts = this.scoreValues["hardPoint"];
              }
              this.scores[messageData.sender] =
                this.scores[messageData.sender] + pts;
              super.sendChat({
                sender: "Score Keeper",
                text: `${messageData.sender} wins! +${pts} points`,
              });
              super.updatePlayerScore(messageData.sender, this.scores[messageData.sender]);
              this.handleEndOfTurn();
            }
          });
        }
      }
    }
  }
  generateWords() {
    const easywords = ["cheese", "bone", "socks", "leaf", "whale", "pie", "shirt", "orange", "lollipop", "bed", "mouth", "person", "horse", "snake", "jar", "spoon", "lamp", "kite", "monkey", "swing", "cloud", "snowman", "baby", "eyes", "pen", "giraffe", "grapes", "book", "ocean", "star", "cupcake", "cow", "lips", "worm", "sun", "basketball", "hat", "bus", "chair", "purse", "head", "spider", "shoe", "ghost", "coat", "chicken", "heart", "jellyfish", "tree", "seashell", "duck", "bracelet", "grass", "jacket", "slide", "doll", "spider", "clock", "cup", "bridge", "apple", "balloon", "drum", "ears", "egg", "bread", "nose", "house", "beach", "airplane", "inchworm", "hippo", "light", "turtle", "ball", "carrot", "cherry", "ice", "pencil", "circle", "bed", "ant", "girl", "glasses", "flower", "mouse", "banana", "alligator", "bell", "robot", "smile", "bike", "rocket", "dinosaur", "dog", "bunny", "cookie", "bowl", "apple", "door"]
    const mediumwords = ["horse", "door", "song", "trip", "backbone", "bomb", "round", "treasure", "garbage", "park", "whistle", "palace", "baseball", "coal", "queen", "dominoes", "photograph", "computer", "hockey", "aircraft", "pepper", "key", "iPad", "whisk", "cake", "circus", "battery", "mailman", "cowboy", "password", "bicycle", "skate", "electricity", "lightsaber", "nature", "shallow", "toast", "outside", "America", "roller", "blading", "gingerbread", "man", "bowtie", "light", "bulb", "platypus", "music", "sailboat", "popsicle", "knee", "pineapple", "tusk", "sprinkler", "money", "spool", "lighthouse", "doormat", "face", "flute", "owl", "gate", "suitcase", "bathroom", "scale", "peach", "newspaper", "watering", "can", "hook", "school", "beaver", "camera", "hair", "dryer", "mushroom", "quilt", "chalk", "dollar", "soda", "chin", "swing", "garden", "ticket", "boot", "cello", "rain", "clam", "pelican", "stingray", "nail", "sheep", "stoplight", "coconut", "crib", "hippopotamus", "ring", "video", "camera", "snowflake"]
    const hardwords = ["clog", "chestnut", "commercial", "Atlantis", "mine", "comfy", "ironic", "implode", "lie", "philosopher", "hang", "vision", "dorsal", "hail", "upgrade", "peasant", "stout", "yolk", "car", "important", "retail", "laser", "crisp", "overture", "blacksmith", "ditch", "exercise", "mime", "pastry", "kilogram", "ligament", "stowaway", "opaque", "drought", "shrew", "tinting", "mooch", "lyrics", "neutron", "stockholder", "flotsam", "cartography", "ice fishing", "eureka", "darkness", "dripping", "wobble", "brunette", "rubber", "tutor", "migrate", "myth", "psychologist", "quarantine", "slump", "landfill", "diagonal", "inquisition", "husband", "ten", "exponential", "neighborhood", "jazz", "catalog", "gallop", "snag", "acre", "protestant", "random", "twang", "flutter", "fireside", "clue", "figment", "ringleader", "parody", "jungle", "armada", "mirror", "newsletter", "sauce", "observatory", "password", "century", "bookend", "drawback", "fabric", "siesta", "aristocrat", "addendum", "rainwater", "barber", "scream", "glitter", "archaeologist", "loiterer", "positive", "dizzy", "czar", "hydrogen"]
    const randint = Math.floor(Math.random() * easywords.length);
    const randint2 = Math.floor(Math.random() * mediumwords.length);
    const randint3 = Math.floor(Math.random() * hardwords.length);
    let randomWords = [
      easywords[randint],
      mediumwords[randint2],
      hardwords[randint3],
    ];
    easywords.splice(randint);
    mediumwords.splice(randint2);
    hardwords.splice(randint3);
    return randomWords;
  }
}

module.exports = DrawTheWord;
