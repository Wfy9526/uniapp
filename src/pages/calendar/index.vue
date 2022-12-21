<template>
    <view class="calendar">
        <view class="nav">
            <!-- 选项卡水平方向滑动，scroll-with-animation是滑动到下一个选项时，有一个延时效果 -->
            <scroll-view
                class="tab-scroll"
                scroll-x="true"
                scroll-with-animation
                :scroll-left="scrollLeft"
            >
                <view class="tab-scroll_box">
                    <!-- 选项卡类别列表 -->
                    <view
                        class="tab-scroll_item"
                        v-for="(item, index) in tabsData"
                        :key="item.name"
                        :class="{ active: isActive == index }"
                        @click="chenked(index)"
                    >
                        {{ item.name }}
                    </view>
                </view>
            </scroll-view>
        </view>
        <!-- 选项卡内容轮播滑动显示，current为当前第几个swiper子项 -->
        <swiper
            @change="swiperChange"
            :current="isActive"
            class="swiper-content"
            :style="fullHeight"
        >
            <swiper-item
                class="swiperitem-content"
                v-for="(item, index) in tabsContentsData"
                :key="index"
            >
                <scroll-view scroll-y style="height: 100%">
                    <uni-group title="早餐">
                        <view class="tag-container">
                            <view class="tag" v-for="(breakfast, i) in item.breakfastData" :key="i">
                                <text>{{ breakfast }}</text>
                                <icon
                                    class="del-icon"
                                    type="cancel"
                                    size="16"
                                    @click="deleteMenu(item.breakfastData, i)"
                                ></icon>
                            </view>
                        </view>

                        <textarea
                            class="nav_item"
                            v-model="item.breakfastText"
                            placeholder="自定义内容..."
                        >
                        </textarea>
                    </uni-group>
                    <uni-group title="中餐">
                        <view class="tag-container">
                            <view class="tag" v-for="(lunch, i) in item.lunchData" :key="i">
                                <view>{{ lunch }}</view>
                                <icon
                                    class="del-icon"
                                    type="cancel"
                                    size="16"
                                    @click="deleteMenu(item.lunchData, i)"
                                ></icon>
                            </view>
                        </view>

                        <textarea
                            class="nav_item"
                            v-model="item.lunchText"
                            placeholder="自定义内容..."
                        >
                        </textarea>
                    </uni-group>
                    <uni-group title="晚餐">
                        <view class="tag-container">
                            <view class="tag" v-for="(supper, i) in item.supperData" :key="i">
                                <view>{{ supper }}</view>
                                <icon
                                    class="del-icon"
                                    type="cancel"
                                    size="16"
                                    @click="deleteMenu(item.supperData, i)"
                                ></icon>
                            </view>
                        </view>
                        <textarea
                            class="nav_item"
                            v-model="item.supperText"
                            placeholder="自定义内容..."
                        >
                        </textarea>
                    </uni-group>
                </scroll-view>
            </swiper-item>
        </swiper>

        <uni-popup ref="popup" background-color="#fff" @change="popupChange">
            <view class="popup-content">
                <template v-for="(menu, label) in labelMenuData">
                    <uni-group :key="label" :title="label">
                        <template v-for="(item, i) in menu">
                            <uni-tag
                                :key="item.name"
                                :text="item.name"
                                :type="
                                    selectMenuCategory === `${item.name}-${item.type}`
                                        ? 'primary'
                                        : ''
                                "
                                @click="addTag(menu, i)"
                            />
                        </template>
                    </uni-group>
                </template>
            </view>
        </uni-popup>

        <uni-fab
            ref="fab"
            :pattern="pattern"
            horizontal="right"
            vertical="bottom"
            direction="horizontal"
            :content="content"
            @trigger="trigger"
        />
    </view>
</template>

