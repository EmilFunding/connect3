import { errorMonitor } from "events";
import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Board, Tile, Position, move } from "./board";
import { createGameAsync, patchGameAsync, selectBoard, selectGameId, selectInGame } from "./gameSlice";
import './Game.css';

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

    function ShowBoard(board : Board<string>){
        let rows = Array.from(Array(10).keys());
        return (<div className="gamecontainer">
            <table className="game">
                {rows.map(item => (Row(board, item)))}
            </table>
        </div>);
    }

    function Row(board : Board<string>, y : number){
        let p = board.pieces.slice(y * board.width, (y * board.width) + board.width)

        return (<tr className="row">
            {p.map((item, index) => <td onClick={() => Select(board, index, y)}><img src={"/tiles/" + item + ".png"} /></td>)}
        </tr>)
    }
    let _positions : Position[];

    function Select(board : Board<string>, x : number, y : number){
        let pos: Position = {
            col: x,
            row: y
        };
        if(_positions == undefined){
            _positions = []
        }
        _positions.push(pos);
        if(_positions.length == 2){
            let second = _positions.pop();
            let first = _positions.pop();
            console.log("move")
            dispatch(() => move(board, first!, second!))
        }
    }

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
            {ShowBoard(board!)}
        </div>);
    }
    
    return body;
}