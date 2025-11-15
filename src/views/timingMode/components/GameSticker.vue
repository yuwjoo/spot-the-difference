<template>
  <div
    class="game-sticker"
    :class="[`game-sticker--${state}`]"
    @click="onStickerClick()"
  >
    <img
      v-for="(info, index) in sticker.stickerInfos"
      class="game-sticker__img"
      :src="info.url"
      :key="index"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Emits, Props } from "../types/gameSticker";

const emit = defineEmits<Emits>();

const props = withDefaults(defineProps<Props>(), {});

const state = ref<"" | "error" | "right">(""); // 状态

/**
 * 监听贴图点击
 */
const onStickerClick = () => {
  if (props.disabledClick) return;
  state.value = props.sticker.isTarget ? "right" : "error";
  setTimeout(() => {
    state.value = "";
    emit("click-animation-end", props.sticker);
  }, 500);
};
</script>

<style lang="scss" scoped>
.game-sticker {
  position: relative;

  &--error {
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(255, 0, 0, 0.4);
      z-index: 9999;
    }
  }

  &--right {
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 255, 0, 0.4);
      z-index: 9999;
    }
  }

  &__img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
