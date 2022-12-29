// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
    /**
     * 菜单分类
     */
    getMenuCategory() {
        // 返回结果
        return [
            {
                image: 'https://mp-c235524f-d6d0-4af9-9981-853f0ea269bc.cdn.bspapp.com/cloudstorage/5c711de9-4a97-4228-8736-4cdbd44de4ab.jpg',
                name: '荤菜',
                type: 'meat',
            },
            {
                image: 'https://mp-c235524f-d6d0-4af9-9981-853f0ea269bc.cdn.bspapp.com/cloudstorage/a036052a-dca9-4e5f-9feb-a52c7081057e.jpg',
                name: '素菜',
                type: 'vegetable',
            },
            {
                image: 'https://mp-c235524f-d6d0-4af9-9981-853f0ea269bc.cdn.bspapp.com/cloudstorage/8ade43d2-3f2e-4fac-85d3-49ed42c02bda.jpg',
                name: '煲汤',
                type: 'stewSoup',
            },
            {
                image: 'https://mp-c235524f-d6d0-4af9-9981-853f0ea269bc.cdn.bspapp.com/cloudstorage/dba111c9-ee30-4d18-a92e-994acac30daa.jpg',
                name: '早餐',
                type: 'breakfast',
            },
        ];
    },
};
