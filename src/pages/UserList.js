import React from "react";
import HomeLayout from '../layouts/HomeLayout';
import request, { get } from '../utils/request';
class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: []
        };
    }

    componentDidMount() {
        // request('get','http://localhost:8080/api/user',{})
        //     .then(res => res.json())
        //     .then(res => {
        //         this.setState({
        //             userList: res
        //         })
        //     }).catch(err => console.log(err))
        return fetch('http://localhost:8080/api/user', {
            mode: "cors",
            method:'get',
            headers: {
                'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                "Content-Type": "application/x-www-form-urlencoded",
                'Origin': '',
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token') || ''
            },
            body:{}
        }).then(res => {
            console.log(res)
            if (res.ok) {
                return res.json()
            } else {
                throw "network error";
            }
        }).then(json => {
            this.setState({
                userList: json
            })
        }).catch(err => console.log(err))
    }

    handleEdit(user) {
        this.props.history.push({ pathname: '/user/edit/' + user.id });
    }

    handleDel(user) {
        const confirmed = confirm(`确定要删除用户 ${user.name} 吗？`);

        if (confirmed) {
            fetch('http://localhost:8080/api/user/' + user.id, {
                mode: "cors",
                method: 'DELETE',
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        userList: this.state.userList.filter(item => item.id !== user.id)
                    });
                    alert('删除用户成功');
                })
                .catch(err => {
                    console.error(err);
                    alert('删除用户失败');
                });
        }
    }
    render() {
        const { userList } = this.state;
        return (
            <HomeLayout title="用户列表">
                    <table>
                        <thead>
                            <tr>
                                <th>用户ID</th>
                                <th>用户名</th>
                                <th>邮箱</th>
                                <th>部门</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                userList.map((user) => {
                                    return (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.department_id}</td>
                                            <td>{user.status}</td>
                                            <td>
                                                <a href="javascript:void(0)" onClick={() => this.handleEdit(user)}>编辑</a>
                                                <a href="javascript:void(0)" onClick={() => this.handleDel(user)}>删除</a>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </HomeLayout>
        )
    }
}

UserList.contextTypes = {
    router: React.PropTypes.object.isRequired
}
export default UserList;