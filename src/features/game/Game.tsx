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
    

    let newGameButton = (<div></div>);
    if (moveCount >= 10)
    {
        newGameButton = (<div className="gameover"><button onClick={() => dispatch(createGameAsync(token))}>Try again</button></div>);
    }

    function ShowBoard(board : Board<string>){
        let rows = Array.from(Array(10).keys());
        return (<div className="gamecontainer">
            <table className="game">
                {rows.map(item => (Row(board, item)))}
            </table>
            {newGameButton}
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
    let body;
    if (!inGame)
    {
        body = (
        <div className="startgame">
            <h2>
                Start now
            </h2>
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
        <div className="ingame">
            <div className="stats">
                <div className="score">
                    <label>
                        Score
                    </label>
                    <span>
                        {board?.score}
                    </span>
                </div>
                <div className="score">
                    <label>
                    Moves left
                    </label>
                    <span>
                        {(10 - moveCount)}
                    </span>
                </div>
            </div>
            {ShowBoard(board!)}
            <div className="gameid">
                Game Id: {gameId}
            </div>
        </div>);
    }
    
    return body;
}