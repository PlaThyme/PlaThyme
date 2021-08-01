// UNO?™

import React, { useState, useEffect } from 'react';
// import queryString from 'query-string'
import PACK_OF_CARDS from "./utils/packOfCards";
import shuffleArray from "./utils/shuffleArray";
import io from "socket.io-client";
import Spinner from './Spinner'
import useSound from 'use-sound'
import bgMusic from './assets/sounds/game-bg-music.mp3';
import unoSound from './assets/sounds/uno-sound.mp3'
// import shufflingSound from './assets/sounds/shuffling-cards-1.mp3'
// import skipCardSound from './assets/sounds/skip-sound.mp3'
// import draw2CardSound from './assets/sounds/draw2-sound.mp3'
// import wildCardSound from './assets/sounds/wild-sound.mp3'
// import draw4CardSound from './assets/sounds/draw4-sound.mp3'
// import gameOverSound from './assets/sounds/game-over-sound.mp3'
import './unotm.css';

export default function UNOTM({ socket }){
  // const data = queryString.parse(props.location.search)
  // console.log("data = ", data); // to get room code
  //initialize socket state
  // const [room, setRoom] = useState(data.roomCode)
  const [roomFull, setRoomFull] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  // const [message, setMessage] = useState('')
  // const [messages, setMessages] = useState([])

  //initialize game state
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState("");
  const [turn, setTurn] = useState("");
  const [player1Deck, setPlayer1Deck] = useState([]);
  const [player2Deck, setPlayer2Deck] = useState([]);
  const [currentColor, setCurrentColor] = useState("");
  // const [currentNumber, setCurrentNumber] = useState('')
  const [playedCardsPile, setPlayedCardsPile] = useState([]);
  // const [drawCardPile, setDrawCardPile] = useState([])

  // const [isChatBoxHidden, setChatBoxHidden] = useState(true)
  const [isUnoButtonPressed, setUnoButtonPressed] = useState(false);
  const [isSoundMuted, setSoundMuted] = useState(false);
  const [isMusicMuted, setMusicMuted] = useState(true);

  const [playBBgMusic, { pause }] = useSound(bgMusic, { loop: true });
  const [playUnoSound] = useSound(unoSound);
  // const [playShufflingSound] = useSound(shufflingSound)
  // const [playSkipCardSound] = useSound(skipCardSound)
  // const [playDraw2CardSound] = useSound(draw2CardSound)
  // const [playWildCardSound] = useSound(wildCardSound)
  // const [playDraw4CardSound] = useSound(draw4CardSound)
  // const [playGameOverSound] = useSound(gameOverSound)

  //runs once on component mount
  // useEffect(() => {
  //   //shuffle PACK_OF_CARDS array
  //   const shuffledCards = shuffleArray(PACK_OF_CARDS);

  //   //extract first 7 elements to player1Deck
  //   const player1Deck = shuffledCards.splice(0, 7);

  //   //extract first 7 elements to player2Deck
  //   const player2Deck = shuffledCards.splice(0, 7);

  //   //extract random card from shuffledCards and check if its not an action card
  //   let startingCardIndex;
  //   while (true) {
  //     startingCardIndex = Math.floor(Math.random() * 94);
  //     if (
  //       shuffledCards[startingCardIndex] === "skipR" ||
  //       shuffledCards[startingCardIndex] === "_R" ||
  //       shuffledCards[startingCardIndex] === "D2R" ||
  //       shuffledCards[startingCardIndex] === "skipG" ||
  //       shuffledCards[startingCardIndex] === "_G" ||
  //       shuffledCards[startingCardIndex] === "D2G" ||
  //       shuffledCards[startingCardIndex] === "skipB" ||
  //       shuffledCards[startingCardIndex] === "_B" ||
  //       shuffledCards[startingCardIndex] === "D2B" ||
  //       shuffledCards[startingCardIndex] === "skipY" ||
  //       shuffledCards[startingCardIndex] === "_Y" ||
  //       shuffledCards[startingCardIndex] === "D2Y" ||
  //       shuffledCards[startingCardIndex] === "W" ||
  //       shuffledCards[startingCardIndex] === "D4W"
  //     ) {
  //       continue;
  //     } else break;
  //   }

  //   //extract the card from that startingCardIndex into the playedCardsPile
  //   const playedCardsPile = shuffledCards.splice(startingCardIndex, 1);

  //   //store all remaining cards into drawCardPile
  //   const drawCardPile = shuffledCards;

  // }, []);
    
  return (
    <div className={`Game backgroundColorR backgroundColor${currentColor}`}>
      {!roomFull ? (
        <>
          <div className="topInfo">
            <img src={require("./assets/logo.png").default} alt="asset logo" />
            <h1>Game Code: roomcode</h1>
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
            </span>
          </div>

          {/* PLAYER LEFT MESSAGES */}
          {users.length === 1 && currentUser === "Player 2" && (
            <h1 className="topInfoText">Player 1 has left the game.</h1>
          )}
          {users.length === 1 && currentUser === "Player 1" && (
            <h1 className="topInfoText">
              Waiting for Player 2 to join the game.
            </h1>
          )}

          {users.length === 2 && (
            <>
              {gameOver ? (
                <div>
                  {winner !== "" && (
                    <>
                      <h1>GAME OVER</h1>
                      <h2>{winner} wins!</h2>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {/* PLAYER 1 VIEW */}
                  {currentUser === "Player 1" && (
                    <>
                      <div
                        className="player2Deck"
                        style={{ pointerEvents: "none" }}
                      >
                        <p className="playerDeckText">Player 2</p>
                        {player2Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            // onClick={() => onCardPlayedHandler(item)}
                            src={require(`./assets/card-back.png`).default}
                            alt="card pic"
                          />
                        ))}
                        {turn === "Player 2" && <Spinner />}
                      </div>
                      <br />
                      <div
                        className="middleInfo"
                        style={
                          turn === "Player 2" ? { pointerEvents: "none" } : null
                        }
                      >
                        <button
                          className="game-button"
                          disabled={turn !== "Player 1"}
                          // onClick={onCardDrawnHandler}
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
                        style={
                          turn === "Player 1" ? null : { pointerEvents: "none" }
                        }
                      >
                        <p className="playerDeckText">Player 1</p>
                        {player1Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            // onClick={() => onCardPlayedHandler(item)}
                            src={
                              require(`./assets/cards-front/${item}.png`)
                                .default
                            }
                            alt="ceard pic1"
                          />
                        ))}
                      </div>

                      {/* <div className="chatBoxWrapper">
                            <div className="chat-box chat-box-player1">
                                <div className="chat-head">
                                    <h2>Chat Box</h2>
                                    {!isChatBoxHidden ?
                                    <span 
                                    // onClick={toggleChatBox} 
                                    class="material-icons">keyboard_arrow_down</span> :
                                    <span 
                                    // onClick={toggleChatBox} 
                                    class="material-icons">keyboard_arrow_up</span>}
                                </div>
                                <div className="chat-body">
                                    <div className="msg-insert">
                                        {messages.map(msg => {
                                            if(msg.user === 'Player 2')
                                                return <div className="msg-receive">{msg.text}</div>
                                            if(msg.user === 'Player 1')
                                                return <div className="msg-send">{msg.text}</div>
                                        })}
                                    </div>
                                    <div className="chat-text">
                                        <input type='text' placeholder='Type a message...' value={message} onChange={event => setMessage(event.target.value)} onKeyPress={event => event.key==='Enter' 
                                        // && 
                                        // sendMessage(event)
                                        } />
                                    </div>
                                </div>
                            </div>
                        </div>  */}
                    </>
                  )}

                  {/* PLAYER 2 VIEW */}
                  {currentUser === "Player 2" && (
                    <>
                      <div
                        className="player1Deck"
                        style={{ pointerEvents: "none" }}
                      >
                        <p className="playerDeckText">Player 1</p>
                        {player1Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            // onClick={() => onCardPlayedHandler(item)}
                            src={require(`./assets/card-back.png`).default}
                            alt="alt pic text"
                          />
                        ))}
                        {turn === "Player 1" && <Spinner />}
                      </div>
                      <br />
                      <div
                        className="middleInfo"
                        style={
                          turn === "Player 1" ? { pointerEvents: "none" } : null
                        }
                      >
                        <button
                          className="game-button"
                          disabled={turn !== "Player 2"}
                          // onClick={onCardDrawnHandler}
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
                        style={
                          turn === "Player 1" ? { pointerEvents: "none" } : null
                        }
                      >
                        <p className="playerDeckText">Player 2</p>
                        {player2Deck.map((item, i) => (
                          <img
                            key={i}
                            className="Card"
                            // onClick={() => onCardPlayedHandler(item)}
                            src={
                              require(`./assets/cards-front/${item}.png`)
                                .default
                            }
                            alt="alt pic img"
                          />
                        ))}
                      </div>

                      {/* <div className="chatBoxWrapper">
                            <div className="chat-box chat-box-player2">
                                <div className="chat-head">
                                    <h2>Chat Box</h2>
                                    {!isChatBoxHidden ?
                                    <span 
                                    // onClick={toggleChatBox} 
                                    class="material-icons">keyboard_arrow_down</span> :
                                    <span 
                                    // onClick={toggleChatBox} 
                                    class="material-icons">keyboard_arrow_up</span>}
                                </div>
                                <div className="chat-body">
                                    <div className="msg-insert">
                                        {messages.map(msg => {
                                            if(msg.user === 'Player 1')
                                                return <div className="msg-receive">{msg.text}</div>
                                            if(msg.user === 'Player 2')
                                                return <div className="msg-send">{msg.text}</div>
                                        })}
                                    </div>
                                    <div className="chat-text">
                                        <input type='text' placeholder='Type a message...' value={message} onChange={event => setMessage(event.target.value)} onKeyPress={event => event.key==='Enter' 
                                        // && sendMessage(event)
                                      } 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>  */}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <h1>Room full</h1>
      )}

      <br />
      <a href="/">
        <button className="game-button red">QUIT</button>
      </a>
    </div>
  );
}