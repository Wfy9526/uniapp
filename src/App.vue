<script>
import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
export default {
    globalData: {
        queryString: 'user_id==$cloudEnv_uid',
        menuCategory: {},
        uniFabPattern: {
            color: '#7A7E83',
            backgroundColor: '#fff',
            selectedColor: '#007AFF',
            buttonColor: '#fff',
            iconColor: '#aaa',
        },
    },
    async onLaunch() {
        console.log('App Launch');
        await uniIdPageInit();
    },
    onShow() {
        console.log('App Show');
    },
    onHide() {
        console.log('App Hide');
    },
};
</script>

<style>
/*每个页面公共css */
::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
}
</style>
