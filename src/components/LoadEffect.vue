<template>
    <div class="loadEffect">
        <span v-for="num in 8" :style="{background:color}" :key="num"></span>
       
    </div>
</template>
<script setup>
const props = defineProps({
    color:{
        type:String,
        default:'var(--ex-primary-color)'
    }
})
</script>
<style lang="less" scoped>
.loadEffect{
    width: 2rem;
    height: 2rem;
    position: relative;
}
.loadEffect span{
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    position: absolute;
    animation: load 1.04s linear infinite;
}
@keyframes load{
    0%{
        transform: scale(1.2);
        opacity: 1;
    }
    100%{
        transform: scale(.3);
        opacity: 0.5;
    }
}
.loadEffect span:nth-child(1){
    left: 0;
    top: 50%;
    margin-top:-0.2rem;
    animation-delay:0.13s;
}
.loadEffect span:nth-child(2){
    left: 0.28rem;
    top: 0.28rem;
    animation-delay:0.26s;
}
.loadEffect span:nth-child(3){
    left: 50%;
    top: 0;
    margin-left: -0.2rem;
    animation-delay:0.39s;
}
.loadEffect span:nth-child(4){
    top: 0.28rem;
    right:0.28rem;
    animation-delay:0.52s;
}
.loadEffect span:nth-child(5){
    right: 0;
    top: 50%;
    margin-top:-0.2rem;
    animation-delay:0.65s;
}
.loadEffect span:nth-child(6){
    right: 0.28rem;
    bottom:0.28rem;
    animation-delay:0.78s;
}
.loadEffect span:nth-child(7){
    bottom: 0;
    left: 50%;
    margin-left: -0.2rem;
    animation-delay:0.91s;
}
.loadEffect span:nth-child(8){
    bottom: 0.28rem;
    left: 0.28rem;
    animation-delay:1.04s;
}
</style>