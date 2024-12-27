<!-- 外汇 -->
<template>
    <div class="page_foreign">

        <div class="list">
            <div class="item" v-for="i in 20" :key="i">

                <div class="left" style="color:var(--ex-text-color)">
                    <div><span>-94</span> <span class="down">-0.15%</span></div>
                    <div class="name">AUDCHF</div>
                    <div><span>09</span> <span>44:57</span></div>
                </div>
                <div class="right">
                    <div class="amount">
                        <span>0.98</span>
                        <span class="big">63</span>
                        <span class="sm">7</span>
                    </div>
                    <div>LOW: 0.99347</div>
                </div>
                <div class="right">
                    <div class="amount">
                        <span>0.98</span>
                        <span class="big">63</span>
                        <span class="sm">7</span>
                    </div>
                    <div>LOW: 0.99347</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.page_foreign {
    padding: 0.3rem 0.3rem 2rem 0.3rem;


    .list {
        padding: 0 0.32rem;
        font-size: 0.22rem;
        line-height: 1;
        color: var(--ex-text-color3);

        .item {
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--ex-border-color);
            height: 1.32rem;

            .left {
                flex: 1;
                text-align: left;

                .name {
                    font-size: 0.32rem;
                    font-weight: bold;
                    color: var(--ex-text-color);
                    margin: 0.08rem 0;
                }
            }

            .right {
                flex: 1;
                text-align: right;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                justify-content: flex-end;
                font-size: 0.24rem;
                line-height: 0.3rem;

                .amount {
                    color: var(--ex-primary-color);
                    vertical-align: baseline;

                    .big {
                        font-size: 0.32rem;
                        margin: 0 0 0 0.04rem;
                    }

                    .sm {
                        position: relative;
                        top: -0.12rem;
                    }
                }
            }

        }
    }
}
</style>