import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom'

import UserAddPage from './pages/UserAdd';
import UserEditPage from './pages/UserEdit';
import UserListPage from './pages/UserList';

import ArticleAddPage from './pages/ArticleAdd';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';

const App = () => (
    <div>
        <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/user/add">UserAdd</Link>
            <Link to="/article/add">ArticleAdd</Link>
        </nav>
        <div>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/" component={HomePage} />
            <Route path="/user/add" component={UserAddPage} />
            <Route path="/user/edit/:id" component={UserEditPage} />
            <Route path="/user/list" component={UserListPage} />
            <Route path="/article/add" component={ArticleAddPage} />
        </div>
    </div>
)


ReactDOM.render((
    <Router history={Route.history}>
        <App />
    </Router>
), document.getElementById('app'))