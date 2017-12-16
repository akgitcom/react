import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom'

import UserAddPage from './pages/UserAdd';
import UserListPage from './pages/UserList';
import HomePage from './pages/Home';

const App = () => (
    <div>
        <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/user/add">UserAdd</Link>
        </nav>
        <div>
            <Route exact path="/" component={HomePage} />
            <Route path="/user/add" component={UserAddPage} />
            <Route path="/user/list" component={UserListPage} />
        </div>
    </div>
)


ReactDOM.render((
    <Router history={Route.history}>
        <App />
    </Router>
), document.getElementById('app'))