<template>
    <view class="add-menu">
        <uni-forms ref="valiForm" :rules="rules" :modelValue="formData">
            <uni-forms-item label="封面图" required name="imageValue">
                <uni-file-picker
                    limit="1"
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
                    v-model="formData.menuName"
                    placeholder="请输入菜名"
                />
            </uni-forms-item>

            <uni-forms-item label="标签" required name="selectMenuCategory">
                <view class="tag-container">
                    <template v-for="(value, key) in menuCategory">
                        <uni-tag
                            class="tag"
                            :key="key"
                            :text="value"
                            :type="key === formData.selectMenuCategory ? 'primary' : ''"
                            @click="addTag(key)"
                        />
                    </template>
                </view>
            </uni-forms-item>
            <uni-forms-item label="配料表" required name="batchingTable">
                <textarea
                    class="batching-table"
                    v-model="formData.batchingTable"
                    placeholder="请输入..."
                />
            </uni-forms-item>
        </uni-forms>
        <view class="btn-container">
            <button class="mini-btn" type="default" size="mini" @click="addMenu">添加</button>
        </view>
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
            menuCategory: {},
            formData: {
                menuName: '',
                imageValue: [],
                selectMenuCategory: '',
                batchingTable: '',
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
                batchingTable: {
                    rules: [
                        {
                            required: true,
                            errorMessage: '配料表',
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
        async addMenu() {
            this.$refs.valiForm
                .validate()
                .then((validateRes) => {
                    const db = uniCloud.database();
                    db.collection('menu')
                        .where('user_id==$cloudEnv_uid')
                        .get()
                        .then((res) => {
                            const [data] = res.result.data;
                            data[validateRes.selectMenuCategory].push({
                                image: validateRes.imageValue[0].url,
                                name: validateRes.menuName,
                                type: validateRes.selectMenuCategory,
                                remark: validateRes.batchingTable,
                            });
                            const updateData = {};
                            updateData[validateRes.selectMenuCategory] =
                                data[validateRes.selectMenuCategory];
                            db.collection('menu')
                                .where('user_id==$cloudEnv_uid')
                                .update(updateData)
                                .then(() => {
                                    uni.navigateBack();
                                });
                        });
                })
                .catch((err) => {
                    // 表单校验验失败，err 为具体错误信息
                    // 其他逻辑处理
                    // ...
                });
        },
        addTag(type) {
            this.formData.selectMenuCategory = type;
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
            console.log('上传成功', e);
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
        this.menuCategory = getApp().globalData.menuCategory;
    },
    // 页面周期函数--监听页面隐藏
    onShow() {
        // this.formData.menuName = '';
        // this.formData.imageValue = [];
        // this.formData.selectMenuCategory = '';
        // this.formData.batchingTable = '';
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
.add-menu {
    padding: 10rpx 30rpx;
    .tag-container {
        line-height: 80rpx;
    }
    .tag {
        margin-right: 20rpx;
    }
    .batching-table {
        width: 92%;
        margin: 0 auto;
        border: 1px solid lightgrey;
        border-radius: 20rpx;
        padding: 20rpx;
    }
    .btn-container {
        text-align: center;
    }
}
</style>
