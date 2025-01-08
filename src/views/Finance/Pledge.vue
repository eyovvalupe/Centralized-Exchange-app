<template>
    <div class="pledge_page">
        <Tabs v-model:active="active" type="custom-card-stake" @change="onChange" style="height: calc(100vh - 0.88rem); overflow-y: auto;">
            <Tab :title="'质押借币'">
                <PledgeForm />
            </Tab>
            <Tab class="mb-[1.2rem]" :title="'在借订单'">
                <PledgeOrder/>
            </Tab>
        </Tabs>
    </div>
</template>

<script setup>
import { Tabs,Tab } from 'vant';
import PledgeForm from './components/PledgeForm'
import PledgeOrder from './components/PledgeOrder.vue';
const active = ref(1)
const onChange = () => {

}
</script>

<style lang="less">
.pledge_page {
    padding: 0 0.32rem;
}
</style>