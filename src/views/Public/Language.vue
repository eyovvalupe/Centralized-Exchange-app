<!-- 语言选择 -->
<template>
    <div class="page page_language">
        <Top :title="'语言'" />

        <CheckboxGroup class="lang_box" v-model="checked" :max="2">
            <div class=" lang_item" v-for="(item, i) in navs" :key="i" @click="clickItem(item)">
                <div class="logo">
                    <img :src="item.icon" alt="english">
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="check">
                    <Checkbox checked-color="#014CFA" :name="item.val"></Checkbox>
                </div>
            </div>
        </CheckboxGroup>
    </div>
</template>

<script setup>
import Top from "@/components/Top.vue"
import { Checkbox, CheckboxGroup } from "vant"
import { ref } from "vue"
import router from "@/router"

const checked = ref(['en'])
const navs = ref([
    { name: 'English', icon: '/static/img/common/en.png', val: 'en' },
    { name: '中文繁体', icon: '/static/img/common/cn.png', val: 'cn' },
])

const clickItem = item => {
    checked.value = [item.val]
    router.back()
}

</script>

<style lang="less" scoped>
.page_language {
    padding-top: 1.12rem;

    .lang_box {
        padding: 0.8rem 0.4rem;

        .lang_item {
            overflow: hidden;
            height: 1.6rem;
            border-bottom: 1px solid #F4F4F4;
            display: flex;
            align-items: center;

            .logo {
                width: 0.96rem;
                height: 0.96rem;
                margin-right: 0.32rem;
            }

            .name {
                flex: 1;
                text-align: left;
                color: #1E1E2D;
                font-size: 0.32rem;
            }
        }
    }
}
</style>