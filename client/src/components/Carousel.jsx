import React from 'react'; 

import demo1 from "../images/drawing.gif";
import demo2 from "../images/enigma.gif";
import demo3 from "../images/eb.PNG";

import "./Carousel.css";

const images = [
  demo1,
  demo2,
  demo3,
];

const Carousel = () => {
  const [displayedImage, setDisplayedImage] = React.useState(0);
  const totalImages = images.length;

  const imgrefs = images.reduce((ret, val, i) => {
    ret[i] = React.createRef();
    return ret;
  }, {});

  const scrollToImage = (i) => {
    setDisplayedImage(i);

    imgrefs[i].current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const handleRight = () => {
    if (displayedImage >= totalImages - 1) {
      scrollToImage(0);
    } else {
      scrollToImage(displayedImage + 1);
    }
  };

  const handleLeft = () => {
    if (displayedImage === 0) {
      scrollToImage(totalImages - 1);
    } else {
      scrollToImage(displayedImage - 1);
    }
  };

  const buttonStyle =
    "text-white text-3xl z-10 bg-green-400 h-10 w-10 rounded-full flex items-center justify-center";

  const sliderControl = (isLeft) => (
    <button
      type="button"
      onClick={isLeft ? handleLeft : handleRight}
      className={`${buttonStyle} ${isLeft ? "left-2" : "right-2"}`}
      style={{ top: "40%" }}
    >
      <span role="img" aria-label={`Arrow ${isLeft ? "left" : "right"}`}>
        {isLeft ? "<" : ">"}
      </span>
    </button>
  );

  return (
    <div className="flex justify-center items-center mt-8 ">
      <div>{sliderControl(true)}</div>
      <div className="relative max-w-screen-sm">
        <div className="carousel border-8 border-thyme text-center ">
          {images.map((img, i) => (
            <div className="w-full  flex-shrink-0 max-h-80" key={img} ref={imgrefs[i]}>
              <img
                src={img}
                alt=""
                className="object-contain text-center m-auto"
              />
            </div>
          ))}
        </div>
      </div>
      <div>{sliderControl()}</div>
    </div>
  );
};

export default Carousel;