import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom'
import HomeLayout from '../layouts/HomeLayout';
const Home = () => (
    <HomeLayout title="Welcome">
        <Link to="/user/list">用户列表</Link>
        <br />
        <Link to="/user/add">添加用户</Link>
    </HomeLayout>
)

export default Home;