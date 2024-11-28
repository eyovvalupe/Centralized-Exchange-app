<template>
    <div
        class="tab"
        :class="{ open_tab: switchs[i] == true }"
        @click="switchOpen(i, $event)"
      >
        <div class="tab_icon">
          <img :src="`/static/img/crypto/${item.name}.png`" class="rounded-full" alt="img" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="amount">{{ item.amount }}</div>
        <div class="more">
          <img src="/static/img/common/menu.png?20241022" alt="img" />
        </div>
        <div class="rights">
          <div class="right" @click="goTopUp(item.currency.toUpperCase())" v-if="item.type == 'crypto'">
            {{ $t("充值") }}
          </div>
          <div class="right right--disabled" v-else>
            {{ $t("充值") }}
          </div>
          <div
            class="right right--yellow"
            @click="goWithdraw(item.currency.toUpperCase())"
            v-if="item.type == 'crypto'">
            {{ $t("提现") }}
          </div>
          <div
            class="right right--yellow right--disabled" v-else>
            {{ $t("提现") }}
          </div>
        </div>
      </div>
</template>
<script setup>
import router from "@/router";
const props = defineProps({
    i:Number,
    item:{
        type:Object,
        default:()=>{}
    },
    switchs:{
        type:Array,
        default:()=>[]
    }
})
const emits = defineEmits(['switchOpen'])
// 展开状态
const switchOpen = (i, e) => {
  emits('switchOpen',i)
  e.stopPropagation();
};

// 跳转充值
const goTopUp = (name) => {
  router.push({
    name: "topUpCrypto",
    query: {
      currency: name,
    },
  });
};


// 跳转提现
const goWithdraw = (name) => {
  router.push({
    name: "withdraw",
    query: {
      currency: name,
    },
  });
};
</script>

<style lang="less" scoped>
.tab {
    padding: 0 0.32rem;
    overflow: hidden;
    height: 1.04rem;
    margin-top: 0.12rem;
    border-radius: 0.32rem;
    background: #f5f7fc;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
    font-size: 0.3rem;
    }
    &:active {
    background-color: rgba(237, 237, 237, 0.87);
    }

    .tab_icon {
    width: 0.52rem;
    height: 0.52rem;
    margin-right: 0.16rem;
    background-color: #fff;
    border-radius: 50%;
    box-sizing: border-box;
    padding: 0.1rem;
    }

    .more {
    width: 0.3rem;
    height: 0.3rem;
    }

    .amount {
    flex: 1;
    text-align: right;
    padding: 0 0.2rem;
    font-size: 0.32rem;
    font-weight: 600;
    transition: 0.3s;
    }

    .rights {
    display: flex;
    height: 100%;
    position: absolute;
    right: -100%;
    top: 0;
    transition: 0.3s;
    .right {
        height: 100%;
        width: 1.04rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 0.3rem;
        font-weight: 400;
        text-align: center;
        color: #fff;
        background-color: #014cfa;
    }
    .right--yellow {
        background-color: #ffaf2a;
    }
    .right--green {
        background-color: #00af70;
    }
    .right--red {
        background-color: #e8503a;
    }
    .right--disabled{
        background-color: #9cb9ff;
    }
    .right--disabled.right--yellow{
        background-color: #ebcc9a;
    }
    .right:first-child {
        border-radius: 0.32rem 0rem 0rem 0.32rem;
    }
    .right:last-child {
        border-radius: 0rem 0.32rem 0.32rem 0rem;
    }
    }
}

.open_tab {
    .name {
     display: none;
    }
    .amount {
        text-align: left;
        padding: 0px;
    }
    .rights {
        right: 0;
    }
}
</style>