<!-- 个人中心 -->
<template>
    <div class="page page_user">

        <!-- 标题 -->
        <!-- <div class="title">用户</div> -->


        <!-- <div class="user-login-login-box" v-if="token || test">
            <div class="user-login-login" >
                <div style="display: flex;" v-if="test">
                    <div class="login-user-box">T</div>
                    <span>Test</span>
                </div>

                <div style="display: flex;" v-else>
                    <div class="login-user-box">{{getFirstCharacter(userInfo.username)}}</div>
                    <span>{{ userInfo.username || '--' }}</span>
                </div>
            
                <Icon name="arrow" class="arrow-right"/>
            </div>
        </div> -->

        <div class="user-login" v-if="token || test">
            <div style="display: flex;">
                <img src="/static/img/user/user-block.png" alt="">
                <!-- <span v-if="test">Test</span> -->
                <div class="user-login-block">
                    <span style="font-weight: 500;" v-if="test">Test</span>
                    <span style="font-weight: 500;" v-else>{{ userInfo.username || '--' }}</span>
                    <div class="id">ID:23424</div>
                </div>
                
            </div>
           
            <Icon name="arrow" class="arrow-right"/>
        </div>


        <div class="user-login" v-else @click="jump('login')">
            <div>
                <img src="/static/img/user/user-block.png" alt="">
                <span>登录/注册新用户</span>
            </div>
           
            <Icon name="arrow" class="arrow-right"/>
        </div>

        <!-- <div class="user-header">
            <div style="margin-right: 0.4rem;margin-top: 0.04rem;">
                <Icon name="comment-o" />
            </div>
            <div>
                <Icon name="point-gift-o" />
            </div>
        </div> -->

        <!-- <div class="user-banner" @click="testBanner" v-if="!test && !token">
            <img src="/static/img/user/bg.png" alt="banner">
        </div> -->

        <div class="user-banner" @click="testBanner" v-if="!test && !token">
            <img src="/static/img/user/bg.png" alt="banner">
        </div>
        <div v-else style="height: 0.28rem;"></div>


        <div class="user-comman" >
            <div class="user-b-box" style="margin-right: 0.2rem;">
                <div class="user-flex">
                    <img src="/static/img/user/user.svg" alt="">
                    <Icon name="arrow" class="arrow-right"/>
                </div>
                <div class="user-sub">推荐朋友</div>
                <div class="user-small-title">
                    分享给好友
                </div>
            </div>

            <div class="user-b-box">
                <div class="user-flex">
                    <img src="/static/img/user/server.png" alt="">

                    <div style="display: flex;">
                        <div class="nums">2</div>
                        <Icon name="arrow" class="arrow-right"/>
                    </div>
                </div>
                <div class="user-sub">客服</div>
                <div class="user-small-title">
                    联系客服
                </div>
            </div>
        </div>


        <div class="user-h-box" @click="jump('account', true)">
            <div class="user-flex">
                <img src="/static/img/user/account.png" alt="">
                <Icon name="arrow" class="arrow-right"/>
            </div>
            <div class="user-sub">收款账户</div>
            <div class="user-small-title">
                收款银行卡添加
            </div>
        </div>


        <div class="user-comman">
            <div class="user-b-box" style="margin-right: 0.2rem;" @click="jump('kyc', true)">
                <div class="user-flex">
                    <img src="/static/img/user/iden.png" alt="">
                    <div style="display: flex;">
                        <span v-if="token">
                            <span class="red-text" v-if="userInfo.kyc!=1 || userInfo.kyc!=2">未认证</span>
                            <span class="red-text" v-else>已认证</span>
                        </span>
                        <Icon name="arrow" class="arrow-right"/>
                    </div>
                    
                </div>
                <div class="user-sub">身份认证</div>
                <div class="user-small-title">
                    进行身份认证
                </div>
            </div>

            <div class="user-b-box" @click="jump('googleCode', true)">
                <div class="user-flex">
                    <img src="/static/img/user/Google-lock.png" alt="">
                   <div style="display: flex;">
                        <span class="red-text" v-if="token && !userInfo.googlebind">谷歌验证器未绑定</span>
                        <span class="red-text" style="color: #18B762;" v-if="token && userInfo.googlebind">谷歌验证器已绑定</span>
                        <Icon name="arrow" class="arrow-right"/>
                   </div>
                </div>
                <div class="user-sub">谷歌验证器</div>
                <div class="user-small-title">
                    谷歌验证器安全认证
                </div>
            </div>
        </div>


        <div class="navs">
            <div class="ripple_button nav" @click="jump('language')" style="border-bottom: 0.02rem solid #eaeaea;">
                <div class="icon">
                    <img src="/static/img/user/lang.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">语言</div>
                </div>
                <div class="lang">
                    <div class="lang_icon">
                        <img src="/static/img/common/en.png" alt="English">
                    </div>
                    <span>English</span>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <div class="ripple_button nav" @click="jump('safety', true)" style="border-bottom: 0.02rem solid #eaeaea;">
                <div class="icon">
                    <img src="/static/img/user/safe.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">安全</div>
                </div>
                <div class="gg" v-if="token">
                    <span style="color: #FF3B30" v-if="!userInfo.googlebind">谷歌验证器未绑定</span>
                    <span style="color: #18B762;" v-if="userInfo.googlebind">谷歌验证器已绑定</span>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
            <div class="ripple_button nav" @click="jump('about')">
                <div class="icon">
                    <img src="/static/img/user/about.png" alt="img">
                </div>
                <div class="content">
                    <div class="title">关于</div>
                </div>
                <Icon class="nav_more" name="arrow" />
            </div>
        </div>


        <!-- 退出登录 -->
        <!-- <div class="loginout" v-if="token || test" @click="loginout">
            <img src="/static/img/user/out.svg" alt="">
            退出登录
        </div> -->
        <div class="ripple_button loginout" v-if="token || test" @click="loginout">退出登录</div>
      
        
    </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { Icon, showConfirmDialog } from 'vant';
