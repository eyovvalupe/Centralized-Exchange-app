<template>
  <div
    class="right_menu"
    :class="status ? 'fade_in_action' : 'fade_out_action'"
    :style="{ visibility: rendered ? 'visible' : '' }"
    @click.self="close"
  >
    <div class="main">
      <div class="w-full h-full overflow-auto">
        <div class="flex flex-col" v-for="(item, i) in itemMap">
          <div
            class="item"
            :style="{
              backgroundColor:
                activeItem == item.name ? 'var(--ex-bg-white2)' : '',
            }"
            @click="goNext(item.name)"
          >
            <div class="item_h">
              <div class="img_container">
                <img
                  class="img"
                  :class="{ '!opacity-[1]': activeItem != item.name }"
                  v-lazy="getStaticImgUrl(`static/img/menu/${item.name}.svg`)"
                />
                <img
                  class="img"
                  :class="{ '!opacity-[1]': activeItem == item.name }"
                  v-lazy="
                    getStaticImgUrl(`static/img/menu/${item.name}_white.svg`)
                  "
                />
              </div>
              <div class="item_text">
                {{
                  item.name == 'one_click'
                    ? t('assets.order_one_click')
                    : item.name == 'market'
                    ? t('home.market')
                    : item.name == 'trade'
                    ? t('home.trade')
                    : item.name == 'finance'
                    ? t('home.finance')
                    : item.name == 'assets'
                    ? t('assets.assets_center')
                    : item.name == 'order'
                    ? t('assets.header_order')
                    : item.name == 'user'
                    ? t('common.user')
                    : item.name == 'referral'
                    ? t('inviteFriends.invite')
                    : item.name == 'support'
                    ? t('user_page.support')
                    : item.name == 'lang'
                    ? !isEmpty(language)
                      ? language.name
                      : defaultLang.name
                    : ''
                }}
              </div>
            </div>
            <div class="size-[0.28rem]" v-if="!isEmpty(item.sub)">
              <img
                v-if="
                  (activeItem == item.name && !double) ||
                  item.sub.includes(activeSub)
                "
                v-lazy="getStaticImgUrl('static/img/menu/up.svg')"
                alt=""
              />
              <img
                v-else
                v-lazy="getStaticImgUrl('static/img/menu/down.svg')"
                alt=""
              />
            </div>
          </div>
          <div
            v-if="!isEmpty(item.sub)"
            class="w-full transition flex flex-col overflow-hidden"
            :style="{
              height:
                (activeItem == item.name && !double) ||
                item.sub.includes(activeSub)
                  ? 0.92 * item.sub.length + 'rem'
                  : '0px',
            }"
          >
            <div
              v-if="
                (activeItem == item.name && !double) ||
                item.sub.includes(activeSub)
              "
              v-for="(subItem, i) in item.sub"
              class="item !pl-[0.96rem] text-[0.32rem] mask-btn"
              :style="{color: subItem == activeSub ? 'var(--ex-primary-color) !important' : ''}"
              @click="goSub(subItem)"
            >
              {{
                subItem == 'optional'
                  ? t('home.optional')
                  : subItem == 'stock'
                  ? t('assets.over_view_stock')
                  : subItem == 'spot'
                  ? t('common.spot')
                  : subItem == 'futures'
                  ? t('common.futures')
                  : subItem == 'ai'
                  ? t('common.option')
                  : subItem == 'forex'
                  ? t('assets.over_view_forex')
                  : subItem == 'commodities'
                  ? t('assets.over_view_trade')
                  : subItem == 'stockTrade'
                  ? t('股票交易')
                  : subItem == 'spotTrade'
                  ? t('币币交易')
                  : subItem == 'futuresTrade'
                  ? t('加密货币合约交易')
                  : subItem == 'aiTrade'
                  ? t('交易机器人交易')
                  : subItem == 'forexTrade'
                  ? t('外汇交易')
                  : subItem == 'commoditiesTrade'
                  ? t('大宗商品交易')
                  : subItem == 'copy'
                  ? t('跟单')
                  : subItem == 'borrow'
                  ? t('DeFi借币')
                  : subItem == 'stake'
                  ? t('质押挖矿')
                  : subItem == 'ipo'
                  ? t('IPO')
                  : subItem == 'assets'
                  ? t('我的资产')
                  : subItem == 'deposit'
                  ? t('充值')
                  : subItem == 'withdraw'
                  ? t('提现')
                  : subItem == 'transfer'
                  ? t('划转')
                  : subItem == 'record'
                  ? t('资金记录')
                  : subItem == 'user'
                  ? t('用户')
                  : subItem == 'account'
                  ? t('收款账户')
                  : subItem == 'kyc'
                  ? t('身份认证')
                  : subItem == 'google'
                  ? t('谷歌认证')
                  : subItem == 'safety'
                  ? t('安全设置')
                  : ''
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, onMounted, watch } from 'vue';
  import store from '@/store';
  import { getStaticImgUrl } from '@/utils/index.js';
  import { isEmpty } from '../utils/isEmpty';
  import { useI18n } from 'vue-i18n';
  import { _langMap } from '@/utils/dataMap';

  const { t, locale } = useI18n();

  const itemMap = [
    { name: 'one_click' },
    {
      name: 'market',
      sub: [
        'optional',
        'stock',
        'spot',
        'futures',
        'ai',
        'forex',
        'commodities',
      ],
    },
    {
      name: 'trade',
      sub: [
        'stockTrade',
        'spotTrade',
        'futuresTrade',
        'aiTrade',
        'forexTrade',
        'commoditiesTrade',
      ],
    },
    { name: 'finance', sub: ['copy', 'borrow', 'stake', 'ipo'] },
    {
      name: 'assets',
      sub: ['assets', 'deposit', 'withdraw', 'transfer', 'record'],
    },
    { name: 'order' },
    { name: 'user', sub: ['user', 'account', 'kyc', 'google', 'safety'] },
    { name: 'referral' },
    { name: 'lang' },
    { name: 'support' },
  ];

  const rendered = ref(false);
  const status = computed(() => store.state.showRightMenu);
  const language = computed(() => store.state.language || {});

  const defaultLang = _langMap.reduce((acc, cur) => {
    if (cur.val == locale.value) acc = cur;
    return acc;
  }, {});
  const activeItem = ref('');
  const activeSub = ref('');
  const double = ref(false);

  const goNext = (val) => {
    activeSub.value = '';
    if (activeItem.value != val) {
      activeItem.value = val;
      double.value = false;
      return;
    }
    if (activeItem.value == val) {
      if (!double.value) {
        double.value = true;
        return;
      }
      if (double.value) double.value = false;
    }
  };

  const goSub = (val) => {
    activeSub.value = val;
  };

  const close = () => {
    store.commit('setShowRightMenu', false);
    activeItem.value = '';
    activeSub.value = '';
    double.value = false;
  };

  onMounted(() => {
    setTimeout(() => {
      rendered.value = true;
    }, 500);
  });
</script>
<style lang="less">
  .right_menu {
    position: absolute;
    z-index: 2000;
    width: 7.5rem;
    bottom: 0;
    right: 0;
    height: 100vh;
    visibility: hidden;
    display: flex;
    align-items: end;
    justify-content: end;

    .main {
      border-top-left-radius: 0.32rem;
      border-bottom-left-radius: 0.32rem;
      background-color: var(--ex-bg-color9);
      width: 6.8rem;
      height: calc(100vh - 50px);
      padding: 0.26rem 0;
      display: flex;
      flex-direction: column;

      .item {
        width: 100%;
        height: 0.92rem;
        display: flex;
        padding: 0 0.4rem 0 0.32rem;
        justify-content: space-between;
        align-items: center;
        color: var(--ex-white);

        .item_h {
          height: 0.92rem;
          display: flex;
          gap: 0.16rem;
          align-items: center;

          .img_container {
            width: 0.48rem;
            height: 0.48rem;
            position: relative;

            .img {
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
            }
          }

          .item_text {
            font-size: 0.32rem;
            color: var(--ex-white);
          }
        }
      }
    }
  }
  .fade_in_action {
    animation-name: fade_in_animation;
    animation-timing-function: ease-in;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
  }

  .fade_out_action {
    animation-name: fade_out_animation;
    animation-timing-function: ease-out;
    animation-duration: 0.2s;
    animation-fill-mode: forwards;
  }
  @keyframes fade_in_animation {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes fade_out_animation {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
