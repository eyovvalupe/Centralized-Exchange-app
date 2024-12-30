<template>
     <div class="header_tabs" :class="['header_tabs--'+type]">
        <slot name="before" />
        <div class="tabs" ref="tabScroller">
            <div class="tab_body">
                <div class="tab" v-for="(tabName,i) in tabs" :key="i" :class="{ 'active_tab': active == i,'tab--last':i == tabs.length-1 }" @click="changeActiveTab(i)">
                    <span class="tab-name">{{tabName}}</span>
                </div>
                
            </div>
        </div>
        <slot name="after" />
    </div>
</template>
<script setup>
import { nextTick,onMounted,ref, watch } from 'vue';
const emit = defineEmits(['update:active','change'])
const props = defineProps({
    type:{
        type:String,
        default:"default"
    },
    active:{
        type:Number,
        default:0
    },
    tabs:{
        type:Array,
        default(){
            return []
        }
    }
})
const tabScroller = ref(null)
let timer = null
const animateScrollLeft = (el,x,n,s=5)=>{
    n -= s
    if(n < x){
        n = x
        el.scrollTo(n,0)
    }else{
        el.scrollTo(n,0)
        timer = setTimeout(()=>{
            animateScrollLeft(el,x,n)
        },15)
    }
}
const animateScrollRight = (el,x,n,s=5)=>{
    n += s
    if(n > x){
        n = x
        el.scrollTo(n,0)
    }else{
        el.scrollTo(n,0)
        timer = setTimeout(()=>{
            animateScrollRight(el,x,n)
        },15)
    }
}
const animateScroll = (el,x,s=5)=>{
    if(timer !== null){
        clearTimeout(timer)
    }
    if(el.scrollLeft > x){
        animateScrollLeft(el,x,el.scrollLeft,s)
    }else{
        animateScrollRight(el,x,el.scrollLeft,s)
    }
}
const initScrollLeft = ()=>{
    if(tabScroller.value && tabScroller.value.querySelector('.active_tab')){
        const activeTabEl = tabScroller.value.querySelector('.active_tab')
        const left = activeTabEl.offsetLeft
        if(left > tabScroller.value.offsetWidth/3){
            const x = left - tabScroller.value.offsetWidth/3
            animateScroll(tabScroller.value,x)
        }else{
            animateScroll(tabScroller.value,0)
        }
    }
}

const changeActiveTab = (val)=>{
    emit('update:active',val)
    emit('change',val)
    
}
watch(()=>props.active,()=>{
    nextTick(()=>{
        initScrollLeft()
    })
})
onMounted(()=>{
    initScrollLeft()
})

</script>

<style lang="less" scoped>
.header_tabs {
    height: 1.12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .tabs {
        flex: 1;
        display: flex;
        align-items: center;
        position: relative;
        overflow-x: auto;
        .tab_body {
            flex: 1;
            display: flex;
            align-items: center;
            margin: 0 0.2rem;
        }

        .tab {
            font-size: .28rem;
            color: var(--ex-text-color2);
            padding: 0 .22rem;
            height: .66rem;
            line-height: 0;
            border-radius: .48rem;
            display: flex;
            padding-bottom: 0.06rem;
            align-items: center;
            cursor: pointer;
            white-space: nowrap;
            position: relative;
        
            .tab-name{
                position: relative;
                z-index: 1;
                transition: .3s;
                font-size: 0.3rem;
            }
            &::after{
                content: '';
                width: 0.6rem;
                height: 0.2rem;
                background-color: var(--ex-primary-color);
                position: absolute;
                bottom: 0;
                left:50%;
                margin-left: -0.3rem;
                border-radius: 0.6rem;
                transition: .3s;
                opacity: 0;
                transform: scale(0);
            }
        }

        .active_tab {
            color: var(--ex-text-color);
            font-weight: 700;
            opacity: 1;
            .tab-name{
                font-size: 0.56rem;
            }
            &::after{
                opacity: 1;
                transform: scale(1);
            }
        }

    }
}
.header_tabs--card,
.header_tabs--small-card{
    height: 0.8rem;
    .tabs{
        .tab_body{
            margin: 0;
        }
        .tab{
            border: 1px solid var(--ex-border-color2);
            margin-right: 0.12rem;
            padding: 0 .32rem;
            height: .8rem;
            font-size: 0.32rem;
            box-sizing: border-box;
        }
        .active_tab{
            background-color: var(--ex-primary-color);
            border-color:var(--ex-primary-color);
            font-weight: normal;
            .tab-name{
                font-size: 0.32rem;
                color:var(--ex-text-color--bg-primary);
            }
            &::after{
                display: none;
            }
        }
    }
}
.header_tabs--small-card{
    height: 0.7rem;
    .tabs{
        .tab{
            height: 0.7rem;
            font-size: 0.3rem;
            padding: 0 0.26rem;
        }
        .active_tab{
            .tab-name{
                font-size: 0.3rem;
            }
        }
    }
}
</style>