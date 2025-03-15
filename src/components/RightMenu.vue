<template>
  <div
    class="right_menu"
    :style="{ visibility: rendered ? 'visible' : '' }"
    :class="status ? 'fade_inner_action' : 'fade_outer_action'"
    @click.self="close"
  >
    <div class="blur_container">
      <div class="main"
      :class="status ? 'fade_in_action' : 'fade_out_action'"
      >
        <div class="w-full h-full overflow-auto">
          <div class="flex flex-col" v-for="(item, i) in itemMap">
            <div
              class="item"
              :style="{
                backgroundColor:
                  activeItem == item.name ? 'var(--ex-bg-white2)' : '',
              }"
              @click="goNext(item)"
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
                :style="{
                  color:
                    subItem == activeSub
                      ? 'var(--ex-primary-color) !important'
                      : '',
                }"
                @click="goSub(subItem, item.jump[subItem])"
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
  </div>
</template>
<script setup>
  import { computed, onMounted, watch } from 'vue';
  import store from '@/store';
  import { getStaticImgUrl } from '@/utils/index.js';
  import { isEmpty } from '../utils/isEmpty';
  import { useI18n } from 'vue-i18n';
  import { _langMap } from '@/utils/dataMap';
  import router from '@/router';

  const { t, locale } = useI18n();

  const itemMap = [
    { name: 'one_click', jump: ['trade', false, { marketType: 'one_click' }] },
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
      jump: {
        optional: ['trade', true, { marketType: 'optional' }],
        stock: ['trade', false, { marketType: 'stock' }],
        spot: ['trade', false, { marketType: 'spot' }],
        futures: ['trade', false, { marketType: 'futures' }],
        ai: ['trade', false, { marketType: 'ai' }],
        forex: ['trade', false, { marketType: 'forex' }],
        commodities: ['trade', false, { marketType: 'commodities' }],
      },
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
      jump: {
        stockTrade: ['tradeInfo', false, { tradeType: 'stock' }],
        spotTrade: ['tradeInfo', false, { tradeType: 'spot' }],
        futuresTrade: ['tradeInfo', false, { tradeType: 'crypto' }],
        aiTrade: ['tradeInfo', false, { tradeType: 'ai' }],
        forexTrade: ['tradeInfo', false, { tradeType: 'forex' }],
        commoditiesTrade: ['tradeInfo', false, { tradeType: 'commodities' }],
      },
    },
    {
      name: 'finance',
      sub: ['copy', 'borrow', 'stake', 'ipo'],
      jump: {
        copy: ['tradeInfo', false, { tradeType: 'copy' }],
        borrow: ['tradeInfo', false, { tradeType: 'borrow' }],
        stake: ['tradeInfo', false, { tradeType: 'stake' }],
        ipo: ['tradeInfo', false, { tradeType: 'ipo' }],
      },
    },
    {
      name: 'assets',
      sub: ['assets', 'deposit', 'withdraw', 'transfer', 'record'],
    },
    { name: 'order', jump: ['assets', true, { activeType: 'order' }] },
    {
      name: 'user',
      sub: ['user', 'account', 'kyc', 'google', 'safety'],
      jump: {
        user: ['user', true],
        account: ['account', true],
        kyc: ['kyc', true],
        google: ['google', true],
        safety: ['safety', true],
      },
    },
    { name: 'referral', jump: ['inviteFriends', true] },
    { name: 'lang', jump: ['language', false] },
    { name: 'support', jump: ['chat', false] },
  ];

  const rendered = ref(false);
  const status = computed(() => store.state.showRightMenu);
  const language = computed(() => store.state.language || {});
  const token = computed(() => store.state.token);

  const defaultLang = _langMap.reduce((acc, cur) => {
    if (cur.val == locale.value) acc = cur;
    return acc;
  }, {});
  const activeItem = ref('');
  const activeSub = ref('');
  const double = ref(false);

  const goNext = (item) => {
    activeSub.value = '';
    if (activeItem.value != item.name) {
      activeItem.value = item.name;
      double.value = false;
      if (isEmpty(item.sub)) jump(item.jump[0], item.jump[1], item.jump[2]);
      return;
    }
    if (activeItem.value == item.name) {
      if (!double.value) {
        double.value = true;
        return;
      }
      if (double.value) double.value = false;
    }
  };

  const goSub = (val, jumpItem) => {
    activeSub.value = val;
    jump(jumpItem[0], jumpItem[1], jumpItem[2]);
  };

  const close = () => {
    store.commit('setShowRightMenu', false);
    activeItem.value = '';
    activeSub.value = '';
    double.value = false;
  };

  const jump = (name, needToken, query) => {
    setTimeout(() => {
      close();
      if (needToken && !token.value) {
        goLogin();
        return;
      }

      if (name == 'assets' && query.activeType == 'order') {
        sessionStorage.setItem('assetsType', 1);
      }

      if (
        query &&
        ['spot', 'constract', 'ai', 'stock', 'forex', 'blocktrade'].includes(
          query.tradeType,
        )
      ) {
        let e;
        switch (query.tradeType) {
          case 'spot':
            e = 1;
            break;
          case 'futures':
            e = 2;
            break;
          case 'ai':
            e = 3;
            break;
          case 'stock':
            e = 4;
            break;
          case 'forex':
            e = 5;
            break;
          case 'commodities':
            e = 6;
            break;
          default:
            e = 4;
            break;
        }
        sessionStorage.setItem('tradeinfo-tab', e);
      }

      if (
        query &&
        [
          'one_click',
          'optional',
          'stock',
          'spot',
          'futures',
          'ai',
          'forex',
          'commodities',
        ].includes(query.marketType)
      ) {
        let e;
        switch (query.marketType) {
          case 'one_click':
            e = 5;
            break;
          case 'optional':
            e = 0;
            break;
          case 'stock':
            e = 6;
            break;
          case 'spot':
            e = 1;
            break;
          case 'futures':
            e = 2;
            break;
          case 'forex':
            e = 7;
            break;
          case 'commodities':
            e = 8;
            break;
          default:
            e = 0;
            break;
        }
        sessionStorage.setItem('rec_tab_trade', e);
      }

      router.push({
        name,
        query,
      });
    }, 200);
  };

  const goLogin = () => {
    close();
    setTimeout(() => {
      store.commit('setIsLoginOpen', true);
    }, 0);
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
    top: 0;
    margin: 0 auto;
    height: 100vh;
    visibility: hidden;
    display: flex;
    align-items: end;

    .blur_container {
      width: 100%;
      height: calc(100vh - 0.88rem);
      display: flex;
      justify-content: end;
      background-color: #00000099;

      .main {
        border-top-left-radius: 0.32rem;
        border-bottom-left-radius: 0.32rem;
        background-color: var(--ex-bg-color9);
        width: 6.8rem;
        height: 100%;
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
      width: 0;
    }

    1% {
      transform: translateX(99%);
      width: 6.8rem;
    }

    100% {
      transform: translateX(0);
      width: 6.8rem;
    }
  }

  @keyframes fade_out_animation {
    0% {
      transform: translateX(0);
      width: 6.8rem;
    }

    99% {
      transform: translateX(99%);
      width: 6.8rem;
    }

    100% {
      transform: translateX(100%);
      width: 0;
    }
  }

  .fade_inner_action {
  animation-name: fade_inner;
  animation-timing-function: ease-out;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

.fade_outer_action {
  animation-name: fade_outer;
  animation-timing-function: ease-out;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

@keyframes fade_inner {
  0% {
    z-index: -1;
    opacity: 0;
  }

  1% {
    z-index: 2000;
    opacity: 0;
  }

  50% {
    z-index: 2000;
    opacity: 1;
  }

  100% {
    z-index: 2000;
    opacity: 1;
  }
}

@keyframes fade_outer {
  0% {
    z-index: 2000;
    opacity: 1;
  }

  50% {
    z-index: 2000;
    opacity: 1;
  }

  99% {
    z-index: 2000;
    opacity: 0;
  }

  100% {
    z-index: -1;
    opacity: 0;
  }
}
</style>