import router from "@/router";
import store from "@/store";
import { _logout } from "@/api/api"

const token = computed(() => store.state.token)
const userInfo = computed(() => store.state.userInfo || {})

const test = ref(false)


const testBanner = ()=>{
    test.value = true
}


const getFirstCharacter = (username) => {
  return username ? username.charAt(0) : '-';
};


const loginout = () => {
    if (token.value) {
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
    } else if (test.value){
        showConfirmDialog({
            title: '退出登录',
            message:
                '您当前确定要退出吗？',
            confirmButtonColor: '#014CFA',
            cancelButtonColor: '#323233'
        })
            .then(() => {
              test.value = false
            }).catch(() => { })
    }
    
}

const jump = (name, needLogin) => {
    if (needLogin && !token.value) {
        router.push({
            name: 'login'
        })
        return
    }
    if (name == 'googleCode') {
        if (token.value && !userInfo.value.googlebind) {
            router.push({
                name: 'google'
            })
        } else if (token.value && userInfo.value.googlebind){
            router.push({
                name: 'googleCode'
            })
        }
    } else {
        router.push({
            name
        })
    }
    
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
    padding: 0rem 0.32rem 1.8rem 0.32rem;
    position: relative;
    .title {
        height: 1.12rem;
        color: #0D0D12;
        font-size: 0.56rem;
        font-weight: 600;
        line-height: 1.12rem;
    }
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
        .banner-title {
            position: absolute;
            left: 0.2rem;
            top: 0.48rem;
            font-size: 0.28rem;
            font-weight: 700;
        }
    }

    .user-login {
        background-color: #f2f3f8;
        margin-top: 0.32rem;
        padding: 0.3rem;
        padding-top: 0.18rem!important;
        border-radius: 0.2rem;
        display: flex;
        justify-content: space-between;
        height: 1.6rem;
        img{
            width: 0.96rem !important;
            height: 0.96rem !important;
            margin-right: 0.48rem;
            vertical-align: middle;
        }
        span {
            line-height: 1rem;
            display: inline-block;
            vertical-align: middle;
            font-size: 0.36rem;
            font-weight: 400;
        }
        .arrow-right {
            margin-top: 0.04rem!important;
            color: #797b81;
        }
        .user-login-block {
            span {
                line-height: 0.6rem;
                margin-bottom: 0.14rem;
            }
            .id {
                color: #014CFA;
                font-weight: 400;
                font-size: 0.28rem;
                line-height: 0.4rem;
                background-color: rgba(1, 76, 250, 0.08);
                padding: 0 0.1rem;
                border-radius: 0.04rem;
            }
        }
    }
    .user-comman{
        display: flex;
        margin-bottom: 0.28rem;
        .user-b-box 
        {
            flex: 1;
            background-color: #f2f3f8;
            padding: 0.2rem 0.3rem;
            border-radius: 0.2rem;
        }
        .user-flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.2rem;
            img {
                width: 0.4rem !important;
            }
            .arrow-right {
                color: #797b81;
                margin-left: 0.24rem;
                margin-top: 0.02rem;
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
        background-color: #f2f3f8;
        padding: 0.2rem 0.3rem;
        border-radius: 0.2rem;
        margin-bottom: 0.28rem;
        .user-flex {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.1rem;
            img {
                width: 0.48rem !important;
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
    .user-login-login-box {
        background-color: #f2f3f8;
        padding: 0.2rem 0.3rem;
        border-radius: 0.2rem;
    }
    .user-login-login {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.2rem;
        .arrow-right {
            margin-top: 0.08rem;
            color: #797b81;
        }
        .login-user-box {
            width: 1rem;
            height: 1rem;
            border-radius: 0.2rem;
            background-color: #667d7f;
            color: white;
            line-height: 0.88rem;
            text-align: center;
            margin-right: 0.4rem;
            font-size: 0.6rem;
            font-weight: 900;
        }
        span {
            font-size: 0.36rem;
            font-weight: 700;
            line-height: 0.6rem;
        }
    }   

    // .loginout {
    //     margin-top: 0.2rem;
    //     border-bottom: 0.02rem solid #f4f4f4;
    //     display: flex;
    //     color: #eb4e3d;
    //     padding: 0.2rem 0;
    //     line-height: 0.4rem;
    //     img {
    //         width: 0.4rem !important;
    //         height: 0.4rem !important;
    //         vertical-align: middle;
    //         margin-right: 0.2rem;
    //     }
    // }
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
        overflow: hidden;
    }
    .user-fllower {
        display: flex;
        .user-fllower-flex {
            flex: 1;
            .user-fllower-num {
                font-size: 0.28rem;
                font-weight: 600;
                margin-bottom: 0.06rem;
            }
            .user-fllower-title {
                font-size: 0.24rem;
                color: #767880;
            }
        }
    }
    .navs {
        margin-top: 0.2rem;

        .nav {
            display: flex;
            align-items: center;
            height: 1.04rem;
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
                    font-weight: 400;
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
        }
    }
    .red-text {
        color: #FF3B30;
        font-size: 0.2rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.32rem;
    }
}
</style>