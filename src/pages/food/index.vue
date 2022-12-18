<template>
    <view class="food">
        <uni-title type="h2" title="冰箱里有什么？" align="center"></uni-title>
        <view class="vegetable">
            <uni-title type="h4" title="蔬菜" align="center"></uni-title>
            <scroll-view scroll-y="true">
                <template v-if="vegetableData.length">
                    <view class="tag-container">
                        <view class="tag" v-for="(item, i) in vegetableData" :key="item">
                            <text>{{ item }}</text>
                            <icon
                                class="del-icon"
                                type="cancel"
                                size="16"
                                @click="deleteVegetable(i)"
                            ></icon>
                        </view>
                    </view>
                </template>
            </scroll-view>
            <view v-show="isShowAddVegetable" class="add-vegetable">
                <uni-easyinput
                    class="uni-input"
                    :focus="isShowAddVegetable"
                    trim="all"
                    @blur="addVegetable"
                    v-model="vegetableInputValue"
                    placeholder="请输入蔬菜，多个蔬菜用逗号分隔"
                />
            </view>
            <button @click="addVegetableMode">添加蔬菜</button>
        </view>
        <view class="meat">
            <uni-title type="h4" title="肉类" align="center"></uni-title>
            <scroll-view scroll-y="true">
                <template v-if="meatData.length">
                    <view class="tag-container">
                        <view class="tag" v-for="(item, i) in meatData" :key="item">
                            <text>{{ item }}</text>

                            <icon
                                class="del-icon"
                                type="cancel"
                                size="16"
                                @click="deleteMeat(i)"
                            ></icon>
                        </view>
                    </view>
                </template>
            </scroll-view>
            <view v-show="isShowAddMeat" class="add-meat">
                <uni-easyinput
                    class="uni-input"
                    trim="all"
                    @blur="addMeat"
                    v-model="meatInputValue"
                    :focus="isShowAddMeat"
                    placeholder="请输入肉类，多个肉类用逗号分隔"
                />
            </view>
            <button @click="addMeatMode">添加肉类</button>
        </view>
        <uni-title type="h4" title="备忘录" align="center"></uni-title>
        <textarea class="nav_item" v-model="remark" @blur="changeRemark" placeholder="备注...">
        </textarea>
    </view>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    name: 'food',
    components: {},
    props: {},
    data() {
        return {
            isShowDeleteIcon: false,
            isShowAddVegetable: false,
            isShowAddMeat: false,
            vegetableInputValue: '',
            meatInputValue: '',
            remark: '',
            vegetableData: [],
            meatData: [],
            menuDB: undefined,
        };
    },
    computed: {},
    methods: {
        addVegetableMode() {
            this.isShowAddVegetable = true;
            this.isShowAddMeat = false;
        },
        addMeatMode() {
            this.isShowAddMeat = true;
            this.isShowAddVegetable = false;
        },
        async deleteVegetable(i) {
            this.vegetableData.splice(i, 1);
            await this.menuDB.update({
                vegetableData: this.vegetableData,
            });
        },
        async deleteMeat(i) {
            this.meatData.splice(i, 1);
            await this.menuDB.update({
                meatData: this.meatData,
            });
        },
        async addVegetable() {
            this.isShowAddVegetable = false;

            if (this.vegetableInputValue.trim()) {
                const _set = new Set(this.vegetableData);
                this.vegetableInputValue.replace('，', ',');
                this.vegetableInputValue.split(',').forEach((v) => _set.add(v));
                this.vegetableData = [..._set];

                await this.menuDB.update({
                    vegetableData: this.vegetableData,
                });
            }

            this.vegetableInputValue = '';
        },

        async addMeat() {
            this.isShowAddMeat = false;

            if (this.meatInputValue.trim()) {
                const _set = new Set(this.meatData);
                this.meatInputValue.replace('，', ',');
                this.meatInputValue.split(',').forEach((v) => _set.add(v));
                this.meatData = [..._set];

                await this.menuDB.update({
                    meatData: this.meatData,
                });
            }

            this.meatInputValue = '';
        },

        async changeRemark() {
            await this.menuDB.update({
                remark: this.remark,
            });
        },
    },
    watch: {},
    async beforeMount() {
        this.menuDB = uniCloud.database().collection('food').where('user_id==$cloudEnv_uid');
        const res = await this.menuDB.get();
        const [data] = res.result.data;
        if (data) {
            this.meatData = data.meatData;
            this.vegetableData = data.vegetableData;
            this.remark = data.remark;
        } else {
            await uniCloud.database().collection('food').add({
                user_id: uniCloud.getCurrentUserInfo().uid,
                meatData: this.meatData,
                vegetableData: this.vegetableData,
                remark: this.remark,
            });
        }
    },
    // 页面周期函数--监听页面加载
    onLoad() {},
    // 页面周期函数--监听页面初次渲染完成
    onReady() {},
    // 页面周期函数--监听页面显示(not-nvue)
    onShow() {},
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
.tag-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .tag {
        margin: 10rpx 20rpx;
    }
}
</style>
