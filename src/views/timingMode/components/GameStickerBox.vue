<template>
  <div class="game-sticker-box">
    <div
      class="game-sticker-box__grid"
      :style="{ 'grid-template-columns': `repeat(${cols}, 1fr)` }"
    >
      <div
        class="game-sticker-box__grid-item"
        v-for="(sticker, index) in stickers"
        :key="index"
      >
        <game-sticker
          class="game-sticker-box__grid-item-sticker"
          :sticker="sticker"
          :disabled-click="disabledClick"
          @click="onStickerClick(sticker, index)"
          @click-animation-end="onStickerClickAnimationEnd"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import GameSticker from "./GameSticker.vue";
import type { Props, Sticker, Emits } from "../types/gameStickerBox";
import { ref } from "vue";

withDefaults(defineProps<Props>(), {
  cols: 4,
});

const emit = defineEmits<Emits>();

const disabledClick = ref(false); // 是否禁用点击

/**
 * 监听贴图点击
 * @param sticker 贴图数据
 * @param index 数组下标
 */
const onStickerClick = (sticker: Sticker, index: number) => {
  disabledClick.value = true;
  emit("click-sticker", sticker, index);
};

/**
 * 监听贴图点击动画结束
 * @param sticker 贴图数据
 */
const onStickerClickAnimationEnd = (sticker: Sticker) => {
  disabledClick.value = false;
  emit("click-animation-end", sticker);
};
</script>

<style lang="scss" scoped>
$grid-padding: 10px; // 网格内边距
$item-space: 10px; // 元素间隔

.game-sticker-box {
  display: flex;
  justify-content: center;
  align-items: center;

  &__grid {
    display: inline-grid;
    gap: $item-space;
    padding: $grid-padding;
    overflow-y: auto;
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
    width: 100%;

    &-item {
      position: relative;
      height: 0;
      padding-bottom: 100%;
      //   aspect-ratio: 1/1;

      &-sticker {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
