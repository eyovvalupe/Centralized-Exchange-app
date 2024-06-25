<!-- 个人中心 -->
<template>
    <div class="page page_user">

        <div class="user-header">
            <div style="margin-right: 0.4rem;margin-top: 0.04rem;">
                <Icon name="comment-o" />
            </div>
            <div>
                <Icon name="point-gift-o" />
            </div>
        </div>

        <div class="user-banner">
            <img src="/static/img/user/bg.png" alt="banner">
            <span class="banner-title">开始免费试用</span>
        </div>

        <div class="user-login" v-if="token">
            <div>
                <img src="/static/img/user/user.svg" alt="">
                <span>{{ userInfo.username || '--' }}</span>
            </div>
           
            <Icon name="arrow" class="arrow-right"/>
        </div>

        <div class="user-login" v-else @click="jump('login')">
            <div>
                <img src="/static/img/user/user.svg" alt="">
                <span>登录</span>
            </div>
           
            <Icon name="arrow" class="arrow-right"/>
        </div>

        <div class="user-comman">
            <div class="user-b-box" style="margin-right: 0.2rem;">
                <div class="user-flex">
                    <img src="/static/img/user/user.svg" alt="">
                    <Icon name="arrow" class="arrow-right"/>
                </div>
                <div class="user-sub">订阅</div>
                <div class="user-small-title">
                    充分发挥 TradingView 的强大功能
                </div>
            </div>

            <div class="user-b-box">
                <div class="user-flex">
                    <img src="/static/img/user/user.svg" alt="">
                    <Icon name="arrow" class="arrow-right"/>
                </div>
                <div class="user-sub">推荐朋友</div>
                <div class="user-small-title">
                    分享你的所爱
                </div>
            </div>
        </div>


        <div class="user-h-box">
            <div class="user-flex">
                <img src="/static/img/user/user.svg" alt="">
                <Icon name="arrow" class="arrow-right"/>
            </div>
            <div class="user-sub">新闻</div>
            <div class="user-small-title">
                随时了解市场动态
            </div>
        </div>


        <div class="user-comman">
            <div class="user-b-box" style="margin-right: 0.2rem;">
                <div class="user-flex">
                    <img src="/static/img/user/user.svg" alt="">
                    <Icon name="arrow" class="arrow-right"/>
                </div>
                <div class="user-sub">经纪商</div>
                <div class="user-small-title">
                    使用热门经纪商交易
                </div>
            </div>

            <div class="user-b-box">
                <div class="user-flex">
                    <img src="/static/img/user/user.svg" alt="">
                    <Icon name="arrow" class="arrow-right"/>
                </div>
                <div class="user-sub">日历</div>
                <div class="user-small-title">
                    塑造市场的事件
                </div>
            </div>
        </div>


        <div class="user-bottom">
            <div class="user-flex">
                <div class="user-item">
                    <img src="/static/img/user/user.svg" alt="">
                    <span>主题</span>
                </div>
                <Icon name="arrow" class="arrow-right"/>
            </div>
            <div class="user-flex">
                <div class="user-item">
                    <img src="/static/img/user/user.svg" alt="">
                    <span>给我们评分</span>
                </div>
            </div>
            <div class="user-flex">
                <div class="user-item">
                    <img src="/static/img/user/user.svg" alt="">
                    <span>帮助中心</span>
                </div>
            </div>
            <div class="user-flex">
                <div class="user-item">
                    <img src="/static/img/user/user.svg" alt="">
                    <span>关于</span>
                </div>
                <Icon name="arrow" class="arrow-right"/>
            </div>
        </div>


        <!-- 退出登录 -->
        <div class="ripple_button loginout" v-if="token" @click="loginout">退出登录</div>
      
        
    </div>
</template>

<script setup>
import { computed } from "vue"
import { Icon, showConfirmDialog } from 'vant';
import router from "@/router";
import store from "@/store";
import { _logout } from "@/api/api"

const token = computed(() => store.state.token)
const userInfo = computed(() => store.state.userInfo || {})


const loginout = () => {
    showConfirmDialog({
        title: '退出登录',
        message:
            '您当前确定要退出吗？',
        confirmButtonColor: '#014CFA',
        cancelButtonColor: '#323233'
    })
        .then(() => {
            _logout()
            setTimeout(() => {
                store.dispatch('reset')
                router.push({
                    name: 'login'
                })
            }, 200)
        }).catch(() => { })
}

