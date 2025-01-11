<template>
    <div class="pledge_page">
        <Tabs v-model:active="active" type="custom-card-stake" @change="onChange" style="height: calc(var(--vh) * 100 - 0.88rem); overflow-y: auto;">
            <Tab :title="$t('finance.defi_coll_borrow')">
                <PledgeForm />
            </Tab>
            <Tab class="mb-[1.2rem]" :title="$t('finance.defi_borrow_order')">
                <PledgeOrder/>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tabs,Tab } from 'vant';
import PledgeForm from './components/PledgeForm'
import PledgeOrder from './components/PledgeOrder.vue';
const active = ref(0)
const onChange = () => {

}
</script>

<style lang="less">
.pledge_page {
    padding: 0 0.32rem;
}
</style>