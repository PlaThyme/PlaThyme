import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import RoomDetailsForm from "./RoomDetailsForm";

export default function SelectGameForm({ handleSelectedGame, listofGames }) {
  const [selected, setSelected] = useState({
    gameId: 0,
    gameName: "Game Name",
    minPlayers: "Min Players",
  });
  const [selectedOption, setSelectedOption] = useState("create-room");

  useEffect(() => {
    handleSelectedGame(selected);
  }, [selected, handleSelectedGame]);

  const handleCreateRoom = () => {
    setSelectedOption("create-room");
  };

  const handleJoinRoom = () => {
    setSelectedOption("join-room");
  };

  return (
    <>
      {/* <div className="bg-green-100 py-32 px-10 min-h-screen ">
        <div className="w-72 fixed top-16">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left justify-around bg-gray-200 shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.gameName}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
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
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white  shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {listofGames.map((game, gameId) => (
                    <Listbox.Option
                      key={gameId}
                      className={({ active }) =>
                        `${
                          active
                            ? "text-amber-900 bg-amber-100 bg-gray-200"
                            : "text-gray-900"
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
                              }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
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
          <div>
            <p>Minimum Number of Players: {selected.minPlayers}</p>
          </div>
        </div>
        <RoomDetailsForm />
      </div> */}
      <div className="h-screen bg-blue-400">
        <div class="shadow sm:w-5/6 md:w-1/4 lg:w-1/3 mx-auto">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-auto">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left justify-around bg-gray-200 shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected.gameName}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
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
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white  shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {listofGames.map((game, gameId) => (
                    <Listbox.Option
                      key={gameId}
                      className={({ active }) =>
                        `${
                          active
                            ? "text-amber-900 bg-amber-100 bg-gray-200"
                            : "text-gray-900"
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
                              }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
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
          <p class="text-center py-2">
            Minimum Number of Players: {selected.minPlayers}
          </p>
        </div>

        <div class=" flex justify-center md:w-3/4 mx-auto lg:w-1/2">
          <button
            class={
              selectedOption === "create-room"
                ? "bg-gray-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-1/2 "
                : "bg-gray-200 hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 w-1/2 "
            }
            onClick={handleCreateRoom}
          >
            Create Room
          </button>
          <button
            class={
              selectedOption === "join-room"
                ? "bg-gray-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 w-1/2 "
                : "bg-gray-200 hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 w-1/2 "
            }
            onClick={handleJoinRoom}
          >
            Join Room
          </button>
        </div>

        {selectedOption === "create-room" ? (
          <div class="bg-white p-4 shadow md:w-3/4 mx-auto lg:w-1/2">
            <form action="">
              <div class="mb-5">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Name"
                  class="border border-gray-300 shadow p-2 w-full"
                />
              </div>
              <button class="block w-full bg-blue-500 text-white font-bold p-2">
                Create New Game Room
              </button>
            </form>
          </div>
        ) : (
          <div class="bg-white p-4 shadow md:w-3/4 mx-auto lg:w-1/2">
            <form action="">
              <div class="mb-5">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Name"
                  class="border border-gray-300 shadow p-2 w-full"
                />
              </div>
              <div class="mb-5">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Room Code"
                  class="border border-gray-300 shadow p-2 w-full"
                />
              </div>
              <button class="block w-full bg-blue-500 text-white font-bold p-2">
                Join Game Room
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
