<!-- 个人中心 -->
<template>
    <div class="page page_user">

        <!-- 用户 -->
        <div class="user">
            <div class="avatar">
                <img src="/static/img/user/avatar.png" alt="avatar">
                <!-- <img v-else src="/static/img/user/unlogin.png" alt="avatar"> -->
            </div>

            <!-- 已登录 -->
            <div v-if="token" class="user_box userinfo">
                <div class="name">{{ userInfo.username || '--' }}</div>
                <div class="id">ID:23424</div>
            </div>
            <!-- 未登录 -->
            <div v-else class="user_box unlogin" @click="jump('login')">
                <span>登录/注册新用户</span>
            </div>
        </div>

        <!-- 账户升级 -->
        <div class="banner">
            <img src="/static/img/user/user_banner.png" alt="banner">

            <div class="title">注册模拟交易账户</div>
            <div class="title title2">无风险尝试投资体验</div>
        </div>

        <!-- 功能项 -->
        <div class="navs">
            <div class=" nav" @click="jump('kyc', true)">
                <div class="icon">
                    <img src="/static/img/user/iden.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">身份认证</div>
                    <div class="info">进行身份认证</div>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <div class=" nav" @click="jump('account', true)">
                <div class="icon">
                    <img src="/static/img/user/account.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">收款账户</div>
                    <div class="info">收款银行卡添加</div>
                </div>
                <div class="cards">
                    <img src="/static/img/user/cards.png" alt="🥧">
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <div class=" nav" @click="jump('safety', true)">
                <div class="icon">
                    <img src="/static/img/user/safe.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">安全</div>
                    <div class="info">谷歌验证码安全认证</div>
                </div>
                <div class="gg" v-if="token">
                    <span style="color: #FF3B30" v-if="!userInfo.googlebind">谷歌验证器未绑定</span>
                    <span style="color: #18B762;" v-if="userInfo.googlebind">谷歌验证器已绑定</span>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <div class=" nav" @click="jump('language')">
                <div class="icon">
                    <img src="/static/img/user/lang.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">语言</div>
                    <div class="info">多语言选择</div>
                </div>
                <div class="lang">
                    <div class="lang_icon">
                        <img src="/static/img/common/en.png" alt="English">
                    </div>
                    <span>English</span>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <div class=" nav">
                <div class="icon">
                    <img src="/static/img/user/server.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">客服</div>
                    <div class="info">联系客服</div>
                </div>
                <div class="nums">2</div>
                <Icon class="nav_more" name="arrow" />
            </div>
        </div>


        <!-- 退出登录 -->
        <div class=" loginout" v-if="token" @click="loginout">退出登录</div>
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
    padding: 0.56rem 0.32rem 1.8rem 0.32rem;
    position: relative;

    .user {
        display: flex;
        align-items: center;

        .avatar {
            width: 1.14rem;
            height: 1.14rem;
            margin-right: 0.14rem;
        }

        .user_box {
            flex: 1;

            .name {
                font-size: 0.36rem;
                font-weight: 400;
                line-height: 0.6rem;
                color: #061023;
                margin-bottom: 0.08rem;
            }

            .id {
                color: #014CFA;
                font-weight: 400;
                font-size: 0.28rem;
                line-height: 0.4rem;
                background-color: rgba(1, 76, 250, 0.08);
                display: inline-block;
                padding: 0 0.1rem;
                border-radius: 0.04rem;
            }
        }

        .unlogin {
            font-size: 0.36rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #061023;
            font-weight: 400;
            padding-left: 0.15rem;
        }
    }

    .banner {
        margin-top: 0.2rem;
        height: 2.03rem;
        color: #FFFFFF;
        position: relative;
        width: calc(100% + 0.12rem);

        >img {
            object-fit: initial !important;
        }

        .title {
            position: absolute;
            font-weight: 700;
            font-size: 0.36rem;
            color: #fff;
            left: 0.3rem;
            top: 0.6rem;
        }

        .title2 {
            left: 1.2rem;
            top: 1.2rem;
        }
    }

    .navs {
        margin-top: 0.2rem;

        .nav {
            display: flex;
            align-items: center;
            height: 1.28rem;
            color: #7E848D;
            font-size: 0.28rem;
            overflow: hidden;

            .icon {
                width: 0.64rem;
                height: 0.64rem;
                margin-right: 0.3rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                >img {
                    width: 0.48rem !important;
                    height: 0.48rem !important;
                }
            }

            .content {
                flex: 1;
                font-weight: 400;
                margin-right: 0.2rem;
                overflow: hidden;

                .title {
                    color: #1E1E2D;
                    font-size: 0.32rem;
                }

                .info {
                    font-size: 0.24rem;
                    color: #C2C2C2;
                    margin-top: 0.2rem;
                }
            }

            .nav_more {
                margin-left: 0.3rem;
            }

            .cards {
                width: 1.36rem;
                height: 0.52rem;
            }

            .gg {
                font-weight: 500;
                font-size: 0.24rem;
            }

            .lang {
                display: flex;
                align-items: center;
                font-weight: 500;
                color: #1E1E2D;
                font-size: 0.24rem;

                .lang_icon {
                    width: 0.48rem;
                    height: 0.48rem;
                    margin-right: 0.2rem;
                }
            }

            .nums {
                width: 0.32rem;
                height: 0.32rem;
                background-color: #FF3B30;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.2rem;
                color: #fff;
                font-weight: 400;
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