import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeOffIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import React from "react";
import "./EnigmaBreakerStyle.css";
import { RadioGroup } from "@headlessui/react";
import NumberSelector from "./NumberSelector";

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
  const [buttonMessage, setButtonMessage] = useState("[CONFIRM]");

  //Current score display.
  const [blueScore, setBlueScore] = useState([0, 0]);
  const [redScore, setRedScore] = useState([0, 0]);

  //Your teams secret words.
  const [words, setWords] = useState(["", "", "", ""]);

  //The following vars control the history tabs.
  const [selected, setSelected] = useState("redHistory");
  const [blueHint, setBlueHint] = useState([
    "Awaiting Transmission",
    "Awaiting Transmission",
    "Awaiting Transmission",
  ]);
  const [redHint, setRedHint] = useState([
    "Awaiting Transmission",
    "Awaiting Transmission",
    "Awaiting Transmission",
  ]);
  const [history, setHistory] = useState({ redHistory: [], blueHistory: [] });
  const hstAnimation = ["sheet1", "sheet2", "sheet3", "sheet4", "sheet5", "sheet6", "sheet7", "sheet8"];
  const [submitted, setSubmitted] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Waiting for more players to join. A minimum of 2 per team are needed."
  );

  //There might be a better way to handle these, but this is for the guess selector
  const [redOne, setRedOne] = useState("0");
  const [redTwo, setRedTwo] = useState("0");
  const [redThree, setRedThree] = useState("0");
  const [blueOne, setBlueOne] = useState("0");
  const [blueTwo, setBlueTwo] = useState("0");
  const [blueThree, setBlueThree] = useState("0");

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
    socket.on("update-game", (data) => {
      if (data.event === "updateActuals") {
        setActualNums(data.nums);
      }
      if (data.event === "allow-start") {
        setButtonMessage("START GAME");
        setActiveConfirm(true);
        setStatusMessage(
          "Minimum Players Reached. You can now start the game."
        );
      }
      if (data.event === "start-game") {
        setButtonMessage("Inactive");
        setActiveConfirm(false);
        setGameState(data.state);
      }
      if (data.event === "new-turn") {
        setShowGuesses(false);
        setCoder(false);
        setSubmitted(false);
        setCurrentRound(data.round);
        setGameState(data.state);
        setActiveConfirm(false);
        setButtonMessage("Inactive");
        setActualNums(["?", "?", "?", "?", "?", "?"]);
        setRedOne("0");
        setRedTwo("0");
        setRedThree("0");
        setBlueOne("0");
        setBlueTwo("0");
        setBlueThree("0");
        setStatusMessage("Waiting for secret codes to be encrypted...");
        setSecretCode(["?", "?", "?"]);
        setBlueHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",
        ]);
        setRedHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",
        ]);
      }
      if (data.event === "red-hints-in") {
        setStatusMessage(
          "Red has encoded their transmission. Waiting on Blue Encoder to complete encryption."
        );
      }
      if (data.event === "blue-hints-in") {
        setStatusMessage(
          "Red has encoded their transmission. Waiting on Blue Encoder to complete encryption."
        );
      }
      if (data.event === "wait-red-guess") {
        setGameState(data.state);
        setStatusMessage(
          "Blue team has decoded the transmission... Waiting for red team to finalize their decryption"
        );
      }
      if (data.event === "wait-blue-guess") {
        setGameState(data.state);
        setStatusMessage(
          "Red team has decoded the transmission... Waiting for blue team to finalize their decryption"
        );
      }
      if (data.event === "decryption") {
        console.log(coder, "Decrpyption");
        setGameState(data.state);
        setRedHint(data.redHints);
        setBlueHint(data.blueHints);

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
      }
      if (data.event === "red-needs-players") {
        setStatusMessage(
          "Red team no longer has enough players. Hire more agents."
        );
      }
      if (data.event === "blue-needs-players") {
        setStatusMessage(
          "Blue team no longer has enough players. Hire more agents."
        );
      }
      if (data.event === "score-result") {
        setHistory({
          redHistory: data.redHistory,
          blueHistory: data.blueHistory,
        });
        setActiveConfirm(true);
        setRedScore(data.redScore);
        setBlueScore(data.blueScore);
        setGameState(data.state);
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
        setStatusMessage(`Results->Red:${rs} Blue:${bs}`);
        setButtonMessage("NEXT ROUND");
        setActualNums(data.codes);
        setGameState(data.state);
      }
      if (data.event === "game-over") {
        setHistory({
          redHistory: data.redHistory,
          blueHistory: data.blueHistory,
        });
        setActiveConfirm(true);
        setButtonMessage("NEW GAME");
        setRedScore(data.redScore);
        setBlueScore(data.blueScore);
        setGameState(data.state);
        let rs = "";
        let bs = "";
        if (data.score[0] === 0 && data.score[1] === 0) {
          rs = "+0";
        } else {
          if (data.score[0]) {
            rs += hit;
          }
          if (data.score[1]) {
            rs += miss;
          }
        }
        if (data.score[2] === 0 && data.score[3] === 0) {
          bs = "+0";
        } else {
          if (data.score[2]) {
            bs += hit;
          }
          if (data.score[3]) {
            bs += miss;
          }
        }
        setStatusMessage(
          `R:${rs} B:${bs} Game-over - ${
            data.winner === "tie" ? "Tie game!" : `${data.winner} team wins!`
          }`
        );
        setActualNums(data.codes);
        setGameState(data.state);
      }
      //Essentially resets the game back to the initial state. People will need to re-join teams.
      if (data.event === "reset-game") {
        setButtonMessage("Inactive");
        setActiveConfirm(false);
        setActualNums(["?", "?", "?", "?", "?", "?"]);
        setRedScore([0, 0]);
        setBlueScore([0, 0]);
        setWords(["", "", "", ""]);
        setRedOne("0");
        setRedTwo("0");
        setRedThree("0");
        setBlueOne("0");
        setBlueTwo("0");
        setBlueThree("0");
        setSecretCode(["?", "?", "?"]);
        setBlueHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",
        ]);
        setRedHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",
        ]);
        setShowGuesses(false);
        setTeamChat("Waiting on comms...");
        setGuessResults(["", "", "", "", "", ""]);
        setHistory({ redHistory: [], blueHistory: [] });
        setGameState(0);
        setCurrentRound(0);
        setMyTeam("");
        setIsOpen(true);
      }
    });
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
          setRedHint(data.redHints);
          setBlueHint(data.blueHints);
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
  }, [coder]);

  //Join team modal functionality
  useEffect(() => {
    if (myTeam === "") {
      setIsOpen(true);
    }
    if (myTeam === "red") {
      setSelected("redHistory");
    }
    if (myTeam === "blue") {
      setSelected("blueHistory");
    }
  }, [myTeam]);

  useEffect(() => {
    if (selected === "redHistory") {
      printHst(history.redHistory, "redType", false);
    }
    if (selected === "blueHistory") {
      printHst(history.blueHistory, "blueType", false);
    }
  }, [history]);

  const printBlueHst = () => {
    if(history.blueHistory.length === 0){
      printHst([["404 NOT FOUND","404 NOT FOUND","404 NOT FOUND","404 NOT FOUND"]], "blueType", false);
    } else {
      printHst(history.blueHistory, "blueType", false);
    }
  };
  const printRedHst = () => {
    if(history.redHistory.length === 0){
      printHst([["404 NOT FOUND","404 NOT FOUND","404 NOT FOUND","404 NOT FOUND"]], "redType", false);
    } else {
      printHst(history.redHistory, "redType", false);
    }
  };

  let timeoutValue;

  const printHst = (historyList, color) => {
    if(timeoutValue !== undefined){
      clearTimeout(timeoutValue);
    }
    timeoutValue = setTimeout(() => {
      const paper = document.querySelector("#printer .paper");
      const sheet = document.createElement("div");
      sheet.className = hstAnimation[historyList.length - 1];
      const edge = document.createElement("div");
      edge.className = "edge";
      const content = document.createElement("div");
      content.className = "content" + " " + color;
      const col = document.createElement("div");
      col.className = "histColumn";
      const line = document.createElement("div");
      line.className = "line";
  
      historyList.reverse().forEach((round) => {
        const col1 = col.cloneNode();
        col1.innerText = round[0];
        const col2 = col.cloneNode();
        col2.innerText = round[1];
        const col3 = col.cloneNode();
        col3.innerText = round[2];
        const col4 = col.cloneNode();
        col4.innerText = round[3];
        const cnt = content.cloneNode();
        cnt.appendChild(col1);
        cnt.appendChild(col2);
        cnt.appendChild(col3);
        cnt.appendChild(col4);
        const currentLine = line.cloneNode();
        currentLine.appendChild(edge.cloneNode());
        currentLine.appendChild(cnt);
        currentLine.appendChild(edge.cloneNode());
        sheet.appendChild(currentLine.cloneNode(true));
      });
      paper.prepend(sheet.cloneNode(true));
      if(paper.childElementCount > 11){
        paper.removeChild(paper.childNodes[paper.childElementCount - 1]);
      }
    }, 50);
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
        (redGuess.size === 3 && blueGuess.size === 3)
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
                  Red Enigma Machine
                </div>
                <div className="flex">
                  <span className="ml-3">Secret Code</span>
                  <span className="flex-grow text-center">Hint Boxes</span>
                  <span className="mr-4">Decoder</span>
                </div>
                <div className="input-box">
                  {myTeam === "red" ? (
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
                  ) : (
                    <div className="code-box red-screen-text ml-5">
                      <div className="ml-1 text-3xl">{`${actualNums[1]}->`}</div>
                      <div className="ml-1 text-3xl">{`${actualNums[2]}->`}</div>
                      <div className="ml-1 text-3xl">{`${actualNums[3]}->`}</div>
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
                        {redHint[0]}
                        <span className="cursor">_</span>
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
                        {redHint[1]}
                        <span className="cursor">_</span>
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
                        {redHint[2]}
                        <span className="cursor">_</span>
                      </div>
                    )}
                  </div>
                  <div className="selector-box mr-3">
                    {gameState === 5 || showGuesses ? (
                      <div className="grid justify-content-center content-center">
                        <div className="red-num-selector red-screen-text red-checked-selector">
                          {currentRound > 0 || myTeam === "red"
                            ? guessResults[0]
                            : ""}
                        </div>
                      </div>
                    ) : (currentRound > 0 ||
                        (myTeam === "red" && gameState > 0)) &&
                      (coder === false || myTeam === "blue") ? (
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
                        (myTeam === "red" && gameState > 0)) &&
                      (coder === false || myTeam === "blue") ? (
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
                        (myTeam === "red" && gameState > 0)) &&
                      (coder === false || myTeam === "blue") ? (
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
                  <div>
                    {`>${statusMessage}`}
                    <span className="cursor">_</span>
                  </div>
                  <div className="screen-buttons">
                    <button
                      type="button"
                      className="red-print-button"
                      onClick={printRedHst}
                    >
                      Print Red History
                    </button>
                    {activeConfirm ? (
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
                  Blue Enigma Machine
                </div>
                <div className="flex">
                  <span className="ml-3">Secret Code</span>
                  <span className="flex-grow text-center">Hint Boxes</span>
                  <span className="mr-4">Decoder</span>
                </div>
                <div className="input-box">
                  {myTeam === "blue" ? (
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
                  ) : (
                    <div className="code-box blue-screen-text ml-5">
                      <div className="ml-1 text-3xl">{`${actualNums[3]}->`}</div>
                      <div className="ml-1 text-3xl">{`${actualNums[4]}->`}</div>
                      <div className="ml-1 text-3xl">{`${actualNums[5]}->`}</div>
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
                        {blueHint[0]}
                        <span className="cursor">_</span>
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
                        {blueHint[1]}
                        <span className="cursor">_</span>
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
                        {blueHint[2]}
                        <span className="cursor">_</span>
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
                        (myTeam === "blue" && gameState > 0)) &&
                      (coder === false || myTeam === "red") ? (
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
                        (myTeam === "blue" && gameState > 0)) &&
                      (coder === false || myTeam === "red") ? (
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
                        (myTeam === "blue" && gameState > 0)) &&
                      (coder === false || myTeam === "red") ? (
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
                  <div className={`${myTeam}-screen-text`}>
                    <span>
                      {`>${teamChat}`}
                      <span className="cursor">_</span>
                    </span>
                    <form onSubmit={sendChat} id="teamChatBox">
                      <input
                        type="text"
                        placeholder="team chat here"
                        required
                        maxlength="40"
                        ref={chatRef}
                        autocomplete="off"
                        className={`${myTeam}-input w-full px-1`}
                      ></input>
                    </form>
                  </div>
                  <div className="screen-buttons">
                    <div className="ml-4">
                      <div>{`Blue Score:${displayScore(blueScore)}`}</div>
                      <div>{`Red Score: ${displayScore(redScore)}`}</div>
                    </div>
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
  );
};

export default EnigmaBreaker;
