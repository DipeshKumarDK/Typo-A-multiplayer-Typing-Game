import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/ProgressInfoContainer.module.scss";
import { GameStateContext, socket } from "../pages/MainLobby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import GeneratedWords from "../components/GeneratedWords";
import UserTypings from "../components/UserTypings";

interface Props {
  words: string;
  typed: string;
}

const ProgressInfoContainer: React.FC<Props> = ({ words, typed }: Props) => {
  const gameState = useContext(GameStateContext) ?? {
    text: "",
    players: [],
    gameStartTime: 0,
  };
  const { text, players, gameStartTime } = gameState;
  const player = players.find((player) => player.socketId === socket.id);

  if (!player) return <></>;

  const [allWords, setAllWords] = useState(words);

  return (
    <section className={styles.container}>
      {player.isFinished ? (
        <div className={styles.top__finished}>
          <FontAwesomeIcon icon={faCheck} className={styles.finishedIcon} />
        </div>
      ) : (
        <div className="w-full">
          <div className="border-2 border-slate-100 max-h-96 overflow-y-scroll p-8">
            <WordsContainer>
              <GeneratedWords key={allWords} words={allWords} />
              <UserTypings
                className="absolute inset-0"
                words={allWords}
                userInput={typed}
              />
            </WordsContainer>
          </div>
        </div>
      )}
    </section>
  );
};

const WordsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative text-3xl leading-relaxed break-all mt-3 overflow-x-auto">
      {children}
    </div>
  );
};

const CountdownTimer = ({ timeLeft }: { timeLeft: number }) => {
  return (
    <h2 className="text-primary-400 font-medium text-center text-lg">
      Time: {timeLeft}
    </h2>
  );
};

export default ProgressInfoContainer;
