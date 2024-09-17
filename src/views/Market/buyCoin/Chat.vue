<!-- 与商家的会话 -->
<template>
    <div class="buycoin-chat">
        <div class="list" ref="listRef">

            <!-- 提示 -->
            <div class="notice_msg">
                <div class="time">2024-10-28 10:25:08</div>
                <div class="content">您已经成功下单，请耐心等候商家付款</div>
            </div>
            <div class="notice_msg">
                <div class="time">2024-10-28 10:25:08</div>
                <div class="content">您已经成功下单，请耐心等候商家付款</div>
            </div>

            <!-- 我的文本 -->
            <div class="my_text_box">
                <div class="my_text">撒旦撒旦</div>
                <div class="time">2024-10-28 10:25:08</div>
            </div>
            <div class="my_text_box">
                <div class="my_text">撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦撒旦</div>
                <div class="time">2024-10-28 10:25:08</div>
            </div>

            <!-- 我的图片 -->
            <div class="my_pic_box">
                <div class="my_pic"></div>
                <div class="time">2024-10-28 10:25:08</div>
            </div>

            <!-- 对方文本 -->
            <div class="op_text_box">
                <div class="avatar">
                    <div class="pointer"></div>
                </div>

                <div class="op_text">
                    <div class="op_text_content">啊是大红色的嘎斯？</div>
                    <div class="time">2024-10-28 10:25:08</div>
                </div>
            </div>
            <div class="op_text_box">
                <div class="avatar">
                    <div class="pointer"></div>
                </div>

                <div class="op_text">
                    <div class="op_text_content">啊是大红色的嘎斯啊是大红色的嘎斯啊是大红色的嘎斯啊是大红色的嘎斯啊是大红色的嘎斯？</div>
                    <div class="time">2024-10-28 10:25:08</div>
                </div>
            </div>

            <!-- 对方图片 -->
            <div class="op_pic_box">
                <div class="avatar">
                    <div class="pointer"></div>
                </div>

                <div class="op_pic">
                    <div class="op_pic_content"></div>
                    <div class="time">2024-10-28 10:25:08</div>
                </div>
            </div>

        </div>
        <div class="box item">
            <div class="box_icon">
                <img src="/static/img/chat/file.png" alt="img">
            </div>
            <input type="text" class="ipt" placeholder="请输入...">
            <div class="box_icon">
                <img src="/static/img/chat/send.png" alt="img">
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.buycoin-chat {
    padding: 0.2rem 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .list {
        flex: 1;
        overflow-y: auto;
        color: #333;
        padding-bottom: 0.6rem;

        .op_pic_box {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            margin-top: 0.4rem;

            .avatar {
                width: 0.64rem;
                height: 0.64rem;
                position: relative;
                border-radius: 50%;
                background-color: #014CFA;
                margin-right: 0.2rem;
                top: 0.05rem;
                flex-shrink: 0;

                .pointer {
                    width: 0.16rem;
                    height: 0.16rem;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    background-color: #30BF87;
                }
            }

            .op_pic {
                .op_pic_content {
                    display: inline-block;
                    width: 4rem;
                    height: 2.4rem;
                    background-color: #eee;
                    border-radius: 0.12rem;
                    margin-bottom: 0.1rem;
                }

                .time {
                    font-size: 0.24rem;
                    color: #AEAEAE;
                }
            }
        }

        .op_text_box {
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            margin-top: 0.4rem;

            .avatar {
                width: 0.64rem;
                height: 0.64rem;
                position: relative;
                border-radius: 50%;
                background-color: #014CFA;
                margin-right: 0.2rem;
                top: 0.05rem;
                flex-shrink: 0;

                .pointer {
                    width: 0.16rem;
                    height: 0.16rem;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    border-radius: 50%;
                    background-color: #30BF87;
                }
            }

            .op_text {
                .op_text_content {
                    display: inline-block;
                    padding: 0.2rem 0.4rem;
                    line-height: 0.4rem;
                    background-color: #F6F8FE;
                    color: #333;
                    text-align: left;
                    border-top-right-radius: 0.24rem;
                    border-bottom-left-radius: 0.24rem;
                    border-bottom-right-radius: 0.24rem;
                    margin-bottom: 0.1rem;
                }

                .time {
                    font-size: 0.24rem;
                    color: #AEAEAE;
                }
            }
        }

        .my_pic_box {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-start;
            margin-top: 0.4rem;


            .my_pic {
                display: inline-block;
                width: 4rem;
                height: 2.4rem;
                background-color: #eee;
                border-radius: 0.12rem;
                margin-bottom: 0.1rem;
            }

            .time {
                font-size: 0.24rem;
                color: #AEAEAE;
            }
        }

        .my_text_box {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-start;
            margin-top: 0.4rem;


            .my_text {
                display: inline-block;
                padding: 0.2rem 0.4rem;
                line-height: 0.4rem;
                background-color: #3D65F9;
                color: #fff;
                text-align: left;
                max-width: 84%;
                border-top-left-radius: 0.24rem;
                border-bottom-left-radius: 0.24rem;
                border-bottom-right-radius: 0.24rem;
                margin-bottom: 0.1rem;
            }

            .time {
                font-size: 0.24rem;
                color: #AEAEAE;
            }
        }

        .notice_msg {
            text-align: center;
            margin: 0.1rem 0.64rem 0.32rem 0.64rem;

            .time {
                font-size: 0.24rem;
                color: #AEAEAE;
                margin-bottom: 0.1rem;
            }
        }
    }

    .box {
        border: 1px solid #D0D8E2;
        height: 0.96rem;
        border-radius: 0.04rem;
        margin-top: 0.1rem;
        display: flex;
        align-items: center;
        padding: 0 0.32rem;

        .ipt {
            flex: 1;
            margin: 0 0.32rem;
        }

        .box_icon {
            width: 0.4rem;
            height: 0.4rem;
        }
    }
}
</style>