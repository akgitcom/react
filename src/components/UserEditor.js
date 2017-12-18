import React from 'react';
import FormItem from '../components/FormItem';
import formProvider from '../utils/formProvider';
import { withRouter } from 'react-router'

class UserEditor extends React.Component {
    handleSubmit(e) {
        e.preventDefault();

        const { form: { name, email, password, department_id, status }, formValid, editTarget } = this.props;
        //在handleSubmit方法中对每个字段的valid进行检测，如果有一个valid为false则直接return以中断提交操作。
        if (!formValid) {
            alert('请填写正确的信息后重试');
            return;
        }

        let editType = '添加';
        let apiUrl = 'http://localhost:8080/api/user';
        let method = 'POST';
        if (editTarget) {
            editType = '编辑';
            apiUrl += '/' + editTarget.id;
            method = 'PUT';
        }
        fetch(apiUrl, {
            mode: "cors",
            method,
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                department_id: department_id.value,
                status: status.value
            }),
            headers: {
                // 'Content-Type': 'application/json'
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then((res) => res.json())
            .then((res) => {
                if (res.id) {
                    alert(editType + '用户成功');
                    this.props.history.push({ pathname: '/user/list' });
                    return;
                } else {
                    alert(editType + '失败');
                }
            })
            .catch((err) => console.error(err));
    }

    componentWillMount() {
        const { editTarget, setFormValues } = this.props;
        if (editTarget) {
            setFormValues(editTarget);
        }
    }

    render() {
        const { form: { name, email, password, department_id, status  }, onFormChange } = this.props;
        return (
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
                        <option value="1">开启</option>
                        <option value="0">禁用</option>
                    </select>
                </FormItem>
                <input type="submit" value="提交" />
            </form>
        );
    }
}


UserEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};

UserEditor = formProvider({
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
                    return value >= 0 && value < 2;
                },
                error: '请选择状态'
            }
        ]
    }
})(UserEditor);
export default withRouter(UserEditor)
// export default UserEditor;