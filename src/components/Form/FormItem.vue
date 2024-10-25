<template>
<div class="form-item">
    <div class="form-item-title" v-if="title">
        <span>{{title}}</span>
        <span class="form-item-title__right">
            <slot name="title-right"/>
        </span>
    </div>
    <div class="form-item-box">
        <div class="item" :class="{'disabled_item':disabled, 'item_focus': inputFocus && tip,'item_focus2':inputFocus && !tip }" :style="{background}">
            <span class="ipt_tip" v-if="tip" v-show="inputVal || inputFocus">{{tip}}</span>
            
            <slot v-if="custom" />
            <input :disabled="disabled" v-else v-model="inputVal" @focus="inputFocus = true" @blur="inputFocus = false" :type="inputType" class="ipt" @input="emit('update:modelValue',inputVal)" @change="inputChange" :placeholder="placeholder">

            <template v-if="percentTags && percentTags.length">
            <span class="percent_tag" v-for="(percent,i) in percentTags" :key="i" @click="percentTagClick(percent)"
                v-show="inputVal" :style="{ visibility: inputFocus ? '' : 'hidden' }">{{ percent }}</span>
            </template>

            <span class="put_all put_all_place" v-if="showBtn && btnPlaceholder && !inputFocus && btnShowMode == 'focus'">{{ btnPlaceholder }}</span>
            <span @click="emit('btnClick')"
            v-if="showBtn && btnShowMode == 'focus'"
            :style="{ opacity: inputFocus ? '1' : '0', visibility: inputFocus ? '' : 'hidden' }"
            class="put_all">{{ btnText }}</span>
            <span @click="emit('btnClick')"
            v-else-if="showBtn"
            class="put_all">{{ btnText }}</span>
            
        </div>
    </div>
</div>
</template>

<script setup>
import { watch } from "vue"

const emit = defineEmits(['update:modelValue','percentTagClick','putAll','change','btnClick'])
const props = defineProps({
    modelValue:{
        type:[String,Number],
        default:''
    },
    background:String,
    title:String,
    custom:Boolean,
    btnPlaceholder:String,
    placeholder:String,
    percentTags:{
        type:Array,
        default(){
            return []
        }
    },
    disabled:Boolean,
    btnShowMode:{
        type:String,
        default:'always'
    },
    btnText:{
        type:String,
        default:"全部"
    },
    showBtn:Boolean,
    tip:String,
    inputType:{
        type:String,
        default:"text"
    }
})
const inputFocus = ref(false)
const inputVal = ref(props.value)

watch(()=>props.modelValue,()=>{
    if(props.modelValue == inputVal.value){
        return
    }
    inputVal.value = props.modelValue
})
const inputChange = ()=>{
    emit('update:modelValue',inputVal.value)
    emit('change',inputVal.value)
}
const percentTagClick = (percent)=>{
    emit('percentTagClick',percent)
}

</script>

<style lang="less" scoped>
.form-item-box {
    display: flex;
    align-items: stretch;

    .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        height: 0.92rem;
        border-radius: 0.32rem;
        border: 1px solid #d0d8e2;
        padding: 0 0.24rem;

        .ipt_tip {
            color: #b7b7b7;
            font-size: 0.24rem;
            position: absolute;
            left: 0.24rem;
            transition: all ease .3s;
        }

        .ipt {
            flex: 1;
            height: 100%;
            font-size: 0.28rem;
            padding: 0;
            position: relative;
            z-index: 1;
        }

    }

    .disabled_item {
        background-color: #D0D8E2;
    }

    .item_focus {
        height: 1.12rem;
        border: 1px solid #034cfa;

        .ipt_tip {
            font-size: 0.2rem;
            transform: translateY(-0.36rem);
        }
    }
    .item_focus2{
        border: 1px solid #034cfa;
    }

    .percent_tag{
        color: #2168F6;
        margin-left: 0.08rem;
        transition: all ease .3s;
        border-radius: 0.3rem;
        background: rgba(33, 104, 246, 0.10);
        font-size: 0.24rem;
        padding: 0 0.14rem;
        height: 0.4rem;
        line-height: 0.4rem;
    }
    .put_all{
        color: #014CFA;
        position: absolute;
        right: 0.32rem;
        font-size: 0.3rem;
        z-index:9;
        transition: all ease .3s
    }
    .put_all_place{
        color:#061023;
    }
}

.form-item-title {
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    color: #061023;
    font-weight: 400;
    line-height: 0.36rem;
    margin-top: 0.4rem;
    margin-bottom: 0.12rem;
    justify-content: space-between;
    &__right {
        text-align: right;
        font-size: 0.28rem;
        color:#666D80;
    }
}
</style>