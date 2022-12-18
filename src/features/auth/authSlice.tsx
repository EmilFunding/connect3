import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { stringify } from 'querystring';
let baseUrl = 'http://localhost:9090/';

export interface AuthState {
    username: string,
    status: string,
    token: string,
    validToken: boolean,
    userId : number,
}
  
const initialState: AuthState = {
    username: "",
    status: "",
    token: "",
    validToken: false,
    userId: -1,
  };

  export const loginAsync = createAsyncThunk(
    'auth/login',
    async (loginInfo: { username: string, password: string }) => {
        let response = await fetch(baseUrl + "login", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: loginInfo.username, password: loginInfo.password})
          })
      return await response.json();
    }
  );

  export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (token : string) => {
        let response = await fetch(baseUrl + "logout?token=" + token, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
        })
    }
  );

  export const authSlice = createSlice({
    name: 'auth',
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
          .addCase(loginAsync.pending, (state) => {
            state.validToken = false;
            state.token = "";
          })
          .addCase(loginAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            if(action.payload.token != '') {
                console.log(action.payload);
                state.validToken = true;
                state.token = action.payload.token;
                state.userId = action.payload.userId;
              }
          })
          .addCase(logoutAsync.fulfilled, (state) => {
            state.validToken = false;
            state.token = "";
          })
      },
  });

  export const {createUser} = authSlice.actions;

  export const selectValidToken = (state : RootState) => state.auth.validToken;
  export const selectToken = (state : RootState) => state.auth.token;
  export const selectUser = (state : RootState) => state.auth.userId;

  export default authSlice.reducer;