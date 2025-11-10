export interface Image {
  id: number;
  url: string;
}

const TOTAL_IMAGES = 40;

export const generateLevel = (level: number) => {
  const correctImageId = Math.floor(Math.random() * TOTAL_IMAGES);
  const correctImageUrl = `https://picsum.photos/seed/${
    correctImageId + level
  }/100`;
  const normalImageUrl = `https://picsum.photos/seed/${level}/100`;

  const images: Image[] = [];
  for (let i = 0; i < TOTAL_IMAGES; i++) {
    images.push({
      id: i,
      url: i === correctImageId ? correctImageUrl : normalImageUrl,
    });
  }

  // Shuffle images
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  return {
    newImages: images,
    correctImage: { id: correctImageId, url: correctImageUrl },
  };
};
