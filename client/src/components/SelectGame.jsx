import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function SelectGame({ handleSelectedGame, listofGames }) {
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
      <div className="h-screen">
        <div class="sm:w-5/6 md:w-1/4 lg:w-1/3 mx-auto">
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-4">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left justify-around bg-thyme-default shadow-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
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
              <button class="block w-full bg-thyme-darkest hover:text-thyme-light text-white font-bold p-2">
                Create New Game Room
              </button>
            </form>
          </div>
        ) : (
          <div class="bg-thyme p-4 shadow md:w-3/4 mx-auto lg:w-1/2">
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
              <button class="block w-full bg-thyme-darkest hover:text-thyme-light text-white font-bold p-2">
                Join Game Room
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
