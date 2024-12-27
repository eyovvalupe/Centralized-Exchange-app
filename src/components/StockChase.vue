<template>
  <div class="market_stock_chase">
    <div class="header_container flex flex-row justify-between items-center">
      <div class="text-[0.32rem] items-center font-semibold">
        <span>{{ t("market.market_stock_chase_movement") }}</span>
      </div>
      <div class="header_text flex items-center text-[0.28rem]">
        <div class="header_eff_text">
          <span>{{ t("market.market_stock_chase_earning_effect") }}</span>
        </div>
        <div class="header_noti_text">
          <span>{{ t("market.market_stock_chase_strong") }}</span>
        </div>
      </div>
    </div>
    <div class="graph_container">
      <div class="chase_container relative">
        <div class="chase_text flex text-center" style="width: 3.014rem !important;">
          <span class="text-color2 mr-[0.16rem]">{{
            t("market.market_stock_chase_movement_percentage")
          }}</span>
          <div class="flex">
            <span style="color: #18b762; margin-right: 0.05rem">356</span>
            <span style="margin-right: 0.05rem">:</span>
            <span style="color: #e8503a">117</span>
          </div>
        </div>
        <div class="chase_graph">
          <img src="static/img/market/chase.svg" alt="chase" />
        </div>
      </div>
      <div class="chase_status relative">
        <div class="chase_state_text flex text-center justify-betwen" style="width: 3.12rem !important;">
          <span
            class="text-color2 mr-[0.16rem] ovreflow-hidden"
            >{{ t("market.market_stock_chase_todays_effect") }}</span
          >
          <span style="color: #18b762">99.26%</span>
        </div>
        <div class="chase_graph">
          <img src="static/img/market/todcondis.svg" alt="condi" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<style lang="less" scoped>
.market_stock_chase {
  height: 5rem;
  box-shadow: 0 0.1rem 0.8rem 0 #014cfa33;
  border-radius: 0.64rem;
  position: relative;
  top: -1rem;
  padding-top: 1rem;
  padding-left: 0.32rem;
  padding-right: 0.32rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;

  .header_container {
    margin: 0.3rem 0;
    .header_text {
      min-width: 2.24rem;
      height: 0.5rem;
      border-radius: 0.25rem;
      border-width: 1px;
      border-color: #014cfa;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .header_eff_text {
        padding-left: 0.2rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #014cfa;
      }

      .header_noti_text {
        display: flex;
        flex-direction: row;
        min-width: 0.76rem;
        margin-left: 0.1rem;
        padding: 0 0.1rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background-color: #014cfa;
        align-items: center;
        justify-content: center;
        color: white;
      }
    }
  }

  .graph_container {
    height: 2.4rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.1rem;
    font-size: 0.28rem;
    line-height: 0.32rem;

    .chase_graph {
      /* background-color: red; */
      position: absolute;
      bottom: -0.3rem;
      width: 3.12rem;
      height: 2rem;
    }
  }
}
</style>
