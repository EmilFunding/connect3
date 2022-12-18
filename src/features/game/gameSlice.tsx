import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { Board, Tile } from './board';
import * as ConnectGame from './board'
import path from 'path';
let baseUrl = 'http://localhost:9090/';

export class CyclicGenerator implements ConnectGame.SequenceGenerator<string> {
    private sequence: string[]
    private index: number

    constructor(sequence: string[]) {
        this.sequence = sequence
        this.index = 0
    }

    next(): string {
        const n = Math.floor(Math.random() * this.sequence.length);
        return this.sequence[n];
    }
}

export interface GameState {
    generator? : CyclicGenerator,
    board? : Board<string>,
    inGame : boolean,
    gameId : number,
    moveCount : number,
    gameOver : boolean,
}
  
const initialState: GameState = {
    generator: undefined,
    board: undefined,
    inGame: false,
    gameId: 0,
    moveCount : 0,
    gameOver : false
};

export const createGameAsync = createAsyncThunk(
    'game/createGame',
    async (token: string) => {
        let response = await fetch(baseUrl + "games?token=" + token, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
      return await response.json();
    }
);

export const patchGameAsync = createAsyncThunk(
  'game/pathGame',
  async (patch : {token: string, user: number, id: number, score : number, completed : boolean}) => {
    console.log(patch);
      let response = await fetch(baseUrl + "games/" + patch.id + "?token=" + patch.token, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: patch.user, id: patch.id, score: patch.score, completed: patch.completed })
        })
        console.log(response);
    return await response.json();
  }
);

export const getAllGameAsync = createAsyncThunk(
  'game/getAllGames',
  async (patch : {token: string, user: number, id: number, score : number, completed : boolean}) => {
    console.log(patch.token);
      let response = await fetch(baseUrl + "games?token=" + patch.token, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
    return await response.json();
  }
);

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
      reset: (state) => {
        state.inGame = false;
        state.gameOver = false;
      },
      setGameOver: (state) => {
        state.gameOver = true;
      },
      makeMove: (state, action: PayloadAction<{first : ConnectGame.Position, second : ConnectGame.Position}>) => {
        state.board = ConnectGame.move(state.board!, action.payload.first, action.payload.second).board;
        state.moveCount++;
      },
      makeStable: (state) => {
        let moveResult: ConnectGame.MoveResult<string> = {
          board: state.board!,
          effects: []
        };
        // Create stable board state
        state.board = ConnectGame.evolveBoard(moveResult).board;
        state.board.score = 0;
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(createGameAsync.pending, (state) => {
            state.inGame = false;
          })
          .addCase(createGameAsync.fulfilled, (state, action) => {
            state.gameId = action.payload.id;
            state.inGame = true;
            state.gameOver = false;
            state.generator = new CyclicGenerator(['bee','frog','lion','pig', 'turtle']);
            state.board = ConnectGame.create(state.generator, 9, 9);
          })
      },
  });

  export const { makeMove, makeStable, setGameOver } = gameSlice.actions;

  export const selectBoard = (state : RootState) => state.game.board;
  export const selectInGame = (state : RootState) => state.game.inGame;
  export const selectGameId = (state : RootState) => state.game.gameId;
  export const selectGenerator = (state : RootState) => state.game.generator;
  export const selectMoveCount = (state : RootState) => state.game.moveCount;
  export const selectGameOver = (state : RootState) => state.game.gameOver;

  export default gameSlice.reducer;