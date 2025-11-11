export interface Props {
  imageSource?: ImageSource; // 图片来源
  rows?: number; // 行数
  cols?: number; // 列数
}

export interface ImageSource {
  interferenceImagePath: string; // 干扰图路径
  targetImagePath: string; // 目标图路径
}
