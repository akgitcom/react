import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()
export default function request(method, url, body) {
    method = method.toUpperCase();
    if (method === 'GET') {
        // fetch的GET不允许有body，参数只能放在url中
        body = undefined;
    } else {
        body = body && JSON.stringify(body);
    }

    return fetch(url, {
        mode: "cors",
        method,
        headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            "Content-Type": "application/x-www-form-urlencoded",
            'Origin': '',
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token') || ''
        },
        body
    }).then(res => {
        console.log(res.ok === "false", res.ok === false)
        if (res.ok === false) {
            return JSON.parse('{"ok":false,"msg":"Unauthorized."}');
        } else {
            return res.json();
        }
    }).then(json => {
        console.log(json)
        if (json) {
            return json;
        }
        else {
            throw "request error";
        }
    }).catch(err => console.log(err))
}

export const get = url => request('GET', url);
export const post = (url, body) => request('POST', url, body);
export const put = (url, body) => request('PUT', url, body);
export const del = (url, body) => request('DELETE', url, body);