import React from 'react';

class UserAdd extends React.Component {
    constructor() {
        super();
        this.state = {
            form: {
                name: {
                    valid: false,
                    value: '',
                    error: ''
                },
                email: {
                    valid: false,
                    value: '',
                    error: ''
                },
                password: {
                    valid: false,
                    value: '',
                    error: ''
                },
                department_id: {
                    valid: false,
                    value: 1,
                    error: ''
                },
                status: {
                    valid: false,
                    value: -1,
                    error: ''
                }
            }
        };
    }
    handleValueChange(field, value, type = 'string') {
        if (type === 'number') {
            value = +value;
        }

        const { form } = this.state;

        const newFieldObj = { value, valid: true, error: '' };

        switch (field) {
            case 'name': {
                if (value.length >= 7) {
                    newFieldObj.error = '用户名最多6个字符';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    newFieldObj.error = '请输入用户名';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'email': {
                if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value)) {
                    newFieldObj.error = '请输入正确的邮箱地址';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    newFieldObj.error = '请输入邮箱';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'password': {
                if (value.length >= 7) {
                    newFieldObj.error = '密码名最多6个字符';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    newFieldObj.error = '请输入密码';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'department_id': {
                if (value > 5 || value <= 0) {
                    newFieldObj.error = '请输入选择1-5之间的数字';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'status': {
                if (value < 0) {
                    newFieldObj.error = '请选择状态';
                    newFieldObj.valid = false;
                }
                break;
            }
        }

        this.setState({
            form: {
                ...form,
                [field]: newFieldObj
            }
        });
    }
    handleSubmit(e) {
        e.preventDefault();

        const { form: { name, email, password, department_id, status } } = this.state;
        //在handleSubmit方法中对每个字段的valid进行检测，如果有一个valid为false则直接return以中断提交操作。
        if (!name.valid || !email.valid || !password.valid || !department_id.valid || !status.valid) {
            alert('请填写正确的信息后重试');
            return;
        }

        fetch('http://localhost:8080/api/user', {
            mode: "cors",
            method: 'POST',
            // 使用fetch提交的json数据需要使用JSON.stringify转换为字符串
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                department_id: department_id.value,
                status: status.value
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
                        department_id: 0,
                        status: -1
                    });
                } else {
                    alert('添加失败');
                }
            })
            .catch((err) => console.error(err));
    }
    render() {
        const { form: { name, email, password, department_id, status } } = this.state;
        return (
            <div>
                <header>
                    <h1>添加用户</h1>
                </header>

                <main>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <label>用户名：</label>
                        <input type="text" value={name.value} onChange={(e) => this.handleValueChange('name', e.target.value)} />
                        {!name.valid && <span>{name.error}</span>}
                        <br />
                        <label>邮箱：</label>
                        <input type="email" value={email.value} onChange={(e) => this.handleValueChange('email', e.target.value)} />
                        {!email.valid && <span>{email.error}</span>}
                        <br />
                        <label>密码：</label>
                        <input type="password" value={password.value || ''} onChange={(e) => this.handleValueChange('password', e.target.value)} />
                        {!password.valid && <span>{password.error}</span>}
                        <br />
                        <label>部门：</label>
                        <input type="number" value={department_id.value || ''} onChange={(e) => this.handleValueChange('department_id', e.target.value, 'number')} />
                        {!department_id.valid && <span>{department_id.error}</span>}
                        <br />
                        <label>状态：</label>
                        <select value={status.value} onChange={(e) => this.handleValueChange('status', e.target.value, 'number')}>
                            <option value="-1">请选择</option>
                            <option value="0">开启</option>
                            <option value="1">关闭</option>
                        </select>
                        {!status.valid && <span>{status.error}</span>}
                        <br />
                        <input type="submit" value="提交" />
                    </form>
                </main>
            </div>
        );
    }
}

export default UserAdd;