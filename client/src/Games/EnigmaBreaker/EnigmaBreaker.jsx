import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeOffIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import React from "react";
import "./EnigmaBreakerStyle.css";
import { RadioGroup } from "@headlessui/react";
import NumberSelector from "./NumberSelector";

const EnigmaBreaker = ({ socket, playerName }) => {
  const miss = "☠️";
  const hit = "💾";
  const [secretCode, setSecretCode] = useState(["E", "R", "R"]);
  const [decrypt, setDecrypt] = useState(false);
  const [blueScore, setBlueScore] = useState([0, 2]);
  const [redScore, setRedScore] = useState([2, 2]);
  const [words, setWords] = useState(["", "", "", ""]);
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
  const [coder, setCoder] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeConfirm, setActiveConfirm] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [redOne, setRedOne] = useState("0");
  const [redTwo, setRedTwo] = useState("0");
  const [redThree, setRedThree] = useState("0");
  const [blueOne, setBlueOne] = useState("0");
  const [blueTwo, setBlueTwo] = useState("0");
  const [blueThree, setBlueThree] = useState("0");
  const [teamChat, setTeamChat] = useState("Waiting comms...");
  const [actualNums, setActualNums] = useState(["?", "?", "?", "?", "?", "?"]);
  const [isOpen, setIsOpen] = useState(true);
  const [myTeam, setMyTeam] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const r1HintRef = useRef();
  const r2HintRef = useRef();
  const r3HintRef = useRef();
  const b1HintRef = useRef();
  const b2HintRef = useRef();
  const b3HintRef = useRef();
  const chatRef = useRef();

  useEffect(() => {
    socket.on("update-game", (data) => {
      if (data.event === "updateActuals") {
        setActualNums(data.nums);
      }
      if (data.event === "allow-start") {
        setActiveConfirm(true);
      }
      if (data.event === "start-game") {
        setGameStarted(true);
      }
      if (data.event === "new-turn") {
        setCoder(false);
        setActiveConfirm(false);
        setRedOne("0");
        setRedTwo("0");
        setRedThree("0");
        setBlueOne("0");
        setBlueTwo("0");
        setBlueThree("0");
        setStatusMessage("Awaiting encrypted messages...");
        setSecretCode(["E", "R", "R"]);
      }
      if (data.event === "red-hints-in") {
        setStatusMessage("Waiting on blue teams encryption...");
      }
      if (data.event === "blue-hints-in") {
        setStatusMessage("Waiting on red teams encryption...");
      }
      if (data.event === "decryption") {
        setRedHint(data.redHints);
        setBlueHint(data.blueHints);
        setDecrypt(true);
        if (coder) {
          setStatusMessage("Agents, decode the messages now");
          setActiveConfirm(false);
        } else {
          setStatusMessage("Message recieved... decode message.");
          setActiveConfirm(true);
        }
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
        setStatusMessage("Code recieved. Encode and retransmit...");
      }
      if (data.status !== undefined) {
        setStatusMessage(data.status);
      }
    });
  }, [redOne, blueOne, statusMessage, teamChat, activeConfirm, gameStarted]);

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

  const closeModal = () => {
    setIsOpen(false);
  };

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

  const handleConfirm = () => {
    if (gameStarted === false) {
      socket.emit("game-data", { event: "begin-game" });
    } else {
      if (coder) {
        if (myTeam === "red") {
          let truncHint1 = r1HintRef.current.value.slice(0, 46);
          let truncHint2 = r2HintRef.current.value.slice(0, 46);
          let truncHint3 = r3HintRef.current.value.slice(0, 46);
          if (truncHint1 === "" || truncHint2 === "" || truncHint3 === "") {
            setStatusMessage("You must fill out all hints before submitting.");
          } else {
            socket.emit("game-data", {
              event: "red-hints",
              hint1: truncHint1,
              hint2: truncHint2,
              hint3: truncHint3,
            });
            setSubmitted(true);
            setStatusMessage("Waiting for blue team to submit");
            setActiveConfirm(false);
          }
        } else {
          let truncHint1 = b1HintRef.current.value.slice(0, 46);
          let truncHint2 = b2HintRef.current.value.slice(0, 46);
          let truncHint3 = b3HintRef.current.value.slice(0, 46);
          if (truncHint1 === "" || truncHint2 === "" || truncHint3 === "") {
            setStatusMessage("You must fill out all hints before submitting");
          } else {
            socket.emit("game-data", {
              event: "blue-hints",
              hint1: truncHint1,
              hint2: truncHint2,
              hint3: truncHint3,
            });
            setSubmitted(true);
            setStatusMessage("Waiting for red team to submit");
            setActiveConfirm(false);
          }
        }
      }
      if (decrypt) {
        const redGuess = new Set([redOne, redTwo, redThree]);
        const blueGuess = new Set([blueOne, blueTwo, blueThree]);
        if (redGuess.size === 3 && blueGuess.size === 3) {
          socket.emit("game-data", {
            event: "submit-guess",
            team: myTeam,
            redGuess: [redOne, redTwo, redThree],
            blueGuess: [blueOne, blueTwo, blueThree],
          });
        } else {
          setStatusMessage("No number may be assigned to two hints per color");
        }
      }
    }
  };

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
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
            1: {words[0]}
          </h1>
        </div>
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl mx-2">
            2: {words[1]}
          </h1>
        </div>
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
            3: {words[2]}
          </h1>
        </div>
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
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
            {coder === false ? (
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
            {coder === false ? (
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
            {coder === false ? (
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
            {coder === false ? (
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
            {coder === false ? (
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
            {coder === false ? (
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
      <div
        className={`history-lists ${
          selected === "redHistory" ? "bg-red-900" : "bg-blue-900"
        }`}
      >
        <div
          className={`word-history ${
            selected === "redHistory" ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          List 1
        </div>
        <div
          className={`word-history ${
            selected === "redHistory" ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          List 2
        </div>
        <div
          className={`word-history ${
            selected === "redHistory" ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          List 3
        </div>
        <div
          className={`word-history ${
            selected === "redHistory" ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          List 4
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
