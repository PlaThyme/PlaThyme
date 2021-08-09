import React from "react";
import { RadioGroup } from "@headlessui/react";
import "./EnigmaBreakerStyle.css";

const NumberSelector = ({ selected, setSelected, color }) => {
  return (
    <div>
      <RadioGroup
        className="num-selector grid grid-cols-4"
        value={selected}
        onChange={setSelected}
      >
        <RadioGroup.Option value="1" className="num-btn">
          {({ checked }) =>
            color === "red" ? (
              <button
                onClick={() => true}
                className={`red-num-selector red-screen-text ${
                  checked
                    ? "red-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                1
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`blue-num-selector blue-screen-text ${
                  checked
                    ? "blue-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                1
              </button>
            )
          }
        </RadioGroup.Option>
        <RadioGroup.Option value="2" className="num-btn">
          {({ checked }) =>
            color === "red" ? (
              <button
                onClick={() => true}
                className={`red-num-selector red-screen-text ${
                  checked
                    ? "red-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                2
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`blue-num-selector blue-screen-text ${
                  checked
                    ? "blue-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                2
              </button>
            )
          }
        </RadioGroup.Option>
        <RadioGroup.Option value="3" className="num-btn">
          {({ checked }) =>
            color === "red" ? (
              <button
                onClick={() => true}
                className={`red-num-selector red-screen-text ${
                  checked
                    ? "red-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                3
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`blue-num-selector blue-screen-text ${
                  checked
                    ? "blue-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                3
              </button>
            )
          }
        </RadioGroup.Option>
        <RadioGroup.Option value="4" className="num-btn">
          {({ checked }) =>
            color === "red" ? (
              <button
                onClick={() => true}
                className={`red-num-selector red-screen-text ${
                  checked
                    ? "red-checked-selector"
                    : "unchecked-selector"
                  }`
                }
              >
                4
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`blue-num-selector blue-screen-text ${
                  checked
                    ? "blue-checked-selector"
                    : "unchecked-selector"
                  }
                `}
              >
                4
              </button>
            )
          }
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
};

export default NumberSelector;
