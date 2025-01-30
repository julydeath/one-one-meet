import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export type User = {
  name: string;
  socket: Socket;
};

export type Queue = String;

const { createRoom, onAnswer, onIceCandidates, onOffer } = RoomManager();

export function UserManager() {
  let users: User[] = [];
  let queue: Queue[] = [];

  function addUser(name: string, socket: Socket) {
    users.push({
      name,
      socket,
    });

    queue.push(socket.id);

    socket.emit("lobby");

    clearQueue();

    initHandlers(socket);
  }

  function removeUser(socketId: string) {
    users = users.filter((user) => user.socket.id !== socketId);
    queue = queue.filter((id) => id !== socketId);
  }

  function clearQueue() {
    if (queue.length < 2) {
      return;
    }

    const id1 = queue.pop();
    const id2 = queue.pop();

    const user1 = users.find((user) => user.socket.id === id1);
    const user2 = users.find((user) => user.socket.id === id2);

    if (!user1 || !user2) {
      return;
    }

    const room = createRoom(user1, user2);
    clearQueue();
  }

  function initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }) => {
      onOffer(roomId, sdp, socket.id);
    });

    socket.on("answer", ({ sdp, roomId }) => {
      onAnswer(roomId, sdp, socket.id);
    });
    socket.on("add-ice-candidate", ({ candidate, roomId, type }) => {
      onIceCandidates(roomId, socket.id, candidate, type);
    });
  }

  return { addUser, removeUser };
}
