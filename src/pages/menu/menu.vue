<template>
    <view class="menu">
        <view class="header">
            <uni-icons type="fire-filled"></uni-icons>
            <uni-title type="h3" title="热门分类"></uni-title>
        </view>

        <uni-grid :column="4" :show-border="false" :square="false">
            <uni-grid-item v-for="(item, index) in labelData" :key="index">
                <view class="grid-item-box" @click="searchMenu(item.type)">
                    <image :src="item.image" class="grid-image"></image>
                    <view>{{ item.name }}</view>
                </view>
            </uni-grid-item>
        </uni-grid>
        <template v-if="menuData.length">
            <uni-grid :column="2" :show-border="false" :square="false">
                <uni-grid-item v-for="(item, index) in menuData" :key="index">
                    <view class="grid-item-box">
                        <image :src="item.image" class="grid-image2"></image>
                        <view>{{ item.name }}</view>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </template>
        <template v-else>
            <view class="tips"> 点击按钮添加菜譜吧~ </view>
        </template>

        <uni-fab
            ref="fab"
            :pattern="pattern"
            horizontal="right"
            vertical="bottom"
            direction="horizontal"
            @fabClick="addMenu"
        />
    </view>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
    name: 'menus',
    components: {},
    props: {},
    data() {
        return {
            pattern: {},
            labelData: [],
            menuData: [],
        };
    },
    computed: {},
    methods: {
        searchMenu(type) {
            uni.navigateTo({
                url: `../menu/search-menu?type=${type}`,
            });
        },
        addMenu() {
            uni.navigateTo({
                url: '../menu/add-menu',
            });
        },
    },
    watch: {},
    async beforeMount() {
        const menuObj = uniCloud.importObject('menu');
        this.labelData = await menuObj.getMenuCategory();
        const menuCategory = {};
        this.labelData.forEach((label) => {
            menuCategory[label.type] = label.name;
        });
        getApp().globalData.menuCategory = menuCategory;
    },
    // 页面周期函数--监听页面加载
    onLoad() {
        this.pattern = getApp().globalData.uniFabPattern;
    },
    // 页面周期函数--监听页面初次渲染完成
    onReady() {},
    // 页面周期函数--监听页面显示(not-nvue)
    async onShow() {
        const db = uniCloud.database();
        const res = await db.collection('menu').where('user_id==$cloudEnv_uid').get();
        const [data] = res.result.data;

        if (data) {
            this.menuData = [...data.meat, ...data.vegetable, ...data.breakfast, ...data.stewSoup];
        } else {
            db.collection('menu').add({
                user_id: uniCloud.getCurrentUserInfo().uid,
                vegetable: [],
                meat: [],
                stewSoup: [],
                breakfast: [],
            });
        }
    },
    // 页面周期函数--监听页面隐藏
    onHide() {},
    // 页面周期函数--监听页面卸载
    onUnload() {},
    // 页面处理函数--监听用户下拉动作
    // onPullDownRefresh() { uni.stopPullDownRefresh(); },
    // 页面处理函数--监听用户上拉触底
    // onReachBottom() {},
    // 页面处理函数--监听页面滚动(not-nvue)
    // onPageScroll(event) {},
    // 页面处理函数--用户点击右上角分享
    // onShareAppMessage(options) {},
});
</script>

<style lang="scss" scoped>
.menu {
    .header {
        display: flex;
        align-items: center;
        padding: 0 20rpx;
    }
    .grid-item-box {
        padding: 10rpx 20rpx;
        text-align: center;
        font-size: 30rpx;
        .grid-image {
            border-radius: 20rpx;
            width: 100%;
            height: 150rpx;
            border: 1px solid lightgrey;
        }
        .grid-image2 {
            width: 100%;
            height: 250rpx;
            border-radius: 20rpx;
            border: 1px solid lightgrey;
        }
    }
    .tips {
        margin-top: 40%;
        text-align: center;
    }
}
</style>
