import { errorMonitor } from "events";
import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Board, Tile, Position, move } from "./board";
import { createGameAsync, patchGameAsync, selectBoard, selectGameId, selectInGame, makeMove, selectMoveCount, makeStable, selectGameOver, setGameOver } from "./gameSlice";
import './Game.css';

interface GameProps{
    token : string,
    user : number
}

function CoordsToIndex(col: number, row: number, width: number): number {
    return col + (row * width);
}

export function Game({token, user} : GameProps){

    const inGame = useSelector(selectInGame);
    const board = useSelector(selectBoard);
    const gameId = useSelector(selectGameId);
    const gameOver = useSelector(selectGameOver);
    const moveCount = useSelector(selectMoveCount);
    const dispatch = useAppDispatch();
    
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
                
            if (!gameOver)
            {
                dispatch(makeMove({first: first!,second: second!}));
            }

            if (moveCount == 9)
            {
                dispatch(setGameOver());
            }
                
            let complete = moveCount >= 10;
            let patch = {token: token, user: user, id: gameId, score : board.score, completed : complete};
            dispatch(patchGameAsync(patch));
        }
    }

    let newGameButton = undefined;
    if (moveCount >= 10)
    {
        newGameButton = (<button onClick={() => dispatch(createGameAsync(token))}>Create new game</button>);
    }

    let body;
    if (!inGame)
    {
        body = (
        <div>
            <h2>Connect 3</h2>
            <button onClick={() => dispatch(createGameAsync(token))}>Create new game</button>
        </div>);
    }
    else
    {
        if(moveCount == 0)
        {
            dispatch(makeStable());
        }
    
        body = (
        <div>
            <h2>Connect 3</h2>
            <p>Score: {board?.score} - GameId: {gameId} - Moves left: {(10 - moveCount)}</p>
            {ShowBoard(board!)}
            {newGameButton}
            
        </div>);
    }
    
    return body;
}