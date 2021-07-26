import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeOffIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import React from "react";
import "./EnigmaBreakerStyle.css";
import { RadioGroup } from "@headlessui/react";
import NumberSelector from "./NumberSelector";

const EnigmaBreaker = ({ socket, playerName }) => {
  const [selected, setSelected] = useState("redHistory");
  const [redOne, setRedOne] = useState("0");
  const [redTwo, setRedTwo] = useState("0");
  const [redThree, setRedThree] = useState("0");
  const [blueOne, setBlueOne] = useState("0");
  const [blueTwo, setBlueTwo] = useState("0");
  const [blueThree, setBlueThree] = useState("0");
  const [actualNums, setActualNums] = useState(["?", "?", "?", "?", "?", "?"]);
  const [isOpen, setIsOpen] = useState(false); ///////////////
  const [myTeam, setMyTeam] = useState("red"); /////////////
  const [blueHints, setBlueHints] = useState({});
  const [redHints, setRedHints] = useState({});
  const [currentHints, setCurrentHints] = useState([]);

  // useEffect(() => {
  //   socket.on("update-game", (data) => {
  //     if (data.event === "team-info") {
  //       console.log(data);
  //       setMyTeam(data.team);
  //       setIsOpen(false);
  //     }
  //     if (data.event === "update-hints") {
  //       setBlueHints(data.blueHints);
  //       setRedHints(data.redHints);
  //     }
  //     if (data.event === "make-guess") {
  //       setCurrentHints(data.hints);
  //     }
  //     if (data.event === "updateActuals") {
  //       setActualNums(data.nums);
  //     }
  //   });
  // }, []);

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

  return (
    <div className="enigma-grid">
      <div className="words-box">
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
            Word 1
          </h1>
        </div>
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
            Word 2
          </h1>
        </div>
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
            Word 3
          </h1>
        </div>
        <div className="word-border">
          <h1 className="word-screen text-center text-3xl bg-green-900 mx-2">
            Word 4
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
          <input
            className="m-2 px-1"
            type="text"
            placeholder="Hint goes here"
          />
          <div className="grid justify-content-center content-center">
            <NumberSelector
              selected={redOne}
              setSelected={setRedOne}
              color="red"
            />
          </div>
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-red-200 rounded-xl mx-3">
              {actualNums[0]}
            </div>
          </div>
          <input
            className="m-2 px-1"
            type="text"
            placeholder="Hint goes here"
          />
          <div className="grid justify-content-center content-center">
            <NumberSelector
              selected={redTwo}
              setSelected={setRedTwo}
              color="red"
            />
          </div>
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-red-200 rounded-xl mx-3">
              {actualNums[1]}
            </div>
          </div>
          <input
            className="m-2 px-1"
            type="text"
            placeholder="Hint goes here"
          />
          <div className="grid justify-content-center content-center">
            <NumberSelector
              selected={redThree}
              setSelected={setRedThree}
              color="red"
            />
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
            <NumberSelector
              selected={blueOne}
              setSelected={setBlueOne}
              color="blue"
            />
          </div>
          <input
            className="m-2 px-1"
            type="text"
            placeholder="Hint goes here"
          />
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-blue-200 rounded-xl mx-3">
              {actualNums[4]}
            </div>
          </div>
          <div className="grid justify-content-center content-center">
            <NumberSelector
              selected={blueTwo}
              setSelected={setBlueTwo}
              color="blue"
            />
          </div>
          <input
            className="m-2 px-1"
            type="text"
            placeholder="Hint goes here"
          />
          <div className="grid justify-content-center content-center">
            <div className="text-center bg-blue-200 rounded-xl mx-3">
              {actualNums[5]}
            </div>
          </div>
          <div className="grid justify-content-center content-center">
            <NumberSelector
              selected={blueThree}
              setSelected={setBlueThree}
              color="blue"
            />
          </div>
          <input
            className="m-2 px-1"
            type="text"
            placeholder="Hint goes here"
          />
        </div>
      </div>
      <div className="status-box">
                  <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900">
              E
            </h1>
          </div>
        <div className="code-box bg-gray-900 rounded-2xl border-2 border-gray-100">
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900">
              E
            </h1>
          </div>
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900">
              R
            </h1>
          </div>
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900">
              R
            </h1>
          </div>
          <div className="num-border">
            <h1 className="word-screen text-center text-4xl bg-green-900">
              !
            </h1>
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
