import React, { useContext, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { REGISTRATION_ROUTE, LOGIN_ROUTE, HOME_ROUTE } from '../../utils/Consts';
import { registration, login } from '../../http/userAPI';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import './Auth.css'; // Подключаем файл со стилями

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password);
            }
            user.setUser(data);
            user.setIsAuth(true);
            navigate(HOME_ROUTE);
        } catch (e) {
            alert(e);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">{isLogin ? "Авторизация" : "Регистрация"}</h2>
                <div className="auth-form">
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="auth-link-text">
                        {isLogin ? (
                            <span>
                                Нет аккаунта?{' '}
                                <NavLink className="auth-link" to={REGISTRATION_ROUTE}>
                                    Зарегистрируйтесь!
                                </NavLink>
                            </span>
                        ) : (
                            <span>
                                Есть аккаунт?{' '}
                                <NavLink className="auth-link" to={LOGIN_ROUTE}>
                                    Войдите!
                                </NavLink>
                            </span>
                        )}
                    </div>
                    <button className="auth-button" onClick={click}>
                        {isLogin ? "Войти" : "Регистрация"}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Auth;
