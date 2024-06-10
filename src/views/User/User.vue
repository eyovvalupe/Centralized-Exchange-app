<!-- 个人中心 -->
<template>
    <div class="page page_user">

        <!-- 客服 -->
        <div class=" server">
            <div class="ripple_button server_btn">
                <img class="server_icon" src="/static/img/common/server.png" alt="server">
            </div>
        </div>

        <!-- 用户 -->
        <div class="user">
            <div class="avatar">
                <img v-if="token" src="/static/img/user/avatar.png" alt="avatar">
                <img v-else src="/static/img/user/unlogin.png" alt="avatar">
            </div>
            <!-- 已登录 -->
            <div v-if="token" class="user_box userinfo">
                <div class="name">{{ userInfo.username || '--' }}</div>
                <div class="user_status_box">
                    <div class="user_status user_status_un" v-if="!userInfo.kyc">未认证</div>
                    <div class="user_status user_status_ed" v-if="userInfo.kyc">已认证</div>

                    <div class="ripple_button user_status_up" v-if="userInfo.role == 'guest'">
                        <div class="user_status_upicon">
                            <img src="/static/img/user/update.png" alt="up">
                        </div>
                        <span>升级投资账户</span>
                    </div>
                </div>
            </div>
            <!-- 未登录 -->
            <div v-else class="user_box unlogin" @click="jump('login')">
                <div class="ripple_button unlogin_btn">
                    登录 / 注册
                </div>
            </div>

        </div>

        <!-- 功能项 -->
        <div class="navs">
            <!-- 注册 -->
            <div class="ripple_button nav active_nav" v-if="!token">
                <div class="nav_icon">
                    <img src="/static/img/user/register.png" alt="icon">
                </div>
                <span class="nav_title">注册模拟账户，领取投资模拟金</span>
                <div class="nav_content"></div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <!-- 身份认证 -->
            <div class="ripple_button nav" :class="[token ? '' : 'disabled_nav']">
                <div class="nav_icon">
                    <img src="/static/img/user/iden.png" alt="icon">
                </div>
                <span class="nav_title">身份认证</span>
                <div class="nav_content"></div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <!-- 收款账户 -->
            <div class="ripple_button nav" :class="[token ? '' : 'disabled_nav']">
                <div class="nav_icon">
                    <img src="/static/img/user/account.png" alt="icon">
                </div>
                <span class="nav_title">收款账户</span>
                <div class="nav_content"></div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <!-- 安全 -->
            <div class="ripple_button nav" :class="[token ? '' : 'disabled_nav']" @click="jump('safety', true)">
                <div class="nav_icon">
                    <img src="/static/img/user/safe.png" alt="icon">
                </div>
                <span class="nav_title">安全</span>
                <div class="nav_content">
                    <span class="tip tip_red" v-if="!userInfo.googlebind">谷歌验证器未绑定</span>
                    <span class="tip tip_green" v-if="userInfo.googlebind">谷歌验证器已绑定</span>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <!-- 语言 -->
            <div class="ripple_button nav" @click="jump('language')">
                <div class="nav_icon">
                    <img src="/static/img/user/lang.png" alt="icon">
                </div>
                <span class="nav_title">语言</span>
                <div class="nav_content">
                    <div class="nav_lang_icon">
                        <img src="/static/img/common/en.png" alt="en">
                    </div>
                    <span>English</span>
                </div>
                <Icon class="nav_more" name="arrow" />
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
    if (needLogin && !token.value) return
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
        Promise.all([
            import('@/views/User/Safety.vue')
        ]).finally(() => {
            console.error('子页面加载完成')
        })
    }, 1000)
}
</script>

<style lang="less" scoped>
.page_user {
    padding-bottom: 1.8rem;
    position: relative;

    .server {
        display: flex;
        padding-right: 0.64rem;
        align-items: center;
        justify-content: flex-end;
        height: 1.12rem;

        .server_btn {
            width: 0.8rem;
            height: 0.8rem;

            .server_icon {
                width: 100%;
                height: 100%;
            }
        }


    }

    .user {
        display: flex;
        align-items: center;
        padding: 0.4rem 0.3rem 0.16rem 0.3rem;

        .avatar {
            width: 1.4rem;
            height: 1.4rem;
            margin-right: 0.4rem;
        }

        .user_box {
            flex: 1;
        }

        .unlogin {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #061023;
            font-size: 0.48rem;

            .unlogin_btn {
                overflow: hidden;
                line-height: 1rem;
            }
        }

        .userinfo {
            .name {
                color: #061023;
                font-size: 0.48rem;
                margin-bottom: 0.08rem;
            }

            .user_status_box {
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .user_status {
                    margin-right: 0.6rem;
                    height: 0.44rem;
                    padding: 0 0.3rem;
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                }

                .user_status_un {
                    color: #333;
                    background-color: rgba(33, 33, 33, 0.08);
                }

                .user_status_ed {
                    color: #014CFA;
                    background-color: rgba(1, 76, 250, 0.08);
                }

                .user_status_up {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    color: #014CFA;
                    overflow: hidden;
                    height: 0.6rem;

                    .user_status_upicon {
                        width: 0.32rem;
                        height: 0.32rem;
                        margin-right: 0.12rem;
                    }
                }
            }
        }
    }

    .navs {
        padding: 0.44rem 0.48rem 0 0.3rem;

        .nav {
            height: 1.12rem;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #F4F4F4;
            overflow: hidden;

            .nav_icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-right: 0.3rem;
            }

            .nav_title {
                font-weight: 400;
                color: #1E1E2D;
            }

            .nav_content {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 0.24rem;
                color: #1E1E2D;
                font-size: 0.24rem;
                font-weight: 500;

                .nav_lang_icon {
                    width: 0.48rem;
                    height: 0.48rem;
                    margin-right: 0.24rem;
                }

                .tip {
                    font-size: 0.24rem;
                }

                .tip_red {
                    color: #FF3B30;
                }

                .tip_green {
                    color: #18B762;
                }
            }

            .nav_more {
                font-size: 0.28rem;
                color: #7E848D;
            }
        }

        .disabled_nav {
            opacity: 0.5;

            &::after {
                display: none;
            }
        }

        .active_nav {
            .nav_title {
                color: #014CFA;
            }

            .nav_more {
                color: #014CFA;
            }
        }
    }

    .loginout {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-weight: 400;
        color: #014CFA;
        bottom: 2rem;
        overflow: hidden;
        line-height: 0.7rem;
    }
}
</style>