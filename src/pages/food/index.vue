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
        </view>
        <uni-title type="h4" title="备忘录" align="center"></uni-title>
        <textarea class="nav_item" v-model="remark" @blur="changeRemark" placeholder="备注...">
        </textarea>

        <uni-fab
            ref="fab"
            :pattern="pattern"
            :horizontal="horizontal"
            :vertical="vertical"
            :direction="direction"
            :content="content"
            @trigger="trigger"
        />

        <view>
            <!-- 输入框示例 -->
            <uni-popup ref="inputDialog" type="dialog">
                <uni-popup-dialog
                    ref="inputClose"
                    mode="input"
                    :title="dialogTitle"
                    placeholder="多个食物用逗号分隔"
                    @confirm="dialogInputConfirm"
                    @close="dialogClose"
                ></uni-popup-dialog>
            </uni-popup>
        </view>
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
            content: [
                {
                    iconPath: '',
                    selectedIconPath: '',
                    text: '蔬菜',
                    type: 'vegetable',
                    active: false,
                },
                {
                    iconPath: '',
                    selectedIconPath: '',
                    text: '肉类',
                    type: 'meat',

                    active: false,
                },
            ],
            isShowDeleteIcon: false,
            remark: '',
            vegetableData: [],
            meatData: [],
            menuDB: undefined,
            selectFoodType: '',
            dialogTitle: '',
        };
    },
    computed: {},
    methods: {
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
        async addVegetable(foodValue) {
            const _set = new Set(this.vegetableData);
            foodValue.replace('，', ',');
            foodValue.split(',').forEach((v) => _set.add(v));
            this.vegetableData = [..._set];

            await this.menuDB.update({
                vegetableData: this.vegetableData,
            });
        },

        async addMeat(foodValue) {
            const _set = new Set(this.meatData);
            foodValue.replace('，', ',');
            foodValue.split(',').forEach((v) => _set.add(v));
            this.meatData = [..._set];

            await this.menuDB.update({
                meatData: this.meatData,
            });
        },

        async changeRemark() {
            await this.menuDB.update({
                remark: this.remark,
            });
        },
        trigger(e) {
            this.content.forEach((_, i) => {
                if (i !== e.index) {
                    _.active = false;
                }
            });
            this.content[e.index].active = !e.item.active;
            this.selectFoodType = e.item.type;
            this.dialogTitle = e.item.text;
            this.$refs.inputDialog.open();
        },
        async dialogInputConfirm(foodValue) {
            uni.hideLoading();
            if (foodValue.trim()) {
                if (this.selectFoodType === 'meat') {
                    await this.addMeat(foodValue);
                } else {
                    await this.addVegetable(foodValue);
                }
            }

            this.$refs.inputDialog.close();
        },
        dialogClose() {
            this.content.forEach((_, i) => {
                _.active = false;
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
