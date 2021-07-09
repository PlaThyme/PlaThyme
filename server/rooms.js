//Source: https://github.com/adrianhajdin/project_chat_application/blob/master/server/users.js

// List of all users in a Room
const users = [];

// check for Deuplicate user name and add user to 'users' list
const joinRoom = ({id, name, gameId, roomCode}) => {
    const duplicateUser = users.find((user) => user.roomCode === roomCode && user.name === name)
    if(duplicateUser){ 
        return {error:"Someone took your name in this room already!"}
    }
    const user = {id, name, gameId, roomCode}
    users.push(user);
    return{user}
}

// If user leaves from the Room, Remove user name from the 'users' list
const leaveRoom = (id) => {
    const toRemove = users.findIndex((user) => user.id === id);
    if(index !== -1){
        return users.splice(toRemove, 1)[0];
    }
}

// search user based on 'Id'. return user Info {id, name, gameId, roomCode}
const getUser = (id) => { return users.find((user) => user.id === id); }

// get GameId for a Room, based on Room code
const getGameId = (roomCode) => {
    const aUser = users.find((user) => user.roomCode === roomCode)
        if(aUser) { return aUser.gameId }
    return null;
}

// return all users within a Room, with a given Roomcode
const getUsersInRoom = (roomCode) => { return users.filter((user) => {user.roomCode === roomCode}); }

// return number of users within a Romm with a given Room Code
const numUsersInRoom = (roomCode) =>{ return users.filter((user) => user.roomCode === roomCode).length }

module.exports = {joinRoom, leaveRoom, getUser, getGameId, numUsersInRoom, getUsersInRoom}