//Source: https://github.com/adrianhajdin/project_chat_application/blob/master/server/users.js

const users = [];

const joinRoom = ({id, name, gameId, roomCode}) =>{
    const duplicateUser = users.find((user) => user.roomCode === roomCode && user.name === name)
    if(duplicateUser){ return {error:"Someone took your name in this room already!"}}



    const user = {id, name, gameId, roomCode}
    users.push(user);
    return{user}
}

const leaveRoom = (id) =>{
    const toRemove = users.findIndex((user) => user.id === id);
    if(index !== -1){
        return users.splice(toRemove, 1)[0];
    }
}

const getUser = (id) =>{ return users.find((user) => user.id === id);}

const getGameId = (roomCode) => {
    const aUser = users.find((user) => user.roomCode === roomCode)
        if(aUser){return aUser.gameId}
    return null;
}

const getUsersInRoom = (roomCode) =>{return users.filter((user) => {user.roomCode === roomCode});}

const numUsersInRoom = (roomCode) =>{return users.filter((user) => user.roomCode === roomCode).length}

module.exports = {joinRoom, leaveRoom, getUser, getGameId, numUsersInRoom, getUsersInRoom, roomExists}