const jump = (name, needLogin) => {
    if (needLogin && !token.value) {
        router.push({
            name: 'login'
        })
        return
    }
    router.push({
        name
    })
}


// 预加载页面
store.commit('setPageLoading', true)
const loadingList = [
    import('@/views/Public/Language.vue'),
]
if (!token.value) {
    loadingList.push(import('@/views/Public/Login.vue'))
}
Promise.all(loadingList).finally(() => {
    store.commit('setPageLoading', false)
})

// 延迟加载
if (token.value) {
    setTimeout(() => {
        store.commit('setPageLoading', false)
        Promise.all([
            import('@/views/User/Safety.vue'),
            import('@/views/User/Account/Account.vue'),
            import('@/views/User/Kyc/Index.vue')
        ]).finally(() => {
            console.error('子页面加载完成')
        })
    }, 1000)
}
</script>

<style lang="less" scoped>
.page_user {
    padding: 0.3rem 0.32rem 1.8rem 0.32rem;
    position: relative;
    .user-header {
        display: flex;
        justify-content: right;
        margin-bottom: 0.4rem;
        div{
            font-size: 0.4rem;
        }
    }
    .user-banner {
        position: relative;
        margin-bottom: 0.2rem;
        .banner-title {
            position: absolute;
            left: 0.2rem;
            top: 0.48rem;
            font-size: 0.28rem;
            font-weight: 700;
        }
    }

    .user-login {
        background-color: #f1f3f9;
        padding: 0.3rem;
        border-radius: 0.2rem;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.2rem;
        img{
            width: 0.4rem !important;
            height: 0.4rem !important;
            margin-right: 0.2rem;
            vertical-align: middle;
        }
        span {
            line-height: 0.4rem;
            display: inline-block;
            vertical-align: middle;
            font-size: 0.32rem;
            font-weight: 500;
        }
        .arrow-right {
            margin-top: 0.08rem;
            color: #797b81;
        }
    }
    .user-comman{
        display: flex;
        margin-bottom: 0.4rem;
        .user-b-box 
        {
            flex: 1;
            background-color: #f1f3f9;
            padding: 0.2rem 0.3rem;
            border-radius: 0.2rem;
        }
        .user-flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.2rem;
            img {
                width: 0.4rem !important;
                height: 0.4rem !important;
            }
            .arrow-right {
                margin-top: 0.08rem;
                color: #797b81;
            }
        }
        .user-sub {
            font-size: 0.28rem;
            font-weight: 600;
            line-height: 0.48rem;
        }
        .user-small-title {
            font-size: 0.24rem;
            line-height: 0.32rem;
            color: #4f5156;
        }
    }
    .user-h-box {
        background-color: #f1f3f9;
        padding: 0.2rem 0.3rem;
        border-radius: 0.2rem;
        margin-bottom: 0.2rem;
        .user-flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.2rem;
            img {
                width: 0.4rem !important;
                height: 0.4rem !important;
            }
            .arrow-right {
                margin-top: 0.08rem;
                color: #797b81;
            }
        }
        .user-sub {
            font-size: 0.28rem;
            font-weight: 600;
            line-height: 0.48rem;
        }
        .user-small-title {
            font-size: 0.24rem;
            line-height: 0.32rem;
            color: #4f5156;
        }
    }
    .user-bottom{
        margin-top: 0.4rem;
        .user-flex{
            border-bottom: 0.02rem solid #f4f4f4;
            display: flex;
            justify-content: space-between;
            padding: 0.2rem 0;
            .user-item {
                img {
                    width: 0.4rem !important;
                    height: 0.4rem !important;
                    vertical-align: middle;
                    margin-right: 0.2rem;
                }
                span {
                    vertical-align: middle;
                }
            }
            .arrow-right {
                margin-top: 0.08rem;
                color: #797b81;
            }
        }
    }

    .loginout {
        width: 100%;
        height: 1.12rem;
        border-radius: 1.3rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.28rem;
        color: #014CFA;
        font-weight: 400;
        margin-top: 1.2rem;
        overflow: hidden;
    }
    
}
</style>