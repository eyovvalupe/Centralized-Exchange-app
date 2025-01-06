<template>
  <Popup position="left" style="height: 100%" v-model:show="visible">
    <div class="left-menu">
      <div class="left-logo">
        <div class="left-logo__img">
          <img
            src="https://hkvaxt.com/uploads/158f40d3dbdc4b18a623218f19133536.png"
          />
        </div>
      </div>
      <div class="user-info">
        <div class="top-con">
            <div class="user-avatar">
                <img
                    src="data:image/png;base64,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"
                    alt=""
                />
            </div>
            <div class="right">
                <div class="top">
                    <span>tuyi****.com</span>
                </div>
                <div class="bottom">
                    <span>UID:15003973</span>
                    <div class="svg-container icon-copy">
                        <img src="/static/img/common/copy.svg" />
                    </div>
                </div>
            </div>
            <div class="score level1">
                <div class="num-wrap"><span class="num">100</span></div>
            </div>
        </div>
        <div class="user-certified">
          <span class="certified-status green">Certified</span>
        </div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { ref } from "vue";
import { Popup } from "vant";
const visible = ref(true);
</script>

<style lang="less" scoped>
.left-logo {
  height: 24vw;
  display: flex;
  align-items: center;
  justify-content: center;
  &__img {
    height: 7.46667vw;
    line-height: 7.46667vw;
    width: auto;
    margin-right: auto;
  }
}
.left-menu {
  width: 80vw;
  height: 100%;
  background-color: var(--ex-bg-color);
  box-sizing: border-box;
  padding: 0 6.66667vw 0 8vw;
}

