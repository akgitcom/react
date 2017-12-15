import React from 'react';

class UserAdd extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password:'',
            department_id:1,
            status: -1
        };
    }
    handleValueChange(field, value, type = 'string') {
        // 由于表单的值都是字符串，我们可以根据传入type为number来手动转换value的类型为number类型
        if (type === 'number') {
            value = +value;
        }

        this.setState({
            [field]: value
        });
    }
    handleSubmit(e) {
        e.preventDefault();

        const { name, email, password, department_id, status } = this.state;
        fetch('http://localhost:8080/api/user', {
            mode: "cors",  
            method: 'POST',
            // 使用fetch提交的json数据需要使用JSON.stringify转换为字符串
            body: JSON.stringify({
                name,
                email,
                password,
                department_id,
                status
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then((res) => res.json())
            .then((res) => {
                // 当添加成功时，返回的json对象中应包含一个有效的id字段
                // 所以可以使用res.id来判断添加是否成功
                if (res.id) {
                    alert('添加用户成功');
                    this.setState({
                        name: '',
                        email: '',
                        password: '',
                        department_id:0,
                        status: -1
                    });
                } else {
                    alert('添加失败');
                }
            })
            .catch((err) => console.error(err));
    }
    render() {
        const { name, email,password, department_id, status } = this.state;
        return (
            <div>
                <header>
                    <h1>添加用户</h1>
                </header>

                <main>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <label>用户名：</label>
                        <input type="text" value={name} onChange={(e) => this.handleValueChange('name', e.target.value)} />
                        <br />
                        <label>邮箱：</label>
                        <input type="text" value={email} onChange={(e) => this.handleValueChange('email', e.target.value)} />
                        <br />
                        <label>密码：</label>
                        <input type="password" value={password || ''} onChange={(e) => this.handleValueChange('password', e.target.value)} />
                        <br />
                        <br />
                        <label>部门：</label>
                        <input type="number" value={department_id || ''} onChange={(e) => this.handleValueChange('department_id', e.target.value, 'number')} />
                        <br />
                        <label>状态：</label>
                        <select value={status} onChange={(e) => this.handleValueChange('status', e.target.value, 'number')}>
                            <option value="-1">请选择</option>
                            <option value="0">开启</option>
                            <option value="1">关闭</option>
                        </select>
                        <br />
                        <br />
                        <input type="submit" value="提交" />
                    </form>
                </main>
            </div>
        );
    }
}

export default UserAdd;