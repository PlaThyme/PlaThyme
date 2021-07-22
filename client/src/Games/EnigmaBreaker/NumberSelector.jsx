import React from "react";
import { RadioGroup } from "@headlessui/react";

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
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-red-600 text-gray-100 border-red-100"
                    : "bg-red-800 text-gray-400 border-gray-600"
                } hover:bg-red-200`}
              >
                1
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-blue-600 text-gray-100 border-blue-100"
                    : "bg-blue-800 text-gray-400 border-gray-600"
                } hover:bg-blue-200`}
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
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-red-600 text-gray-100 border-red-100"
                    : "bg-red-800 text-gray-400 border-gray-600"
                } hover:bg-red-200`}
              >
                2
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-blue-600 text-gray-100 border-blue-100"
                    : "bg-blue-800 text-gray-400 border-gray-600"
                } hover:bg-blue-200`}
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
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-red-600 text-gray-100 border-red-100"
                    : "bg-red-800 text-gray-400 border-gray-600"
                } hover:bg-red-200`}
              >
                3
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-blue-600 text-gray-100 border-blue-100"
                    : "bg-blue-800 text-gray-400 border-gray-600"
                } hover:bg-blue-200`}
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
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-red-600 text-gray-100 border-red-100"
                    : "bg-red-800 text-gray-400 border-gray-600"
                } hover:bg-red-200`}
              >
                4
              </button>
            ) : (
              <button
                onClick={() => true}
                className={`text-sm border-2 rounded-md ${
                  checked
                    ? "bg-blue-600 text-gray-100 border-blue-100"
                    : "bg-blue-800 text-gray-400 border-gray-600"
                } hover:bg-blue-200`}
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
