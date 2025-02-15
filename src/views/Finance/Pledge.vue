<template>
    <div class="pledge_page">
        <Tabs v-model:active="active" id="pledge-tabs" animated type="custom-card-stake" @change="onChange"
            style="height: calc(var(--vh) * 100 - 0.88rem); overflow-y: auto;" @scroll="onScroll">
            <Tab :title="$t('finance.defi_coll_borrow')">
                <PledgeForm />
                <div class="h-[1.4rem]"></div>
            </Tab>
            <Tab :title="$t('finance.defi_borrow_order')">
                <PledgeOrder />
                <div class="h-[1.4rem]"></div>
            </Tab>
        </Tabs>

    </div>
</template>

<script setup>
import { Tabs, Tab } from 'vant';
import PledgeForm from './components/PledgeForm.vue'
import PledgeOrder from './components/PledgeOrder.vue';
import eventBus from "@/utils/eventBus";
import { onMounted, onBeforeUnmount } from 'vue';

const active = ref(0)
const onChange = () => {

}
const onPledgeSuccess = () => {
    active.value = 1
}
let loadflag = true
const onScroll = (e) => {
    if (e.target.offsetHeight + e.target.scrollTop + 20 > e.target.scrollHeight && active.value == 1 && loadflag) {
        loadflag = false
        eventBus.emit("pledgeLoad")
        setTimeout(() => {
            loadflag = true
        }, 1000)
    }
}
onMounted(() => {
    document.getElementById('pledge-tabs').addEventListener('scroll', onScroll)
    eventBus.on("pledgeSuccess", onPledgeSuccess)
})
onBeforeUnmount(() => {
    document.getElementById('pledge-tabs').removeEventListener('scroll', onScroll)
    eventBus.off("pledgeSuccess", onPledgeSuccess)
})

</script>
