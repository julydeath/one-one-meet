import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1;

interface Room {
  user1: User;
  user2: User;
}

export function RoomManager() {
  let rooms = new Map<string, Room>();

  function generate(): Number {
    return GLOBAL_ROOM_ID++;
  }

  function createRoom(user1: User, user2: User) {
    const roomId = generate().toString();

    rooms.set(roomId, {
      user1,
      user2,
    });

    user1.socket.emit("send-offer", {
      roomId,
    });

    user2.socket.emit("send-offer", {
      roomId,
    });
  }

  function onOffer(roomId: string, sdp: string, senderSocketid: String) {
    const room = rooms.get(roomId);

    if (!room) {
      return;
    }

    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser?.socket.emit("offer", {
      sdp,
      roomId,
    });
  }

  function onAnswer(roomId: string, sdp: string, senderSocketid: String) {
    const room = rooms.get(roomId);

    if (!room) {
      return;
    }

    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser?.socket.emit("answer", {
      sdp,
      roomId,
    });
  }

  function onIceCandidates(
    roomId: string,
    senderSocketid: String,
    candidate: any,
    type: "sender " | "receiver"
  ) {
    const room = rooms.get(roomId);

    if (!room) {
      return;
    }

    const receivingUser =
      room.user1.socket.id === senderSocketid ? room.user2 : room.user1;
    receivingUser?.socket.emit("add-ice-candidate", { candidate, type });
  }

  return { createRoom, onAnswer, onOffer, onIceCandidates };
}
