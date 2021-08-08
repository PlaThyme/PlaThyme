// UNO?™
import React, { useEffect, useState } from "react";
import PACK_OF_CARDS from "./utils/packOfCards";
import shuffleArray from "./utils/shuffleArray";
import Spinner from "./Spinner";
import useSound from "use-sound";

import bgMusic from "./assets/sounds/game-bg-music.mp3";
import unoSound from "./assets/sounds/uno-sound.mp3";
import shufflingSound from "./assets/sounds/shuffling-cards-1.mp3";
import skipCardSound from "./assets/sounds/skip-sound.mp3";
import draw2CardSound from "./assets/sounds/draw2-sound.mp3";
import wildCardSound from "./assets/sounds/wild-sound.mp3";
import draw4CardSound from "./assets/sounds/draw4-sound.mp3";
import gameOverSound from "./assets/sounds/game-over-sound.mp3";
import "./unotm.css";

export default function UNOTM({ socket }) {
  const [room, setRoom] = useState("");
  const [roomFull, setRoomFull] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  // const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState([]);

  //initialize game state
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [drawCardPile, setDrawCardPile] = useState([]);

  // const [isChatBoxHidden, setChatBoxHidden] = useState(true);
  const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);
  const [isSoundMuted, setSoundMuted] = useState(false);
  const [isMusicMuted, setMusicMuted] = useState(true);

  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true });
  const [playUnoSound] = useSound(unoSound);
  const [playShufflingSound] = useSound(shufflingSound);
  const [playSkipCardSound] = useSound(skipCardSound);
  const [playDraw2CardSound] = useSound(draw2CardSound);
  const [playWildCardSound] = useSound(wildCardSound);
  const [playDraw4CardSound] = useSound(draw4CardSound);
  const [playGameOverSound] = useSound(gameOverSound);
  // const [playerLeftName, setPlayerLeftName] = useState("");
  const [playerLeft, setPlayerLeft] = useState(false);
  const [leftPlayerName, setLeftPlayerName] = useState("");

  //runs once on component mount
  useEffect(() => {
    //shuffle PACK_OF_CARDS array
    const shuffledCards = shuffleArray(PACK_OF_CARDS);

    //extract first 7 elements to player1Deck
    const player1Deck = shuffledCards.splice(0, 7);

    //extract first 7 elements to player2Deck
    const player2Deck = shuffledCards.splice(0, 7);

    //extract random card from shuffledCards and check if its not an action card
    let startingCardIndex;
    while (true) {
      startingCardIndex = Math.floor(Math.random() * 94);
      if (
        shuffledCards[startingCardIndex] === "skipR" ||
        shuffledCards[startingCardIndex] === "_R" ||
        shuffledCards[startingCardIndex] === "D2R" ||
        shuffledCards[startingCardIndex] === "skipG" ||
        shuffledCards[startingCardIndex] === "_G" ||
        shuffledCards[startingCardIndex] === "D2G" ||
        shuffledCards[startingCardIndex] === "skipB" ||
        shuffledCards[startingCardIndex] === "_B" ||
        shuffledCards[startingCardIndex] === "D2B" ||
        shuffledCards[startingCardIndex] === "skipY" ||
        shuffledCards[startingCardIndex] === "_Y" ||
        shuffledCards[startingCardIndex] === "D2Y" ||
        shuffledCards[startingCardIndex] === "W" ||
        shuffledCards[startingCardIndex] === "D4W"
      ) {
        continue;
      } else break;
    }

    //extract the card from that startingCardIndex into the playedCardsPile
    const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);

    //store all remaining cards into drawCardPile
    const drawCardPile = shuffledCards;

    socket.emit("game-data", {
      event: "initGameState",
      gameOver: false,
      turn: "Player 1",
      player1Deck: [...player1Deck],
      player2Deck: [...player2Deck],
      currentColor: playedCardsPile[0].charAt(1),
      currentNumber: playedCardsPile[0].charAt(0),
      playedCardsPile: [...playedCardsPile],
      drawCardPile: [...drawCardPile],
    });
  }, []);

  useEffect(() => {
    socket.on("playerLeft", (data) => {
      setPlayerLeft(true);
      setLeftPlayerName(data.leftPlayerName);
    })

    socket.on("update-game-player", (data) => {
      if (data.event === "currentUserData") {
        let { name } = data;
        setCurrentUser(name);
      }
    });

    socket.on("update-game", (data) => {
      if (data.event === "roomData") {
        let { users, roomCode } = data;
        setUsers(users);
        setRoomFull(true);
        setRoom(roomCode);
      }
      if (data.event === "initGameState") {
        let {
          gameOver,
          turn,
          player1Deck,
          player2Deck,
          currentColor,
          currentNumber,
          playedCardsPile,
          drawCardPile,
        } = data;
        console.log(
          "initData --> ",
          "gameOver = ",
          gameOver,
          "turn = ",
          turn,
          "player1Deck = ",
          player1Deck,
          "player2Deck = ",
          player2Deck,
          "currentColor = ",
          currentColor,
          "currentNumber = ",
          currentNumber,
          "playedCardsPile = ",
          playedCardsPile,
          "drawCardPile = ",
          drawCardPile
        );
        setGameOver(gameOver);
        setTurn(turn);
        setPlayer1Deck(player1Deck);
        setPlayer2Deck(player2Deck);
        setCurrentColor(currentColor);
        setCurrentNumber(currentNumber);
        setPlayedCardsPile(playedCardsPile);
        setDrawCardPile(drawCardPile);
      }

      if (data.event === "updateGameState") {
        let {
          gameOver,
          winner,
          turn,
          player1Deck,
          player2Deck,
          currentColor,
          currentNumber,
          playedCardsPile,
          drawCardPile,
        } = data;
        console.log(
          "updateGameState --> ",
          "gameOver = ",
          gameOver,
          "winner = ",
          winner,
          "turn = ",
          turn,
          "player1Deck = ",
          player1Deck,
          "player2Deck = ",
          player2Deck,
          "currentColor = ",
          currentColor,
          "currentNumber = ",
          currentNumber,
          "playedCardsPile = ",
          playedCardsPile,
          "drawCardPile = ",
          drawCardPile
        );

        winner && setWinner(winner);
        turn && setTurn(turn);
        player1Deck && setPlayer1Deck(player1Deck);
        player2Deck && setPlayer2Deck(player2Deck);
        currentColor && setCurrentColor(currentColor);
        currentNumber && setCurrentNumber(currentNumber);
        playedCardsPile && setPlayedCardsPile(playedCardsPile);
        drawCardPile && setDrawCardPile(drawCardPile);
        gameOver && setGameOver(gameOver);
        gameOver === true && playGameOverSound();
        setUnoButtonPressed(false);
      }

      // if (data.event === "playerLeft") {
      //   console.log("playerLeft event received ---> ", data.playerName);
      //   setPlayerLeftName(data.playerName);
      // }
    });

    // socket.on("message-callback", (message) => {
    //   setMessages((messages) => [...messages, message]);
    //   const chatBody = document.querySelector(".chat-body");
    //   if (chatBody !== null) {
    //     chatBody.scrollTop = chatBody.scrollHeight;
    //     console.log("Inside scrollHeight = ", chatBody.scrollHeight);
    //     console.log("Inside scrollTop === ", chatBody.scrollTop);
    //   }
    // });
  }, []);

  //some util functions
  const checkGameOver = (arr) => {
    return arr.length === 1;
  };

  const checkWinner = (arr, player) => {
    console.log("checking winner === ", arr, " arr.length = ", arr.length);
    return arr.length === 1 ? player : "";
  };

  // const toggleChatBox = () => {
  //   const chatBody = document.querySelector(".chat-body");
  //   if (isChatBoxHidden) {
  //     chatBody.style.display = "block";
  //     setChatBoxHidden(false);
  //   } else {
  //     chatBody.style.display = "none";
  //     setChatBoxHidden(true);
  //   }
  // };

  // const sendMessage = (event) => {
  //   event.preventDefault();
  //   if (message) {
  //     socket.emit("sendMessage-callback", { message: message }, () => {
  //       setMessage("");
  //     });
  //   }
  // };

  // const handlePlayerQuit = () => {
  //   let playerName = "";
  //   if (currentUser === "Player 1") playerName = users[0];
  //   else playerName = users[1];
  //   socket.emit("game-data", {
  //     event: "playerLeft",
  //     playerName: playerName,
  //   });
  //   window.location.href = "/";
  // };

  const refillDrawCardPile = (copiedDrawCardPileArray) => {
    let newCopiedDrawCardPileArray = [];
    for (let i = 0; i < PACK_OF_CARDS.length; i++) {
      if (
        player1Deck.indexOf(PACK_OF_CARDS[i]) === -1 ||
        player2Deck.indexOf(PACK_OF_CARDS[i]) === -1 ||
        copiedDrawCardPileArray.indexOf(PACK_OF_CARDS[i]) === -1
      ) {
        newCopiedDrawCardPileArray.push(PACK_OF_CARDS[i]);
      }
    }
    if (copiedDrawCardPileArray.length !== 0) {
      for (let i = 0; i < copiedDrawCardPileArray.length; i++) {
        newCopiedDrawCardPileArray.push(copiedDrawCardPileArray[i]);
      }
    }
    return newCopiedDrawCardPileArray;
  };

  //driver functions
  const onCardPlayedHandler = (played_card) => {
    const cardPlayedBy = turn;
    switch (played_card) {
      case "0R":
      case "1R":
      case "2R":
      case "3R":
      case "4R":
      case "5R":
      case "6R":
      case "7R":
      case "8R":
      case "9R":
      case "_R":
      case "0G":
      case "1G":
      case "2G":
      case "3G":
      case "4G":
      case "5G":
      case "6G":
      case "7G":
      case "8G":
      case "9G":
      case "_G":
      case "0B":
      case "1B":
      case "2B":
      case "3B":
      case "4B":
      case "5B":
      case "6B":
      case "7B":
      case "8B":
      case "9B":
      case "_B":
      case "0Y":
      case "1Y":
      case "2Y":
      case "3Y":
      case "4Y":
      case "5Y":
      case "6Y":
      case "7Y":
      case "8Y":
      case "9Y":
      case "_Y": {
        const numberOfPlayedCard = played_card.charAt(0);
        const colorOfPlayedCard = played_card.charAt(1);
        //check for color match
        if (currentColor === colorOfPlayedCard) {
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1);
              updatedPlayer1Deck.push(drawCard2);
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1);
              updatedPlayer2Deck.push(drawCard2);
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          }
        }
        //check for number match
        else if (currentNumber === numberOfPlayedCard) {
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1);
              updatedPlayer1Deck.push(drawCard2);
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                turn: "Player 2",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1);
              updatedPlayer2Deck.push(drawCard2);
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playShufflingSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                turn: "Player 1",
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: numberOfPlayedCard,
              });
            }
          }
        }
        //if no color or number match, invalid move - do not update state
        else {
          alert("Invalid Move!");
        }
        break;
      }
      //if card played was a skip card
      case "skipR":
      case "skipG":
      case "skipB":
      case "skipY": {
        //extract color of played skip card
        const colorOfPlayedCard = played_card.charAt(4);
        if (currentColor === colorOfPlayedCard) {
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1);
              updatedPlayer1Deck.push(drawCard2);
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1);
              updatedPlayer2Deck.push(drawCard2);
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              });
            }
          }
        }
        //check for number match - if skip card played on skip card
        else if (currentNumber === 404) {
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1);
              updatedPlayer1Deck.push(drawCard2);
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let copiedDrawCardPileArray = [...drawCardPile];
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1 = copiedDrawCardPileArray.pop();
              const drawCard2 = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1);
              updatedPlayer2Deck.push(drawCard2);
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playSkipCardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 2"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 404,
              });
            }
          }
        }
        //if no color or number match, invalid move - do not update state
        else {
          alert("Invalid Move!");
        }
        break;
      }
      //if card played was a draw 2 card
      case "D2R":
      case "D2G":
      case "D2B":
      case "D2Y": {
        //extract color of played skip card
        const colorOfPlayedCard = played_card.charAt(2);
        //check for color match
        if (currentColor === colorOfPlayedCard) {
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            let copiedDrawCardPileArray = [...drawCardPile];
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              //pull out last two elements from drawCardPile
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1X = copiedDrawCardPileArray.pop();
              const drawCard2X = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1X);
              updatedPlayer1Deck.push(drawCard2X);
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                player2Deck: [
                  ...player2Deck.slice(0, player2Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player2Deck.slice(player2Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, player2Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player2Deck.slice(player2Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            let copiedDrawCardPileArray = [...drawCardPile];
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1X = copiedDrawCardPileArray.pop();
              const drawCard2X = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1X);
              updatedPlayer2Deck.push(drawCard2X);
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                player1Deck: [
                  ...player1Deck.slice(0, player1Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player1Deck.slice(player1Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, player1Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player1Deck.slice(player1Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            }
          }
        }
        //check for number match - if draw 2 card played on draw 2 card
        else if (currentNumber === 252) {
          if (cardPlayedBy === "Player 1") {
            const removeIndex = player1Deck.indexOf(played_card);
            let copiedDrawCardPileArray = [...drawCardPile];
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            if (player1Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1X = copiedDrawCardPileArray.pop();
              const drawCard2X = copiedDrawCardPileArray.pop();
              const updatedPlayer1Deck = [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ];
              updatedPlayer1Deck.push(drawCard1X);
              updatedPlayer1Deck.push(drawCard2X);
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [...updatedPlayer1Deck],
                player2Deck: [
                  ...player2Deck.slice(0, player2Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player2Deck.slice(player2Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player1Deck),
                winner: checkWinner(player1Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, removeIndex),
                  ...player1Deck.slice(removeIndex + 1),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, player2Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player2Deck.slice(player2Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            }
          } else {
            const removeIndex = player2Deck.indexOf(played_card);
            let copiedDrawCardPileArray = [...drawCardPile];
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            if (player2Deck.length === 2 && !isUnoButtonPressed) {
              alert(
                "Oops! You forgot to press UNO. You drew 2 cards as penalty."
              );
              let num_of_pop = 2;
              let num_of_drawCardPile_after_pop =
                copiedDrawCardPileArray.length - num_of_pop;
              if (num_of_drawCardPile_after_pop < 0) {
                copiedDrawCardPileArray = refillDrawCardPile(
                  copiedDrawCardPileArray
                );
              }
              const drawCard1X = copiedDrawCardPileArray.pop();
              const drawCard2X = copiedDrawCardPileArray.pop();
              const updatedPlayer2Deck = [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ];
              updatedPlayer2Deck.push(drawCard1X);
              updatedPlayer2Deck.push(drawCard2X);
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [...updatedPlayer2Deck],
                player1Deck: [
                  ...player1Deck.slice(0, player1Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player1Deck.slice(player1Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            } else {
              !isSoundMuted && playDraw2CardSound();

              socket.emit("game-data", {
                event: "updateGameState",
                gameOver: checkGameOver(player2Deck),
                winner: checkWinner(player2Deck, "Player 1"),
                playedCardsPile: [
                  ...playedCardsPile.slice(0, playedCardsPile.length),
                  played_card,
                  ...playedCardsPile.slice(playedCardsPile.length),
                ],
                player2Deck: [
                  ...player2Deck.slice(0, removeIndex),
                  ...player2Deck.slice(removeIndex + 1),
                ],
                player1Deck: [
                  ...player1Deck.slice(0, player1Deck.length),
                  drawCard1,
                  drawCard2,
                  ...player1Deck.slice(player1Deck.length),
                ],
                currentColor: colorOfPlayedCard,
                currentNumber: 252,
                drawCardPile: [...copiedDrawCardPileArray],
              });
            }
          }
        }
        //if no color or number match, invalid move - do not update state
        else {
          alert("Invalid Move!");
        }
        break;
      }
      //if card played was a wild card
      case "W": {
        if (cardPlayedBy === "Player 1") {
          let newColor = "";
          do {
            newColor = prompt("Enter first letter of new color (R/G/B/Y)");
            if (newColor !== null) {
              newColor = newColor.toUpperCase();
            }
          } while (newColor === null || newColor === "");
          const removeIndex = player1Deck.indexOf(played_card);
          if (player1Deck.length === 2 && !isUnoButtonPressed) {
            alert(
              "Oops! You forgot to press UNO. You drew 2 cards as penalty."
            );
            let copiedDrawCardPileArray = [...drawCardPile];
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            const updatedPlayer1Deck = [
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ];
            updatedPlayer1Deck.push(drawCard1);
            updatedPlayer1Deck.push(drawCard2);
            !isSoundMuted && playWildCardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player1Deck),
              winner: checkWinner(player1Deck, "Player 1"),
              turn: "Player 2",
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player1Deck: [...updatedPlayer1Deck],
              currentColor: newColor,
              currentNumber: 300,
              drawCardPile: [...copiedDrawCardPileArray],
            });
          } else {
            !isSoundMuted && playWildCardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player1Deck),
              winner: checkWinner(player1Deck, "Player 1"),
              turn: "Player 2",
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              currentColor: newColor,
              currentNumber: 300,
            });
          }
        } else {
          //ask for new color
          let newColor = "";
          do {
            newColor = prompt("Enter first letter of new color (R/G/B/Y)");
            if (newColor !== null) {
              newColor = newColor.toUpperCase();
            }
          } while (newColor === null || newColor === "");
          const removeIndex = player2Deck.indexOf(played_card);
          if (player2Deck.length === 2 && !isUnoButtonPressed) {
            alert(
              "Oops! You forgot to press UNO. You drew 2 cards as penalty."
            );
            let copiedDrawCardPileArray = [...drawCardPile];
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1 = copiedDrawCardPileArray.pop();
            const drawCard2 = copiedDrawCardPileArray.pop();
            const updatedPlayer2Deck = [
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ];
            updatedPlayer2Deck.push(drawCard1);
            updatedPlayer2Deck.push(drawCard2);
            !isSoundMuted && playWildCardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player2Deck),
              winner: checkWinner(player2Deck, "Player 2"),
              turn: "Player 1",
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player2Deck: [...updatedPlayer2Deck],
              currentColor: newColor,
              currentNumber: 300,
              drawCardPile: [...copiedDrawCardPileArray],
            });
          } else {
            !isSoundMuted && playWildCardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player2Deck),
              winner: checkWinner(player2Deck, "Player 2"),
              turn: "Player 1",
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              currentColor: newColor,
              currentNumber: 300,
            });
          }
        }
        break;
      }
      //if card played was a draw four wild card
      case "D4W":
        if (cardPlayedBy === "Player 1") {
          //ask for new color
          let newColor = "";
          do {
            newColor = prompt("Enter first letter of new color (R/G/B/Y)");
            if (newColor !== null) {
              newColor = newColor.toUpperCase();
            }
          } while (newColor === null || newColor === "");
          const removeIndex = player1Deck.indexOf(played_card);
          let copiedDrawCardPileArray = [...drawCardPile];
          let num_of_pop = 4;
          let num_of_drawCardPile_after_pop =
            copiedDrawCardPileArray.length - num_of_pop;
          if (num_of_drawCardPile_after_pop < 0) {
            copiedDrawCardPileArray = refillDrawCardPile(
              copiedDrawCardPileArray
            );
          }
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();
          const drawCard3 = copiedDrawCardPileArray.pop();
          const drawCard4 = copiedDrawCardPileArray.pop();
          if (player1Deck.length === 2 && !isUnoButtonPressed) {
            alert(
              "Oops! You forgot to press UNO. You drew 2 cards as penalty."
            );
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1X = copiedDrawCardPileArray.pop();
            const drawCard2X = copiedDrawCardPileArray.pop();
            const updatedPlayer1Deck = [
              ...player1Deck.slice(0, removeIndex),
              ...player1Deck.slice(removeIndex + 1),
            ];
            updatedPlayer1Deck.push(drawCard1X);
            updatedPlayer1Deck.push(drawCard2X);
            !isSoundMuted && playDraw4CardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player1Deck),
              winner: checkWinner(player1Deck, "Player 1"),
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player1Deck: [...updatedPlayer1Deck],
              player2Deck: [
                ...player2Deck.slice(0, player2Deck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
                ...player2Deck.slice(player2Deck.length),
              ],
              currentColor: newColor,
              currentNumber: 600,
              drawCardPile: [...copiedDrawCardPileArray],
            });
          } else {
            !isSoundMuted && playDraw4CardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player1Deck),
              winner: checkWinner(player1Deck, "Player 1"),
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player1Deck: [
                ...player1Deck.slice(0, removeIndex),
                ...player1Deck.slice(removeIndex + 1),
              ],
              player2Deck: [
                ...player2Deck.slice(0, player2Deck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
                ...player2Deck.slice(player2Deck.length),
              ],
              currentColor: newColor,
              currentNumber: 600,
              drawCardPile: [...copiedDrawCardPileArray],
            });
          }
        } else {
          //ask for new color
          let newColor = "";
          do {
            newColor = prompt("Enter first letter of new color (R/G/B/Y)");
            if (newColor !== null) {
              newColor = newColor.toUpperCase();
            }
          } while (newColor === null || newColor === "");
          const removeIndex = player2Deck.indexOf(played_card);
          let copiedDrawCardPileArray = [...drawCardPile];
          let num_of_pop = 4;
          let num_of_drawCardPile_after_pop =
            copiedDrawCardPileArray.length - num_of_pop;
          if (num_of_drawCardPile_after_pop < 0) {
            copiedDrawCardPileArray = refillDrawCardPile(
              copiedDrawCardPileArray
            );
          }
          const drawCard1 = copiedDrawCardPileArray.pop();
          const drawCard2 = copiedDrawCardPileArray.pop();
          const drawCard3 = copiedDrawCardPileArray.pop();
          const drawCard4 = copiedDrawCardPileArray.pop();
          !isSoundMuted && playDraw4CardSound();

          socket.emit("game-data", {
            event: "updateGameState",
            gameOver: checkGameOver(player2Deck),
            winner: checkWinner(player2Deck, "Player 2"),
            playedCardsPile: [
              ...playedCardsPile.slice(0, playedCardsPile.length),
              played_card,
              ...playedCardsPile.slice(playedCardsPile.length),
            ],
            player2Deck: [
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ],
            player1Deck: [
              ...player1Deck.slice(0, player1Deck.length),
              drawCard1,
              drawCard2,
              drawCard3,
              drawCard4,
              ...player1Deck.slice(player1Deck.length),
            ],
            currentColor: newColor,
            currentNumber: 600,
            drawCardPile: [...copiedDrawCardPileArray],
          });
          if (player2Deck.length === 2 && !isUnoButtonPressed) {
            alert(
              "Oops! You forgot to press UNO. You drew 2 cards as penalty."
            );
            let num_of_pop = 2;
            let num_of_drawCardPile_after_pop =
              copiedDrawCardPileArray.length - num_of_pop;
            if (num_of_drawCardPile_after_pop < 0) {
              copiedDrawCardPileArray = refillDrawCardPile(
                copiedDrawCardPileArray
              );
            }
            const drawCard1X = copiedDrawCardPileArray.pop();
            const drawCard2X = copiedDrawCardPileArray.pop();
            const updatedPlayer2Deck = [
              ...player2Deck.slice(0, removeIndex),
              ...player2Deck.slice(removeIndex + 1),
            ];
            updatedPlayer2Deck.push(drawCard1X);
            updatedPlayer2Deck.push(drawCard2X);
            !isSoundMuted && playDraw4CardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player2Deck),
              winner: checkWinner(player2Deck, "Player 2"),
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player2Deck: [...updatedPlayer2Deck],
              player1Deck: [
                ...player1Deck.slice(0, player1Deck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
                ...player1Deck.slice(player1Deck.length),
              ],
              currentColor: newColor,
              currentNumber: 600,
              drawCardPile: [...copiedDrawCardPileArray],
            });
          } else {
            !isSoundMuted && playDraw4CardSound();

            socket.emit("game-data", {
              event: "updateGameState",
              gameOver: checkGameOver(player2Deck),
              winner: checkWinner(player2Deck, "Player 2"),
              playedCardsPile: [
                ...playedCardsPile.slice(0, playedCardsPile.length),
                played_card,
                ...playedCardsPile.slice(playedCardsPile.length),
              ],
              player2Deck: [
                ...player2Deck.slice(0, removeIndex),
                ...player2Deck.slice(removeIndex + 1),
              ],
              player1Deck: [
                ...player1Deck.slice(0, player1Deck.length),
                drawCard1,
                drawCard2,
                drawCard3,
                drawCard4,
                ...player1Deck.slice(player1Deck.length),
              ],
              currentColor: newColor,
              currentNumber: 600,
              drawCardPile: [...copiedDrawCardPileArray],
            });
          }
        }

        break;
      default:
        console.log("in default block");
        break;
    }
  };

  const onCardDrawnHandler = () => {
    const cardDrawnBy = turn;
    let copiedDrawCardPileArray = [...drawCardPile];
    let num_of_pop = 1;
    let num_of_drawCardPile_after_pop =
      copiedDrawCardPileArray.length - num_of_pop;
    if (num_of_drawCardPile_after_pop < 0) {
      copiedDrawCardPileArray = refillDrawCardPile(copiedDrawCardPileArray);
    }
    const drawCard = copiedDrawCardPileArray.pop();
    const colorOfDrawnCard = drawCard.charAt(drawCard.length - 1);
    let numberOfDrawnCard = drawCard.charAt(0);

    if (
      colorOfDrawnCard === currentColor &&
      (drawCard === "skipR" ||
        drawCard === "skipG" ||
        drawCard === "skipB" ||
        drawCard === "skipY")
    ) {
      alert(`You drew ${drawCard}. It was played for you.`);
      !isSoundMuted && playShufflingSound();
      socket.emit("game-data", {
        event: "updateGameState",
        playedCardsPile: [
          ...playedCardsPile.slice(0, playedCardsPile.length),
          drawCard,
          ...playedCardsPile.slice(playedCardsPile.length),
        ],
        currentColor: colorOfDrawnCard,
        currentNumber: 404,
        drawCardPile: [...copiedDrawCardPileArray],
      });
    } else if (
      colorOfDrawnCard === currentColor &&
      (drawCard === "D2R" ||
        drawCard === "D2G" ||
        drawCard === "D2B" ||
        drawCard === "D2Y")
    ) {
      alert(`You drew ${drawCard}. It was played for you.`);

      let copiedDrawCardPileArray = [...drawCardPile];
      let num_of_pop = 2;
      let num_of_drawCardPile_after_pop =
        copiedDrawCardPileArray.length - num_of_pop;
      if (num_of_drawCardPile_after_pop < 0) {
        copiedDrawCardPileArray = refillDrawCardPile(copiedDrawCardPileArray);
      }
      const drawCard1 = copiedDrawCardPileArray.pop();
      const drawCard2 = copiedDrawCardPileArray.pop();
      !isSoundMuted && playDraw2CardSound();

      if (cardDrawnBy === "Player 1") {
        socket.emit("game-data", {
          event: "updateGameState",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          player2Deck: [
            ...player2Deck.slice(0, player2Deck.length),
            drawCard1,
            drawCard2,
            ...player2Deck.slice(player2Deck.length),
          ],
          currentColor: colorOfDrawnCard,
          currentNumber: 252,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("game-data", {
          event: "updateGameState",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          player1Deck: [
            ...player1Deck.slice(0, player1Deck.length),
            drawCard1,
            drawCard2,
            ...player1Deck.slice(player1Deck.length),
          ],
          currentColor: colorOfDrawnCard,
          currentNumber: 252,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    } else if (drawCard === "W") {
      alert(`You drew ${drawCard}. It was played for you.`);
      let newColor = "";

      do {
        newColor = prompt("Enter first letter of new color (R/G/B/Y)");
        if (newColor !== null) {
          newColor = newColor.toUpperCase();
        }
      } while (newColor === null || newColor === "");
      !isSoundMuted && playWildCardSound();

      if (cardDrawnBy === "Player 1") {
        socket.emit("game-data", {
          event: "updateGameState",
          turn: "Player 2",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          currentColor: newColor,
          currentNumber: 300,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("game-data", {
          event: "updateGameState",
          turn: "Player 1",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          currentColor: newColor,
          currentNumber: 300,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    } else if (drawCard === "D4W") {
      alert(`You drew ${drawCard}. It was played for you.`);
      let newColor = "";
      do {
        newColor = prompt("Enter first letter of new color (R/G/B/Y)");
        if (newColor !== null) {
          newColor = newColor.toUpperCase();
        }
      } while (newColor === null || newColor === "");
      let copiedDrawCardPileArray = [...drawCardPile];
      let num_of_pop = 4;
      let num_of_drawCardPile_after_pop =
        copiedDrawCardPileArray.length - num_of_pop;
      if (num_of_drawCardPile_after_pop < 0) {
        copiedDrawCardPileArray = refillDrawCardPile(copiedDrawCardPileArray);
      }
      const drawCard1 = copiedDrawCardPileArray.pop();
      const drawCard2 = copiedDrawCardPileArray.pop();
      const drawCard3 = copiedDrawCardPileArray.pop();
      const drawCard4 = copiedDrawCardPileArray.pop();
      !isSoundMuted && playDraw4CardSound();
      if (cardDrawnBy === "Player 1") {
        socket.emit("game-data", {
          event: "updateGameState",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          player2Deck: [
            ...player2Deck.slice(0, player2Deck.length),
            drawCard1,
            drawCard2,
            drawCard3,
            drawCard4,
            ...player2Deck.slice(player2Deck.length),
          ],
          currentColor: newColor,
          currentNumber: 600,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("game-data", {
          event: "updateGameState",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          player1Deck: [
            ...player1Deck.slice(0, player1Deck.length),
            drawCard1,
            drawCard2,
            drawCard3,
            drawCard4,
            ...player1Deck.slice(player1Deck.length),
          ],
          currentColor: newColor,
          currentNumber: 600,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    } else if (
      numberOfDrawnCard === currentNumber ||
      colorOfDrawnCard === currentColor
    ) {
      alert(`You drew ${drawCard}. It was played for you.`);
      !isSoundMuted && playShufflingSound();

      if (cardDrawnBy === "Player 1") {
        socket.emit("game-data", {
          event: "updateGameState",
          turn: "Player 2",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          currentColor: colorOfDrawnCard,
          currentNumber: numberOfDrawnCard,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("game-data", {
          event: "updateGameState",
          turn: "Player 1",
          playedCardsPile: [
            ...playedCardsPile.slice(0, playedCardsPile.length),
            drawCard,
            ...playedCardsPile.slice(playedCardsPile.length),
          ],
          currentColor: colorOfDrawnCard,
          currentNumber: numberOfDrawnCard,
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    } else {
      !isSoundMuted && playShufflingSound();
      if (cardDrawnBy === "Player 1") {
        socket.emit("game-data", {
          event: "updateGameState",
          turn: "Player 2",
          player1Deck: [
            ...player1Deck.slice(0, player1Deck.length),
            drawCard,
            ...player1Deck.slice(player1Deck.length),
          ],
          drawCardPile: [...copiedDrawCardPileArray],
        });
      } else {
        socket.emit("game-data", {
          event: "updateGameState",
          turn: "Player 1",
          player2Deck: [
            ...player2Deck.slice(0, player2Deck.length),
            drawCard,
            ...player2Deck.slice(player2Deck.length),
          ],
          drawCardPile: [...copiedDrawCardPileArray],
        });
      }
    }
  };

  return (
    <div className={`Game backgroundColorR backgroundColor${currentColor}`}>
      {
        <>
          {playerLeft ? (
            <h1 className="topInfoText text-white font-bold pt-20">
              {leftPlayerName} has left the game.
            </h1>
          ) : (
            <>
              {users.length === 2 ? (
                <>
                  <div className="topInfo">
                    <img
                      src={require("./assets/logo.png").default}
                      alt="asset logo"
                    />
                    <span>
                      <button
                        className="game-button green"
                        onClick={() => setSoundMuted(!isSoundMuted)}
                      >
                        {isSoundMuted ? (
                          <span className="material-icons">volume_off</span>
                        ) : (
                          <span className="material-icons">volume_up</span>
                        )}
                      </button>
                      <button
                        className="game-button green"
                        onClick={() => {
                          if (isMusicMuted) playBBgMusic();
                          else pause();
                          setMusicMuted(!isMusicMuted);
                        }}
                      >
                        {isMusicMuted ? (
                          <span className="material-icons">music_off</span>
                        ) : (
                          <span className="material-icons">music_note</span>
                        )}
                      </button>
                      {/* <button
                        type="button"
                        className="game-button red"
                        onClick={handlePlayerQuit}
                      >
                        QUIT
                      </button> */}
                    </span>
                  </div>

                  {gameOver ? (
                    <div>
                      {winner !== "" && (
                        <>
                          <h1>GAME OVER</h1>
                          <h2>
                            {winner === "Player 1" ? users[0] : users[1]} wins!
                          </h2>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div
                        className={`${
                          currentUser === "Player 1"
                            ? "player2Deck"
                            : "player1Deck"
                        }`}
                        style={{ pointerEvents: "none" }}
                      >
                        {currentUser === "Player 1" ? (
                          <>
                            <p className="playerDeckText  text-white font-bold">
                              {users[1]}
                            </p>
                            {player2Deck.map((item, i) => (
                              <img
                                key={i}
                                className="Card"
                                onClick={() => onCardPlayedHandler(item)}
                                src={require(`./assets/card-back.png`).default}
                                alt="card pic"
                              />
                            ))}
                            {turn === "Player 2" && <Spinner />}
                          </>
                        ) : (
                          <>
                            <p className="playerDeckText text-white font-bold">
                              {users[0]}
                            </p>
                            {player1Deck.map((item, i) => (
                              <img
                                key={i}
                                className="Card"
                                onClick={() => onCardPlayedHandler(item)}
                                src={require(`./assets/card-back.png`).default}
                                alt="alt pic text"
                              />
                            ))}
                            {turn === "Player 1" && <Spinner />}
                          </>
                        )}
                      </div>

                      <br />

                      <div
                        className="middleInfo"
                        style={
                          currentUser === "Player 1" && turn === "Player 2"
                            ? { pointerEvents: "none" }
                            : currentUser === "Player 2" && turn === "Player 1"
                            ? { pointerEvents: "none" }
                            : null
                        }
                      >
                        <button
                          className="game-button"
                          disabled={
                            currentUser === "Player 1"
                              ? turn !== "Player 1"
                              : turn !== "Player 2"
                          }
                          onClick={onCardDrawnHandler}
                        >
                          DRAW CARD
                        </button>
                        {playedCardsPile && playedCardsPile.length > 0 && (
                          <img
                            className="Card"
                            src={
                              require(`./assets/cards-front/${
                                playedCardsPile[playedCardsPile.length - 1]
                              }.png`).default
                            }
                            alt="card img alt"
                          />
                        )}
                        <button
                          className="game-button orange"
                          disabled={
                            currentUser === "Player 1"
                              ? player1Deck.length !== 2
                              : player2Deck.length !== 2
                          }
                          onClick={() => {
                            setUnoButtonPressed(!isUnoButtonPressed);
                            playUnoSound();
                          }}
                        >
                          UNO
                        </button>
                      </div>

                      <br />

                      <div
                        className={
                          currentUser === "Player 1"
                            ? "player1Deck"
                            : "player2Deck"
                        }
                        style={
                          currentUser === "Player 1" && turn !== "Player 1"
                            ? { pointerEvents: "none" }
                            : currentUser === "Player 2" && turn !== "Player 2"
                            ? { pointerEvents: "none" }
                            : null
                        }
                      >
                        {currentUser === "Player 1" ? (
                          <>
                            <p className="playerDeckText  text-white font-bold">
                              {users[0] + "(You)"}
                            </p>
                            {player1Deck.map((item, i) => (
                              <img
                                key={i}
                                className="Card"
                                onClick={() => onCardPlayedHandler(item)}
                                src={
                                  require(`./assets/cards-front/${item}.png`)
                                    .default
                                }
                                alt="ceard pic1"
                              />
                            ))}
                          </>
                        ) : (
                          <>
                            <p className="playerDeckText text-white font-bold">
                              {users[1] + "(you)"}
                            </p>
                            {player2Deck.map((item, i) => (
                              <img
                                key={i}
                                className="Card"
                                onClick={() => onCardPlayedHandler(item)}
                                src={
                                  require(`./assets/cards-front/${item}.png`)
                                    .default
                                }
                                alt="alt pic img"
                              />
                            ))}
                          </>
                        )}
                      </div>
                      {/* <div className="chatBoxWrapper">
                        <div
                          className={`${
                            currentUser === "Player 1"
                              ? "chat-box chat-box-player1"
                              : "chat-box chat-box-player2"
                          }`}
                        >
                          <div className="chat-head">
                            <h2>Chat Box</h2>
                            {!isChatBoxHidden ? (
                              <span
                                onClick={toggleChatBox}
                                className="material-icons"
                              >
                                keyboard_arrow_down
                              </span>
                            ) : (
                              <span
                                onClick={toggleChatBox}
                                className="material-icons"
                              >
                                keyboard_arrow_up
                              </span>
                            )}
                          </div>
                          <div className="chat-body">
                            <div className="msg-insert">
                              {currentUser === "Player 1" ? (
                                <>
                                  {messages.map((msg) => {
                                    if (msg.user === users[1])
                                      return (
                                        <div className="msg-receive">
                                          {" "}
                                          {msg.text}{" "}
                                        </div>
                                      );
                                    if (msg.user === users[0])
                                      return (
                                        <div className="msg-send">
                                          {msg.text}
                                        </div>
                                      );
                                  })}
                                </>
                              ) : (
                                <>
                                  {messages.map((msg) => {
                                    if (msg.user === users[0])
                                      return (
                                        <div className="msg-receive">
                                          {" "}
                                          {msg.text}{" "}
                                        </div>
                                      );
                                    if (msg.user === users[1])
                                      return (
                                        <div className="msg-send">
                                          {msg.text}
                                        </div>
                                      );
                                  })}
                                </>
                              )}
                            </div>
                            <div className="chat-text">
                              <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(event) =>
                                  setMessage(event.target.value)
                                }
                                onKeyPress={(event) =>
                                  event.key === "Enter" && sendMessage(event)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </>
                  )}
                </>
              ) : (
                <div className="pt-48">
                  <h1 className="text-white font-bold text-4xl">
                    Waiting for Player 2 to Join the game
                  </h1>
                  <Spinner />
                </div>
              )}
            </>
          )}
        </>
      }
    </div>
  );
}
