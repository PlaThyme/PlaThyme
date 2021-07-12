//Source: https://github.com/adrianhajdin/project_chat_application/blob/master/server/users.js

// List of all users in a Room
const users = [];

const joinRoom = ({ id, name, gameId, roomCode }) => {
  const duplicateUser = users.find(
    (user) => user.roomCode === roomCode && user.name === name
  );
  if (duplicateUser) {
    return { error: "dup" };
  }

  const user = { id, name, gameId, roomCode };
  users.push(user);
  return { user };
};

const leaveRoom = (id) => {
  const toRemove = users.findIndex((user) => user.id === id);
  if (toRemove !== -1) {
    return users.splice(toRemove, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUserByNameAndCode = (userName, roomCode) => {
  return users.find((user) => user.roomCode === roomCode && user.name === userName);
}

// get GameId for a Room, based on Room code
const getGameId = (roomCode) => {
  const aUser = users.find((user) => user.roomCode === roomCode);
  if (aUser) {
    return aUser.gameId;
  }
  return null;
};

const getUsersInRoom = (roomCode) => {
  return users.filter((user) => user.roomCode === roomCode).map(user => user.name);
};

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
};
