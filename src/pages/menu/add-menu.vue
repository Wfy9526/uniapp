<template>
    <view class="add-menu">
        <uni-forms ref="valiForm" :rules="rules" :modelValue="formData">
            <uni-forms-item label="封面图" required name="imageValue">
                <uni-file-picker
                    limit="1"
                    title="选择图片上传"
                    v-model="formData.imageValue"
                    fileMediatype="image"
                    @select="select"
                    @progress="progress"
                    @success="success"
                    @fail="fail"
                ></uni-file-picker>
            </uni-forms-item>
            <uni-forms-item label="菜名" required name="menuName">
                <uni-easyinput
                    class="uni-input"
                    trim="all"
                    @blur="addMenuName"
                    v-model="formData.menuName"
                    placeholder="请输入菜名"
                />
            </uni-forms-item>
            <uni-forms-item label="添加标签" required name="selectMenuCategory">
                <template v-for="(item, i) in labelData">
                    <uni-tag
                        :key="item.name"
                        :text="item.name"
                        :type="item.type === formData.selectMenuCategory ? 'primary' : ''"
                        @click="addTag(i)"
                    />
                </template>
            </uni-forms-item>
        </uni-forms>

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
            labelData: [],
            formData: {
                menuName: '',
                imageValue: [],
                selectMenuCategory: '',
            },
            rules: {
                menuName: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '请输入菜名',
                        },
                    ],
                },
                selectMenuCategory: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '请添加标签',
                        },
                    ],
                },
                imageValue: {
                    rules: [
                        {
                            format: 'array',
                        },
                        {
                            validateFunction: function (rule, value, data, callback) {
                                if (value.length === 0) {
                                    callback('请上传图片');
                                }
                                return true;
                            },
                        },
                    ],
                },
            },
        };
    },
    computed: {},
    methods: {
        addMenuName() {},
        async addMenu() {
            const validateRes = await this.$refs.valiForm.validate();
            const db = uniCloud.database();
            const res = await db.collection('menu').where('user_id==$cloudEnv_uid').get();
            const [data] = res.result.data;
            data[validateRes.selectMenuCategory].push({
                image: validateRes.imageValue[0].url,
                name: validateRes.menuName,
            });
            const updateData = {};
            updateData[validateRes.selectMenuCategory] = data[validateRes.selectMenuCategory];
            await db.collection('menu').where('user_id==$cloudEnv_uid').update(updateData);
            uni.navigateBack();
        },
        addTag(i) {
            this.formData.selectMenuCategory = this.labelData[i].type;
        },
        // 获取上传状态
        select(e) {
            console.log('选择文件：', e);
        },
        // 获取上传进度
        progress(e) {
            console.log('上传进度：', e);
        },

        // 上传成功
        success(e) {
            console.log('上传成功');
        },

        // 上传失败
        fail(e) {
            console.log('上传失败：', e);
        },
    },
    watch: {},

    // 页面周期函数--监听页面加载
    onLoad() {},
    // 页面周期函数--监听页面初次渲染完成
    onReady() {
        this.$refs.valiForm.setRules(this.rules);
    },
    // 页面周期函数--监听页面显示(not-nvue)
    async beforeMount() {
        const menuObj = uniCloud.importObject('menu');
        this.labelData = await menuObj.getMenuCategory();
    },
    // 页面周期函数--监听页面隐藏
    onShow() {
        // this.formData.menuName = '';
        // this.formData.imageValue = [];
        // this.formData.selectMenuCategory = '';
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
