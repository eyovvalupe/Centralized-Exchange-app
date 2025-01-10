<!-- 带单详情 -->
 <template>
    <div class="page-followinfo">
        <Top :backFunc="backFunc" :title="'订单详情'"></Top>

        <MyFollowItem :item="info" :stopJump="true" :showDetail="true" />
    </div>
 </template>

 <script setup>
import Top from "@/components/Top.vue";
import MyFollowItem from "../components/MyFollowItem.vue"

const emits = defineEmits(['back'])

const backFunc = () => {
    emits('back')
}
const info = ref({ uid: 'uid', name: '用户名', lv: '9', followers: '11', amount: '999', returnrate: 50, returnamount: 700, winrate: 20, time: [] })
</script>

<style lang="less">
.page-followinfo {
    padding: 1.6rem 0.32rem 0.48rem 0.32rem;
}
</style>