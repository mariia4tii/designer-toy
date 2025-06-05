import React, { useContext } from 'react';
import { Context } from '../..';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as Lk } from './lk.svg';
import { ReactComponent as Basket } from './basket.svg';
import {
  ADMIN_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  SHOP_ROUTE,
  BASKET_ROUTE,
  DESIGNER_PROFILE_ROUTE,
  USER_ROUTE,
  ADMIN_PROFILE_ROUTE
} from '../../utils/Consts';
import { observer } from 'mobx-react-lite';

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isAdmin = token ? JSON.parse(atob(token.split('.')[1])).role === "admin" : false;
  const isDesigner = token ? JSON.parse(atob(token.split('.')[1])).role === "designer" : false;

  const navbarStyles = {
    position: 'fixed',
    backgroundColor: '#EFEAE0',
    fontFamily: '"Neucha", cursive',
    color: '#181818',
    width: '100%',
    zIndex: 9999,
    paddingBottom: '20px',
    height: '80px',
  };

  const navLinkStyles = {
    color: '#181818',
    fontSize: '20px',
    textDecoration: 'none',
    marginLeft: '40px',
    marginTop: '0px',
  };

  const navLinkHoverStyles = {
    color: '#98AEFA',
  };

  const iconButtonStyles = {
    backgroundColor: 'transparent',
    border: 'none',
    marginRight: '50px',
    padding: '0',
    cursor: 'pointer',
  };

  const ButtonStyles = {
    backgroundColor: 'transparent',
    border: '1px solid #181818',
    color: '#181818',
    fontFamily: '"Neucha", cursive',
    fontSize: '20px',
    marginRight: '40px',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '7px',
  };

  const ButtonStylesHovering = {
    color: '#98AEFA',
    border: '1px solid #98AEFA',
  };

  return (
    <Navbar style={navbarStyles} expand="lg">
      <Container>
        <NavLink to={HOME_ROUTE}>
          <Button
            style={{
              textDecoration: 'none',
              marginRight: '60px',
              marginTop: '0px',
              backgroundColor: 'transparent',
              border: 'transparent',
            }}
          >
            <Logo />
          </Button>
        </NavLink>

        <Nav
          className="me-auto"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <NavLink
            to={SHOP_ROUTE}
            style={navLinkStyles}
            onMouseEnter={(e) => (e.target.style.color = navLinkHoverStyles.color)}
            onMouseLeave={(e) => (e.target.style.color = navLinkStyles.color)}
          >
            Каталог
          </NavLink>
          <Nav.Link
            href="#designer"
            style={navLinkStyles}
            onMouseEnter={(e) => (e.target.style.color = navLinkHoverStyles.color)}
            onMouseLeave={(e) => (e.target.style.color = navLinkStyles.color)}
          >
            Дизайнеры
          </Nav.Link>
          <Nav.Link
            href="#collection"
            style={navLinkStyles}
            onMouseEnter={(e) => (e.target.style.color = navLinkHoverStyles.color)}
            onMouseLeave={(e) => (e.target.style.color = navLinkStyles.color)}
          >
            Коллекции
          </Nav.Link>
        </Nav>

        {user.isAuth ? (
          <Nav className="nl-auto">
            {isAdmin && (
              <Button
                style={ButtonStyles}
                onMouseEnter={(e) => (e.target.style.color = ButtonStylesHovering.color)}
                onMouseLeave={(e) => (e.target.style.color = ButtonStyles.color)}
                onClick={() => navigate(ADMIN_ROUTE)}
              >
                Админ панель
              </Button>
            )}

            {isDesigner && (
              <Button
                style={ButtonStyles}
                onMouseEnter={(e) => (e.target.style.color = ButtonStylesHovering.color)}
                onMouseLeave={(e) => (e.target.style.color = ButtonStyles.color)}
                onClick={() => navigate(DESIGNER_PROFILE_ROUTE)} // или другой маршрут панели дизайнера
              >
                Панель дизайнера
              </Button>
            )}

            <NavLink
              to={
                isAdmin
                  ? ADMIN_PROFILE_ROUTE
                  : user.role === 'designer'
                  ? DESIGNER_PROFILE_ROUTE
                  : USER_ROUTE
              }
            >
              <Button style={iconButtonStyles}>
                <Lk />
              </Button>
            </NavLink>

            <NavLink to={BASKET_ROUTE}>
              <Button style={iconButtonStyles}>
                <Basket />
              </Button>
            </NavLink>
          </Nav>
        ) : (
          <Nav className="nl-auto">
            <NavLink to={LOGIN_ROUTE}>
              <Button style={iconButtonStyles}>
                <Lk />
              </Button>
            </NavLink>
            <NavLink to={LOGIN_ROUTE}>
              <Button style={iconButtonStyles}>
                <Basket />
              </Button>
            </NavLink>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
});

export default NavBar;
