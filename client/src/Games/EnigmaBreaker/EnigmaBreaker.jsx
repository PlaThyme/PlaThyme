import { useState, useEffect, useReducer, useRef, Fragment } from "react";
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
import ToolTip from "../../components/ToolTip";

const EnigmaBreaker = ({ socket, playerName }) => {
  //Used to track current state of the game.
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState(0);
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

  //Emojis... really?
  const miss = "☠️";
  const hit = "💾";
  const MAXHINTWIDTH = 46;

  //Controls the three digit code indicator
  const [secretCode, setSecretCode] = useState(["?", "?", "?"]);
  const [buttonMessage, setButtonMessage] = useState("Wait For Players");

  //Current score display.
  const [blueScore, setBlueScore] = useState([0, 0]);
  const [redScore, setRedScore] = useState([0, 0]);

  //Your teams secret words.
  const [words, setWords] = useState(["", "", "", ""]);

  const [hints, setHints] = useState(["", "", "", "", "", ""]);

  const [history, setHistory] = useState({ redHistory: [], blueHistory: [] });

  const [submitted, setSubmitted] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for more players to join. A minimum of 2 per team are needed."
  );

  //There might be a better way to handle these, but this is for the guess selector
  const [redOne, setRedOne] = useState("1");
  const [redTwo, setRedTwo] = useState("1");
  const [redThree, setRedThree] = useState("1");
  const [blueOne, setBlueOne] = useState("1");
  const [blueTwo, setBlueTwo] = useState("1");
  const [blueThree, setBlueThree] = useState("1");

  //Dispaly guesses when your team has finalzed them.
  const [showGuesses, setShowGuesses] = useState(false);

  //Hold, update team chat message
  const [teamChat, setTeamChat] = useState("Waiting comms...");

  //These will show your guesses, and the results in the middle of the hints and guess portion of the screen.
  const [actualNums, setActualNums] = useState(["?", "?", "?", "?", "?", "?"]);
  const [guessResults, setGuessResults] = useState(["", "", "", "", "", ""]);

  //This simply controls the join team modal.
  const [isOpen, setIsOpen] = useState(false);

  //This keeps track of what team you're on locally.
  const [myTeam, setMyTeam] = useState("");

  const [soundToggle, SetSoundToggle] = useState(false);

  //Refs are for input boxes. Chat, and hints.
  const r1HintRef = useRef();
  const r2HintRef = useRef();
  const r3HintRef = useRef();
  const b1HintRef = useRef();
  const b2HintRef = useRef();
  const b3HintRef = useRef();
  const chatRef = useRef();

  //These are all the socket events.
  useEffect(() => {
    socket.on(
      "update-game",
      (data) => {
        if (data.event === "updateActuals") {
          setActualNums(data.nums);
          return;
        }
        if (data.event === "allow-start") {
          setButtonMessage("START GAME");
          setActiveConfirm(true);
          setStatusMessage(
            "Minimum Players Reached. You can now start the game."
          );
          return;
        }
        if (data.event === "start-game") {
          setActualNums(["?", "?", "?", "?", "?", "?"]);
          setButtonMessage("Inactive");
          setActiveConfirm(false);
          setGameState(data.state);
          return;
        }
        if (data.event === "new-turn") {
          handleNewTurn(data);
        }
        if (data.event === "red-hints-in") {
          setRedOne("0");
          setRedTwo("0");
          setRedThree("0");
          setBlueOne("0");
          setBlueTwo("0");
          setBlueThree("0");
          setStatusMessage(
            "Red has encoded their transmission. Waiting on Blue Encoder to complete encryption."
          );
          return;
        }
        if (data.event === "blue-hints-in") {
          setStatusMessage(
            "Blue has encoded their transmission. Waiting on Red Encoder to complete encryption."
          );
          return;
        }
        if (data.event === "wait-red-guess") {
          setGameState(data.state);
          if (myTeam === "blue") {
            setActiveConfirm(false);
            setButtonMessage("Please Wait");
          }
          setStatusMessage(
            "Blue team has decoded the transmission... Waiting for red team to finalize their decryption"
          );
          return;
        }
        if (data.event === "wait-blue-guess") {
          setGameState(data.state);
          if (myTeam === "red") {
            setActiveConfirm(false);
            setButtonMessage("Please Wait");
          }
          setStatusMessage(
            "Red team has decoded the transmission... Waiting for blue team to finalize their decryption"
          );
          return;
        }
        if (data.event === "decryption") {
          handleDecryption(data);
          return;
        }
        if (data.event === "red-needs-players") {
          setStatusMessage(
            "Red team no longer has enough players. Hire more agents."
          );
          return;
        }
        if (data.event === "blue-needs-players") {
          setStatusMessage(
            "Blue team no longer has enough players. Hire more agents."
          );
          return;
        }
        if (data.event === "score-result") {
          handleScoreResult(data);
        }
        if (data.event === "game-over") {
          handleGameOver(data);
          return;
        }
        //Essentially resets the game back to the initial state. People will need to re-join teams.
        if (data.event === "reset-game") {
          handleResetGame();
        }
      },
      []
    );
    socket.on("update-game-player", (data) => {
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
        if (data.gameState > 2) {
          setHints([data.redHints, data.blueHints]);
        }
        if (data.gameState === 1 || data.gameState === 2) {
          setStatusMessage("Waiting on encoders to encrypt their secret code.");
          setActiveConfirm(false);
          setButtonMessage("Inactive");
        }
        if (data.gameState === 3) {
          setActiveConfirm(true);
          setButtonMessage("Submit");
          setStatusMessage(
            "Transmission received. Agents, decode the secret messages above."
          );
        }
        if (data.gameState === 4) {
          if (data.wait) {
            setActiveConfirm(false);
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
        if (data.gameState === 5) {
          setActiveConfirm(true);
          setButtonMessage("Next Round");
          setStatusMessage("Ready to start next round");
        }
        if (data.gameState === 6) {
          setActiveConfirm(true);
          setButtonMessage("NEW GAME");
          setStatusMessage("Game Over... Start a new game?");
        }
        setCurrentRound(data.currentRound);
        setHistory({
          redHistory: data.redHistory,
          blueHistory: data.blueHistory,
        });
        setRedScore(data.redScore);
        setBlueScore(data.blueScore);
        setGameState(data.gameState);
      }
      if (data.event === "selections") {
        setRedOne(data.selections[0]);
        setRedTwo(data.selections[1]);
        setRedThree(data.selections[2]);
        setBlueOne(data.selections[3]);
        setBlueTwo(data.selections[4]);
        setBlueThree(data.selections[5]);
      }
      if (data.event === "team-chat") {
        setTeamChat(data.message);
      }
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
      if (data.event === "guess-data") {
        setShowGuesses(true);
        setGuessResults(data.guess);
      }
    });
  }, []);

  //Join team modal functionality
  useEffect(() => {
    if (myTeam === "") {
      setIsOpen(true);
    }
  }, [myTeam]);

  useEffect(() => {
    if (gameState === 5 || gameState === 6) {
      if (myTeam === "red") {
        printHst(history.redHistory, "redType", false);
      }
      if (myTeam === "blue") {
        printHst(history.blueHistory, "blueType", false);
      }
    }
  }, [gameState]);

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

  const handleResetGame = () => {
    setButtonMessage("Wait For Players");
    setActiveConfirm(false);
    setRedScore([0, 0]);
    setBlueScore([0, 0]);
    setShowGuesses(false);
    setHistory({ redHistory: [], blueHistory: [] });
    setGameState(0);
    setCurrentRound(0);
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

  const handleNewTurn = (data) => {
    setShowGuesses(false);
    setCoder(false);
    setSubmitted(false);
    setCurrentRound(data.round);
    setGameState(data.state);
    setActiveConfirm(false);
    setButtonMessage("Inactive");
    setStatusMessage("Waiting for secret codes to be encrypted...");
  };

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
  };

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
  };

  const handleDecryption = (data) => {
    setGameState(data.state);
    setHints([data.redHints, data.blueHints]);
    if (coder === true) {
      setActiveConfirm(false);
      setButtonMessage("Inactive");
      if (currentRound === 0) {
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

  let printing = false;
  const printHst = (historyList, color) => {
    if (!printing) {
      printing = true;
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
      let listLength = historyList.length;
      let timeOutValue;

      const beginPrinting = (listLength, color) => {
        if (listLength > 0) {
          printLine(historyList[listLength - 1], color);
          if (timeOutValue !== undefined) {
            clearTimeout(timeOutValue);
          }
          listLength--;
          timeOutValue = setTimeout(() => {
            beginPrinting(listLength, color);
          }, 500);
        } else {
          printing = false;
        }
      };
      beginPrinting(listLength, color);
    }
  };

  const printLine = (hstLine, color) => {
    const paper = document.querySelector("#printer .paper");
    const edge = document.createElement("div");
    edge.className = "edge";
    const content = document.createElement("div");
    content.className = "content" + " " + color;
    const col = document.createElement("div");
    col.className = "histColumn";
    const line = document.createElement("div");
    line.className = "line sheet1";

    const col1 = col.cloneNode();
    col1.innerText = hstLine[0];
    const col2 = col.cloneNode();
    col2.innerText = hstLine[1];
    const col3 = col.cloneNode();
    col3.innerText = hstLine[2];
    const col4 = col.cloneNode();
    col4.innerText = hstLine[3];
    const cnt = content.cloneNode();
    cnt.appendChild(col1);
    cnt.appendChild(col2);
    cnt.appendChild(col3);
    cnt.appendChild(col4);
    const currentLine = line.cloneNode();
    currentLine.appendChild(edge.cloneNode());
    currentLine.appendChild(cnt);
    currentLine.appendChild(edge.cloneNode());
    paper.prepend(currentLine.cloneNode(true));
    if (paper.childElementCount > 11) {
      paper.removeChild(paper.childNodes[paper.childElementCount - 1]);
    }
  };

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
    if (gameState === 0) {
      socket.emit("game-data", { event: "begin-game" });
    }
    //If the round has ended, now its
    if (gameState === 5) {
      socket.emit("game-data", { event: "next-round" });
    }
    if ((gameState === 1 || gameState === 2) && coder) {
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
    if ((gameState === 3 || gameState === 4) && !coder) {
      const redGuess = new Set([redOne, redTwo, redThree]);
      const blueGuess = new Set([blueOne, blueTwo, blueThree]);
      const allguess = [redOne, redTwo, redThree, blueOne, blueTwo, blueThree];
      //There are some specific rules to submitting guesses, and this if statement handles them
      //1: Each hint must have a unique number associated with it. That's what the set creation is about. If 3 are found, then we know each hint has a different number guessed.
      //2: First round you only guess on your own teams hints. In figure rounds you need to guess on both.
      if (
        (myTeam === "blue" && currentRound === 0 && blueGuess.size === 3) ||
        (myTeam === "red" && currentRound === 0 && redGuess.size === 3) ||
        (redGuess.size === 3 &&
          blueGuess.size === 3 &&
          redGuess.has("0") !== true &&
          blueGuess.has("0") !== true)
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
    if (gameState === 6) {
      socket.emit("game-data", { event: "new-game" });
    }
  };

  //This just sends the private team chat. The 41 magic number is just the max length that can fit in that chat box.
  const sendChat = (e) => {
    e.preventDefault();
    if (chatRef.current.value) {
      let truncMessage = chatRef.current.value.slice(0, 39);
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

    <div className={`${myTeam}-screen-text`}>
      <span>
        <button onClick={toggleSound}>
          {soundToggle ? (
            <VolumeUpIcon className="h-10 w-10" />
            ) : (
              <VolumeOffIcon className="h-10 w-10" />
              )}
        </button>
        <span className="float-right">
            <a
              href="https://github.com/dwareb/PlaThyme/blob/main/client/src/Games/EnigmaBreaker/README.md"
              target="_blank" className="float-left">
              <QuestionMarkCircleIcon className="h-10 w-10 float-right" />
            </a>
        </span>
      </span>
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
                        <div className="ml-1 text-3xl">{`${actualNums[1]}->`}</div>
                        <div className="ml-1 text-3xl">{`${actualNums[2]}->`}</div>
                        <div className="ml-1 text-3xl">{`${actualNums[3]}->`}</div>
                      </div>
                    ) : (
                      <div className="code-box blue-screen-text ml-5">
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
                        <div className="grid justify-content-center content-center">
                          <div className="red-num-selector red-screen-text red-checked-selector">
                            {currentRound > 0 || myTeam === "red"
                              ? guessResults[0]
                              : ""}
                          </div>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "red" && gameState > 2)) &&
                        (coder === false || myTeam === "blue") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={redOne}
                          setSelected={updateRedOne}
                          color="red"
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState === 5 || showGuesses ? (
                        <div className="grid justify-content-center content-center">
                          <div className="red-num-selector red-screen-text red-checked-selector">
                            {currentRound > 0 || myTeam === "red"
                              ? guessResults[1]
                              : ""}
                          </div>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "red" && gameState > 2)) &&
                        (coder === false || myTeam === "blue") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={redTwo}
                          setSelected={updateRedTwo}
                          color="red"
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState === 5 || showGuesses ? (
                        <div className="grid justify-content-center content-center">
                          <div className="red-num-selector red-screen-text red-checked-selector">
                            {currentRound > 0 || myTeam === "red"
                              ? guessResults[2]
                              : ""}
                          </div>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "red" && gameState > 2)) &&
                        (coder === false || myTeam === "blue") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={redThree}
                          setSelected={updateRedThree}
                          color="red"
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
                            maxlength="40"
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
                            : "Awaiting Trainsmission"}
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
                          {gameState > 2 ? hints[1][2] : "Awaiting Transmssion"}
                        </div>
                      )}
                    </div>
                    <div className="selector-box mr-3">
                      {gameState === 5 || showGuesses ? (
                        <div className="grid justify-content-center content-center">
                          <div className="blue-num-selector blue-screen-text blue-checked-selector">
                            {currentRound > 0 || myTeam === "blue"
                              ? guessResults[3]
                              : ""}
                          </div>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "blue" && gameState > 2)) &&
                        (coder === false || myTeam === "red") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={blueOne}
                          setSelected={updateBlueOne}
                          color="blue"
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState === 5 || showGuesses ? (
                        <div className="grid justify-content-center content-center">
                          <div className="blue-num-selector blue-screen-text blue-checked-selector">
                            {currentRound > 0 || myTeam === "blue"
                              ? guessResults[4]
                              : ""}
                          </div>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "blue" && gameState > 2)) &&
                        (coder === false || myTeam === "red") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={blueTwo}
                          setSelected={updateBlueTwo}
                          color="blue"
                        />
                      ) : (
                        <div></div>
                      )}
                      {gameState === 5 || showGuesses ? (
                        <div className="grid justify-content-center content-center">
                          <div className="blue-num-selector blue-screen-text blue-checked-selector">
                            {currentRound > 0 || myTeam === "blue"
                              ? guessResults[5]
                              : ""}
                          </div>
                        </div>
                      ) : (currentRound > 0 ||
                          (myTeam === "blue" && gameState > 2)) &&
                        (coder === false || myTeam === "red") &&
                        gameState > 2 ? (
                        <NumberSelector
                          selected={blueThree}
                          setSelected={updateBlueThree}
                          color="blue"
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
                            maxlength="40"
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
