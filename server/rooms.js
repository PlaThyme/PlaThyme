/* @Resources
* https://github.com/adrianhajdin/project_chat_application/blob/master/server/users.js
*
* List of all users in a Room
*/

const users = [];


//Joins a user to a room. Returns error if duplicate user is in the room.
const joinRoom = ({ id, name, gameId, roomCode, score}) => {
  const duplicateUser = users.find(
    (user) => user.roomCode === roomCode && user.name === name
  );
  if (duplicateUser) {
    return { error: "dup" };
  }

  const user = { id, name, gameId, roomCode, score};
  users.push(user);
  return user;
};

//removes the user from the room, returns their object. If not exists returns error.
const leaveRoom = (id) => {
  const toRemove = users.findIndex((user) => user.id === id);
  if (toRemove !== -1) {
    return users.splice(toRemove, 1)[0];
  }
  return { error: "not found" };
};


//Returns full user object based on socket ID. Returns error if not found.
const getUser = (id) => {
  const ret = users.find((user) => user.id === id);
  if(ret !== undefined){
    return ret;
  }
  return {error:"not found"};
};


//Returns a user by their name, and the room code that they're in. Returns error if not found.
const getUserByNameAndCode = (userName, roomCode) => {
  const ret = users.find(
    (user) => (user.roomCode === roomCode && user.name === userName)
  );
  if(ret !== undefined){
    return ret;
  }
  return {error:"not found"};
};

// get GameId for a Room, based on Room code. Returns error if not found.
const getGameId = (roomCode) => {
  const aUser = users.find((user) => user.roomCode === roomCode);
  if (aUser) {
    return aUser.gameId;
  }
  return {error: "not found"};
};


//Returns an array of objects that are a user name, and their score. Returns an error if no one in the room.
const getUsersInRoom = (roomCode) => {
  const allUsers = users.filter((user) => user.roomCode === roomCode);
  if(allUsers.length === 0){
    return {error: "not found"};
  }
  let namesAndScores = [];
  allUsers.forEach((user) => {
    namesAndScores.push({ name: user.name, score: user.score });
  });
  return namesAndScores;
};


//Updates a score for a user based on their name and room code. Returns error if not found.
const updateScore = (roomCode, playerName, score) => {
  let toUpdate = users.find(
    (user) => user.roomCode === roomCode && user.name === playerName
  );
  if(toUpdate !== undefined){
    toUpdate.score = score;
    return toUpdate.score;
  }
  return {error:"not found"};
};


//Returns the number of users associated with a specific room code.
const numUsersInRoom = (roomCode) => {
  return users.filter((user) => user.roomCode === roomCode).length;
};

module.exports = {
  joinRoom,
  leaveRoom,
  getUser,
  getGameId,
  numUsersInRoom,
  getUsersInRoom,
  getUserByNameAndCode,
  updateScore,
};
