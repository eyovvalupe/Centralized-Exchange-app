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
          <span class="text-color3 mr-[0.16rem]">{{
            t("market.market_stock_chase_movement_percentage")
          }}</span>
          <div class="flex">
            <span class="text-success" style=" margin-right: 0.05rem">356</span>
            <span style="margin-right: 0.05rem">:</span>
            <span class="text-error">117</span>
          </div>
        </div>
        <div class="chase_graph">
          <img src="static/img/market/chase.svg" alt="chase" />
        </div>
      </div>
      <div class="chase_status relative">
        <div class="chase_state_text flex text-center justify-betwen" style="width: 3.12rem !important;">
          <span class="text-color3 mr-[0.16rem] ovreflow-hidden">{{ t("market.market_stock_chase_todays_effect")
            }}</span>
          <span class="text-success">99.26%</span>
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
  border-radius: 0.32rem;
  background: var(--ex-bg-color2);
  position: relative;
  padding-left: 0.32rem;
  padding-right: 0.32rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0.2rem;
  display: flex;
  flex-direction: column;

  .header_container {
    padding: 0.4rem 0;

    .header_text {
      min-width: 2.24rem;
      height: 0.5rem;
      border-radius: 0.25rem;
      border-width: 1px;
      border-color: var(--ex-primary-color);
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
        color: var(--ex-primary-color);
      }

      .header_noti_text {
        display: flex;
        flex-direction: row;
        min-width: 0.76rem;
        margin-left: 0.1rem;
        padding: 0 0.1rem;
        height: 0.5rem;
        border-radius: 0.25rem;
        background-color: var(--ex-primary-color);
        align-items: center;
        justify-content: center;
        color: var(--ex-text-color--bg-primary);
      }
    }
  }

  .graph_container {
    height: 2.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 0.1rem;
    font-size: 0.28rem;
    line-height: 0.32rem;

    .chase_graph {
      position: absolute;
      width: 3.12rem;
      height: 2rem;
    }
  }
}
</style>
