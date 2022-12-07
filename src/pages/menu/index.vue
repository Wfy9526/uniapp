<template>
    <view class="menu">
        <view class="header">
            <uni-icons type="fire-filled"></uni-icons>
            <uni-title type="h3" title="热门分类"></uni-title>
        </view>

        <uni-grid :column="4" :show-border="false" :square="false">
            <uni-grid-item v-for="(item, index) in labelData" :key="index">
                <view class="grid-item-box">
                    <image :src="item.image" class="grid-image"></image>
                    <view>{{ item.name }}</view>
                </view>
            </uni-grid-item>
        </uni-grid>
        <uni-grid :column="2" :show-border="false" :square="false">
            <uni-grid-item v-for="(item, index) in menuData" :key="index">
                <view class="grid-item-box">
                    <image :src="item.image" class="grid-image2"></image>
                    <view>{{ item.name }}</view>
                </view>
            </uni-grid-item>
        </uni-grid>
        <uni-fab
            ref="fab"
            :pattern="pattern"
            :horizontal="horizontal"
            :vertical="vertical"
            :direction="direction"
            @fabClick="fabClick"
        />
    </view>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
    name: 'menu',
    components: {},
    props: {},
    data() {
        return {
            horizontal: 'right',
            vertical: 'bottom',
            direction: 'horizontal',
            pattern: {
                color: '#7A7E83',
                backgroundColor: '#fff',
                selectedColor: '#007AFF',
                buttonColor: '#007AFF',
                iconColor: '#fff',
            },
            labelData: [],
            menuData: [],
        };
    },
    computed: {},
    methods: {
        fabClick() {
            uni.navigateTo({
                url: '../add-menu/index',
            });
        },
    },
    watch: {},

    // 页面周期函数--监听页面加载
    onLoad() {},
    // 页面周期函数--监听页面初次渲染完成
    onReady() {},
    // 页面周期函数--监听页面显示(not-nvue)
    onShow() {
        // eslint-disable-next-line no-undef
        this.labelData = getApp().globalData.labelData;
        // eslint-disable-next-line no-undef
        this.menuData = getApp().globalData.menuData;
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
        justify-content: center;
        align-items: center;
        padding: 0 20rpx;
    }
    .grid-item-box {
        padding: 10rpx 20rpx;
        text-align: center;
        .grid-image {
            width: 100%;
            height: 150rpx;
        }
        .grid-image2 {
            width: 100%;
            height: 250rpx;
        }
    }
}
</style>
