import { useState, useEffect } from "react";
import { EyeOffIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import React from "react";
import "./EnigmaBreakerStyle.css";
import { RadioGroup } from "@headlessui/react";
import NumberSelector from "./NumberSelector";

const EnigmaBreaker = ({ socket }) => {
  const [selected, setSelected] = useState("redHistory");
  const [redOne, setRedOne] = useState("0");
  const [redTwo, setRedTwo] = useState("0");
  const [redThree, setRedThree] = useState("0");
  const [blueOne, setBlueOne] = useState("0");
  const [blueTwo, setBlueTwo] = useState("0");
  const [blueThree, setBlueThree] = useState("0");
  const [redOneActual, setRedOneActual] = useState("1");
  const [redTwoActual, setRedTwoActual] = useState("2");
  const [redThreeActual, setRedThreeActual] = useState("3");
  const [blueOneActual, setBlueOneActual] = useState("1");
  const [blueTwoActual, setBlueTwoActual] = useState("2");
  const [blueThreeActual, setBlueThreeActual] = useState("3");




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
          <input className="m-2 px-1" type="text" placeholder="Hint goes here"/>
          <div className="grid justify-content-center content-center">
            <NumberSelector selected={redOne} setSelected={setRedOne} color="red"/>
          </div>
          <div className="grid justify-content-center content-center"><div className="text-center bg-red-200 rounded-xl mx-3">{redOneActual}</div></div>
          <input className="m-2 px-1" type="text" placeholder="Hint goes here"/>
          <div className="grid justify-content-center content-center">
            <NumberSelector selected={redTwo} setSelected={setRedTwo} color="red"/>
          </div>
          <div className="grid justify-content-center content-center"><div className="text-center bg-red-200 rounded-xl mx-3">{redTwoActual}</div></div>
          <input className="m-2 px-1" type="text" placeholder="Hint goes here"/>
          <div className="grid justify-content-center content-center">
            <NumberSelector selected={redThree} setSelected={setRedThree} color="red"/>
          </div>
          <div className="grid justify-content-center content-center"><div className="text-center bg-red-200 rounded-xl mx-3">{redThreeActual}</div></div>
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
          <div className="grid justify-content-center content-center"><div className="text-center bg-blue-200 rounded-xl mx-3">{blueOneActual}</div></div>
          <div className="grid justify-content-center content-center">
            <NumberSelector selected={blueOne} setSelected={setBlueOne} color="blue"/>
          </div>
          <input className="m-2 px-1" type="text" placeholder="Hint goes here"/>
          <div className="grid justify-content-center content-center"><div className="text-center bg-blue-200 rounded-xl mx-3">{blueOneActual}</div></div>
          <div className="grid justify-content-center content-center">
            <NumberSelector selected={blueTwo} setSelected={setBlueTwo} color="blue"/>
          </div>
          <input className="m-2 px-1" type="text" placeholder="Hint goes here"/>
          <div className="grid justify-content-center content-center"><div className="text-center bg-blue-200 rounded-xl mx-3">{blueOneActual}</div></div>
          <div className="grid justify-content-center content-center">
            <NumberSelector selected={blueThree} setSelected={setBlueThree} color="blue"/>
          </div>
          <input className="m-2 px-1" type="text" placeholder="Hint goes here"/>
        </div>
      </div>
      <div className="status-box">status box</div>
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
    </div>
  );
};

export default EnigmaBreaker;
