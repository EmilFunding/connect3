import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import path from 'path';
let baseUrl = 'http://localhost:9090/';

export interface ScoreBoardState {
    user : number,
    userHighscores? : number[],
    GlobalHighscores? : number[],
}
  
const initialState:  ScoreBoardState = {
    user : 0,
    userHighscores : undefined,
    GlobalHighscores : undefined,
};

export const getAllGamesAsync = createAsyncThunk(
    'game/getAllGames',
    async (token : string) => {
        let response = await fetch(baseUrl + "games?token=" + token, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          })
      return await response.json();
    }
  );  

export const scoreBoardSlice = createSlice({
    name: 'scoreboard',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{userId : number}>) => {
            state.user = action.payload.userId;
          }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getAllGamesAsync.fulfilled, (state, action) => {
            let games : {
                user: number,
                id: number,
                score: number,
                completed: boolean,
              }[] = action.payload;

            let sortedGames = games.sort((a,b) => {return a.score - b.score});
            
            state.GlobalHighscores = sortedGames.map(x => x.score);
            state.GlobalHighscores.reverse();
            console.log(state.user);
            state.userHighscores = sortedGames.filter(x => x.user == state.user).map(x => x.score);
            state.userHighscores.reverse();
          })
      },
  });

  export const { setUser } = scoreBoardSlice.actions;

  export const selectUserHighscore = (state : RootState) => state.scoreboard.userHighscores;
  export const selectGlobalHighscore = (state : RootState) => state.scoreboard.GlobalHighscores;

  export default scoreBoardSlice.reducer;