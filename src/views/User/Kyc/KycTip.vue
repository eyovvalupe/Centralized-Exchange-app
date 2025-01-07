<!-- 上传提示 -->
<template>
    <div class="page page-tip">
        <Top :backFunc="backFunc" :title="'身份认证上传要求'"></Top>

        <div class="boxs">
            <div class="box">
                <div class="img_box">
                    <img :src="getStaticImgUrl('/static/img/user/auth_tip_1.svg')" alt="img">

                    <div class="img_status">
                        <img :src="getStaticImgUrl('/static/img/user/ok_icon.svg')" alt="img">
                    </div>
                </div>
                <div>标准</div>
            </div>
            <div class="box">
                <div class="img_box">
                    <img :src="getStaticImgUrl('/static/img/user/auth_tip_2.svg')" alt="img">

                    <div class="img_status">
                        <img :src="getStaticImgUrl('/static/img/user/err_icon.svg')" alt="img">
                    </div>
                </div>
                <div>边框缺失</div>
            </div>
            <div class="box">
                <div class="img_box">
                    <img :src="getStaticImgUrl('/static/img/user/auth_tip_3.svg')" alt="img">

                    <div class="img_status">
                        <img :src="getStaticImgUrl('/static/img/user/err_icon.svg')" alt="img">
                    </div>
                </div>
                <div>照片模糊</div>
            </div>
            <div class="box">
                <div class="img_box">
                    <img :src="getStaticImgUrl('/static/img/user/auth_tip_4.svg')" alt="img">

                    <div class="img_status">
                        <img :src="getStaticImgUrl('/static/img/user/err_icon.svg')" alt="img">
                    </div>
                </div>
                <div>闪光强烈</div>
            </div>
        </div>

        <div class="subtitle">拍摄身份证要求:</div>
        <div class="info">
            <span>持有的本人有效身份证:</span><br />
            <span>拍摄时确保身份证边框完整、字体清晰、亮度均匀;</span>
        </div>
    </div>
</template>

<script setup>
import { getStaticImgUrl } from "@/utils/index.js"
import Top from '@/components/Top.vue';

const emits = defineEmits(['back'])
const backFunc = () => {
    emits('back')
}
</script>

<style lang="less" scoped>
.page-tip {
    padding: 1.4rem 0.32rem 0.32rem 0.32rem;

    .boxs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.4rem;

        .box {
            width: 48%;
            background-color: var(--ex-bg-white2);
            border-radius: 0.12rem;
            height: 2rem;
            margin-bottom: 0.28rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--ex-text-color4);
            font-size: 0.24rem;

            .img_box {
                width: 1.2rem;
                height: 0.8rem;
                margin-bottom: 0.16rem;
                position: relative;

                .img_status {
                    width: 0.24rem;
                    height: 0.24rem;
                    position: absolute;
                    bottom: -0.1rem;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }

    .subtitle {
        color: var(--ex-text-color);
        margin-bottom: 0.18rem;
    }

    .info {
        color: var(--ex-text-color4);
        line-height: 0.5rem;
    }
}
</style>