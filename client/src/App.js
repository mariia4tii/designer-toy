import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import AppRouter from './components/AppRouter/AppRouter';

//import ProductPage from './pages/ProductPage/ProductPage';
//import Auth from './pages/Auth/Auth';



const App = observer(() => {
    return (
        <Router>
            <AppRouter />
        </Router>
    );
});

export default App;
