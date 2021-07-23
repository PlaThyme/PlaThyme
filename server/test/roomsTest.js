const assert = require('chai').assert;
const {
  joinRoom,
  leaveRoom,
  getUser,
  getGameId,
  numUsersInRoom,
  getUsersInRoom,
  getUserByNameAndCode,
  updateScore,
} = require("../rooms.js");

describe('Rooms', () => {
    let user1 = {id:123, name:"Test Name", gameId:"1", roomCode:"ABC123", score:10};
    let user2 = {id:321, name:"Test Name", gameId:"1", roomCode:"ABC123", score:20};
    let user3 = {id:955, name:"Test Name 2", gameId:"1", roomCode:"ABC888", score:30};

    //Join room tests
    it('joinRoom should return the user provided.', () => {
      assert.equal("Test Name", joinRoom(user1).name);
    });
    it('joinRoom with duplicate name in same room should return error.', () => {
      assert.equal("dup", joinRoom(user2).error);
    });
    it('joinRoom with same room different name should work.', () => {
      user2.name = "Different Name"
      assert.equal("Different Name", joinRoom(user2).name);
    });

    //getUser tests.
    it('getUser should pass with existing user, and return them', () => {
      assert.equal("Test Name", getUser(123).name);
    });
    it('getUser should return an error when the user doesnt exit', () => {
      assert.equal("not found", getUser(999).error);
    });

    //getUserByNameAndCode tests.
    it('getUserByNameAndCode should pass with existing user in the specified room, and return them', () => {
      assert.equal("Test Name", getUserByNameAndCode("Test Name", "ABC123").name);
    });
    it('getUserByNameAndCode should return an error when the user doesnt exit in room', () => {
      assert.equal("not found", getUserByNameAndCode("Test Name", "AAB112").error);
    });

    //getGameId tests.
    it('getGameId for a room that does exist should return its Id', () => {
      assert.equal("1", getGameId("ABC123"));
    });
    it('getGameId for a room that does not exist should return an error', () => {
      assert.equal("not found", getGameId("AAAHHH").error);
    });

    //getUsersInRoom tests
    it('getUsersInRoom should return names for all users in a room for room with users', () => {
      const usrs = getUsersInRoom("ABC123");
      assert.isTrue(usrs.find((user) => user.name === "Test Name").score === 10 && usrs.find((user) => user.name === "Different Name").score === 20);

    });
    it('getUsersInRoom should return only the users in that room', () => {
      const usrs = getUsersInRoom("ABC123");
      assert.isFalse(usrs.find((user) => user.name === "Test Name 2") !== undefined);
    });

    //updateScore tests
    it('updateScore should return new score if it works', () => {
      assert.equal(444,updateScore("ABC123", "Test Name", 444));
    });
    it('updateScore should return an error if unable to update the score', () => {
      assert.equal("not found",updateScore("ABC123", "Test Name 2", 444).error);
    });

    //numUsersInRoom tests
    it('numUsersInRoom should return correct number when room exists, or doesnt', () => {
      assert.equal(2, numUsersInRoom("ABC123"));
      assert.equal(0, numUsersInRoom("ABCXX1"));
    });

    //leaveRoom tests
    it('leaveRoom should return user when successfully removed', () => {
      assert.equal("Test Name", leaveRoom(123).name);
    });
    it('leaveRoom should return error socket id is not in a room. Also indicates user was correctly removed above.', () => {
      assert.equal("not found", leaveRoom(123).error);
    });

});