import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    createUser,
    loginAsync,
    selectValidToken,
    selectToken,
    logoutAsync,
    selectUser,
    changePasswordAsync
} from './authSlice';
import styles from './Auth.module.css';
import { createStore } from "redux";
import { Game } from "../game/Game";
import { ScoreBoard } from "../scoreboard/ScoreBoard";
import './Auth.css';

export function Auth() {
    const token = useSelector(selectToken);
    const user = useSelector(selectUser);
    const validToken = useSelector(selectValidToken);
    const dispatch = useAppDispatch();
    let [mode, setMode] = useState("login");
    const [username, setUsername] = useState('user');
    const [password, setPassword] = useState('secret');
    const [newPassword, setNewPassword] = useState('');

    let title, button, action;
    let cred = {
        username: username,
        password: password
    }
    if (mode == "login") {
        title = "Login";
        button = <button onClick={() => dispatch(loginAsync(cred))}>Login</button>;
        action = <div className={styles.loginAction} onClick={() => setMode("create")}>Create user</div>;
    }
    else if (mode == "create") {
        title = "Create user";
        button = <button onClick={() => dispatch(createUser({ username, password }))}>Create</button>;
        action = <div className={styles.loginAction} onClick={() => setMode("login")}>Login</div>;
    }

    let body;
    if (validToken) {
        body = 
        <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
                <div className={styles.token}>
                    {token}
                </div>
                <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                <button onClick={() => dispatch(changePasswordAsync({userid: user, token: token, password: newPassword}))}>Change Password</button>
                <button onClick={() => dispatch(logoutAsync(token))}>Logout</button>
            </div>
            <div className={styles.gameContent}>
                <Game token={token} user={user}></Game>
                <ScoreBoard token={token} user={user}></ScoreBoard>
            </div>
        </div>;
    }
    else 
    {
        body = (
            <div className={styles.loginContainer}>
                <h1>
                    {title}
                </h1>

                <label>
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                <label>
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                {button}
                {action}
            </div>
        );
    }

    return body;
}