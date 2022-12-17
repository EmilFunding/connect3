import { errorMonitor } from "events";
import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { createGameAsync, patchGameAsync, selectBoard, selectGameId, selectInGame } from "./gameSlice";

interface GameProps{
    token : string,
}

function CoordsToIndex(col: number, row: number, width: number): number {
    return col + (row * width);
}

export function Game({token} : GameProps){

    const inGame = useSelector(selectInGame);
    const board = useSelector(selectBoard);
    const gameId = useSelector(selectGameId);
    const dispatch = useAppDispatch();
    
    let patch = {token: token, user: 1, id: 1, score : 17, completed : false};

    let body;
    if (!inGame)
    {
        body = (
        <div>
            <h2>What an amazing game</h2>
            <button onClick={() => dispatch(createGameAsync(token))}>Create new game</button>
        </div>);
    }
    else
    {
        body = (
        <div>
            <button onClick={() => dispatch(patchGameAsync(patch))}>Patch</button>
            <h2>What an amazing game</h2>
            <p>Score: {board?.score}</p>
            <p>GmaeId: {gameId}</p>
        </div>);
    }

    return body;
}