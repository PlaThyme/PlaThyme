//PlayerList takes in an array of players and displays them in a list.
import { useState, Fragment, useEffect } from "react";
import { Dialog, RadioGroup, Transition} from "@headlessui/react";

import Chat from "./Chat";

const SideBar = ({ currentPlayer, allUsers, leaveGame, socket }) => {

  const [selected, setSelected] = useState("chatBtn");
  const [showPlayers, setPlayersChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);


  //The following 3 functions are usef to create and handle the confirmation popup for leaving.
  const handleLeaveGame = () => {
    socket.emit("leaveGame");
    leaveGame(false);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  //This is used to recieve chat messages.
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  return (
    <div className="flex-col flex w-full">
      {/* Radio Group is the tabs to select between chat and player list. */}
      <RadioGroup
        className="flex flex-row w-full"
        value={selected}
        onChange={setSelected}
      >
        <RadioGroup.Option value="playersBtn" className="flex w-3/6">
          {({ checked }) => (
            <button
              onClick={() => setPlayersChat(true)}
              className={`${
                checked ? "bg-thyme" : "bg-thyme-dark"
              } flex-grow p-2 w-3/6 text-2xl hover:bg-thyme-light rounded-b-lg`}
            >
              Players
            </button>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value="chatBtn" className="flex w-3/6">
          {({ checked }) => (
            <button
              onClick={() => setPlayersChat(false)}
              className={`${
                checked ? "bg-thyme" : "bg-thyme-dark"
              } flex-grow p-2 w-3/6 text-2xl hover:bg-thyme-light rounded-b-lg`}
            >
              Chat
            </button>
          )}
        </RadioGroup.Option>
      </RadioGroup>
      {/* Here is the content of the sidebar, either player list, or chat window. */}
      <div className="flex-grow flex-col grid justify-items-center">
        {showPlayers ? (
          <div className="flex-shrink flex-rows flex">
            <ul className="flex-col bg-gray-900 divide-y-4 divide-thyme divide-dashed content-center">
              {allUsers.map((player) => (
                <h1 className="text-xl text-center align-middle bg-gray-900 text-thyme-lightest p-2">
                  {player.name} : {player.score}
                </h1>
              ))}
            </ul>
          </div>
        ) : (
          <Chat
            socket={socket}
            messages={messages}
            currentPlayer={currentPlayer}
            className="flex-grow"
          />
        )}
      </div>
      {/* Leave room button, and confirmation popup */}
      <button
        onClick={() => openModal()}
        className=" text-thyme-lightest p-2 w-full text-xl rounded-t-lg bg-red-600 hover:bg-red-800"
      >
        Leave Room
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-30 overflow-y-auto"
          onClose={() => setIsOpen(false)}
        >
          <div className="h-screen px-4 text-center">
            <Transition.Child as={Fragment}>
              <Dialog.Overlay className="fixed inset-Y0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            ></span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <div className="inline-block max-w-sm p-4 my-5 overflow-hidden text-left align-middle transition-all transform bg-thyme-700 shadow-md rounded-lg">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-thyme-300"
                >
                  Exit the game?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-md text-thyme-100">You sure 'bout that?</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="justify-center px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"
                    onClick={handleLeaveGame}
                  >
                    Yeah, I'm sure
                  </button>
                  <button
                    type="button"
                    className="justify-center ml-2 px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"
                    onClick={closeModal}
                  >
                    On second thought...
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

export default SideBar;
