import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "./EnigmaBreakerStyle.css";
import print1 from "./audio/print1.mp3";
import print2 from "./audio/print2.mp3";
import print3 from "./audio/print3.mp3";
import print4 from "./audio/print4.mp3";
import print5 from "./audio/print5.mp3";
import print6 from "./audio/print6.mp3";
import print7 from "./audio/print7.mp3";
import print8 from "./audio/print8.mp3";
import NumberSelector from "./NumberSelector";
import {
  QuestionMarkCircleIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";

const EnigmaBreaker = ({ socket, playerName }) => {
  //Used to track current state of the game.
  const [currentRound, setCurrentRound] = useState(0);
  //Ref is for event handler in use effect blocks.
  const currentRoundRef = useRef(currentRound);
  
  //Tracks game state. Information on that follows
  const [gameState, setGameState] = useState(0);
  //Ref is for event handler in use effect blocks.
  const gameStateRef = useRef(gameState);
  // Game flow:
  // #0 : pre game, waiting for players
  // #1 : code sent out, waiting for both teams hints to be submitted
  // #2 : one team hints submitted, waiting for other
  // #3 : all hints submitted, waiting for both teams to guess
  // #4 : one teams guess recieved waiting other
  // #5 : both teams guess recieved, results presented
  // check for win, if win return to 1, else
  // #6 : game is over present results offer new game.

  //Coder indicates if this client is the active player.
  const [coder, setCoder] = useState(false);
  const coderRef = useRef(coder);

  //Emojis... really?
  const miss = "☠️";
  const hit = "💾";
  //Character maximum for hints.
  const MAXHINTWIDTH = 46;

  //Controls the three digit code indicator
  const [secretCode, setSecretCode] = useState(["?", "?", "?"]);
  const [buttonMessage, setButtonMessage] = useState("Wait For Players");

  //Current score display.
  const [blueScore, setBlueScore] = useState([0, 0]);
  const [redScore, setRedScore] = useState([0, 0]);

  //Your teams secret words.
  const [words, setWords] = useState(["", "", "", ""]);
  //Current hints to be displayed.
  const [hints, setHints] = useState(["", "", "", "", "", ""]);

  //Array of hint history. Used for dot-matrix-printer
  const [history, setHistory] = useState({ redHistory: [], blueHistory: [] });

  //Var keeping track if hints have been submitted yet.
  const [submitted, setSubmitted] = useState(false);

  //This sets the confirm button between active, and inactive CSS formatting, and function.
  const [activeConfirm, setActiveConfirm] = useState(false);

  //This controls status messages
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for more players to join. A minimum of 2 per team are needed."
  );

  //There might be a better way to handle these, but this is for the guess selector
  const [redOne, setRedOne] = useState("-");
  const [redTwo, setRedTwo] = useState("-");
  const [redThree, setRedThree] = useState("-");
  const [blueOne, setBlueOne] = useState("-");
  const [blueTwo, setBlueTwo] = useState("-");
  const [blueThree, setBlueThree] = useState("-");

  //Dispaly guesses when your team has finalzed them.
  const [showGuesses, setShowGuesses] = useState(false);

  //Hold, update team chat message
  const [teamChat, setTeamChat] = useState("Waiting comms...");

  //These will show your guesses, and the results in the middle of the hints and guess portion of the screen.
  const [actualNums, setActualNums] = useState(["?", "?", "?", "?", "?", "?"]);
  const [guessResults, setGuessResults] = useState(["", "", "", "", "", ""]);
  const [guesses, setGuesses] = useState([[],[]]);

  //This simply controls the join team modal.
  const [isOpen, setIsOpen] = useState(false);

  //This keeps track of what team you're on locally.
  const [myTeam, setMyTeam] = useState("");
  const myTeamRef = useRef(myTeam);

  //Controls sound, default is off.
  const [soundToggle, SetSoundToggle] = useState(false);

  //Refs are for input boxes. Chat, and hints.
  const r1HintRef = useRef();
  const r2HintRef = useRef();
  const r3HintRef = useRef();
  const b1HintRef = useRef();
  const b2HintRef = useRef();
  const b3HintRef = useRef();
  const chatRef = useRef();


  //Initializes references, so they can be used inside event handlers.
  useEffect(() => {
    coderRef.current = coder;
    currentRoundRef.current = currentRound;
    myTeamRef.current = myTeam;
    gameStateRef.current = gameState;
  })

  //These are all the socket events.
  useEffect(() => {

    //Update-game events are ones that are sent to all clients in room.
    socket.on(
      "update-game",
      (data) => {
        //Updates actual secret code numbers
        if (data.event === "updateActuals") {
          setActualNums(data.nums);
          return;
        }
        //This event enables the game to start. When each team has 2 players, this should have been sent.
        if (data.event === "allow-start") {
          setButtonMessage("START GAME");
          setActiveConfirm(true);
          setStatusMessage(
            "Minimum Players Reached. You can now start the game."
          );
          return;
        }
        //This is a notification that the game has been started.
        if (data.event === "start-game") {
          setActualNums(["?", "?", "?", "?", "?", "?"]);
          setButtonMessage("Inactive");
          setActiveConfirm(false);
          setGameState(data.state);
          return;
        }

        //This triggers a new turn. Resets much of the UI
        if (data.event === "new-turn") {
          handleNewTurn(data);
          return;
        }

        //This indicates that red team has submitted their hints.
        if (data.event === "red-hints-in") {
          setStatusMessage(
            "Red has encoded their transmission. Waiting on Blue Encoder to complete encryption."
          );
          return;
        }
        //This indicates that blue team has submitted their hints.
        if (data.event === "blue-hints-in") {
          setStatusMessage(
            "Blue has encoded their transmission. Waiting on Red Encoder to complete encryption."
          );
          return;
        }

        //This indicates that players are waiting for red to submit their guesses.
        if (data.event === "wait-red-guess") {
          setGameState(data.state);
          if (myTeamRef.current === "blue") {
            setActiveConfirm(false);
            setButtonMessage("Please Wait");
          }
          setStatusMessage(
            "Blue team has decoded the transmission... Waiting for red team to finalize their decryption"
          );
          return;
        }
        //This indicates that players are waiting for blue to submit their guesses.
        if (data.event === "wait-blue-guess") {
          setGameState(data.state);
          if (myTeamRef.current === "red") {
            setActiveConfirm(false);
            setButtonMessage("Please Wait");
          }
          setStatusMessage(
            "Red team has decoded the transmission... Waiting for blue team to finalize their decryption"
          );
          return;
        }

        //This indicates that its time for both teams to decrypt the secret codes.
        if (data.event === "decryption") {
          setActiveConfirm(false);
          handleDecryption(data);
          return;
        }

        //This event occurs when red team drops below 2 players.
        if (data.event === "red-needs-players") {
          setStatusMessage(
            "Red team no longer has enough players. Hire more agents."
          );
          return;
        }
        //This event occurs when blue team drops below 2 players.
        if (data.event === "blue-needs-players") {
          setStatusMessage(
            "Blue team no longer has enough players. Hire more agents."
          );
          return;
        }

        //This event contains score data, and ends the round.
        if (data.event === "score-result") {
          handleScoreResult(data);
        }

        //Game has ended, final score and winner is indicated.
        if (data.event === "game-over") {
          handleGameOver(data);
          return;
        }
        //Essentially resets the game back to the initial state. People will need to re-join teams.
        if (data.event === "reset-game") {
          handleResetGame();
        }
      }
    );

    //These events are player specific, and haven't been sent to other clients.
    socket.on("update-game-player", (data) => {

      //This event is the data / inforation for when joining a team. Contains all current game state info too.
      if (data.event === "team-info") {
        setMyTeam(data.team);
        setIsOpen(false);
        setRedOne(data.selections[0]);
        setRedTwo(data.selections[1]);
        setRedThree(data.selections[2]);
        setBlueOne(data.selections[3]);
        setBlueTwo(data.selections[4]);
        setBlueThree(data.selections[5]);
        setWords(data.wordList);

        //The following conditional statements set the UI to match the current game state / phase.
        if (data.gameState > 2) {
          setHints([data.redHints, data.blueHints]);
        }
        //State 1 and 2 indiates that they need to wait.
        if (data.gameState === 1 || data.gameState === 2) {
          setStatusMessage("Waiting on encoders to encrypt their secret code.");
          setActiveConfirm(false);
          setButtonMessage("Inactive");
        }
        //State 3 is time to guess on the hints.
        if (data.gameState === 3) {
          setActiveConfirm(true);
          setButtonMessage("Submit");
          setStatusMessage(
            "Transmission received. Agents, decode the secret messages above."
          );
        }
        //State 4 is the same as 3, but depending on the team sets wait, or indicates that they need to decode/guess
        if (data.gameState === 4) {
          if (data.wait) {
            setActiveConfirm(false);
            setGuesses(guesses);
            setButtonMessage("Inactive");
            setStatusMessage(
              "Waiting on other team to decrypt their transmissions."
            );
          } else {
            setActiveConfirm(true);
            setButtonMessage("Submit");
            setStatusMessage(
              "Waiting on your team to decrypt the secret messages above."
            );
          }
        }

        //State 5 is end of round.
        if (data.gameState === 5) {
          setActiveConfirm(true);
          setButtonMessage("Next Round");
          setStatusMessage("Ready to start next round");
        }

        //State 6 is the game has ended. Start new game
        if (data.gameState === 6) {
          setActiveConfirm(true);
          setButtonMessage("NEW GAME");
          setStatusMessage("Game Over... Start a new game?");
        }

        //Sets final UI elements to match game state sent in the data json
        setCurrentRound(data.currentRound);
        setHistory({
          redHistory: data.redHistory,
          blueHistory: data.blueHistory,
        });
        setRedScore(data.redScore);
        setBlueScore(data.blueScore);
        setGameState(data.gameState);
      }

      //This event updates player selections.
      if (data.event === "selections") {
        setRedOne(data.selections[0]);
        setRedTwo(data.selections[1]);
        setRedThree(data.selections[2]);
        setBlueOne(data.selections[3]);
        setBlueTwo(data.selections[4]);
        setBlueThree(data.selections[5]);
      }

      //Team chat received.
      if (data.event === "team-chat") {
        setTeamChat(data.message);
      }

      //This event indicates that they are the encoder. Sets UI to support this.
      if (data.event === "your-turn") {
        setCoder(true);
        setSecretCode(data.code);
        setActiveConfirm(true);
        setSubmitted(false);
        setActualNums(["?", "?", "?", "?", "?", "?"]);
        setStatusMessage(
          "Secret code received. Encode the numbers by creating secret messages which match the words up top for your team to guess"
        );
        setButtonMessage("./SUBMIT");
      }

      //This event populates a teams guesses.
      if (data.event === "guess-data") {
        setShowGuesses(true);
        setGuessResults(data.guess);
        if(myTeamRef.current === "red"){
          setGuesses([data.guess,["-","-","-","-","-","-"]]);
        } else {
          setGuesses([["-","-","-","-","-","-"],data.guess]);
        }
      }
    });

    //This event handles decryption starting. References are used, as state variables will be stale.
    const handleDecryption = (data) => {
      setGameState(data.state);
      setHints([data.redHints, data.blueHints]);
      if (coderRef.current) {
        setActiveConfirm(false);
        setButtonMessage("Inactive");
        if (currentRoundRef.current === 0) {
          setStatusMessage(
            "Hint sumbmitted. Round 1 no information on other team yet... Cannot assist in breaking their code."
          );
        } else {
          setStatusMessage(
            "Transmission received. Assist agents in breaking enemy code."
          );
        }
      } else {
        setActiveConfirm(true);
        setButtonMessage("./SUBMIT");
        setStatusMessage(
          "Transmission received. Agents, decode the secret messages above. Match the hints, to the words above."
        );
      }
      return;
    };
  }, [socket]);
  
  //Join team modal functionality
  useEffect(() => {
    if (myTeamRef.current === "") {
      setIsOpen(true);
    }
  }, [myTeam]);


  //When the round hits 5, print history.
  useEffect(() => {
    if (gameStateRef.current === 5 || gameStateRef.current === 6) {
      if (myTeam === "red") {
        printHst(history.redHistory, "redType", false);
      }
      if (myTeam === "blue") {
        printHst(history.blueHistory, "blueType", false);
      }
    }
  }, [gameState]);
  
  //Score data requires transcription into a readable message. This function produces it, and returns the human readable scores.
  const parseScores = (data) => {
    let rs = "";
    let bs = "";
    if (data.score[0] === 0 && data.score[1] === 0) {
      rs = "Only decoded their message.";
    } else {
      if (data.score[0]) {
        rs += hit + "Broke the other teams encryption!";
      }
      if (data.score[1]) {
        rs += miss + "Failed to decode their own message.";
      }
    }
    if (data.score[2] === 0 && data.score[3] === 0) {
      bs = "Only decoded their message.";
    } else {
      if (data.score[2]) {
        bs += hit + "Broke the other teams encryption!";
      }
      if (data.score[3]) {
        bs += miss + "Failed to decode their own message.";
      }
    }
    return [rs, bs];
  };

  //This sets all of the game state information back to its default, and prints out a new game indication.
  const handleResetGame = () => {
    setButtonMessage("Wait For Players");
    setActiveConfirm(false);
    setRedScore([0, 0]);
    setBlueScore([0, 0]);
    setShowGuesses(false);
    setHistory({ redHistory: [], blueHistory: [] });
    setGameState(0);
    setCurrentRound(0);
    setRedOne("-");
    setRedTwo("-");
    setRedThree("-");
    setBlueOne("-");
    setBlueTwo("-");
    setBlueThree("-");
    setMyTeam("");
    setCoder(false);
    setActualNums(["?", "?", "?", "?", "?", "?"]);
    setIsOpen(true);
    setStatusMessage(
      "Waiting for more players to join. A minimum of 2 per team are needed."
    );
    printHst(
      [
        [
          "<----NEW GAME---->",
          "<----NEW GAME---->",
          "<----NEW GAME---->",
          "<----NEW GAME---->",
        ],
      ],
      "blueType",
      false
    );
    printHst(
      [
        [
          "<----NEW GAME---->",
          "<----NEW GAME---->",
          "<----NEW GAME---->",
          "<----NEW GAME---->",
        ],
      ],
      "redType",
      false
    );
  };

  //This resets all the UI state variables back to the start of the turn.
  const handleNewTurn = (data) => {
    setRedOne("-");
    setRedTwo("-");
    setRedThree("-");
    setBlueOne("-");
    setBlueTwo("-");
    setBlueThree("-");
    setShowGuesses(false);
    setCoder(false);
    setSubmitted(false);
    setCurrentRound(data.round);
    setGameState(data.state);
    setActiveConfirm(false);
    setButtonMessage("Inactive");
    setStatusMessage("Waiting for secret codes to be encrypted...");
  };

  //Display final game scores, and setup game for starting a new one.
  const handleGameOver = (data) => {
    setHistory({
      redHistory: data.redHistory,
      blueHistory: data.blueHistory,
    });
    setActiveConfirm(true);
    setButtonMessage("NEW GAME");
    setRedScore(data.redScore);
    setBlueScore(data.blueScore);
    setGameState(data.state);
    const rslt = parseScores(data);
    setStatusMessage(
      `R:${rslt[0]} B:${rslt[1]} Game-over - ${
        data.winner === "tie" ? "Tie game!" : `${data.winner} team wins!`
      }`
    );
    setActualNums(data.codes);
    setGameState(data.state);
    setGuesses(data.guesses);
  };


  //This sets UI elements to the state for end of round, and prints out end of round scores.
  const handleScoreResult = (data) => {
    setHistory({
      redHistory: data.redHistory,
      blueHistory: data.blueHistory,
    });
    setActiveConfirm(true);
    setRedScore(data.redScore);
    setBlueScore(data.blueScore);
    setGameState(data.state);
    const rslt = parseScores(data);
    setStatusMessage(`Results->Red:${rslt[0]} Blue:${rslt[1]}`);
    setButtonMessage("NEXT ROUND");
    setActualNums(data.codes);
    setGameState(data.state);
    setGuesses(data.guesses);
  };

  //This calls blue history printing. Conditional allows for blank history.
  const printBlueHst = () => {
    if (history.blueHistory.length === 0) {
      printHst(
        [["404 NOT FOUND", "404 NOT FOUND", "404 NOT FOUND", "404 NOT FOUND"]],
        "blueType",
        false
      );
    } else {
      printHst(history.blueHistory, "blueType", false);
    }
  };
  //This calls red history printing. Conditional allows for blank history.
  const printRedHst = () => {
    if (history.redHistory.length === 0) {
      printHst(
        [["404 NOT FOUND", "404 NOT FOUND", "404 NOT FOUND", "404 NOT FOUND"]],
        "redType",
        false
      );
    } else {
      printHst(history.redHistory, "redType", false);
    }
  };


  //Prints history... printing variable is because this is a timed animation. Do not allow a new print event to start while one is already running.
  let printing = false;
  const printHst = (historyList, color) => {
    if (!printing) {
      printing = true;

      //Plays audio, if sound is turned on.
      if (soundToggle) {
        let audioElement;
        switch (historyList.length) {
          case 1:
            audioElement = document.getElementById("print1");
            break;
          case 2:
            audioElement = document.getElementById("print2");
            break;
          case 3:
            audioElement = document.getElementById("print3");
            break;
          case 4:
            audioElement = document.getElementById("print4");
            break;
          case 5:
            audioElement = document.getElementById("print5");
            break;
          case 6:
            audioElement = document.getElementById("print6");
            break;
          case 7:
            audioElement = document.getElementById("print7");
            break;
          case 8:
            audioElement = document.getElementById("print8");
            break;
        }
        audioElement.play();
      }

      //Nabs length of list
      let listLength = historyList.length;

      //Timeout is used to countdown between print events.
      let timeOutValue;

      //Recursive printing so the timing of each line can be maintained, and animation will by synchronized.
      //Prints one line, then uses a timeout to wait for half a second before printing the next.
      const beginPrinting = (listLength, index, color) => {
        //Checks if there are more lines to be printed.
        if (index < listLength ) {
          printLine(historyList[index], color);
          if (timeOutValue !== undefined) {
            clearTimeout(timeOutValue);
          }
          index++;
          timeOutValue = setTimeout(() => {
            beginPrinting(listLength, index, color);
          }, 500);
        } else {
          printing = false;
        }
      };
      //Start recursive printing, with index starting at zero.
      beginPrinting(listLength, 0, color);
    }
  };


  //Creates a line for the dot matrix printer sheet, and appends it to the list, before the last one. Thus pushing down the old ones.
  const printLine = (hstLine, color) => {

    //Nabs the printer, creates base elements that make up a line of printed text for history.
    const paper = document.querySelector("#printer .paper");
    const edge = document.createElement("div");
    edge.className = "edge";
    const content = document.createElement("div");
    content.className = "content" + " " + color;
    const col = document.createElement("div");
    col.className = "histColumn";
    const line = document.createElement("div");
    line.className = "line sheet1";

    //Fill the line up with the text
    const col1 = col.cloneNode();
    col1.innerText = hstLine[0];
    const col2 = col.cloneNode();
    col2.innerText = hstLine[1];
    const col3 = col.cloneNode();
    col3.innerText = hstLine[2];
    const col4 = col.cloneNode();
    col4.innerText = hstLine[3];
    const cnt = content.cloneNode();
    //Add the text to the line.
    cnt.appendChild(col1);
    cnt.appendChild(col2);
    cnt.appendChild(col3);
    cnt.appendChild(col4);
    const currentLine = line.cloneNode();
    currentLine.appendChild(edge.cloneNode());
    currentLine.appendChild(cnt);
    currentLine.appendChild(edge.cloneNode());

    //Add the line to the sheet of printer paper. Prepend so its at the top.
    paper.prepend(currentLine.cloneNode(true));

    //Remove elements that extend out of sight.
    if (paper.childElementCount > 11) {
      paper.removeChild(paper.childNodes[paper.childElementCount - 1]);
    }
  };

  //Simply sets the sound toggle.
  const toggleSound = () => {
    SetSoundToggle(!soundToggle);
  };

  //When first joining you get prompt to join a team, these send the server what you selected.
  const joinRed = () => {
    socket.emit("game-data", {
      event: "join-team",
      team: "red",
      playerName: playerName,
    });
  };

  const joinBlue = () => {
    socket.emit("game-data", {
      event: "join-team",
      team: "blue",
      playerName: playerName,
    });
  };

  const joinAny = () => {
    socket.emit("game-data", {
      event: "join-team",
      team: "any",
      playerName: playerName,
    });
  };

  //Pretty stright forward, displays the score.
  const displayScore = (score) => {
    let text = "";
    for (let i = 0; i < score[0]; i++) {
      text += hit;
    }
    for (let i = 0; i < score[1]; i++) {
      text += miss;
    }
    if(text === ""){
      text = "0";
    }
    return text;
  };

  //These control the hint selectors, and call the fucntion that emits it to the server, relays to your team.
  const updateRedOne = (num) => {
    setRedOne(num);
    updateSelections(0, num);
  };
  const updateRedTwo = (num) => {
    setRedTwo(num);
    updateSelections(1, num);
  };
  const updateRedThree = (num) => {
    setRedThree(num);
    updateSelections(2, num);
  };
  const updateBlueOne = (num) => {
    setBlueOne(num);
    updateSelections(3, num);
  };
  const updateBlueTwo = (num) => {
    setBlueTwo(num);
    updateSelections(4, num);
  };
  const updateBlueThree = (num) => {
    setBlueThree(num);
    updateSelections(5, num);
  };

  //Each time someone selects a guess button, emit the data, so everyone on your team can see it.
  const updateSelections = (index, num) => {
    if (myTeam === "red") {
      socket.emit("game-data", {
        event: "red-selections",
        index: index,
        num: num,
      });
    }
    if (myTeam === "blue") {
      socket.emit("game-data", {
        event: "blue-selections",
        index: index,
        num: num,
      });
    }
  };

  //Confirm button is multi-function, so this controls that.
  const handleConfirm = () => {
    //If the game hasn't started yet, this starts it. For example, players still joining.
    if (gameStateRef.current === 0) {
      socket.emit("game-data", { event: "begin-game" });
    }
    //If the round has ended, now its
    if (gameStateRef.current === 5) {
      socket.emit("game-data", { event: "next-round" });
    }
    if ((gameStateRef.current === 1 || gameStateRef.current === 2) && coderRef.current) {
      //Handle submitting red hints
      if (myTeam === "red") {
        //Truncate hints to the maximum width for the field.
        let truncHint1 = r1HintRef.current.value.slice(0, MAXHINTWIDTH);
        let truncHint2 = r2HintRef.current.value.slice(0, MAXHINTWIDTH);
        let truncHint3 = r3HintRef.current.value.slice(0, MAXHINTWIDTH);

        //Verify that hints are filled out
        if (truncHint1 === "" || truncHint2 === "" || truncHint3 === "") {
          setStatusMessage("You must fill out all hints before submitting.");
        } else {
          //Send hints out
          socket.emit("game-data", {
            event: "red-hints",
            hint1: truncHint1,
            hint2: truncHint2,
            hint3: truncHint3,
          });
          setSubmitted(true);
          //Deactivate the confirm button
          setActiveConfirm(false);
          setButtonMessage("inactive");
        }
      } else {
        //Handle Submitting blue hints
        //Truncate hints to the maximum width for the field.
        let truncHint1 = b1HintRef.current.value.slice(0, MAXHINTWIDTH);
        let truncHint2 = b2HintRef.current.value.slice(0, MAXHINTWIDTH);
        let truncHint3 = b3HintRef.current.value.slice(0, MAXHINTWIDTH);
        if (truncHint1 === "" || truncHint2 === "" || truncHint3 === "") {
          setStatusMessage("You must fill out all hints before submitting");
        } else {
          //Send hints out
          socket.emit("game-data", {
            event: "blue-hints",
            hint1: truncHint1,
            hint2: truncHint2,
            hint3: truncHint3,
          });
          setSubmitted(true);
          //Deactivate the confirm button
          setActiveConfirm(false);
          setButtonMessage("inactive");
        }
      }
    }

    //Submit your teams guesses
    if ((gameStateRef.current === 3 || gameStateRef.current === 4) && !coderRef.current) {
      const redGuess = new Set([redOne, redTwo, redThree]);
      const blueGuess = new Set([blueOne, blueTwo, blueThree]);
      const allguess = [redOne, redTwo, redThree, blueOne, blueTwo, blueThree];
      //There are some specific rules to submitting guesses, and this if statement handles them
      //1: Each hint must have a unique number associated with it. That's what the set creation is about. If 3 are found, then we know each hint has a different number guessed.
      //2: First round you only guess on your own teams hints. In figure rounds you need to guess on both.
      if (
        (myTeam === "blue" && currentRoundRef.current === 0 && blueGuess.size === 3) ||
        (myTeam === "red" && currentRoundRef.current === 0 && redGuess.size === 3) ||
        (redGuess.size === 3 &&
          blueGuess.size === 3 &&
          redGuess.has("-") !== true &&
          blueGuess.has("-") !== true)
      ) {
        socket.emit("game-data", {
          event: "submit-guess",
          team: myTeam,
          guess: allguess,
        });
      } else {
        setStatusMessage(
          "Error: Code Format => Every encrypted hint must have a decode selected. After round 1 you must guess on the enemy's code too. Each hint per color must have a different number."
        );
      }
    }

    //Offer to start new game
    if (gameStateRef.current === 6) {
      socket.emit("game-data", { event: "new-game" });
    }
  };

  //This just sends the private team chat. The 41 magic number is just the max length that can fit in that chat box.
  const sendChat = (e) => {
    e.preventDefault();
    if (chatRef.current.value) {
      let truncMessage = chatRef.current.value.slice(0, 60);
      socket.emit("game-data", {
        event: "team-chat",
        team: myTeam,
        message: truncMessage,
      });
      document.getElementById("teamChatBox").reset();
    }
  };

  //This is what actually renders the element.
  return (
    <div>
      <audio id="print1" src={print1} crossorigin="anonymous"></audio>
      <audio id="print2" src={print2} crossorigin="anonymous"></audio>
      <audio id="print3" src={print3} crossorigin="anonymous"></audio>
      <audio id="print4" src={print4} crossorigin="anonymous"></audio>
      <audio id="print5" src={print5} crossorigin="anonymous"></audio>
      <audio id="print6" src={print6} crossorigin="anonymous"></audio>
      <audio id="print7" src={print7} crossorigin="anonymous"></audio>
      <audio id="print8" src={print8} crossorigin="anonymous"></audio>

      <div className={`${myTeam}-screen-text float-left`}>
        <button onClick={toggleSound}>
          {soundToggle ? (
            <VolumeUpIcon className="h-10 w-10" />
          ) : (
            <VolumeOffIcon className="h-10 w-10" />
          )}
        </button>
      </div>
      <div className={`${myTeam}-screen-text float-right`}>
        <a
          href="https://github.com/dwareb/PlaThyme/blob/main/client/src/Games/EnigmaBreaker/README.md"
          target="_blank"
          className="float-left"
        >
          <QuestionMarkCircleIcon className="h-10 w-10 float-right" />
        </a>
      </div>
      <div
        className={`${
          myTeam === "red"
            ? "border-dotted border-red-700"
            : "border-dotted border-blue-700"
        } enigma-grid border-4`}
      >
        <div className="words-box">
          <div className="word-border">
            <h1
              className={`${
                myTeam === ""
                  ? "word-screen"
                  : myTeam === "red"
                  ? "red-screen"
                  : "blue-screen"
              } text-center text-2xl bg-green-900 mx-2`}
            >
              1: {words[0]}
            </h1>
          </div>
          <div className="word-border">
            <h1
              className={`${
                myTeam === ""
                  ? "word-screen"
                  : myTeam === "red"
                  ? "red-screen"
                  : "blue-screen"
              } text-center text-2xl bg-green-900 mx-2`}
            >
              2: {words[1]}
            </h1>
          </div>
          <div className="word-border">
            <h1
              className={`${
                myTeam === ""
                  ? "word-screen"
                  : myTeam === "red"
                  ? "red-screen"
                  : "blue-screen"
              } text-center text-2xl bg-green-900 mx-2`}
            >
              3: {words[2]}
            </h1>
          </div>
          <div className="word-border">
            <h1
              className={`${
                myTeam === ""
                  ? "word-screen"
                  : myTeam === "red"
                  ? "red-screen"
                  : "blue-screen"
              } text-center text-2xl bg-green-900 mx-2`}
            >
              4: {words[3]}
            </h1>
          </div>
        </div>
        <div className="input-container">
          <div className="tv-border">
            <div className="tv-bezel">
              <div className="tv-screen">
                <div className="tv-content">
                  <div className="text-center red-screen-text mt-1">
                    Red Enigma Uplink
                  </div>
                  <div className="flex">
                    <span className="ml-3">Secret Code</span>
                    <span className="flex-grow text-center">Hint Boxes</span>
                    <span className="mr-4">Decoder</span>
                  </div>
                  <div className="input-box">
                    {myTeam === "red" && gameState < 5 && coder ? (
                      <div className="code-box red-screen-text ml-5">
                        <span className="ml-1 text-3xl">
                          {`${secretCode[0]}`}
                          <span
                            className={`${
                              coder && gameState < 3 ? "cursor " : " "
                            }`}
                          >
                            {"->"}
                          </span>
                        </span>
                        <span className="ml-1 text-3xl">
                          {`${secretCode[1]}`}
                          <span
                            className={`${
                              coder && gameState < 3 ? "cursor " : " "
                            }`}
                          >
                            {"->"}
                          </span>
                        </span>
                        <span className="ml-1 text-3xl">
                          {`${secretCode[2]}`}
                          <span
                            className={`${
                              coder && gameState < 3 ? "cursor " : " "
                            }`}
                          >
                            {"->"}
                          </span>
                        </span>
                      </div>
                    ) : gameState > 4 ? (
                      <div className="code-box red-screen-text ml-5">
                        <div className="ml-1 text-3xl">{`${actualNums[0]}->`}</div>
                        <div className="ml-1 text-3xl">{`${actualNums[1]}->`}</div>
                        <div className="ml-1 text-3xl">{`${actualNums[2]}->`}</div>
                      </div>
                    ) : (
                      <div className="code-box red-screen-text ml-5">
                        <div className="ml-1 text-3xl">{`?->`}</div>
                        <div className="ml-1 text-3xl">{`?->`}</div>
                        <div className="ml-1 text-3xl">{`?->`}</div>
                      </div>
                    )}
                    <div className="hint-boxes">
                      {myTeam === "red" &&
                      coder === true &&
                      submitted === false ? (
                        <input
                          className="red-input"
                          type="text"
                          placeholder="Hint goes here"
                          maxlength="42"
                          ref={r1HintRef}
                        />
                      ) : (
                        <div className="hint-box">
                          {gameState > 2
                            ? hints[0][0]
                            : "Awaiting Transmission"}
                        </div>
                      )}
                      {myTeam === "red" &&
                      coder === true &&
                      submitted === false ? (
                        <input
                          className="red-input"
                          type="text"
                          placeholder="Hint goes here"
                          maxlength="42"
                          ref={r2HintRef}
                        />
                      ) : (
                        <div className="hint-box">
                          {gameState > 2
                            ? hints[0][1]
                            : "Awaiting Transmission"}
                        </div>
                      )}
                      {myTeam === "red" &&
                      coder === true &&
                      submitted === false ? (
                        <input
                          className="red-input"
                          type="text"
                          placeholder="Hint goes here"
                          maxlength="42"
                          ref={r3HintRef}
                          gfd
                        />
                      ) : (
                        <div className="hint-box">
                          {gameState > 2
                            ? hints[0][2]
                            : "Awaiting Transmission"}
                        </div>
                      )}
                    </div>
                    <div className="selector-box mr-3">
                      {gameState > 4 || showGuesses ? (
                        <div className="">
                          <span className="red-num-selector red-screen-text red-checked-selector">
                              {guesses[0][0]}
                          </span>
                          <span className="blue-num-selector blue-screen-text blue-checked-selector">
                            {currentRound > 0
                              ? guesses[1][0]
                              : "-"}
                          </span>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "red" && gameState > 2)) &&
                        (coder === false || myTeam === "blue") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={redOne}
                          setSelected={updateRedOne}
                          color={myTeam}
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState > 4 || showGuesses ? (
                        <div className="">
                          <span className="red-num-selector red-screen-text red-checked-selector">
                              {guesses[0][1]}
                          </span>
                          <span className="blue-num-selector blue-screen-text blue-checked-selector">
                            {currentRound > 0
                              ? guesses[1][1]
                              :"-"}
                          </span>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "red" && gameState > 2)) &&
                        (coder === false || myTeam === "blue") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={redTwo}
                          setSelected={updateRedTwo}
                          color={myTeam}
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState > 4 || showGuesses ? (
                        <div className="">
                          <span className="red-num-selector red-screen-text red-checked-selector">
                              {guesses[0][2]}
                          </span>
                          <span className="blue-num-selector blue-screen-text blue-checked-selector">
                            {currentRound > 0
                              ? guesses[1][2]
                              :"-"}
                          </span>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "red" && gameState > 2)) &&
                        (coder === false || myTeam === "blue") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={redThree}
                          setSelected={updateRedThree}
                          color={myTeam}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  <div className="screen-bottom mx-3 my-2">
                    {myTeam === "red" ? (
                      <div className={`${myTeam}-screen-text`}>
                        <span>{`>${teamChat}`}</span>
                        <form onSubmit={sendChat} id="teamChatBox">
                          <input
                            type="text"
                            placeholder="team chat here"
                            required
                            maxlength="60"
                            ref={chatRef}
                            autocomplete="off"
                            className={`${myTeam}-input w-full px-1`}
                          />
                        </form>
                      </div>
                    ) : (
                      <div>{`>${statusMessage}`}</div>
                    )}
                    <div className="screen-buttons">
                      <button
                        type="button"
                        className="red-print-button"
                        onClick={printRedHst}
                      >
                        Print Red History
                      </button>
                      {myTeam === "red" ? (
                        activeConfirm ? (
                          <button
                            type="button"
                            className="confirm-button"
                            onClick={handleConfirm}
                          >
                            {buttonMessage}
                          </button>
                        ) : (
                          <button type="button" className="inactive-button">
                            {buttonMessage}
                          </button>
                        )
                      ) : (
                        <div className="mr-4">
                          <div>
                            {`Blue Score:${displayScore(blueScore)}`}
                            <span
                              className={`float-right ${myTeam}-screen-text`}
                            >{`${
                              myTeam === "red"
                                ? `Round ${currentRound + 1}`
                                : "<-My Team"
                            }`}</span>
                          </div>
                          <div>
                            {`Red Score: ${displayScore(redScore)}`}
                            <span
                              className={`float-right ${myTeam}-screen-text`}
                            >{`${
                              myTeam === "blue"
                                ? `Round ${currentRound + 1}`
                                : "<-My Team"
                            }`}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tv-border">
            <div className="tv-bezel">
              <div className="tv-screen">
                <div className="tv-content">
                  <div className="text-center blue-screen-text mt-1">
                    Blue Enigma Uplink
                  </div>
                  <div className="flex">
                    <span className="ml-3">Secret Code</span>
                    <span className="flex-grow text-center">Hint Boxes</span>
                    <span className="mr-4">Decoder</span>
                  </div>
                  <div className="input-box">
                    {myTeam === "blue" && gameState < 5 && coder ? (
                      <div className="code-box blue-screen-text ml-5">
                        <span className="ml-1 text-3xl">
                          {`${secretCode[0]}`}
                          <span
                            className={`${
                              coder && gameState < 3 ? "cursor " : " "
                            }`}
                          >
                            {"->"}
                          </span>
                        </span>
                        <span className="ml-1 text-3xl">
                          {`${secretCode[1]}`}
                          <span
                            className={`${
                              coder && gameState < 3 ? "cursor " : " "
                            }`}
                          >
                            {"->"}
                          </span>
                        </span>
                        <span className="ml-1 text-3xl">
                          {`${secretCode[2]}`}
                          <span
                            className={`${
                              coder && gameState < 3 ? "cursor " : " "
                            }`}
                          >
                            {"->"}
                          </span>
                        </span>
                      </div>
                    ) : gameState > 4 ? (
                      <div className="code-box blue-screen-text ml-5">
                        <div className="ml-1 text-3xl">{`${actualNums[3]}->`}</div>
                        <div className="ml-1 text-3xl">{`${actualNums[4]}->`}</div>
                        <div className="ml-1 text-3xl">{`${actualNums[5]}->`}</div>
                      </div>
                    ) : (
                      <div className="code-box blue-screen-text ml-5">
                        <div className="ml-1 text-3xl">{`?->`}</div>
                        <div className="ml-1 text-3xl">{`?->`}</div>
                        <div className="ml-1 text-3xl">{`?->`}</div>
                      </div>
                    )}

                    <div className="blue-hint-boxes">
                      {myTeam === "blue" &&
                      coder === true &&
                      submitted === false ? (
                        <input
                          className="blue-input"
                          type="text"
                          placeholder="Hint goes here"
                          maxlength="42"
                          ref={b1HintRef}
                        />
                      ) : (
                        <div className="blue-hint-box">
                          {gameState > 2
                            ? hints[1][0]
                            : "Awaiting Transmission"}
                        </div>
                      )}
                      {myTeam === "blue" &&
                      coder === true &&
                      submitted === false ? (
                        <input
                          className="blue-input"
                          type="text"
                          placeholder="Hint goes here"
                          maxlength="42"
                          ref={b2HintRef}
                        />
                      ) : (
                        <div className="blue-hint-box">
                          {gameState > 2
                            ? hints[1][1]
                            : "Awaiting Transmission"}
                        </div>
                      )}
                      {myTeam === "blue" &&
                      coder === true &&
                      submitted === false ? (
                        <input
                          className="blue-input"
                          type="text"
                          placeholder="Hint goes here"
                          maxlength="42"
                          ref={b3HintRef}
                          gfd
                        />
                      ) : (
                        <div className="blue-hint-box">
                          {gameState > 2 ? hints[1][2] : "Awaiting Transmission"}
                        </div>
                      )}
                    </div>
                    <div className="selector-box mr-3">
                      {gameState > 4 || showGuesses ? (
                        <div className="">
                          <span className="blue-num-selector blue-screen-text blue-checked-selector">
                              {guesses[1][3]}
                          </span>
                          <span className="red-num-selector red-screen-text red-checked-selector">
                            {currentRound > 0
                              ? guesses[0][3]
                              :"-"}
                          </span>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "blue" && gameState > 2)) &&
                        (coder === false || myTeam === "red") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={blueOne}
                          setSelected={updateBlueOne}
                          color={myTeam}
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState > 4 || showGuesses ? (
                        <div className="">
                          <span className="blue-num-selector blue-screen-text blue-checked-selector">
                              {guesses[1][4]}
                          </span>
                          <span className="red-num-selector red-screen-text red-checked-selector">
                            {currentRound > 0
                              ? guesses[0][4]
                              :"-"}
                          </span>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "blue" && gameState > 2)) &&
                        (coder === false || myTeam === "red") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={blueTwo}
                          setSelected={updateBlueTwo}
                          color={myTeam}
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState > 4 || showGuesses ? (
                        <div className="">
                          <span className="blue-num-selector blue-screen-text blue-checked-selector">
                              {guesses[1][5]}
                          </span>
                          <span className="red-num-selector red-screen-text red-checked-selector">
                            {currentRound > 0
                              ? guesses[0][5]
                              :"-"}
                          </span>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "blue" && gameState > 2)) &&
                        (coder === false || myTeam === "red") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={blueThree}
                          setSelected={updateBlueThree}
                          color={myTeam}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                  <div className={`screen-bottom mx-3 my-2`}>
                    {myTeam === "blue" ? (
                      <div className={`${myTeam}-screen-text`}>
                        <span>{`>${teamChat}`}</span>
                        <form onSubmit={sendChat} id="teamChatBox">
                          <input
                            type="text"
                            placeholder="team chat here"
                            required
                            maxlength="60"
                            ref={chatRef}
                            autocomplete="off"
                            className={`${myTeam}-input w-full px-1`}
                          />
                        </form>
                      </div>
                    ) : (
                      <div>{`>${statusMessage}`}</div>
                    )}
                    <div className="screen-buttons">
                      {myTeam === "blue" ? (
                        activeConfirm ? (
                          <button
                            type="button"
                            className="confirm-button"
                            onClick={handleConfirm}
                          >
                            {buttonMessage}
                          </button>
                        ) : (
                          <button type="button" className="inactive-button">
                            {buttonMessage}
                          </button>
                        )
                      ) : (
                        <div className="ml-4">
                          <div>
                            {`Blue Score:${displayScore(blueScore)}`}
                            <span
                              className={`float-right ${myTeam}-screen-text`}
                            >{`${
                              myTeam === "red"
                                ? `Round ${currentRound + 1}`
                                : "<-My Team"
                            }`}</span>
                          </div>
                          <div>
                            {`Red Score: ${displayScore(redScore)}`}
                            <span
                              className={`float-right ${myTeam}-screen-text`}
                            >{`${
                              myTeam === "blue"
                                ? `Round ${currentRound + 1}`
                                : "<-My Team"
                            }`}</span>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        className="blue-print-button"
                        onClick={printBlueHst}
                      >
                        Print Blue History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div classname="history-lists bg-red-900">
          <div className="printer" id="printer">
            <div className="paper"></div>
          </div>
        </div>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => {}}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child as={Fragment}>
                <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-60" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-50"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-50"
              >
                <div className="inline-block max-w-md p-4 my-5 overflow-hidden text-left align-middle transition-all transform bg-gray-700 shadow-md rounded-lg">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-100"
                  >
                    Pick a Team
                  </Dialog.Title>
                  <div className="mt-4 w-full flex">
                    <button
                      type="button"
                      className="px-4 py-2 mx-2 text-sm font-medium shadow-md text-red-900 bg-red-100 rounded-md hover:bg-red-200"
                      onClick={joinRed}
                    >
                      Red Team
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 mx-2 text-sm font-medium shadow-md text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200"
                      onClick={joinBlue}
                    >
                      Blue Team
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 mx-2 text-sm font-medium shadow-md text-gray-900 bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={joinAny}
                    >
                      Pick For Me
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default EnigmaBreaker;
