import React from 'react';
import HomeLayout from '../layouts/HomeLayout';
import FormItem from '../components/FormItem';
import { post } from '../utils/request';
import formProvider from '../utils/formProvider';

class Login extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const { formValid, form: { username, password } } = this.props;
        if (!formValid) {
            alert('请输入账号或密码');
            return;
        }

        // fetch('http://localhost:8080/api/login', {
        //     mode: "cors",
        //     method: 'post',
        //     headers: {
        //         'Accept': 'application/json',
        //         // 'Content-Type': 'application/json',
        //         "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //     body: JSON.stringify({
        //         username: username.value,
        //         password: password.value
        //     })
        // }).then(res => {
        //     console.log(res)
        //     if (res.ok) {
        //         return res.json();
        //     } else {
        //         throw "用户名密码错误！";
        //     }
        // }).then(json => {
        //     console.log(json.token)
        //     if (json.token) {
        //         const token = json.token;
        //         sessionStorage.setItem('access_token', token);
        //         this.props.history.push('/');
        //     }
        //     else {
        //         throw "request error";
        //     }
        // }).catch(err => console.log(err))

        post('http://localhost:8080/api/login', {
            username: username.value,
            password: password.value
         }).then((res) => {
             console.log(res)
            if (res.token) {
                const token = res.token;
                sessionStorage.setItem('access_token', token);
                this.props.history.push('/');
            }
            else {
                return Promise.reject(res.msg);
            }
        }).catch(err => console.log(err))
    }

    render() {
        const { form: { username, password }, onFormChange } = this.props;
        return (
            <HomeLayout title="请登录">
                <form onSubmit={this.handleSubmit}>
                    <FormItem label="账号：" valid={username.valid} error={username.error}>
                        <input type="text" value={username.value} onChange={e => onFormChange('username', e.target.value)} />
                    </FormItem>
                    <FormItem label="密码：" valid={password.valid} error={password.error}>
                        <input type="password" value={password.value} onChange={e => onFormChange('password', e.target.value)} />
                    </FormItem>
                    <br />
                    <input type="submit" value="登录" />
                </form>
            </HomeLayout>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
};

Login = formProvider({
    username: {
        defaultValue: '',
        rules: [
            {
                pattern(value) {
                    return value.length > 0;
                },
                error: '请输入账号'
            }
        ]
    },
    password: {
        defaultValue: '',
        rules: [
            {
                pattern(value) {
                    return value.length > 0;
                },
                error: '请输入密码'
            }
        ]
    }
})(Login);

export default Login;