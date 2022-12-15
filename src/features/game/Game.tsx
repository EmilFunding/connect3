import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

export function Game(){

    const dispatch = useAppDispatch();
    
    let body = (<h2>What an amazing game</h2>);

    return body;
}