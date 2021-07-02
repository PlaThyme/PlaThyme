import React from "react";

const ToolTip = ({ children, text }) => {
  const ttRef = React.createRef();

  function mouseEnter() {
    ttRef.current.style.marginRight = "15px";
    ttRef.current.style.opacity = 1;
  }

  function mouseLeave() {
    ttRef.current.style.marginRight = "5px";
    ttRef.current.style.opacity = 0;
  }
  return (
    <div className="realitive flex items-center">
      <div>
        <div className="text-md text-thyme-light bg-gray-700 bg-opacity-60 p-1 rounded-md shadow-md transition-all duration-200 z-40" ref={ttRef}>
          {text}
        </div>
      </div>
      <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
        {children}
      </div>
    </div>
  );
};
export default ToolTip;
