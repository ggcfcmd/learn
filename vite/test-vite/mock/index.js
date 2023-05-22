const mockJS = require("mockjs");

const userList = mockJS.mock({
    "data|10": [{
        name: "@cname", // 表示生成不同的中文名
        ename: mockJS.Random.name(), // 生成不同的英文名
        "id|+1": 1, // 生成一个自增数 id，起始值为 1，每次增 1
        avatar: mockJS.Random.image(),
        time: "@time"
    }]
});

module.exports = [
    {
        method: "post",
        url: "/api/users",
        response: ({ body }) => {
            return {
                code: 200,
                msg: "success",
                data: userList
            };
        }
    }
]