import React from "react";

/**
 * This function returns a waiting room component for the players to land, before all ((or) minimum number) of players join the room.
 */
export default function WaitRoom() {
  return (
    <div>
      <h1 className="text-white text-center">Game will start soon.</h1>
      <h1 className="text-white text-center">
        Waiting for all players to join ...
      </h1>
    </div>
  );
}
