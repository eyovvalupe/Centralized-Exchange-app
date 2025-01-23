<template>
    <div class="page-trade3">
        
       <div class="search-bg">
            <div class="search-box item">
                <div class="search-icon" >
                    <img v-lazy="getStaticImgUrl('/static/img/common/search.svg')" alt="">
                </div>

                <input class="ipt" type="text" placeholder="输入币对">
            </div>

            <div class="bill-box" @click="jump('tradeOrder')">
                <img v-lazy="getStaticImgUrl('/static/img/common/bill.svg')" alt="">
            </div>
       </div>
        
        <Recommend from="trade" :sticky="true" :activated="activated" />
    </div>
</template>

<script setup>
import Recommend from "@/views/Home/Homes/Recommend.vue"
import { ref, onActivated, onDeactivated } from "vue"
import { useSocket } from "@/utils/ws";
import store from "@/store"
import { getStaticImgUrl } from "@/utils/index.js"
import router from "@/router";

const jump = name => router.push(name)

const { startSocket } = useSocket();
// 订阅
const subs = () => {
    store.commit("setMarketWatchKeysByPage");
    store.dispatch("subList", {});
};


const activated = ref(false);
onActivated(() => {
    store.commit("setMarketWatchKeys", []);
    activated.value = true;
    subs();
});
onDeactivated(() => {
    activated.value = false;
    // 取消订阅
    const socket = startSocket(() => {
        socket && socket.emit("realtime", ""); // 价格变化
        socket && socket.emit("snapshot", ""); // 快照数据
        socket && socket.off("realtime");
        socket && socket.off("snapshot");
    });

});
</script>

<style lang="less" scoped>
.page-trade3 {
    width: 100%;height: 100%;padding: 1.32rem 0.32rem 1.4rem 0.32rem;overflow-y: auto;
    position: relative;
    .search-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 1.34rem;
        padding: 0.16rem 0.32rem 0 0.32rem;
        z-index: 999;
        background-color: var(--ex-bg-color);

        .bill-box {
            width: 0.64rem;
            height: 0.64rem;
            border-radius: 50%;
            background-color: var(--ex-bg-white);
            position: absolute;
            right: 0.32rem;
            padding: 0.16rem;
            top: 1.32rem;
        }
    }
    .search-box {
        height: 0.92rem;
        border-radius: 0.92rem;
        background-color: var(--ex-bg-white2);
        display: flex;
        align-items: center;
        padding: 0 0.3rem;
        .search-icon {
            width: 0.32rem;
            height: 0.32rem;
            margin-right: 0.3rem;
        }
        .ipt {
            height: 100%;
            flex: 1;
        }
    }
}
</style>