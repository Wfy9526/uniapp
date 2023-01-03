<template>
    <view class="list">
        <!-- 页面分类标题 -->
        <uni-section :title="title" type="line"></uni-section>
        <uni-list>
            <!-- 通过 uni-list--waterfall 类决定页面布局方向 -->
            <!-- to 属性携带参数跳转详情页面，当前只为参考 -->
            <uni-list-item
                :border="true"
                class="uni-list-item--waterfall"
                title=""
                v-for="(item, i) in menuData"
                :key="i"
            >
                <!-- 通过header插槽定义列表左侧图片 -->
                <template v-slot:header>
                    <view class="uni-thumb shop-picture">
                        <image :src="item.image" mode="aspectFill"></image>
                    </view>
                </template>
                <template v-slot:body>
                    <view class="shop">
                        <view>
                            <view class="uni-title">
                                <text class="uni-ellipsis-2">{{ item.name }}</text>
                            </view>
                            <view>
                                <text v-show="item.remark" class="uni-tag hot-tag">{{
                                    item.remark
                                }}</text>
                            </view>
                        </view>
                    </view>
                </template>
            </uni-list-item>
        </uni-list>
        <template v-if="!menuData.length">
            <view class="tips"> 未查询到数据~ </view>
        </template>
    </view>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            title: '',
            menuData: [],
        };
    },
    async onLoad(options) {
        this.title = getApp().globalData.menuCategory[options.type];
        uni.setNavigationBarTitle({
            title: `${this.title}查询`,
        });
        const db = uniCloud.database();
        const res = await db
            .collection('menu')
            .where(getApp().globalData.queryString)
            .field(options.type)
            .get();
        const [data] = res.result.data;
        if (data) {
            this.menuData = data[options.type];
        }
    },
    methods: {},
};
</script>

<style lang="scss">
@import '../../common/uni-ui.scss';
page {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background-color: #efeff4;
    min-height: 100%;
    height: auto;
}
.tips {
    margin-top: 40%;
    text-align: center;
}

.shop {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.shop-picture {
    width: 110px;
    height: 110px;
}
.shop-picture-column {
    width: 100%;
    height: 170px;
    margin-bottom: 10px;
}
.shop-price {
    margin-top: 5px;
    font-size: 12px;
    color: #ff5a5f;
}
.shop-price-text {
    font-size: 16px;
}
.hot-tag {
    background: #ff5a5f;
    border: none;
    color: #fff;
}
.button-box {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    background: #007aff;
    color: #fff;
}
.uni-link {
    flex-shrink: 0;
}
.ellipsis {
    display: flex;
    overflow: hidden;
}
.uni-ellipsis-1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.uni-ellipsis-2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
// 默认加入 scoped ，所以外面加一层提升权重
.list {
    .uni-list--waterfall {
        /* #ifndef H5 || APP-VUE */
        // 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
        .uni-list {
            /* #endif */
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 5px;
            box-sizing: border-box;
            /* #ifdef H5 || APP-VUE */
            // h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
            /* #endif */
            .uni-list-item--waterfall {
                width: 50%;
                box-sizing: border-box;
                .uni-list-item__container {
                    padding: 5px;
                    flex-direction: column;
                }
            }
            /* #ifndef H5 || APP-VUE */
        }
        /* #endif */
    }
}
</style>
