<template>
  <div class="challenge-grid">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="image-container"
      :class="{ incorrect: incorrectSelection === index }"
      @click="selectImage(index)"
    >
      <img :src="image.url" :alt="'image-' + index" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Image {
  url: string;
  isDifferent: boolean;
}

defineProps<{
  images: Image[];
  incorrectSelection: number | null;
}>();

const emit = defineEmits(["select-image"]);

const selectImage = (index: number) => {
  emit("select-image", index);
};
</script>

<style lang="scss" scoped>
.challenge-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 20px;
}

.image-container {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;

  &.incorrect {
    border-color: red;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
