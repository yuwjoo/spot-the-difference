<template>
  <div class="game-sticker">
    <img
      class="game-sticker__img"
      :src="sticker.url"
      @click="onStickerClick()"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Props } from "../types/gameSticker";

const props = withDefaults(defineProps<Props>(), {});

const state = ref<"" | "error" | "right">(""); // 状态

/**
 * 监听贴图点击
 */
const onStickerClick = () => {
  state.value = props.isTarget ? "right" : "error";
};
</script>

<style lang="scss" scoped>
.game-sticker {
  &__img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
