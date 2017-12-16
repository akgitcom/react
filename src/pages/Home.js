import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom'
const Home = () => (
    <div>
        <header>
            <h1>Welcome,Dashboard</h1>
        </header>
        <main>
            <Link to="/user/add">添加用户</Link>
            <Link to="/user/list">用户列表</Link>
        </main>
    </div>
)

export default Home;