<template>
    <div class="ipo_stock_detail">
        <Top title="IPO订单详情"></Top>
        <div class="scroller">
            
            <div class="status_box" v-if="currDetail.status == 'success'">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <rect width="60" height="60" rx="16" fill="#014CFA" fill-opacity="0.1"/>
                    <path d="M30.3335 11.333C41.3795 11.333 50.3335 20.287 50.3335 31.333C50.3335 42.379 41.3795 51.333 30.3335 51.333C19.2875 51.333 10.3335 42.379 10.3335 31.333C10.3335 20.287 19.2875 11.333 30.3335 11.333ZM28.3335 20.309C27.8031 20.309 27.2944 20.5197 26.9193 20.8948C26.5442 21.2699 26.3335 21.7786 26.3335 22.309V33.333L26.3475 33.567C26.4048 34.0535 26.6387 34.5021 27.0047 34.8276C27.3708 35.1531 27.8436 35.3329 28.3335 35.333H39.3935L39.6255 35.319C40.1124 35.2621 40.5614 35.0285 40.8873 34.6624C41.2132 34.2962 41.3934 33.8232 41.3935 33.333L41.3815 33.099C41.3241 32.6122 41.09 32.1633 40.7235 31.8378C40.357 31.5122 39.8837 31.3326 39.3935 31.333H30.3335V22.309C30.3335 21.205 29.3595 20.309 28.3335 20.309Z" fill="#014CFA"/>
                </svg>
                <div class="status_text" style="color:#18B762;">
                    恭喜你，已中签
                </div>
            </div>
             <div class="status_box" v-else-if="currDetail.status == 'failure'">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <rect width="60" height="60" rx="16" fill="#014CFA" fill-opacity="0.1"/>
                    <path d="M30.3335 11.333C41.3795 11.333 50.3335 20.287 50.3335 31.333C50.3335 42.379 41.3795 51.333 30.3335 51.333C19.2875 51.333 10.3335 42.379 10.3335 31.333C10.3335 20.287 19.2875 11.333 30.3335 11.333ZM28.3335 20.309C27.8031 20.309 27.2944 20.5197 26.9193 20.8948C26.5442 21.2699 26.3335 21.7786 26.3335 22.309V33.333L26.3475 33.567C26.4048 34.0535 26.6387 34.5021 27.0047 34.8276C27.3708 35.1531 27.8436 35.3329 28.3335 35.333H39.3935L39.6255 35.319C40.1124 35.2621 40.5614 35.0285 40.8873 34.6624C41.2132 34.2962 41.3934 33.8232 41.3935 33.333L41.3815 33.099C41.3241 32.6122 41.09 32.1633 40.7235 31.8378C40.357 31.5122 39.8837 31.3326 39.3935 31.333H30.3335V22.309C30.3335 21.205 29.3595 20.309 28.3335 20.309Z" fill="#014CFA"/>
                </svg>
                <div class="status_text" style="color:#666D80;">
                    很可惜，未中签
                </div>
            </div>
             <div class="status_box" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <rect width="60" height="60" rx="16" fill="#014CFA" fill-opacity="0.1"/>
                    <path d="M30.3335 11.333C41.3795 11.333 50.3335 20.287 50.3335 31.333C50.3335 42.379 41.3795 51.333 30.3335 51.333C19.2875 51.333 10.3335 42.379 10.3335 31.333C10.3335 20.287 19.2875 11.333 30.3335 11.333ZM28.3335 20.309C27.8031 20.309 27.2944 20.5197 26.9193 20.8948C26.5442 21.2699 26.3335 21.7786 26.3335 22.309V33.333L26.3475 33.567C26.4048 34.0535 26.6387 34.5021 27.0047 34.8276C27.3708 35.1531 27.8436 35.3329 28.3335 35.333H39.3935L39.6255 35.319C40.1124 35.2621 40.5614 35.0285 40.8873 34.6624C41.2132 34.2962 41.3934 33.8232 41.3935 33.333L41.3815 33.099C41.3241 32.6122 41.09 32.1633 40.7235 31.8378C40.357 31.5122 39.8837 31.3326 39.3935 31.333H30.3335V22.309C30.3335 21.205 29.3595 20.309 28.3335 20.309Z" fill="#014CFA"/>
                </svg>
                <div class="status_text">
                    已认购，等待中签中
                </div>
            </div>

            <div class="main_item">
                <div class="item_box">
                    <div class="name_box">
                        <div class="name">{{ currDetail.company_name }}</div>
                        <img  v-if="currDetail.lever > 1" src="/static/img/trade/level.png"/>
                    </div>
                    <div class="item_order_no">
                        <span>订单号 {{ currDetail.order_no || '--' }}</span>
                        <div class="item_copy_icon" @click="copy(currDetail.order_no)">
                            <img src="/static/img/trade/copy.png" alt="copy">
                        </div>
                    </div>
                    
                </div>

                <div class="info_boxs">
                
                    <div class="info_box">
                        <div>中签数量</div>
                        <div class="amount blue">
                           {{ currDetail.winning || '--' }}
                        </div>
                    </div>
                    <div class="info_box info_box--line">
                        <div>认购数量</div>
                        <div class="amount">
                           {{ currDetail.volume || '--' }}
                        </div>
                    </div>
                    <div class="split-line"></div>
                    <div class="info_box ">
                        <div>冻结金额</div>
                        <div class="amount blue">
                            {{ '--' }}
                        </div>
                    </div>
                    <div class="info_box info_box--line">
                        <div>认购金额</div>
                        <div class="amount">
                            {{ currDetail.issue_price || '--' }}
                        </div>
                    </div>
                </div>

            </div>

            <div class="detail_item_list">
                <div class="detail_item">
                    <div>利息</div>
                    <div class="val">{{ currDetail.fee || '--' }} <span>USDT</span></div>
                </div>
                <div class="detail_item">
                    <div>上市日期</div>
                    <div class="val">{{ currDetail.listing_date || '--' }}</div>
                </div>
                <div class="detail_item">
                    <div>上市价格</div>
                    <div class="val">{{ currDetail.listing_price || '--' }}</div>
                </div>
                
                <div class="detail_item">
                    <div>认购价格</div>
                    <div class="val">{{ currDetail.issue_price || '--' }}</div>
                </div>
                <div class="detail_item">
                    <div>认购杠杆</div>
                    <div class="val">{{ currDetail.lever ? currDetail.lever + 'X' : '--' }}</div>
                </div>
                <div class="detail_item">
                    <div>认购开始日期</div>
                    <div class="val">{{ currDetail.created || '--' }}</div>
                </div>
                <div class="detail_item">
                    <div>认购结束日期</div>
                    <div class="val">{{ '--' }}</div>
                </div>
                <div class="detail_item">
                    <div>订单时间</div>
                    <div class="val">{{ currDetail.created }}</div>
                </div>
                
                
                
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { _ipoGet } from "@/api/api";
import Top from "@/components/Top.vue"
import { Button } from 'vant'
import { useRoute } from "vue-router"
import { onBeforeUnmount } from 'vue'
import { _orderGet } from "@/api/api";
import { _copyTxt } from "@/utils/index"
import router from "@/router"
const route = useRoute()
const currDetail = ref({})
const statusMap = ref({
  lock: '锁定',
  success: '中签',
  failure: '未中签'
})
const openDetail = () => {
  _orderGet({
    order_no: route.query.order_no
  }).then(res => {
    if (res.data) {
      currDetail.value = {
        ...currDetail.value,
        ...res.data
      }
    }
  })
}
openDetail()