<script>
import Vue from 'vue';
export default Vue.extend({
    name: 'calendar',
    components: {},
    props: {},
    data() {
        return {
            isActive: 0,
            currentindex: 0,
            contentScrollW: 0, // 导航区宽度
            scrollLeft: 0, // 横向滚动条位置
            fullHeight: '',
            tabsContentsData: [
                {
                    breakfastText: '',
                    lunchText: '',
                    supperText: '',
                    breakfastData: ['1', '2', '233', '444dsa', '66'],
                    lunchData: [],
                    supperData: [],
                },
            ],
            tabsData: [
                { name: '周日' },
                { name: '周一' },
                { name: '周二' },
                { name: '周三' },
                { name: '周四' },
                { name: '周五' },
                { name: '周六' },
            ],
            labelMenuData: {},
            selectMenuCategory: '',
            selectFoodType: '',
            pattern: {},
            content: [
                {
                    iconPath: '',
                    selectedIconPath: '',
                    text: '早餐',
                    type: 'breakfast',
                    active: false,
                },
                {
                    iconPath: '',
                    selectedIconPath: '',
                    text: '午餐',
                    type: 'lunch',
                    active: false,
                },
                {
                    iconPath: '',
                    selectedIconPath: '',
                    text: '晚餐',
                    type: 'supper',
                    active: false,
                },
            ],
        };
    },
    watch: {
        // swiper与上面选项卡联动
        currentindex(newval) {
            this.isActive = newval;
            this.scrollLeft = 0;
            // 滑动swiper后，每个选项距离其父元素最左侧的距离
            for (let i = 0; i < newval - 1; i++) {
                this.scrollLeft += this.tabsData[i].width;
            }
        },
    },
    mounted() {
        //获取手机屏幕的高度，让其等于swiper的高度，从而使屏幕充满
        uni.getSystemInfo({
            success: (res) => {
                this.fullHeight = `height:${res.windowHeight}px`;
            },
        });
        // 获取标题区域宽度，和每个子元素节点的宽度
        this.getScrollW();
    },
    methods: {
        // 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
        getScrollW() {
            const query = uni.createSelectorQuery().in(this);
            query
                .select('.tab-scroll')
                .boundingClientRect((data) => {
                    // 拿到 scroll-view 组件宽度
                    this.contentScrollW = data.width;
                })
                .exec();
            query
                .selectAll('.tab-scroll_item')
                .boundingClientRect((data) => {
                    let dataLen = data.length;
                    for (let i = 0; i < dataLen; i++) {
                        //  scroll-view 子元素组件距离左边栏的距离
                        this.tabsData[i].left = data[i].left;
                        //  scroll-view 子元素组件宽度
                        this.tabsData[i].width = data[i].width;
                    }
                })
                .exec();
        },
        // 当前点击子元素靠左留一个选项展示，子元素宽度不相同也可实现
        chenked(index) {
            this.isActive = index;
            this.scrollLeft = 0;
            for (let i = 0; i < index - 1; i++) {
                this.scrollLeft += this.tabsData[i].width;
            }
        },
        // swiper滑动时，获取其索引，也就是第几个
        swiperChange(e) {
            this.currentindex = e.detail.current;
        },
        addTag(arr, i) {
            this.selectMenuCategory = `${arr[i].name}-${arr[i].type}`;
        },
        deleteMenu(data, i) {
            data.splice(i, 1);
        },
        async popupChange(e) {
            if (!e.show) {
                //
            }
        },
        async loadMenuData() {
            const menuData = await uniCloud
                .database()
                .collection('menu')
                .where('user_id==$cloudEnv_uid')
                .get();
            this.labelMenuData = menuData.result.data[0] || {};
        },
        trigger(e) {
            this.content.forEach((_, i) => {
                if (i !== e.index) {
                    _.active = false;
                }
            });
            this.content[e.index].active = !e.item.active;
            this.selectFoodType = e.item.type;
            this.$refs.popup.open('top');
        },
    },

    // 页面周期函数--监听页面加载
    async onLoad() {
        this.pattern = getApp().globalData.uniFabPattern;
        await this.loadMenuData();
    },
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

<style lang="scss">
.calendar {
    width: 100%;
    .nav {
        border-top: 1rpx solid #f2f2f2;
        background-color: #fceeee;
        height: 100rpx;
        line-height: 100rpx;
        .tab-scroll {
            white-space: nowrap;
            .tab-scroll_box {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                box-sizing: border-box;
                .tab-scroll_item {
                    line-height: 60rpx;
                    flex-shrink: 0;
                    display: flex;
                    justify-content: center;
                    font-size: 16px;
                    padding: 10rpx 30rpx;
                }
            }
        }
    }
    .swiper-content {
        .swiperitem-content {
            background-color: #ffffff;
            .nav_item {
                background-color: #ffffff;
                padding: 20rpx 40rpx 0rpx 40rpx;
            }
        }
    }
    .active {
        position: relative;
        color: #ff0000;
        font-weight: 600;
    }
    .tag-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .tag {
            margin: 10rpx 20rpx;
        }
    }
}
</style>
