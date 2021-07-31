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
  const [secretCode, setSecretCode] = useState(["E", "R", "R"]);

  //Current score display.
  const [blueScore, setBlueScore] = useState([0, 0]);
  const [redScore, setRedScore] = useState([0, 0]);

  //Your teams secret words.
  const [words, setWords] = useState(["", "", "", ""]);

  //The following vars control the history tabs.
  const [selected, setSelected] = useState("redHistory");
  const [blueHint, setBlueHint] = useState([
    "Awaiting Transmission...",
    "Awaiting Transmission...",
    "Awaiting Transmission...",
  ]);
  const [redHint, setRedHint] = useState([
    "Awaiting Transmission...",
    "Awaiting Transmission...",
    "Awaiting Transmission...",
  ]);
  const [redHistory, setRedHistory] = useState([]);
  const [blueHistory, setBlueHistory] = useState([]);
  const hstAnimation = ["sheet1", "sheet2", "sheet3", "sheet4"];
  const [submitted, setSubmitted] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

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
  const [isOpen, setIsOpen] = useState(true);

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
        setActiveConfirm(true);
        setStatusMessage(
          "Minimum Players Reached. Press confirm to start game."
        );
      }
      if (data.event === "start-game") {
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
        setActualNums(["?", "?", "?", "?", "?", "?"]);
        setRedOne("0");
        setRedTwo("0");
        setRedThree("0");
        setBlueOne("0");
        setBlueTwo("0");
        setBlueThree("0");
        setStatusMessage("Awaiting encrypted messages...");
        setSecretCode(["E", "R", "R"]);
        setBlueHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",]);
        setRedHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",]);
      }
      if (data.event === "red-hints-in") {
        setStatusMessage("Waiting on blue teams encryption...");
      }
      if (data.event === "blue-hints-in") {
        setStatusMessage("Waiting on red teams encryption...");
      }
      if (data.event === "wait-red-guess") {
        setGameState(data.state);
        setStatusMessage("Waiting for red team to finalize decryption");
      }
      if (data.event === "wait-blue-guess") {
        setGameState(data.state);
        setStatusMessage("Waiting for blue team to finalize decryption");
      }
      if (data.event === "decryption") {
        setGameState(data.state);
        setRedHint(data.redHints);
        setBlueHint(data.blueHints);
        if (coder) {
          setStatusMessage("Agents, decode the messages now");
          setActiveConfirm(false);
        } else {
          setStatusMessage("Message recieved... decode message.");
          setActiveConfirm(true);
        }
      }
      if (data.event === "score-result") {
        setRedHistory(data.redHistory);
        setBlueHistory(data.blueHistory);
        setActiveConfirm(true);
        setRedScore(data.redScore);
        setBlueScore(data.blueScore);
        setGameState(data.state);
        setCoder(false);
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
          `Results->Red:${rs} Blue:${bs} Hit confirm for next round`
        );
        setActualNums(data.codes);
        setGameState(data.state);
      }
      if (data.event === "game-over") {
        setRedHistory(data.redHistory);
        setBlueHistory(data.blueHistory);
        setActiveConfirm(true);
        setRedScore(data.redScore);
        setBlueScore(data.blueScore);
        setGameState(data.state);
        setCoder(false);
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
          `R:${rs} B:${bs} Game-over - ${data.winner === "tie" ? "Tie game!" : `${data.winner} team wins!`}`
        );
        setActualNums(data.codes);
        setGameState(data.state);
      }
      //Essentially resets the game back to the initial state. People will need to re-join teams.
      if (data.event === "reset-game"){
        setSecretCode(["E", "R", "R"]);
        setActiveConfirm(false);
        setActualNums(["?", "?", "?", "?", "?", "?"]);
        setBlueHint("");
        setRedHint("");
        setRedScore([0,0]);
        setBlueScore([0,0]);
        setWords(["","","",""]);
        setRedOne("0");
        setRedTwo("0");
        setRedThree("0");
        setBlueOne("0");
        setBlueTwo("0");
        setBlueThree("0");
        setSecretCode(["E", "R", "R"]);
        setBlueHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",]);
        setRedHint([
          "Awaiting Transmission...",
          "Awaiting Transmission...",
          "Awaiting Transmission...",]);
        setShowGuesses(false);
        setTeamChat("Waiting on comms...");
        setGuessResults(["", "", "", "", "", ""]);
        setGameState(0);
        setCurrentRound(0);
        setMyTeam("");
        setIsOpen(true);
      }
      if (data.status !== undefined) {
        setStatusMessage(data.status);
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
        setStatusMessage("Code received. Encode and retransmit...");
      }
      if (data.event === "guess-data") {
        setShowGuesses(true);
        setGuessResults(data.guess);
      }
      if (data.status !== undefined) {
        setStatusMessage(data.status);
      }
    });
  }, [redOne, blueOne, statusMessage, teamChat, activeConfirm, gameState]);

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
    const printHst = (history, color) =>{
      const paper = document.querySelector("#printer .paper");
      const sheet = document.createElement("div");
      sheet.className = hstAnimation[history.length -1];
      const edge = document.createElement("div");
      edge.className = "edge";
      const content = document.createElement("div");
      content.className = "content" + " " + color;
      const col = document.createElement("div");
      col.className = "histColumn";
      const line = document.createElement("div");
      line.className = "line";

      history.reverse().forEach((round) => {
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
    }

    if (selected === "redHistory") {
      printHst(redHistory, "redType");
    }
    if (selected === "blueHistory") {
      printHst(blueHistory, "blueType");
    }
  }, [redHistory, blueHistory, selected]);

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

  const printHist = (history) => {
    console.log("Hmm...");
    return history.reverse().map((hist) => {
      <div className="line">
        <div className="edge" />
        <div className="content">
          <div>{hist[0]}</div>
          <div>{hist[1]}</div>
          <div>{hist[2]}</div>
          <div>{hist[3]}</div>
        </div>
        <div className="edge" />
      </div>;
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
        }
      }
    }

    //Submit your teams guesses
    if ((gameState === 3 || gameState === 4) && !coder) {
      const redGuess = new Set([redOne, redTwo, redThree]);
      const blueGuess = new Set([blueOne, blueTwo, blueThree]);
      const allguess = [redOne, redTwo, redThree, blueOne, blueTwo, blueThree];
      console.log(redGuess, blueGuess, allguess);
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
        setStatusMessage("Error: Code Format => See Rules Below");
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
      let truncMessage = chatRef.current.value.slice(0, 41);
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
        <div className="red-input-container">
          <div>
            <div className="text-center bg-red-200 mx-40 rounded-xl">
              Red Hints
            </div>
          </div>
          <div className="icon-box">
            <QuestionMarkCircleIcon className="bg-red-200 rounded-xl" />
          </div>
          <div className="icon-box">
            <EyeOffIcon className="bg-red-200 rounded-xl" />
          </div>
          {myTeam === "red" && coder === true && submitted === false ? (
            <input
              className="m-2 px-1"
              type="text"
              placeholder="Hint goes here"
              ref={r1HintRef}
            />
          ) : (
            <div className="bg-gray-200 m-2 pl-1">{redHint[0]}</div>
          )}
          <div className="grid justify-content-center content-center">
            {gameState === 5 || showGuesses ? (
              <div className="grid justify-content-center content-center">
                <div className="text-center bg-red-200 rounded-xl mx-3">
                  {guessResults[0]}
                </div>
              </div>
            ) : (currentRound > 0 || (myTeam === "red" && gameState > 0)) &&
              coder === false ? (
              <NumberSelector
                selected={redOne}
                setSelected={updateRedOne}
                color="red"
              />
            ) : (
              <div></div>
            )}
          </div>
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-red-200 rounded-xl mx-3">
              {actualNums[0]}
            </div>
          </div>
          {myTeam === "red" && coder === true && submitted === false ? (
            <input
              className="m-2 px-1"
              type="text"
              placeholder="Hint goes here"
              ref={r2HintRef}
            />
          ) : (
            <div className="bg-gray-200 m-2 pl-1">{redHint[1]}</div>
          )}
          <div className="grid justify-content-center content-center">
            {gameState === 5 || showGuesses ? (
              <div className="grid justify-content-center content-center">
                <div className="text-center bg-red-200 rounded-xl mx-3">
                  {guessResults[1]}
                </div>
              </div>
            ) : (currentRound > 0 || (myTeam === "red" && gameState > 0)) &&
              coder === false ? (
              <NumberSelector
                selected={redTwo}
                setSelected={updateRedTwo}
                color="red"
              />
            ) : (
              <div></div>
            )}
          </div>
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-red-200 rounded-xl mx-3">
              {actualNums[1]}
            </div>
          </div>
          {myTeam === "red" && coder === true && submitted === false ? (
            <input
              className="m-2 px-1"
              type="text"
              placeholder="Hint goes here"
              ref={r3HintRef}
            />
          ) : (
            <div className="bg-gray-200 m-2 pl-1">{redHint[2]}</div>
          )}
          <div className="grid justify-content-center content-center">
            {gameState === 5 || showGuesses ? (
              <div className="grid justify-content-center content-center">
                <div className="text-center bg-red-200 rounded-xl mx-3">
                  {guessResults[2]}
                </div>
              </div>
            ) : (currentRound > 0 || (myTeam === "red" && gameState > 0)) &&
              coder === false ? (
              <NumberSelector
                selected={redThree}
                setSelected={updateRedThree}
                color="red"
              />
            ) : (
              <div></div>
            )}
          </div>
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-red-200 rounded-xl mx-3">
              {actualNums[2]}
            </div>
          </div>
        </div>

        <div className="blue-input-container">
          <div className="icon-box">
            <EyeOffIcon className="bg-blue-200 rounded-xl" />
          </div>
          <div className="icon-box">
            <QuestionMarkCircleIcon className="bg-blue-200 rounded-xl" />
          </div>
          <div>
            <div className="text-center bg-blue-200 mx-40 rounded-xl">
              Blue Hints
            </div>
          </div>
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-blue-200 rounded-xl mx-3">
              {actualNums[3]}
            </div>
          </div>
          <div className="grid justify-content-center content-center">
            {gameState === 5 || showGuesses ? (
              <div className="grid justify-content-center content-center">
                <div className="text-center bg-blue-200 rounded-xl mx-3">
                  {guessResults[3]}
                </div>
              </div>
            ) : (currentRound > 0 || (myTeam === "blue" && gameState > 0)) &&
              coder === false ? (
              <NumberSelector
                selected={blueOne}
                setSelected={updateBlueOne}
                color="blue"
              />
            ) : (
              <div></div>
            )}
          </div>
          {myTeam === "blue" && coder === true && submitted === false ? (
            <input
              className="m-2 px-1"
              type="text"
              placeholder="Hint goes here"
              ref={b1HintRef}
            />
          ) : (
            <div className="bg-gray-200 m-2 pl-1">{blueHint[0]}</div>
          )}
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-blue-200 rounded-xl mx-3">
              {actualNums[4]}
            </div>
          </div>
          <div className="grid justify-content-center content-center">
            {gameState === 5 || showGuesses ? (
              <div className="grid justify-content-center content-center">
                <div className="text-center bg-blue-200 rounded-xl mx-3">
                  {guessResults[4]}
                </div>
              </div>
            ) : (currentRound > 0 || (myTeam === "blue" && gameState > 0)) &&
              coder === false ? (
              <NumberSelector
                selected={blueTwo}
                setSelected={updateBlueTwo}
                color="blue"
              />
            ) : (
              <div></div>
            )}
          </div>
          {myTeam === "blue" && coder === true && submitted === false ? (
            <input
              className="m-2 px-1"
              type="text"
              placeholder="Hint goes here"
              ref={b2HintRef}
            />
          ) : (
            <div className="bg-gray-200 m-2 pl-1">{blueHint[1]}</div>
          )}
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-blue-200 rounded-xl mx-3">
              {actualNums[5]}
            </div>
          </div>
          <div className="grid justify-content-center content-center">
            {gameState === 5 || showGuesses ? (
              <div className="grid justify-content-center content-center">
                <div className="text-center bg-blue-200 rounded-xl mx-3">
                  {guessResults[5]}
                </div>
              </div>
            ) : (currentRound > 0 || (myTeam === "blue" && gameState > 0)) &&
              coder === false ? (
              <NumberSelector
                selected={blueThree}
                setSelected={updateBlueThree}
                color="blue"
              />
            ) : (
              <div></div>
            )}
          </div>
          {myTeam === "blue" && coder === true && submitted === false ? (
            <input
              className="m-2 px-1"
              type="text"
              placeholder="Hint goes here"
              ref={b3HintRef}
            />
          ) : (
            <div className="bg-gray-200 m-2 pl-1">{blueHint[2]}</div>
          )}
        </div>
      </div>
      <div className="status-box">
        <div className="code-box bg-gray-900">
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900 rounded-md">
              {secretCode[0]}
            </h1>
          </div>
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900 rounded-md">
              {secretCode[1]}
            </h1>
          </div>
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900 rounded-md">
              {secretCode[2]}
            </h1>
          </div>
        </div>
        <div className="word-border h-max-full">
          <div className="word-screen h-full">{`>${statusMessage}_`}</div>
        </div>
        <div className="confirm-box bg-black h-full">
          {activeConfirm ? (
            <button
              type="button"
              className="confirm-button w-full h-full"
              onClick={handleConfirm}
            >
              {`[CONFIRM]`}
            </button>
          ) : (
            <div className="inactive-button w-full h-full">{"[INACTIVE]"}</div>
          )}
        </div>
        <div className="word-border h-max-full">
          <div className="word-screen h-full">
            {coder ? (
              <>
                <div>{">Communications Failure..._"}</div>
                <div className="team-chat w-full px-1">...........</div>
              </>
            ) : (
              <>
                <div>{`>${teamChat}_`}</div>
                <form onSubmit={sendChat} id="teamChatBox">
                  <input
                    type="text"
                    placeholder="team chat here"
                    required
                    ref={chatRef}
                    autocomplete="off"
                    className="team-chat w-full px-1"
                  ></input>
                </form>
              </>
            )}
          </div>
        </div>
        <div className="word-border h-max-full">
          <div className="word-screen h-full">
            <div>{`Blue:${displayScore(blueScore)}`}</div>
            <div>{`Red: ${displayScore(redScore)}`}</div>
          </div>
        </div>
      </div>
      <RadioGroup
        className="enigma-tabs"
        value={selected}
        onChange={setSelected}
      >
        <RadioGroup.Option value="redHistory" className="e-tab">
          {({ checked }) => (
            <button
              onClick={() => true}
              className={`hist-btn rounded-t-md ${
                checked ? "bg-red-600 text-gray-100" : "bg-red-800 text-black"
              } text-2xl hover:bg-red-200`}
            >
              Red History
            </button>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="blueHistory" className="e-tab">
          {({ checked }) => (
            <button
              onClick={() => true}
              className={`hist-btn rounded-t-md ${
                checked ? "bg-blue-600 text-gray-100" : "bg-blue-800 text-black"
              } text-2xl hover:bg-blue-200`}
            >
              Blue History
            </button>
          )}
        </RadioGroup.Option>
      </RadioGroup>
        <div classname="history-lists bg-red-900">
          <div className="printer" id="printer">
            <div className="paper">
            </div>
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
