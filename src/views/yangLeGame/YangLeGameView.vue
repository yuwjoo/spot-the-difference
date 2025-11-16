<template>
  <div>333</div>
</template>

<script lang="ts" setup>
import { useCardMap } from "./gameLogic/cardMap";

useCardMap({
  mapTemplate: [
    ["o", "o", "o", "o", "o", "o", "o"],
    ["o", "o", "o", "o", "o", "o", "o"],
    ["o", "o", "o", "o", "o", "o", "o"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
    ["x", "o", "o", "o", "o", "o", "x"],
  ],
  arrangeRule: "random",
  cardCount: 300,
});
</script>
