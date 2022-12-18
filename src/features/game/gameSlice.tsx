import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { Board } from './board';
import * as ConnectGame from './board'
import path from 'path';
let baseUrl = 'http://localhost:9090/';

class CyclicGenerator implements ConnectGame.SequenceGenerator<string> {
    private sequence: string
    private index: number

    constructor(sequence: string) {
        this.sequence = sequence
        this.index = 0
    }

    next(): string {
        const n = this.sequence.charAt(this.index)
        this.index = (this.index + 1) % this.sequence.length
        return n
    }
}

export interface GameState {
    generator? : CyclicGenerator,
    board? : Board<string>,
    inGame : boolean,
    gameId : number
}
  
const initialState: GameState = {
    generator: undefined,
    board: undefined,
    inGame: false,
    gameId: 0
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
    console.log(patch.token);
      let response = await fetch(baseUrl + "games/" + patch.id + "?token=" + patch.token, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: 1, id: patch.id, score: patch.score, completed: patch.completed })
        })
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
      createUser: (state, action: PayloadAction<{username : string, password : string}>) => {
        console.log("create: user: " + action.payload.username + ", pass: " + action.payload.password);

        fetch(baseUrl + "users", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username: action.payload.username, password: action.payload.password})
        }).then(response => console.log(JSON.stringify(response)));

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
            state.generator = new CyclicGenerator('ABC');
            state.board = ConnectGame.create(state.generator, 9, 9);
          })
      },
  });

  export const selectBoard = (state : RootState) => state.game.board;
  export const selectInGame = (state : RootState) => state.game.inGame;
  export const selectGameId = (state : RootState) => state.game.gameId;

  export default gameSlice.reducer;