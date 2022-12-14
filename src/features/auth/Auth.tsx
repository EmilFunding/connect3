import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    createUser,
    loginAsync,
    selectValidToken,
    selectToken,
    logoutAsync
} from './authSlice';
import styles from './Auth.module.css';
import { createStore } from "redux";

export function Auth() {
    const token = useSelector(selectToken);
    const validToken = useSelector(selectValidToken);
    const dispatch = useAppDispatch();
    let [mode, setMode] = useState("login");
    const [username, setUsername] = useState('user');
    const [password, setPassword] = useState('secret');

    let title, button, action;
    let cred = {
        username: username,
        password: password
    }

    if (mode == "login") {
        title = "Login1";
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
        body = <div>
            <button onClick={() => dispatch(logoutAsync(token))}>Logout</button>
            <h1>ok</h1><p>{token}</p>
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