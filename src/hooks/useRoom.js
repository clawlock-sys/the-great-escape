// src/hooks/useRoom.js
import { usePersistedState } from './usePersistedState';

const initialGameState = {
  currentRoom: 0,
  rooms: {
    0: { completed: false, attempts: 0, hintsUsed: 0 },
    1: { completed: false, attempts: 0, hintsUsed: 0 },
    2: { completed: false, foundNashes: [], attempts: 0, hintsUsed: 0 },
    3: { completed: false, attempts: 0, hintsUsed: 0 },
    4: { completed: false, attempts: 0, hintsUsed: 0 },
    5: { completed: false, attempts: 0, hintsUsed: 0 },
    6: { completed: false, attempts: 0, hintsUsed: 0 },
  },
  totalHintsUsed: 0,
  startTime: null,
  endTime: null,
};

export function useRoom() {
  const [gameState, setGameState] = usePersistedState(
    'valentine-escape-state',
    initialGameState
  );

  const nextRoom = () => {
    setGameState((prev) => ({
      ...prev,
      currentRoom: Math.min(prev.currentRoom + 1, 6),
      startTime: prev.startTime || Date.now(),
    }));
  };

  const completeRoom = (roomId) => {
    setGameState((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: { ...prev.rooms[roomId], completed: true },
      },
      endTime: roomId === 6 ? Date.now() : prev.endTime,
    }));
  };

  const useHint = (roomId) => {
    setGameState((prev) => ({
      ...prev,
      totalHintsUsed: prev.totalHintsUsed + 1,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          hintsUsed: (prev.rooms[roomId].hintsUsed || 0) + 1,
        },
      },
    }));
  };

  const recordAttempt = (roomId) => {
    setGameState((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          attempts: (prev.rooms[roomId].attempts || 0) + 1,
        },
      },
    }));
  };

  const findNash = (roomId, nashId) => {
    setGameState((prev) => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          foundNashes: [...(prev.rooms[roomId].foundNashes || []), nashId],
        },
      },
    }));
  };

  const resetGame = () => {
    setGameState(initialGameState);
  };

  return {
    gameState,
    nextRoom,
    completeRoom,
    useHint,
    recordAttempt,
    findNash,
    resetGame,
  };
}