//  复制
const copy = text => {
    _copyTxt(text)
    showToast('已复制')
}

</script>

<style lang="less" scoped>
.ipo_stock_detail {
  padding-top: 1.12rem;
 

  .scroller{
    height: calc(100vh - 1.12rem);
    overflow-y: auto;
    box-sizing: border-box;
    padding:0.28rem 0.32rem 0.32rem 0.32rem;
  }
  
   .main_item {
        border-radius: 0.32rem;
        border: 1px solid #EFF3F8;
        background: #F5F7FC;
        margin-top:0.4rem;
        .name {
            color: #061023;
            font-size: 0.32rem;
            font-weight: 600;
            line-height: 0.36rem; 
            color: #0D0D12;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 0.36rem; 
            white-space: wrap;
            word-break: keep-all;
            margin-bottom: 0.14rem;
            max-width: 80%;
        }
        .name_box{
            display: flex;
            img{
                width: 0.34rem !important;
                height: 0.34rem !important;
                margin-left: 0.08rem;
            }
        }
        .item_box {
            padding: 0.26rem 0.32rem 0.16rem 0.32rem;
            position: relative;
        }

        .item_order_no{
            display: flex;
            align-items: center;
            color:#8F92A1;
            margin-top: 0.12rem;
            span{
                font-size: 0.28rem;
            }
        }

        .item_copy_icon {
            width: 0.24rem;
            height: 0.24rem;
            margin-left: 0.12rem;
            img{
                width: 100%;
                height: 100%;
            }
        }

    }

    .status_box{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .status_text{
        color: #014CFA;
        text-align: center;
        font-size: 0.3rem;
        font-style: normal;
        font-weight: 400;
        line-height: 0.44rem; 
        margin-top:0.24rem;
    }

    .split-line{
        clear: both;
        height: 0.62rem;
        position: relative;
        margin:0 0.42rem;
        &::after{
            content: '';
            width: 100%;
            position: absolute;
            left:0;
            top:50%;
            height: 1px;
            background-color: #EFF3F8;
        }
    }
    .info_boxs {
        padding: 0.3rem 0;
        position: relative;
        border: 1px solid #EFF3F8;
        border-bottom: 0px;
        border-radius: 0.32rem;
        background-color: #fff;
        width: calc(100% + 2px);
        left:-1px;
        z-index: 1;
        &::after{
            content: '';
            display: block;
            clear: both;
        }
        .info_box {
            width: 50%;
            float: left;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #8F92A1;
            font-size: 0.28rem;
            line-height: 0.44rem;
            position: relative;
            .amount {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 0.44rem;
                margin-top: 0.12rem;
                font-weight: 600;
                color: #061023;
                font-size: 0.36rem;
            }
            .blue{
                color:#014CFA;
            }
        }
        .info_box--line::after{
            content: '';
            width: 1px;
            height: 0.9rem;
            background-color: #EFF3F8;
            position: absolute;
            left:0;
            top:50%;
            margin-top:-0.45rem;
        }
    }

    .detail_item_list{
        padding: 0.08rem 0.32rem 0 0.32rem;
    }
    .detail_item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 0.44rem;
        padding: 0.32rem 0 0.2rem 0;
        border-bottom: 1px solid #F5F7FC;
        color: #8F92A1;
        font-size: 0.28rem;
        font-weight: 400;

        .name {
            color: #8F92A1;
            font-weight: 600;
            font-size: 0.28rem;
        }

        .val {
            color: #061023;
            font-size: 0.3rem;
        }
    }
    .detail_item:last-child{
        border-bottom: 0px;
    }
  
}
</style>