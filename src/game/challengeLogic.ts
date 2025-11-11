import { ref, onUnmounted } from "vue";

export interface Image {
  url: string;
  isDifferent: boolean;
}

export function useChallengeGame() {
  const score = ref(0);
  const time = ref(60);
  const images = ref<Image[]>([]);
  const incorrectSelection = ref<number | null>(null);
  const isGameOver = ref(false);

  let timer: number;

  const imageSources = [
    "./konglongA.png",
    "./konglongB.png",
    // Add more image paths here
  ];

  function generateImages() {
    const newImages: Image[] = [];
    const standardImage =
      imageSources[Math.floor(Math.random() * imageSources.length)];
    let differentImage = standardImage;
    while (differentImage === standardImage) {
      differentImage =
        imageSources[Math.floor(Math.random() * imageSources.length)];
    }

    const differentIndex = Math.floor(Math.random() * 40);

    for (let i = 0; i < 40; i++) {
      newImages.push({
        url: i === differentIndex ? differentImage : standardImage,
        isDifferent: i === differentIndex,
      });
    }
    images.value = newImages;
  }

  function startGame() {
    score.value = 0;
    time.value = 60;
    isGameOver.value = false;
    generateImages();
    timer = setInterval(() => {
      time.value--;
      if (time.value <= 0) {
        endGame();
      }
    }, 1000);
  }

  function selectImage(index: number) {
    if (images.value[index].isDifferent) {
      score.value += 5;
      time.value += 5;
      generateImages();
    } else {
      time.value -= 5;
      incorrectSelection.value = index;
      setTimeout(() => {
        incorrectSelection.value = null;
      }, 500);
    }
  }

  function endGame() {
    clearInterval(timer);
    isGameOver.value = true;
  }

  function restartGame() {
    startGame();
  }

  onUnmounted(() => {
    clearInterval(timer);
  });

  return {
    score,
    time,
    images,
    incorrectSelection,
    isGameOver,
    startGame,
    selectImage,
    restartGame,
  };
}
