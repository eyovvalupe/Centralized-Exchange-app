<!-- 交易订单 -->
 <template>
    <div class="page trade-orders">
        <Top :title="'交易订单'" />

        <div style="padding:0.32rem">
            <Tabs :offset-top="'1.12rem'" class="van-tabs--sub van-tabs--sub_line" :sticky="true" :color="'var(--ex-primary-color)'"
             v-model:active="activeTab" animated shrink>
            <Tab :name="0" :title="t('common.spot')">
                <div class="pt-[0.2rem]">现货</div>
            </Tab>
            <Tab :name="1" :title="$t('common.crypto')">
                <div class="pt-[0.2rem]">
                    <ContractBlock />
                </div>
            </Tab>
            <Tab :name="3" :title="$t('common.option')">
                <div class="pt-[0.2rem]">
                    <AiBlock />
                </div>
            </Tab>
            <!-- <Tab :name="4" :title="'ETF'">
                <div class="pt-[0.2rem]">现货</div>
            </Tab> -->
        </Tabs>
        </div>
    </div>
 </template>

 <script setup>
import Top from "@/components/Top.vue";
import {ref} from "vue"
import { Tab, Tabs } from "vant";
import { useI18n } from "vue-i18n";
import ContractBlock from "@/views/Trade2/pages/ContractBlock"
import AiBlock from "@/views/Trade2/pages/AiBlock"

const { t } = useI18n();
const activeTab = ref(0);
</script>

<style lang="less" scoped>
.trade-orders{
    padding-top: 0.48rem;

}
</style>