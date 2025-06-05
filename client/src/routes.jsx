import Admin from "./pages/Admin/Admin"
import Auth from "./pages/Auth/Auth"
import Home from "./pages/HomePage/HomePage"
import User from "./pages/User/UserProfile"
import Basket from "./pages/Basket/Basket"
import Shop from "./pages/Shop/Shop"
import Designer from "./pages/Disignerpages/Disignerpages"
import Adminpr from "./pages/AdminProfile/AdminProfile"
import ProductPage from "./pages/ProductPage/ProductPage"
import { ADMIN_ROUTE, BASKET_ROUTE, PRODUCT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE,HOME_ROUTE, USER_ROUTE, ADMIN_PROFILE_ROUTE, DESIGNER_PROFILE_ROUTE } from "./utils/Consts"

export const authRoutes = [
{
    path:ADMIN_ROUTE,
    Component : Admin
},
{
    path:BASKET_ROUTE,
    Component : Basket
},
{
    path:USER_ROUTE,
    Component : User
},
{
    path:ADMIN_PROFILE_ROUTE,
    Component : Adminpr
},
{
    path:DESIGNER_PROFILE_ROUTE,
    Component : Designer
},
]

export const publicRoutes = [
    {
        path:SHOP_ROUTE,
        Component : Shop
    },
    {
        path:HOME_ROUTE,
        Component : Home
    },
    {
        path:LOGIN_ROUTE,
        Component : Auth
    },
    {
        path:REGISTRATION_ROUTE,
        Component : Auth
    },
    {
        path:PRODUCT_ROUTE + '/:id',
        Component : ProductPage
    },
]