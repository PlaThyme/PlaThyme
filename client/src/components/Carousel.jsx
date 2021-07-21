import React from 'react'; 

import demo1 from "../images/demo.gif";

import "./Carousel.css";

const images = [
  demo1,
  "https://placekitten.com/102/100",
  "https://placekitten.com/103/100",
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
    <div className="flex justify-center w-screen  items-center mt-8 ">
      <div>{sliderControl(true)}</div>
      <div className="relative ">
        <div className="carousel border-8 border-thyme text-center ">
          {images.map((img, i) => (
            <div className="w-full  flex-shrink-0" key={img} ref={imgrefs[i]}>
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