.user-info .top-con {
    display: flex;
    flex-wrap: initial;
    flex-direction: initial;
    align-items: initial;
    justify-content: initial;

    .user-avatar {
        flex: none;
        width: 10.13333vw;
        height: 10.13333vw;
        margin-right: 2.93333vw;
        border-radius: 50%;
    }

    .top,
    .bottom {
        display: flex;
        flex-wrap: initial;
        flex-direction: initial;
        align-items: center;
        justify-content: initial;
        height: 5.33333vw;
    }

    .top span,
    .bottom span {
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        height: 5.33333vw;
        line-height: 5.33333vw;
    }

    .right {
        flex: 1;
    }

    .top span:nth-of-type(1) {
        max-width: 32vw;
        margin-right: 1.06667vw;
    }

    .top .vip {
        width: 8.53333vw;
        height: 4.8vw;
        line-height: 4.8vw;
        background: linear-gradient(270deg, #fcdf7b 0%, #f9cd4e 100%);
        border-radius: 1.33333vw 1.33333vw 1.33333vw 0px;
        font-weight: 700;
        color: #a07400;
        display: flex;
        flex-wrap: initial;
        flex-direction: initial;
        align-items: center;
        justify-content: center;
    }

    .top .vip i {
        font-size: 3.2vw;
        transform: scale(0.7);
    }

    .top .vip.vip5,
    .top .vip.vip6,
    .top .vip.vip7,
    .top .vip.vip8 {
        width: 11.73333vw;
        height: 4.8vw;
        line-height: 4.8vw;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAASCAYAAAAg9DzcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ8SURBVHgB7VZLbxxFEP5qdryz3t2YWdshEg9piQTBPA4ggSIOKBYnTiQHbqAkJ+78gkgIcYMbHGNL3OEfxIIjQljKASUHszFWgsDxPmyz69mZLqr6MTuJSW5RDklLtT3dXdv91ddf1QzwtD3aRvdP8Pi77oPdG2IT6RoDossDPIZWAmb+pgv+4DdgJwWafnLPAUQsngvSz+ukPC8Cd78H/3WdTV6QGLgooL0aipxNYfSZWOcKu87l2M7l4ldwkRs7F/5/fy/A9MSNusGl01/iVmRxjb/qIvvnGngrBd0WQDfEekAkIKOPxc7KuC920xmLz0IdWHyeZEN2u2qvDLA+ERsmdxjbGFEdi5H1BDnGwt/dVrB7cMmpOJ3LCGtw1On6zlUUpgtsAfWh7i62JPaRd3lR7Dmxn8Wm4i/s5HugVBgfiUxGh6QHCEh7cHkYB/M/ClAWDbMEZBw+2wd/28jGE3hQyHqpEboWMPc/OY/p8JxVh9kWwAcy3RL7TOyEWOEjfU9MmMWGTI0FtwTGhaijSTzat2Acc4EovseMsm6fLasKh0qkDpwF6mIzHLaiUrK4ZQEPrv+OejtCstxCrSVgW6rVT8VqYnc92+RNQUtQ01+A7ABHf4+Q7WVI6m1Hj+FSChSYPmYoe+frh4Yr6lJSPbt6Ltm5NQu48/6vP25/e3JdDrjYWErQefdD1JIfVHOOKpPb+0AUOylQjIOtPzG6sQ0+mqDzxgpKZsBBkUGVNEPHnizDM9noj/EX4+Xg9yAOOzJZ9DW92kqV2Pk6XRNwF5M0xvIrTc10B9qIJGqSYFFkvSd7Y+zezCSGCIvvvM615jyxVgStBD67y4rg+mPVwlcAX12komil8L2rMt7XRazxbLz6Ba8qzigAfuHzwSWu1TYmooqjiQCck4RKBPi8SKQhFgvDcw30b8suSYzFt1cQn2hTmV2V7LbS8H0pBacRd+V+fUa+7Ym8Hvy4FLnMrAecJWBtedq5QK1ks38nA88FsC0HeP4Z/LsfoYjrSN88g/pyJ2SDExsCIFRi4HLZVINQfTAHaRCCOAxClXO1gcgmaJDDMcAvXe4NpvHRqoDa3D9MLEgLtpGgqLUxHDI6Z06j+eySBeLoA81YBaGabA6IT0J/CLnyZuw8Qo2GLxNcqdXkcg0/rVxB738BO9CDwbSZrh4Mx708EnZb8lZrpBj2J2idWrZgQ1L4K/f3PiO8rLtlpoUMYoeD2ded8ILg2eX7EuFHSvHVKr5jgC3oC5sDSavV4e5+D/WmyKAjlaONhVMnuXLV5Oore7Y0AGPfDNUSd09pK6Hb9ZJ9V+L07ehY1z3JSeKPufpMDpYoPKTduXa2u/Tya+enw920GcsJuqGI0eQ5cslo5Pq9oNXEZ7j2mcxrL+D1ubLufQ3yLPf76HrGbk73ywWs+MlY3gL9wwjrb13BY/nIenLbf34QhvJlYLbtAAAAAElFTkSuQmCC);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-weight: 600;
        color: #fff;
        text-align: right;
        justify-content: flex-end;
        padding-right: 0.8vw;
    }

    .top .vip.vip9,
    .top .vip.vip10,
    .top .vip.vip11,
    .top .vip.vip12 {
        width: 13.6vw;
        height: 6.93333vw;
        line-height: 6.93333vw;
        background-image: url(data:image/png;base64,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);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        text-align: right;
        font-weight: 600;
        justify-content: flex-end;
    }

    .top .vip.vip9 i {
        transform: translateY(0.8vw) scale(0.7);
    }

    .top .vip.vip10 i,
    .top .vip.vip11 i,
    .top .vip.vip12 i {
        transform: translate(0.53333vw, 0.8vw) scale(0.7);
    }

    .top .vip-img {
        width: 5.33333vw;
        height: 5.33333vw;
    }

    .bottom span {
        max-width: 32vw;
        margin-right: 2.13333vw;
    }

    .bottom .icon-copy {
        height: 4.26667vw;
        width: 4.26667vw;
        transform: translateY(-1px);
    }

    .score {
        width: 10.13333vw;
        height: 10.13333vw;
        font-size: 3.73333vw;
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-wrap: initial;
        flex-direction: initial;
        align-items: center;
        justify-content: center;
    }

    .score .num-wrap {
        width: 8vw;
        height: 8vw;
        background-repeat: no-repeat;
        background-size: cover;
        display: flex;
        flex-wrap: initial;
        flex-direction: initial;
        align-items: center;
        justify-content: center;
    }
}
.user-info .user-certified {
    margin-top: 4.8vw;
    font-size: 2.66667vw;
    min-height: 8vw;
    .certified-status{
        margin-left: 12.8vw;
        min-width: 14.93333vw;
        height: 6.4vw;
        line-height: 6.4vw;
        display: inline-block;
        padding: 0 1.6vw;
        border-radius: 1.6vw;
        font-size: 3.2vw;
        text-align: center;
        color: #4ceba1;
        background: linear-gradient(180deg, #2FAA70 0%, #12653E 100%);
    }
}
</style>
