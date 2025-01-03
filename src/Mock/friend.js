const Mock = require('mockjs');
const List = [{
    id: 0,
    siteName: "",
    path: "",
    desc: ""
}]
const count = 14

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        id: '@increment',
        siteName: "@cname",
        path: "@url",
        desc: "@ctitle(5,20)"
    }))
}

export default [
    {
        url: '/mock/friend',
        type: 'get',
        response: config => {
            return {
                code: 20000,
                data: List
            }
        }
    }
]
