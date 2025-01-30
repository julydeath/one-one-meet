import { Socket } from "socket.io";

export type User = {
  name: string;
  socket: Socket;
};

export type Queue = String;

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
  }
}
