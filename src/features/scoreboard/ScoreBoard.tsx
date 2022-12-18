import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { getAllGamesAsync, selectGlobalHighscore, selectUserHighscore } from "./scoreBoardSlice";

interface ScoreBoardProps{
    token : string,
}
export function ScoreBoard({token} : ScoreBoardProps){

    const globalHighScore = useSelector(selectGlobalHighscore);
    const userHighScore = useSelector(selectUserHighscore);
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (globalHighScore == undefined)
        dispatch(getAllGamesAsync(token));
    })

    let body = (<div>
        <p>High scores</p>
    </div>);

    return body;
}