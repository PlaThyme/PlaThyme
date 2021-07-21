import {useState, useEffect} from 'react';

import React from "react";
import "./EnigmaBreakerStyle.css";
import { RadioGroup } from "@headlessui/react";

const EnigmaBreaker = ({socket}) => {
  const [selected, setSelected] = useState("redHistory");

  return (
    <div className="enigma-grid">
      <div className="words-box">
        <h1 className="text-center text-3xl">Word 1</h1>
        <h1 className="text-center text-3xl">Word 2</h1>
        <h1 className="text-center text-3xl">Word 3</h1>
        <h1 className="text-center text-3xl">Word 4</h1>
      </div>
      <div className="input-container">
        <div className="red-input-container">
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
        </div>

        <div className="blue-input-container">
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
          <div>Here</div>
        </div>
      </div>
      <div>status box</div>
      <div>
        <RadioGroup
          className="flex flex-row w-full"
          value={selected}
          onChange={setSelected}
        >
          <RadioGroup.Option value="redHistory" className="flex w-3/6">
            {({ checked }) => (
              <button
                onClick={() => (true)}
                className={`${
                  checked ? "bg-thyme" : "bg-thyme-dark"
                } flex-grow p-2 w-3/6 text-2xl hover:bg-thyme-light rounded-b-lg`}
              >
                Red History
              </button>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="blueHistory" className="flex w-3/6">
            {({ checked }) => (
              <button
                onClick={() => (false)}
                className={`${
                  checked ? "bg-thyme" : "bg-thyme-dark"
                } flex-grow p-2 w-3/6 text-2xl hover:bg-thyme-light rounded-b-lg`}
              >
                Blue History
              </button>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </div>
      <div></div>
    </div>
  );
};

export default EnigmaBreaker;
