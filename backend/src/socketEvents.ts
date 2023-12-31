import type { Server, Socket } from 'socket.io';
import type { DefaultEventProps } from './types/DefaultEventProps';
import { SocketRequestType } from './types/SocketRequestType';
import joinLobby from './modules/lobby/events/joinLobby';
import joinLobbyPublic from './modules/lobby/events/joinLobbyPublic';
import leaveLobby from './modules/lobby/events/leaveLobby';
import toggleReady from './modules/lobby/events/toggleReady';
import switchCarEvent from './modules/lobby/events/switchCar';
import gameUpdate from './modules/game/events/gameUpdate';
import leaveGame from './modules/game/events/leaveGame';

const registerSocketEvents = (io: Server, socket: Socket): void => {
    const props: DefaultEventProps = { io, socket };

    socket.on(SocketRequestType.LOBBY_JOIN, (username: string, lobbyId: string | null, difficulty: string) =>
        joinLobby(props, username, lobbyId, difficulty),
    );

    socket.on(SocketRequestType.LOBBY_JOIN_PUBLIC, (username: string, difficulty: string) =>
        joinLobbyPublic(props, username, difficulty),
    );

    socket.on(SocketRequestType.LOBBY_TOGGLE_READY, () => toggleReady(props));

    socket.on(SocketRequestType.LOBBY_SWITCH_CAR, (carIndex: number) => switchCarEvent(props, carIndex));

    socket.on(SocketRequestType.DISCONNECT, () => {
        leaveLobby(props);
        leaveGame(props);
    });

    socket.on(SocketRequestType.GAME_UPDATE, (currentTextPos: number) => gameUpdate(props, currentTextPos));
};

export default registerSocketEvents;
