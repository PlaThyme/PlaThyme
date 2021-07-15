import React, { useState, useEffect, Fragment, Component } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import ToolTip from "./ToolTip";

const RandomWord = () => {
    const easywords = ["cheese", "bone", "socks", "leaf", "whale", "pie", "shirt", "orange", "lollipop", "bed", "mouth", "person", "horse", "snake", "jar", "spoon", "lamp", "kite", "monkey", "swing", "cloud", "snowman", "baby", "eyes", "pen", "giraffe", "grapes", "book", "ocean", "star", "cupcake", "cow", "lips", "worm", "sun", "basketball", "hat", "bus", "chair", "purse", "head", "spider", "shoe", "ghost", "coat", "chicken", "heart", "jellyfish", "tree", "seashell", "duck", "bracelet", "grass", "jacket", "slide", "doll", "spider", "clock", "cup", "bridge", "apple", "balloon", "drum", "ears", "egg", "bread", "nose", "house", "beach", "airplane", "inchworm", "hippo", "light", "turtle", "ball", "carrot", "cherry", "ice", "pencil", "circle", "bed", "ant", "girl", "glasses", "flower", "mouse", "banana", "alligator", "bell", "robot", "smile", "bike", "rocket", "dinosaur", "dog", "bunny", "cookie", "bowl", "apple", "door"]
    const mediumwords = ["horse", "door", "song", "trip", "backbone", "bomb", "round", "treasure", "garbage", "park", "whistle", "palace", "baseball", "coal", "queen", "dominoes", "photograph", "computer", "hockey", "aircraft", "pepper", "key", "iPad", "whisk", "cake", "circus", "battery", "mailman", "cowboy", "password", "bicycle", "skate", "electricity", "lightsaber", "nature", "shallow", "toast", "outside", "America", "roller", "blading", "gingerbread", "man", "bowtie", "light", "bulb", "platypus", "music", "sailboat", "popsicle", "knee", "pineapple", "tusk", "sprinkler", "money", "spool", "lighthouse", "doormat", "face", "flute", "owl", "gate", "suitcase", "bathroom", "scale", "peach", "newspaper", "watering", "can", "hook", "school", "beaver", "camera", "hair", "dryer", "mushroom", "quilt", "chalk", "dollar", "soda", "chin", "swing", "garden", "ticket", "boot", "cello", "rain", "clam", "pelican", "stingray", "nail", "sheep", "stoplight", "coconut", "crib", "hippopotamus", "ring", "video", "camera", "snowflake"]
    const hardwords = ["clog", "chestnut", "commercial", "Atlantis", "mine", "comfy", "ironic", "implode", "lie", "philosopher", "hang", "vision", "dorsal", "hail", "upgrade", "peasant", "stout", "yolk", "car", "important", "retail", "laser", "crisp", "overture", "blacksmith", "ditch", "exercise", "mime", "pastry", "kilogram", "ligament", "stowaway", "opaque", "drought", "shrew", "tinting", "mooch", "lyrics", "neutron", "stockholder", "flotsam", "cartography", "ice fishing", "eureka", "darkness", "dripping", "wobble", "brunette", "rubber", "tutor", "migrate", "myth", "psychologist", "quarantine", "slump", "landfill", "diagonal", "inquisition", "husband", "ten", "exponential", "neighborhood", "jazz", "catalog", "gallop", "snag", "acre", "protestant", "random", "twang", "flutter", "fireside", "clue", "figment", "ringleader", "parody", "jungle", "armada", "mirror", "newsletter", "sauce", "observatory", "password", "century", "bookend", "drawback", "fabric", "siesta", "aristocrat", "addendum", "rainwater", "barber", "scream", "glitter", "archaeologist", "loiterer", "positive", "dizzy", "czar", "hydrogen"]
    
    let randint = Math.floor(Math.random() * easywords.length + 1);
    
    let ret = [easywords[randint], mediumwords[randint], hardwords[randint]];
    // console.log(ret);
    easywords.splice(randint);
    mediumwords.splice(randint);
    hardwords.splice(randint);
    // console.log(ret[0]);

    let [isOpen, setIsOpen] = useState(true);
    isOpen = true;

    let [selectedWord, setSelectedWord] = useState('');
    
    const handleWordSelect = (userSelectedWord) => {
        setSelectedWord(userSelectedWord);
        console.log(selectedWord);
    }

    return (
<>
    <Transition 
    show={isOpen}
    enter="transition duration-100 ease-out"
    enterFrom="transform scale-95 opacity-0"
    enterTo="transform scale-100 opacity-100"
    leave="transition duration-75 ease-out"
    leaveFrom="transform scale-100 opacity-100"
    leaveTo="transform scale-95 opacity-0"
  >
    <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="min-h-screen px-4 text-center"></div>
        <Dialog.Overlay className="fixed inset-0" />

    {/* This element is to trick the browser into centering the modal contents. */}
    <span
    className="inline-block h-screen align-middle"
    aria-hidden="true"
    >
    &#8203;
    </span>
    {/* <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            > */}

   <div className="inline-block max-w-md p-4 my-5 overflow-hidden text-left align-middle transition-all transform bg-thyme-700 shadow-md rounded-lg">

        <Dialog.Title  
        as="h3"
        className="text-lg font-medium leading-6 text-thyme-300">Choose the word you draw!
        </Dialog.Title>
        


        <div className="inline-flex space-x-2 p-6">
        <ToolTip text="Easy">
            <button 
            type="button" 
            className="max-w-full px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200" 
            onclick={() => handleWordSelect( ret[0] ) }>
                {ret[0]}
            </button>
        </ToolTip>
        <br></br>
        
        <ToolTip text="Medium">
            <button 
            type="button" 
            className="px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200" 
            onclick={() => handleWordSelect(ret[1])} >{ret[1]}</button>
        </ToolTip>
        <br></br>

        <ToolTip text="Hard">
            <button 
            type="button" 
            className="px-4 py-2 text-sm font-medium shadow-md text-thyme-900 bg-thyme-100 rounded-md hover:bg-thyme-200"             
            onclick={() => handleWordSelect(ret[2])} >{ret[2]}</button>
        </ToolTip>
        </div>
        
    </div>
    
    </Dialog>
    {/* </Transition.Child> */}
    </Transition> 
</>
    )
}

export default RandomWord;