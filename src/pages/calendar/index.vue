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
                        <view class="tag-container" v-if="item.breakfastData">
                            <view class="tag" v-for="(breakfast, i) in item.breakfastData" :key="i">
                                <text>{{ breakfast.name }}</text>
                                <icon
                                    class="del-icon"
                                    type="cancel"
                                    size="16"
                                    @click="deleteMenu(item.breakfastData, i)"
                                ></icon>
                            </view>
                        </view>
                    </uni-group>
                    <uni-group title="中餐">
                        <view class="tag-container" v-if="item.lunchData">
                            <view class="tag" v-for="(lunch, i) in item.lunchData" :key="i">
                                <text>{{ lunch.name }}</text>
                                <icon
                                    class="del-icon"
                                    type="cancel"
                                    size="16"
                                    @click="deleteMenu(item.lunchData, i)"
                                ></icon>
                            </view>
                        </view>
                    </uni-group>
                    <uni-group title="晚餐">
                        <view class="tag-container" v-if="item.supperData">
                            <view class="tag" v-for="(supper, i) in item.supperData" :key="i">
                                <text>{{ supper.name }}</text>
                                <icon
                                    class="del-icon"
                                    type="cancel"
                                    size="16"
                                    @click="deleteMenu(item.supperData, i)"
                                ></icon>
                            </view>
                        </view>
                    </uni-group>
                </scroll-view>
            </swiper-item>
        </swiper>

        <uni-popup ref="popup" background-color="#fff" @change="popupChange">
            <view class="popup-content">
                <template v-for="val in menuCategory">
                    <uni-group :key="val.type" :title="val.name">
                        <template v-for="item in labelMenuData[val.type]">
                            <view class="label" :key="item.name">
                                <uni-tag
                                    :text="item.name"
                                    :type="
                                        selectMenuCategory.includes(`${item.name}-${val.type}`)
                                            ? 'primary'
                                            : ''
                                    "
                                    @click="clickTag(`${item.name}-${val.type}`)"
                                />
                            </view>
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
            tabsContentsData: {},
            tabsData: [
                { name: '周一', type: 'day1' },
                { name: '周二', type: 'day2' },
                { name: '周三', type: 'day3' },
                { name: '周四', type: 'day4' },
                { name: '周五', type: 'day5' },
                { name: '周六', type: 'day6' },
                { name: '周日', type: 'day7' },
            ],
            labelMenuData: {},
            menuCategory: [],
            selectMenuCategory: [],
            selectFoodType: '',
            selectDay: '',
            pattern: {},
            content: [
                {
                    iconPath: '/static/tabbar/list.png',
                    selectedIconPath: '/static/tabbar/list_active.png',
                    text: '早餐',
                    type: 'breakfast',
                    active: false,
                },
                {
                    iconPath: '/static/tabbar/list.png',
                    selectedIconPath: '/static/tabbar/list_active.png',
                    text: '午餐',
                    type: 'lunch',
                    active: false,
                },
                {
                    iconPath: '/static/tabbar/list.png',
                    selectedIconPath: '/static/tabbar/list_active.png',
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
            this.selectDay = this.tabsData[index].type;
        },
        // swiper滑动时，获取其索引，也就是第几个
        swiperChange(e) {
            this.currentindex = e.detail.current;
        },
        clickTag(category) {
            const _set = new Set(this.selectMenuCategory);
            if (_set.has(category)) {
                _set.delete(category);
            } else {
                _set.add(category);
            }
            this.selectMenuCategory = [..._set];
        },
        async deleteMenu(data, i) {
            data.splice(i, 1);
            this.tabsContentsData = { ...this.tabsContentsData };
            const dayDatas = this.tabsContentsData[this.selectDay];
            const updateData = {};
            updateData[this.selectDay] = [
                ...dayDatas.breakfastData,
                ...dayDatas.lunchData,
                ...dayDatas.supperData,
            ];
            await uniCloud
                .database()
                .collection('calendar')
                .where(getApp().globalData.queryString)
                .update(updateData);
        },

        async loadMenuData() {
            const menuData = await uniCloud
                .database()
                .collection('menu')
                .where(getApp().globalData.queryString)
                .get();
            const [data] = menuData.result.data;
            if (data) {
                this.labelMenuData = data;
            }
        },
        async loadCalendarData() {
            const menuData = await uniCloud
                .database()
                .collection('calendar')
                .where(getApp().globalData.queryString)
                .get();
            const [data] = menuData.result.data;
            if (data) {
                this.tabsData.forEach((tab) => {
                    const breakfastData = [];
                    const supperData = [];
                    const lunchData = [];
                    data[tab.type].forEach((d) => {
                        if (d.type === 'breakfast') {
                            breakfastData.push(d);
                        } else if (d.type === 'lunch') {
                            lunchData.push(d);
                        } else {
                            supperData.push(d);
                        }
                    });
                    this.tabsContentsData[tab.type] = { breakfastData, supperData, lunchData };
                });
            } else {
                await uniCloud.database().collection('calendar').add({
                    user_id: uniCloud.getCurrentUserInfo().uid,
                    day1: [],
                    day2: [],
                    day3: [],
                    day4: [],
                    day5: [],
                    day6: [],
                    day7: [],
                });
            }
        },
        trigger(e) {
            this.content.forEach((_) => {
                _.active = false;
            });
            this.content[e.index].active = true;
            this.selectFoodType = e.item.type;
            this.$refs.popup.open('center');
        },
        async popupChange(e) {
            if (!e.show) {
                this.content.forEach((_) => {
                    _.active = false;
                });
            }
            if (!e.show && this.selectMenuCategory.length) {
                if (!this.tabsContentsData[this.selectDay]) {
                    this.tabsContentsData[this.selectDay] = {
                        breakfastData: [],
                        lunchData: [],
                        supperData: [],
                    };
                }
                const dayDatas = this.tabsContentsData[this.selectDay];
                this.selectMenuCategory.forEach((menu) => {
                    const [name] = menu.split('-');
                    const menuInfo = { name, type: this.selectFoodType };
                    if (this.selectFoodType === 'breakfast') {
                        dayDatas.breakfastData.push(menuInfo);
                    } else if (this.selectFoodType === 'lunch') {
                        dayDatas.lunchData.push(menuInfo);
                    } else {
                        dayDatas.supperData.push(menuInfo);
                    }
                });
                this.tabsContentsData = { ...this.tabsContentsData };
                const updateData = {};
                updateData[this.selectDay] = [
                    ...dayDatas.breakfastData,
                    ...dayDatas.lunchData,
                    ...dayDatas.supperData,
                ];
                await uniCloud
                    .database()
                    .collection('calendar')
                    .where(getApp().globalData.queryString)
                    .update(updateData);
            }
        },
    },
    async beforeMount() {
        const menuObj = uniCloud.importObject('menu');
        this.menuCategory = await menuObj.getMenuCategory();
    },
    // 页面周期函数--监听页面加载
    async onLoad() {
        this.pattern = getApp().globalData.uniFabPattern;
        this.selectDay = this.tabsData[0].type;
        await this.loadCalendarData();
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
        background-color: #f1f1f1;
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
            padding: 10rpx 20rpx;
            background: lightgrey;
            border-radius: 20rpx;
            height: 40rpx;
            line-height: 40rpx;
            font-size: 32rpx;
            margin-right: 25rpx;
            margin-bottom: 20rpx;
        }
        .del-icon {
            margin-left: 5rpx;
        }
    }
    .label {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 20rpx;
    }
    .uni-popup__wrapper {
        width: 95%;
        height: 75%;
        overflow: auto;
        border-radius: 15rpx;
    }
}
</style>
