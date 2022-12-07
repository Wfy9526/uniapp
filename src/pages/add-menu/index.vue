<template>
    <view class="add-menu">
        <view class="example-body">
            <uni-file-picker limit="1" title="选择图片上传"></uni-file-picker>
        </view>
        <input class="uni-input" @blur="addMenuName" v-model="menuName" placeholder="请输入菜名" />
        <uni-section class="mb-10" title="添加标签" type="line"></uni-section>
        <template v-for="(item, i) in labelData">
            <uni-tag
                :key="item.name"
                :text="item.name"
                :type="item.buttonType"
                @click="addTag(i)"
            />
        </template>
        <button @click="addMenu">添加</button>
    </view>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
    name: 'add-menu',
    components: {},
    props: {},
    data() {
        return {
            menuName: '',
            labelData: [],
        };
    },
    computed: {},
    methods: {
        addMenuName() {},
        addMenu() {
            //
        },
        addTag(i) {
            this.labelData[i].buttonType = this.labelData[i].buttonType ? '' : 'primary';
            this.$set(this.labelData, i, this.labelData[i]);
        },
    },
    watch: {},

    // 页面周期函数--监听页面加载
    onLoad() {},
    // 页面周期函数--监听页面初次渲染完成
    onReady() {},
    // 页面周期函数--监听页面显示(not-nvue)
    beforeMount() {
        // eslint-disable-next-line no-undef
        this.labelData = getApp().globalData.labelData;
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

<style lang="scss" scoped></style>
