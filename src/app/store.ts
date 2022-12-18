import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import scoreBoardReducer from '../features/scoreboard/scoreBoardSlice';
import { ScoreBoard } from '../features/scoreboard/ScoreBoard';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    game: gameReducer,
    scoreboard: scoreBoardReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
