import type { DefaultEventProps } from '../../../types/DefaultEventProps';
import { SocketResponseType } from '../../../types/SocketResponseType';
import { createLobby, getLobby, joinLobby, sendLobbyUpdate } from '../lobbyManager';
import { getGame } from '../../game/gameManager';

export default (props: DefaultEventProps, username: string, lobbyId: string | null, difficulty: string): void => {
    const { socket } = props;

    if (!username.match(/^.{1,30}$/)) {
        socket.emit(SocketResponseType.LOBBY_ERROR_INCORRECT_USERNAME);
        return;
    }

    if (lobbyId && lobbyId.length > 0 && !getLobby(lobbyId)) {
        socket.emit(SocketResponseType.LOBBY_ERROR_NOT_FOUND);
        return;
    }

    if (getGame(lobbyId) && !getGame(lobbyId)?.isFinished) {
        socket.emit(SocketResponseType.LOBBY_ERROR_GAME_ONGOING);
        return;
    }

    if (lobbyId && lobbyId.length > 0) {
        const lobby = getLobby(lobbyId);
        if (lobby && lobby.players.length >= lobby.maxPlayers) {
            socket.emit(SocketResponseType.LOBBY_ERROR_MAX_PLAYERS);
            return;
        }
    }

    const lobby = getLobby(lobbyId) ?? createLobby(difficulty);
    joinLobby(lobby.lobbyId, socket.id, username);

    socket.join(lobby.lobbyId);

    sendLobbyUpdate(props, lobby.lobbyId);
};
