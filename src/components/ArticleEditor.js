import React from 'react';
import FormItem from '../components/FormItem';
import formProvider from '../utils/formProvider';
import { withRouter } from 'react-router';
import AutoComplete from './AutoComplete';

class ArticleEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendArticles: []
        };
    }
    handleSubmit(e) {
        e.preventDefault();

        const { form: { cid, title, slug, keyword, description, url, body, photo, sort, user_id, status, hits, related_articles_keyword, related_products_keyword }, formValid, editTarget } = this.props;
        //在handleSubmit方法中对每个字段的valid进行检测，如果有一个valid为false则直接return以中断提交操作。
        if (!formValid) {
            alert('请填写正确的信息后重试');
            return;
        }

        let editType = '添加';
        let apiUrl = 'http://localhost:8080/api/article';
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
                cid: cid.value,
                title: title.value,
                slug: slug.value,
                keyword: keyword.value,
                description: description.value,
                url: url.value,
                body: body.value,
                photo: photo.value,
                sort: sort.value,
                user_id: user_id.value,
                status: status.value,
                hits: hits.value,
                related_articles_keyword: related_articles_keyword.value,
                related_products_keyword: related_products_keyword.value
            }),
            headers: {
                // 'Content-Type': 'application/json'
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then((res) => res.json())
            .then((res) => {
                if (res.id) {
                    alert(editType + '成功');
                    this.props.history.push({ pathname: '/article/list' });
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

    getRecommendArticles(partialArticleId) {
        fetch('http://localhost:8080/api/article/id-like/' + partialArticleId, {
            mode: "cors",
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.Value.length === 1 && res.Value[0].id === partialArticleId) {
                    // 如果结果只有1条且id与输入的id一致，说明输入的id已经完整了，没必要再设置建议列表
                    return;
                }

                // 设置建议列表
                this.setState({
                    recommendArticles: res.Value.map((article) => {
                        return {
                            text: `${article.id}（${article.title}）`,
                            value: article.title
                        };
                    })
                });
            });
    }

    timer = 0;
    handleOwnerIdChange(value) {
        this.props.onFormChange('related_articles_keyword', value);
        this.setState({ recommendArticles: [] });

        // 使用“节流”的方式进行请求，防止用户输入的过程中过多地发送请求
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (value) {
            // 200毫秒内只会发送1次请求
            this.timer = setTimeout(() => {
                // 真正的请求方法
                this.getRecommendArticles(value);
                this.timer = 0;
            }, 200);
        }
    }

    render() {
        const { recommendArticles } = this.state;
        const { form: { cid, title, slug, keyword, description, url, body, photo, sort, user_id, status, hits, related_articles_keyword, related_products_keyword }, onFormChange } = this.props;
        return (
            <form onSubmit={(e) => this.handleSubmit(e)}>
                <FormItem label="分类：" valid={cid.valid} error={cid.error}>
                    <input
                        type="number"
                        value={cid.value}
                        onChange={(e) => onFormChange('cid', e.target.value)}
                    />
                </FormItem>
                <FormItem label="标题：" valid={title.valid} error={title.error}>
                    <input
                        type="text"
                        value={title.value}
                        onChange={(e) => onFormChange('title', e.target.value)}
                    />
                </FormItem>
                <FormItem label="路由：" valid={slug.valid} error={slug.error}>
                    <input
                        type="text"
                        value={slug.value}
                        onChange={(e) => onFormChange('slug', e.target.value)}
                    />
                </FormItem>
                <FormItem label="关键字：">
                    <input
                        type="text"
                        value={keyword.value}
                        onChange={(e) => onFormChange('keyword', e.target.value)}
                    />
                </FormItem>
                <FormItem label="描述：">
                    <input
                        type="text"
                        value={description.value}
                        onChange={(e) => onFormChange('description', e.target.value)}
                    />
                </FormItem>

                <FormItem label="跳转网址：">
                    <input
                        type="text"
                        value={url.value}
                        onChange={(e) => onFormChange('url', e.target.value)}
                    />
                </FormItem>
                <FormItem label="内容：" valid={body.valid} error={body.error}>
                    <textarea
                        type="text"
                        value={body.value}
                        onChange={(e) => onFormChange('body', e.target.value)}
                    />
                </FormItem>
                <FormItem label="图片：">
                    <input
                        type="file"
                        value={photo.value}
                        onChange={(e) => onFormChange('photo', e.target.value)}
                    />
                </FormItem>
                <FormItem label="排序：" valid={sort.valid} error={sort.error}>
                    <input
                        type="number"
                        value={sort.value}
                        onChange={(e) => onFormChange('sort', e.target.value)}
                    />
                </FormItem>
                <FormItem label="用户：">
                    <input
                        type="number"
                        value={user_id.value}
                        onChange={(e) => onFormChange('user_id', e.target.value)}
                    />
                </FormItem>
                <FormItem label="点击量：">
                    <input
                        type="number"
                        value={hits.value}
                        onChange={(e) => onFormChange('hits', e.target.value)}
                    />
                </FormItem>
                <FormItem label="相关新闻：">
                    <AutoComplete
                        value={related_articles_keyword.value ? related_articles_keyword.value + '' : ''}
                        // options={[{ text: '10000（一韬）', value: 10000 }, { text: '10001（张三）', value: 10001 }]}
                        options={recommendArticles}
                        onValueChange={value => this.handleOwnerIdChange(value)}
                    />
                </FormItem>
                <FormItem label="相关产品：">
                    <input
                        type="text"
                        value={related_products_keyword.value}
                        onChange={(e) => onFormChange('related_products_keyword', e.target.value)}
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


ArticleEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};

ArticleEditor = formProvider({
    cid: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value > 0;
                },
                error: '请选择分类'
            }
        ]
    },
    title: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入标题'
            },
            {
                pattern: /^.{1,20}$/,
                error: '标题最多20个字符'
            }
        ]
    },
    slug: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入路由'
            },
            {
                pattern: /^.{1,100}$/,
                error: '路由最多100个字符'
            }
        ]
    },
    keyword: {
        defaultValue: '',
        rules: [
        ]
    },
    description: {
        defaultValue: '',
        rules: [
        ]
    },
    url: {
        defaultValue: '',
        rules: [
        ]
    },

    body: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入内容'
            }
        ]
    },
    photo: {
        defaultValue: '',
        rules: [
        ]
    },
    sort: {
        defaultValue: '',
        rules: [
        ]
    },
    user_id: {
        defaultValue: '',
        rules: [
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
    },
    hits: {
        defaultValue: '',
        rules: [
        ]
    },
    related_articles_keyword: {
        defaultValue: '',
        rules: [
        ]
    },
    related_products_keyword: {
        defaultValue: '',
        rules: [
        ]
    },

})(ArticleEditor);

export default withRouter(ArticleEditor)
// export default ArticleEditor;