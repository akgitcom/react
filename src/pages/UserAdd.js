import React from 'react';
import FormItem from "../components/FormItem";
import formProvider from '../utils/formProvider';
class UserAdd extends React.Component {
    handleSubmit(e) {
        e.preventDefault();

        const { form: { name, email, password, department_id, status }, formValid } = this.props;
        //在handleSubmit方法中对每个字段的valid进行检测，如果有一个valid为false则直接return以中断提交操作。
        if (!formValid) {
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
                } else {
                    alert('添加失败');
                }
            })
            .catch((err) => console.error(err));
    }
    render() {
        const { form: { name, email, password, department_id, status }, onFormChange } = this.props;
        return (
            <div>
                <header>
                    <h1>添加用户</h1>
                </header>

                <main>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <FormItem label="用户名：" valid={name.valid} error={name.error}>
                            <input
                                type="text"
                                value={name.value}
                                onChange={(e) => onFormChange('name', e.target.value)}
                            />
                        </FormItem>
                        <FormItem label="邮箱：" valid={email.valid} error={email.error}>
                            <input
                                type="text"
                                value={email.value}
                                onChange={(e) => onFormChange('email', e.target.value)}
                            />
                        </FormItem>
                        <FormItem label="密码：" valid={password.valid} error={password.error}>
                            <input
                                type="text"
                                value={password.value}
                                onChange={(e) => onFormChange('password', e.target.value)}
                            />
                        </FormItem>
                        <FormItem label="部门：" valid={department_id.valid} error={department_id.error}>
                            <input
                                type="number"
                                value={department_id.value}
                                onChange={(e) => onFormChange('department_id', e.target.value)}
                            />
                        </FormItem>
                        <FormItem label="状态：" valid={status.valid} error={status.error}>
                            <select
                                value={status.value}
                                onChange={(e) => onFormChange('status', e.target.value)}
                            >
                                <option value="-1">请选择</option>
                                <option value="0">开启</option>
                                <option value="1">禁用</option>
                            </select>
                        </FormItem>
                        <input type="submit" value="提交" />
                    </form>
                </main>
            </div>
        );
    }
}
UserAdd = formProvider({
    name: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入用户名'
            },
            {
                pattern: /^.{1,8}$/,
                error: '用户名最多8个字符'
            }
        ]
    },
    email: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入邮箱地址'
            },
            {
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
                error: '请输入正确的邮箱地址'
            }
        ]
    },
    password: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入密码'
            },
            {
                pattern: /^.{1,8}$/,
                error: '密码最多8个字符'
            }
        ]
    },
    department_id: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value > 0;
                },
                error: '请选择部门'
            },
            {
                pattern: function (value) {
                    return value < 5;
                },
                error: '请选择1-4之间的部门'
            }
        ]
    },
    status: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value >= 0;
                },
                error: '请选择状态'
            }
        ]
    }
})(UserAdd);

export default UserAdd;