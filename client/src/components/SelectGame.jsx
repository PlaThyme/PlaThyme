import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function SelectGame({
  handleSelectedGame,
  listofGames,
  createGame,
  joinGame,
}) {
  const [selected, setSelected] = useState({
    gameId: 0,
    gameName: "Select a Game",
    minPlayers: "Min Players",
  });

  const [selectedOption, setSelectedOption] = useState("create-room");
  const [isOpen, setIsOpen] = useState(false);
  const nameRef = useRef();
  const codeRef = useRef();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  useEffect(() => {
    handleSelectedGame(selected);
  }, [selected, handleSelectedGame]);

  const handleCreateRoom = () => {
    setSelectedOption("create-room");
  };

  const handleJoinRoom = () => {
    setSelectedOption("join-room");
  };

  function handleCreateNewRoom(e) {
    e.preventDefault();
    if (selected.gameId === 0) {
      openModal(true);
      return;
    }
    createGame(nameRef.current.value, selected);
  }

  function handeJoinExistingRoom(e) {
    e.preventDefault();
    joinGame(nameRef.current.value, codeRef.current.value);
  }

  return (
    <div className="h-screen">
      <div class="sm:w-5/6 md:w-1/4 lg:w-1/3 mx-auto">
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative mt-4">
            <Listbox.Button className="relative w-full border-2 py-2 pl-3 pr-10 text-thyme-lightest text-left justify-around bg-thyme-default shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
              <span className="block truncate">{selected.gameName}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="w-5 h-5 text-thyme-default"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-thyme-lightest  shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {listofGames.map((game, gameId) => (
                  <Listbox.Option
                    key={gameId}
                    className={({ active }) =>
                      `${
                        active
                          ? "text-thyme-dark bg-amber-100 bg-gray-200"
                          : "text-thyme-default"
                      }
                          cursor-default select-none relative py-2 pl-10 pr-4`
                    }
                    value={game}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`${
                            selected ? "font-medium" : "font-normal"
                          } block truncate`}
                        >
                          {game.gameName}
                        </span>
                        {selected ? (
                          <span
                            className={`${
                              active ? "text-amber-600" : "text-amber-600"
                            } absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child as={Fragment}>
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
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
                <div className="inline-block max-w-md p-4 my-5 overflow-hidden text-left align-middle transition-all transform bg-thyme-700 shadow-md rounded-lg">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-thyme-300"
                  >
                    Huh, what?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-thyme-100">
                      You need to select a game from the drop down box
                    </p>
                  </div>

                  <div className="mt-4 w-full flex">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"
                      onClick={closeModal}
                    >
                      If I have to...
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        <p class="text-center text-thyme-light py-2">
          Minimum Number of Players:{" "}
          <span className="bg-thyme-darkest text-thyme-lightest">
            <b>&nbsp;{selected.minPlayers}&nbsp;</b>
          </span>
        </p>
      </div>

      <div class=" flex justify-center mt-8 md:w-3/4 mx-auto lg:w-1/2">
        <button
          class={
            selectedOption === "create-room"
              ? "bg-thyme hover:bg-thyme text-gray-900 font-bold py-2 px-4 w-1/2 "
              : "bg-thyme-lightest hover:bg-gray-100 text-gray-900 font-bold py-2 px-4 w-1/2 "
          }
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
        <button
          class={
            selectedOption === "join-room"
              ? "bg-thyme hover:bg-thyme text-gray-900 font-bold py-2 px-4 w-1/2 "
              : "bg-thyme-lightest hover:bg-gray-100 text-gray-900 font-bold py-2 px-4 w-1/2 "
          }
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>

      {selectedOption === "create-room" ? (
        <div class="bg-thyme p-4 shadow md:w-3/4 mx-auto lg:w-1/2">
          <form onSubmit={handleCreateNewRoom} action="">
            <div class="mb-5">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Name"
                class="border border-gray-300 shadow p-2 w-full"
                ref={nameRef}
                required
              />
            </div>
            <button class="block w-full bg-thyme-darkest hover:text-thyme-light text-white font-bold p-2">
              Create New Game Room
            </button>
          </form>
        </div>
      ) : (
        <div class="bg-thyme p-4 shadow md:w-3/4 mx-auto lg:w-1/2">
          <form onSubmit={handeJoinExistingRoom} action="">
            <div class="mb-5">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Name"
                class="border border-gray-300 shadow p-2 w-full"
                ref={nameRef}
                required
              />
            </div>
            <div class="mb-5">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Room Code"
                class="border border-gray-300 shadow p-2 w-full"
                ref={codeRef}
                required
              />
            </div>
            <button class="block w-full bg-thyme-darkest hover:text-thyme-light text-white font-bold p-2">
              Join Game Room
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
