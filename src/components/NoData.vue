<!-- 空数据 -->
<template>
    <div class="no_data">
        <div class="nodata_icon">
            <img src="/static/img/common/nodata.png" alt="nothing">
        </div>
        <div>{{ props.tip }}</div>
    </div>
</template>

<script setup>

const props = defineProps({
    tip: {
        type: String,
        default: '暂无数据'
    }
})
</script>

<style scoped lang="less">
.no_data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    line-height: 0.4rem;
    font-size: 0.28rem;
    color: #A5AFBA;
    padding: 1rem 0;

    .nodata_icon {
        width: 4.14rem;
        height: auto;
        img {
            width: 100%;
        }
    }
}
</style>