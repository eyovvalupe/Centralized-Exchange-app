<template>
  <div
    class=""
    :class="[
      from == 'order' ? '' : 'pt-[0.32rem] px-[0.32rem]',
    ]"
  >
    <div
      class="my-total"
      :class="[props.from == 'trade' ? 'bg-white2' : 'bg-color3']"
      v-if="!isEmpty(myCopyData)"
    >
      <div class="info-flex">
        <div class="info-item">
          <div class="name">
            {{ $t('copy.copy_order_total_profit')
            }}<span class="text-[0.24rem]">(USDT)</span>
          </div>
          <div
            class="val"
            :class="[myCopyData.returnamount >= 0 ? 'up' : 'down']"
          >
            {{ myCopyData.returnamount }}
          </div>
        </div>
        <div class="info-item" style="text-align: right">
          <div class="name">
            {{ $t('copy.copy_order_total_amount')
            }}<span class="text-[0.24rem]">(USDT)</span>
          </div>
          <div class="val" @click="plus">
            <span>{{ myCopyData.amount }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pb-[0.32rem]" v-if="!isEmpty(myFollowList)">
      <Tabs
        :type="from == 'order' ? 'sub-order' : 'sub-stake'"
        v-model="typeChange"
        :swipeable="false"
        :color="'var(--ex-primary-color)'"
        shrink
      >
        <Tab :title="$t('common.option')"> </Tab>
        <!-- <Tab
                :title="$t('common.crypto')"
            >
            </Tab> -->
      </Tabs>
    </div>
    <div :class="from == 'order' ? 'h-[9rem] overflow-auto pb-[0.4rem]' : ''">
      <div class="list-i" v-if="myFollowList.length">
        <MyFollowItem
          :from="from"
          @openInfo="openInfo"
          :item="item"
          v-for="(item, i) in myFollowList"
          :key="i"
          :showDetail="false"
        />
      </div>
      <div class="" v-if="!token">
        <UnLogin />
      </div>
      <NoData v-else-if="!myFollowList.length" />
    </div>

    <!-- 详情 -->
    <Popup
      teleport="body"
      v-model:show="showInfo"
      position="right"
      :style="{ height: '100%', width: '100%' }"
    >
      <FollowInfo
        v-if="showInfo"
        @back="showInfo = false"
        style="width: 100%; height: 100%"
      />
    </Popup>
  </div>
</template>
<script setup>
  import store from '@/store';
  import { isEmpty } from '@/utils/isEmpty';
  import MyFollowItem from './MyFollowItem.vue';
  import { computed, ref } from 'vue';
  import { Popup, Tabs, Tab } from 'vant';
  import NoData from '@/components/NoData.vue';
  import FollowInfo from '../Follow/FollowInfo.vue';
  import UnLogin from '@/components/UnLogin.vue';
  const props = defineProps({
    from: {
      type: String,
      default: '',
    },
  });
  const token = computed(() => store.state.token);
  const myFollowList = computed(() => store.state.myCopy);
  const myCopyData = computed(() => store.state.myCopyData);
  const typeChange = ref(0);
  const showInfo = ref(false);
  // 跟单详情
  const openInfo = () => {
    showInfo.value = true;
  };

  const init = () => {
    if (!token.value) {
      return;
    }
    store.dispatch('updateMyFollowList');
    store.dispatch('updateMyCopyData');
  };

  onMounted(() => {
    if (token.value) init();
  });

  watch(token, (val) => {
    if (val) init();
  });

  defineExpose({
    init,
  });
</script>
<style lang="less" scoped>
  .list-i {
    margin-bottom: 0.24rem;
  }

  .my-total {
    border-radius: 0.32rem;
    padding: 0.12rem;
    margin-bottom: 0.2rem;

    .info-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.16rem 0;

      .info-item {
        text-align: left;
        padding: 0 0.16rem;

        .name {
          color: var(--ex-placeholder-color);
          font-size: 0.3rem;
          margin-bottom: 0.24rem;
        }

        .val {
          color: var(--ex-white);
          font-weight: bold;
          font-size: 0.36rem;
        }
      }
    }

    .info-box {
      width: 100%;
      border-radius: 0.32rem;
      background-color: var(--ex-bg-white2);
      padding: 0.28rem;

      .info-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 0.52rem;

        .name {
          color: var(--ex-placeholder-color);
        }

        .val {
          display: flex;
          align-items: center;

          .plus {
            width: 0.4rem;
            height: 0.4rem;
            margin-left: 0.12rem;
          }
        }
      }
    }
  }
</style>
