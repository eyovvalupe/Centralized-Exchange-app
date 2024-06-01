<!-- 密码等级 -->
<template>
    <div class="password_level" :class="'password_level_' + levels">
        <div class="levels">
            <div class="level level_active" v-for="i in levels" :key="i"></div>
            <div class="level" v-for="i in (4 - levels)" :key="i"></div>
        </div>
        <span>
            {{ levelsMap[levels] }}
        </span>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue"

const props = defineProps({
    password: {
        type: String,
        default: ''
    }
})

const levelsMap = {
    0: '弱',
    2: '中等',
    4: '优秀'
}
const levels = computed(() => {
    if (props.password.length < 6) {
        return 0
    }
    if (props.password.length < 10) {
        return 2
    }
    return 4
})
</script>

<style lang="less" scoped>
.password_level {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.24rem;
    color: #FF5757;

    .levels {
        display: flex;
        align-items: center;
        margin-right: 0.16rem;

        .level {
            width: 0.4rem;
            height: 0.06rem;
            background-color: #D9D9D9;
            margin-right: 0.08rem;
            border-radius: 0.04rem;
        }
    }
}

.password_level_2 {
    color: #E53E00;

    .levels {
        .level_active {
            background-color: #FF5757;
        }
    }
}

.password_level_4 {
    color: #00AF70;

    .levels {
        .level_active {
            background-color: #00AF70;
        }
    }
}
</style>