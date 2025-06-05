import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Context } from '../..';
import { authRoutes, publicRoutes } from '../../routes';
import { HOME_ROUTE } from '../../utils/Consts';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

const AppRouter = observer(() => {
    const { user } = useContext(Context);
    

    return (
        <div>
            <NavBar />
            <Routes>
                {user.isAuth &&
                    authRoutes.map(({ path, Component }) => (
                        <Route key={path} path={path} element={<Component />} />
                    ))}
                {publicRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
                <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
            </Routes>
            <Footer/>
            
        </div>
    );
});

export default AppRouter;
