import React from 'react'; 

const images = ['https://placekitten.com/101/100','https://placekitten.com/102/100','https://placekitten.com/103/100']
//const imgdescriptions = ['a cute cate', 'wow much cute', 'cuteis']

const Carousel = () => {
  const [displayedImage, setDisplayedImage] = React.useState(0);
  //const [currentText, setCurrentText] = React.useState(1);

  const totalImages = images.length;
  //const totalDescriptions = imgdescriptions.length;
  

  const imgrefs = images.reduce((ret, val, i) => {
    ret[i] = React.createRef();
    return ret;
  }, {});

  //const textrefs = imgdescriptions.reduce((ret, val, i) => {
  //  ret[i] = React.createRef();
  //  return ret;
  //}, {});

  const scrollToImage = i => {
    setDisplayedImage(i);
 //   setCurrentText(i);
    
    imgrefs[i].current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });

  //  textrefs[i].current.scrollIntoView({
  //    behavior: 'smooth',
  //    block: 'nearest',
  //    inline: 'start',
  //  });
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
    'text-white text-3xl z-10 bg-green-400 h-10 w-10 rounded-full flex items-center justify-center';

  const sliderControl = isLeft => (
    <button
      type="button"
      onClick={isLeft ? handleLeft : handleRight}
      className={`${buttonStyle} ${isLeft ? 'left-2' : 'right-2'}`}
      style={{ top: '40%' }}
    >
      <span role="img" aria-label={`Arrow ${isLeft ? 'left' : 'right'}`}>
        {isLeft ? '<' : '>'}
      </span>
    </button>
  );

  return (

    <div className="p-12 flex justify-center w-screen md:w-1/2 items-center">
      {sliderControl(true)}
      <div className="relative w-full">
        <div className="carousel w-full border-8 border-green-500 text-center">
          
          {images.map((img, i) => (
            <div className="w-full flex-shrink-0" key={img} ref={imgrefs[i]}>
              <img src={img} alt='' className="w-full object-contain" />
            </div>
          ))}
      
        </div>  
      </div>
      {sliderControl()}
    </div>
  );
};

export default Carousel;