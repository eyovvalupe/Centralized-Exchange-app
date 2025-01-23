<template>
    <div style="width: 100%;height: 100%;padding: 0 0.32rem 1.4rem 0.32rem;overflow-y: auto;">
        <Recommend :sticky="true" :activated="activated" />
    </div>
</template>

<script setup>
import Recommend from "@/views/Home/Homes/Recommend.vue"
import { ref, onActivated, onDeactivated } from "vue"
import { useSocket } from "@/utils/ws";
import store from "@/store"

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