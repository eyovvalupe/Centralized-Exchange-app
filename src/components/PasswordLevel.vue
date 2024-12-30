<!-- 密码等级 -->
<template>
  <div class="password_level" :class="'password_level_' + levels">
    <div class="levels">
      <div class="level level_active" v-for="i in levels" :key="i"></div>
      <div class="level" v-for="i in 4 - levels" :key="i"></div>
    </div>
    <span
      v-if="levels"
      :class="
        props.from == 'forgot'
          ? 'relative '
          : 'absolute top-[-0.05rem] left-[2.5rem]'
      "
    >
      {{ levelsMap[levels] }}
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  password: {
    type: String,
    default: "",
  },
  from: {
    type: String,
    default: "",
  },
});

const levelsMap = {
  0: t('password_level.weak'),
  1: t('password_level.weak'),
  2: t('password_level.weak'),
  3: t('password_level.normal'),
  4: t('password_level.strong'),
};
const levels = computed(() => {
  const password = props.password;

  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[\W_]/.test(password);

  // 初始评估等级为0（弱）
  let strength = 0;
  // 如果密码长度大于等于最小长度，增加评估等级
  if (password.length >= minLength) {
    // 如果密码包含大写字母，增加评估等级
    if (hasUpperCase) strength += 1;
    // 如果密码包含小写字母，增加评估等级
    if (hasLowerCase) strength += 1;
    // 如果密码包含数字，增加评估等级
    if (hasNumbers) strength += 1;
    // 如果密码包含特殊字符，增加评估等级
    if (hasSpecialChars) strength += 1;
  } else {
    strength = password.length ? 1 : 0;
  }
  return strength > 4 ? 4 : strength;
});
</script>

<style lang="less" scoped>
.password_level {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.24rem;
  color: var(--ex-error-color);

  .levels {
    display: flex;
    align-items: center;
    margin-right: 0.16rem;

    .level {
      width: 0.52rem;
      height: 0.06rem;
      background-color: var(--ex-border-color2);
      margin-right: 0.08rem;
      border-radius: 0.04rem;
    }
  }
}

.password_level_1,
.password_level_2 {
  color: var(--ex-error-color);

  .levels {
    .level_active {
      background-color: var(--ex-error-color);
    }
  }
}
.password_level_3 {
  color: var(--ex-primary-color);

  .levels {
    .level_active {
      background-color: var(--ex-primary-color);
    }
  }
}
.password_level_4 {
  color: var(--ex-success-color);

  .levels {
    .level_active {
      background-color: var(--ex-success-color);
    }
  }
}
</style>
