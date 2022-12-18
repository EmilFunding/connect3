import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getAllGamesAsync, selectGlobalHighscore, selectUserHighscore, setUser } from "./scoreBoardSlice";
import './ScoreBoard.css';


interface ScoreBoardProps{
    token : string,
    user: number
}
export function ScoreBoard({token, user} : ScoreBoardProps){

    const globalHighScore = useSelector(selectGlobalHighscore);
    const userHighScore = useSelector(selectUserHighscore);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (globalHighScore == undefined)
        dispatch(getAllGamesAsync(token));
        dispatch(setUser({ userId: user }));
    })

    function ShowHighScores(scores : number[] ,i : number, type : string){
        let rows = Array.from(Array(i).keys());
        return (
        <div className={type}>
            <label>
                {type} top {i}
            </label>
            <ol>
                {rows.map(item => (<li>{scores![item]}</li>))}
            </ol>
        </div>);
    }

    let scores;
    if (globalHighScore != undefined)
    {
        scores = (
        <div>
            {ShowHighScores(globalHighScore! , 10, "global")}
            {ShowHighScores(userHighScore! , 3, "personal")}
        </div>)
    }

    let body = (<div className="scores">
        <p>High scores</p>
        {scores}
    </div>);

    return body;
}