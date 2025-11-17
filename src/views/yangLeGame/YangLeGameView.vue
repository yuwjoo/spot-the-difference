<template>
  <div class="yang-le-game">
    <div
      v-for="(item, index) in cardArr"
      :key="index"
      class="yang-le-game__block"
      :class="{
        'yang-le-game__block--isTop': item.isTop,
      }"
      :style="{
        left: (item.x / 2) * 45 + 'px',
        top: (item.y / 2) * 45 + 'px',
        zIndex: item.z,
      }"
      @click="onClickCard(item)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCardMap, type CardData } from "./gameLogic/cardMap";

const cardArr = ref<CardData[]>([]);

const { cardDataList, removeCard } = useCardMap({
  mapTemplate: [
    ["o", "o", "o", "o", "o", "o", "o"],
    ["o", "o", "o", "o", "o", "o", "o"],
    ["o", "o", "o", "o", "o", "o", "o"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],

    // ["o", "o", "o"],
    // ["o", "x", "o"],
    // ["o", "o", "o"],
    // ["o", "o"],
  ],
  arrangeRule: "random",
  cardCount: 120,
});

cardArr.value = cardDataList;

/**
 * 点击卡片事件
 * @param item 卡片数据
 */
function onClickCard(item: CardData) {
  const newCardArr = removeCard(item);
  cardArr.value = newCardArr;
}
</script>

<style lang="scss" scoped>
$block-size: 40px; // 块尺寸

.yang-le-game {
  position: relative;

  &__block {
    position: absolute;
    width: $block-size;
    height: $block-size;
    background: url("@/assets/konglong.png") no-repeat center center/cover;
    box-shadow: 0 0 5px black;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      content: "";
    }

    &--isTop {
      &::before {
        display: none;
      }
    }
  }
}
</style>
