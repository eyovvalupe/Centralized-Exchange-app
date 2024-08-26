<!-- 自选推荐 -->
<template>
    <div class="recommend_list">
        <Loading v-show="!props.list.length && props.loading" />
        <div class="list_box">
            <div class="list_item" @click="changeCheck(i)" :class="{ 'list_item_active': checkedList[i] }"
                v-for="(item, i) in props.list" :key="i">
                <div class="symbol">{{ item.symbol }}</div>
                <div class="name">{{ item.name || '--' }}</div>
                <div class="price">{{ item.price ? (item.price).toFixed(2) : '--' }}</div>
                <div class="percent" :class="[updown(item) === 0 ? '' : (updown(item) > 0 ? 'up' : 'down')]">{{
                    ((item.ratio || 0) *
                        100).toFixed(2) }}%</div>

                <div class="sparkLine">
                    <SparkLine v-if="item.points" style="width:100%;height:0.45rem" :points="item.points"
                        :ratio="item.ratio" />
                </div>

                <div class="unchecked" v-if="!checkedList[i]"></div>
                <div class="checked" v-if="checkedList[i]">
                    <div class="ok">
                        <img src="/static/img/common/ok.png" alt="√">
                    </div>
                </div>
            </div>
        </div>
        <!-- <Button :loading="loading" :disabled="disabled" round color="#014CFA" class="submit" type="primary"
            @click="submit">一键添加至自选</Button> -->
    </div>
</template>

<script setup>
import SparkLine from "./SparkLine.vue"
import Loading from "./Loaidng.vue"
import { ref, computed } from "vue"
import { Button, showToast } from 'vant'
import { _add } from "@/api/api"
import store from "@/store"
import router from "@/router"

const emits = defineEmits(['init', 'change'])
const token = computed(() => store.state.token || '')

const props = defineProps({
    keyStr: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: true,
    },
    list: {
        type: Array,
        default: () => []
    }
})


const updown = item => {
    if (item.ratio === undefined) return 0
    return item.ratio > 0 ? 1 : -1
}

const emitsKeys = () => {
    const keys = []

    checkedList.value.map((item, i) => {
        if (item) {
            keys.push(props.list[i].symbol)
        }
    })
    emits('change', keys)
}

const checkedList = ref([])
try {
    checkedList.value = JSON.parse(sessionStorage.getItem(props.keyStr + '_recommend_check_list') || '[]')
} catch {
    checkedList.value = []
}
emitsKeys()

const changeCheck = i => {
    if (checkedList.value[i]) {
        checkedList.value[i] = !checkedList.value[i]
    } else {
        checkedList.value[i] = true
    }

    sessionStorage.setItem(props.keyStr + '_recommend_check_list', JSON.stringify(checkedList.value))

    emitsKeys()
}


const loading = ref(false)
const disabled = computed(() => !checkedList.value.some(item => item == true))


// 添加自选
const submit = () => {

    if (!token.value) return router.push({
        name: 'login',
        query: {
            reurl: "market"
        }
    })

    const keys = []
    checkedList.value.map((item, i) => {
        if (item) {
            keys.push(props.list[i].symbol)
        }
    })
    loading.value = true
    _add({
        symbol: keys.join(',')
    }).then(res => {
        if (res.code == 200) {
            showToast('添加成功')
            emits('init')
        }
    }).finally(() => {
        loading.value = false
    })
}
</script>


<style lang="less" scoped>
.recommend_list {
    padding: 0 0.32rem;
    // height: calc(var(--app-height) - 4.2rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .list_box {
        flex: 1;
        overflow-y: auto;
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        flex-wrap: wrap;

        .list_item {
            height: 2rem;
            width: 3.36rem;
            border-radius: 0.12rem;
            border: 1px solid #E9EBF0;
            margin-bottom: 0.28rem;
            position: relative;
            padding: 0.12rem;
            overflow: hidden;

            .symbol {
                font-size: 0.32rem;
                color: #061023;
            }

            .name {
                font-size: 0.24rem;
                color: #8F92A1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin: 0.2rem 0;
            }

            .price {
                color: #061023;
                font-weight: 700;
                font-size: 0.32rem;
                margin-bottom: 0.08rem;
            }

            .percent {
                font-size: 0.32rem;
            }

            .sparkLine {
                position: absolute;
                width: 1.6rem;
                height: 0.5rem;
                right: 0.1rem;
                bottom: 0.1rem;
            }

            .unchecked {
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                width: 0.36rem;
                height: 0.36rem;
                border-radius: 50%;
                border: 1px solid #ddd;
                opacity: 0.9;
            }
        }

        .list_item_active {
            // border: 1px solid #3B6BEE;
            background-color: #F5F7F8;

            .checked {
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                width: 0.36rem;
                height: 0.36rem;
                border-radius: 50%;
                background-color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.9;

                .ok {
                    width: 0.16rem;
                    height: 0.16rem;
                    text-align: center;
                    line-height: 0;
                }
            }
        }

        .list_item_active2 {
            border: 1px solid #3B6BEE;

            .checked {
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
                background-color: #3B6BEE;
                display: flex;
                align-items: center;
                justify-content: center;

                .ok {
                    width: 0.24rem;
                    height: 0.24rem;
                }
            }
        }

        .list_item_active3 {
            background-color: #F5F7F8;

            .checked {
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 50%;
                background-color: #000;
                display: flex;
                align-items: center;
                justify-content: center;

                .ok {
                    width: 0.24rem;
                    height: 0.24rem;
                }
            }
        }
    }

    .submit {
        margin: 0.2rem 0;
    }
}
</style>