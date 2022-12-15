import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { createGameAsync, selectBoard, selectGameId, selectInGame } from "./gameSlice";

interface GameProps{
    token : string,
}

export function Game({token} : GameProps){

    const inGame = useSelector(selectInGame);
    const board = useSelector(selectBoard);
    const gameId = useSelector(selectGameId);
    const dispatch = useAppDispatch();
    
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
            <h2>What an amazing game</h2>
            <h2>{board?.score}</h2>
            <h2>{gameId}</h2>
        </div>);
    }

    return body;
}