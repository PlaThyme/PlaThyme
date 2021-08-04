// UNO?™

import React, { useState, useEffect } from "react";
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
import PACK_OF_CARDS from "./utils/packOfCards";
import shuffleArray from "./utils/shuffleArray";
import "./unotm.css";

export default function UNOTM({ socket }) {
  const [myTurn, setMyTurn] = useState(false);
  const [currentPlayerDeck, setCurrentPlayerDeck] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [room, setRoom] = useState("");
  const [roomFull, setRoomFull] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //initialize game state
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  const [drawCardPile, setDrawCardPile] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const [isChatBoxHidden, setChatBoxHidden] = useState(true);
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

  useEffect(() => {
    socket.on("update-game-player", (data) => {
      if (data.event === "playerDetails") {
        console.log("playerName --> ", data.player);
        setCurrentUser(data.player);
      }
    });
    socket.on("testEvent", (data) => {
      console.log("testEvent --> ", data);
    });
    // socket.on("playerDetails", (data) => {
    //   console.log("playerName --> ", data.player);
    //   setCurrentUser(data.player);
    // });

    socket.on("update-game", ({ event, data }) => {
      // console.log("player1Deck = ", data.player1Deck);
      console.log("inside update-game ", data);
      if (event === "init-data") {
        setGameStarted(data.gameStarted);
        setRoomFull(data.roomFull);
        setRoomCode(data.roomCode);
        setUsers(data.users);
        setGameOver(data.gameOver);
        setTurn(data.turn);
        setPlayer1Deck(data.player1Deck);
        setPlayer2Deck(data.player2Deck);
        setCurrentColor(data.currentColor);
        setCurrentNumber(data.currentNumber);
        setPlayedCardsPile(data.playedCardsPile);
        setDrawCardPile(data.drawCardPile);
      }
    });
  }, []);

  const onCardPlayedHandler = (item) => {
    // console.log("inside oncardplayed handle function..");
    console.log("item = ", item);
    // socket.emit("CardPlayedHandler", { playedCard: item, roomCode: roomCode });
  };
  const onCardDrawnHandler = (player) => {
    console.log("onCardDrawnHandler == ", player);
    // socket.emit("CardDrawnHandler", { player: player, roomCode: roomCode });
  };

  const toggleChatBox = () => {
    console.log("inside toggle checkbox");
    // const chatBody = document.querySelector(".chat-body");
    // if (isChatBoxHidden) {
    //   chatBody.style.display = "block";
    //   setChatBoxHidden(false);
    // } else {
    //   chatBody.style.display = "none";
    //   setChatBoxHidden(true);
    // }
  };

  const sendMessage = (event) => {
    console.log("event");
  };

  if (gameStarted) {
    return (
      <div className={`Game backgroundColorR backgroundColor${currentColor}`}>
        {/* PLAYER 1 VIEW */}
        {currentUser === "Player 1" && (
          <>
            <div className="player2Deck" style={{ pointerEvents: "none" }}>
              <p className="playerDeckText">Player 2</p>
              {player2Deck.map((item, i) => (
                <img
                  key={i}
                  className="Card"
                  onClick={() => onCardPlayedHandler(item)}
                  src={require(`./assets/card-back.png`).default}
                  alt="card-pic"
                />
              ))}
              {turn === "Player 2" && <Spinner />}
            </div>

            <br />

            <div
              className="middleInfo"
              style={turn === "Player 2" ? { pointerEvents: "none" } : null}
            >
              <button
                className="game-button"
                disabled={turn !== "Player 1"}
                onClick={onCardDrawnHandler("Player 1")}
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
                disabled={player1Deck.length !== 2}
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
              className="player1Deck"
              style={turn === "Player 1" ? null : { pointerEvents: "none" }}
            >
              <p className="playerDeckText">Player 1</p>
              {player1Deck.map((item, i) => (
                <img
                  key={i}
                  className="Card"
                  onClick={() => onCardPlayedHandler(item)}
                  src={require(`./assets/cards-front/${item}.png`).default}
                  alt="ceard pic1"
                />
              ))}
            </div>

            <div className="chatBoxWrapper">
              <div className="chat-box chat-box-player1">
                <div className="chat-head">
                  <h2>Chat Box</h2>
                  {!isChatBoxHidden ? (
                    <span onClick={toggleChatBox} class="material-icons">
                      keyboard_arrow_down
                    </span>
                  ) : (
                    <span onClick={toggleChatBox} class="material-icons">
                      keyboard_arrow_up
                    </span>
                  )}
                </div>
                <div className="chat-body">
                  <div className="msg-insert">
                    {messages.map((msg) => {
                      if (msg.user === "Player 2")
                        return <div className="msg-receive">{msg.text}</div>;
                      if (msg.user === "Player 1")
                        return <div className="msg-send">{msg.text}</div>;
                    })}
                  </div>
                  <div className="chat-text">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      onKeyPress={(event) =>
                        event.key === "Enter" && sendMessage(event)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PLAYER 2 VIEW */}
        {currentUser === "Player 2" && (
          <>
            <div className="player1Deck" style={{ pointerEvents: "none" }}>
              <p className="playerDeckText">Player 1</p>
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
            </div>

            <br />

            <div
              className="middleInfo"
              style={turn === "Player 1" ? { pointerEvents: "none" } : null}
            >
              <button
                className="game-button"
                disabled={turn !== "Player 2"}
                onClick={onCardDrawnHandler("Player 2")}
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
                  alt="alt pic test2"
                />
              )}

              <button
                className="game-button orange"
                disabled={player2Deck.length !== 2}
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
              className="player2Deck"
              style={turn === "Player 1" ? { pointerEvents: "none" } : null}
            >
              <p className="playerDeckText">Player 2</p>
              {player2Deck.map((item, i) => (
                <img
                  key={i}
                  className="Card"
                  onClick={() => onCardPlayedHandler(item)}
                  src={require(`./assets/cards-front/${item}.png`).default}
                  alt="alt pic img"
                />
              ))}
            </div>

            <div className="chatBoxWrapper">
              <div className="chat-box chat-box-player2">
                <div className="chat-head">
                  <h2>Chat Box</h2>
                  {!isChatBoxHidden ? (
                    <span onClick={toggleChatBox} class="material-icons">
                      keyboard_arrow_down
                    </span>
                  ) : (
                    <span onClick={toggleChatBox} class="material-icons">
                      keyboard_arrow_up
                    </span>
                  )}
                </div>
                <div className="chat-body">
                  <div className="msg-insert">
                    {messages.map((msg) => {
                      if (msg.user === "Player 1")
                        return <div className="msg-receive">{msg.text}</div>;
                      if (msg.user === "Player 2")
                        return <div className="msg-send">{msg.text}</div>;
                    })}
                  </div>
                  <div className="chat-text">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      onKeyPress={(event) =>
                        event.key === "Enter" && sendMessage(event)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <br />
        <a href="/">
          <button className="game-button red">QUIT</button>
        </a>
      </div>
    );
  } else {
    return <h1>Waiting for other players to join ...</h1>;
  }
}
