import { useEffect, useState } from 'react';
import { Image } from 'react-native';

export interface UseImageSizeProps {
  image?: string;
  maxWidth: number;
  maxHeight: number;
}

export function useImageSize(props?: UseImageSizeProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    return function onDestroy() {};
  }, []);

  useEffect(() => {
    if (props?.image) {
      const { maxHeight, maxWidth } = props;
      Image.getSize(props.image, (imageWidth, imageHeight) => {
        const { displayWidth: width, displayHeight: height } = calculateSize({
          imageHeight,
          imageWidth,
          maxHeight,
          maxWidth,
        });
        setImageSize({ width, height });
      });
    }
  }, [props?.image]);

  return { imageSize, calculateSize };
}

export interface UseImageSizesProps extends Omit<UseImageSizeProps, 'image'> {
  images: string[];
}

export interface ImageSize {
  width: number;
  height: number;
}

export function useImageSizes(props: UseImageSizesProps) {
  const [imageSizes, setImageSizes] = useState<ImageSize[]>(
    props.images.map((_) => ({ width: 0, height: 0 }))
  );

  useEffect(() => {
    return function onDestroy() {};
  }, []);

  useEffect(() => {
    (async () => {
      if (props.images.length) {
        const sizes: ImageSize[] = [];
        for (const image of props.images) {
          const { maxHeight, maxWidth } = props;
          await new Promise((res, rej) =>
            Image.getSize(
              image,
              (imageWidth, imageHeight) => {
                const { displayWidth: width, displayHeight: height } =
                  calculateSize({
                    imageHeight,
                    imageWidth,
                    maxHeight,
                    maxWidth,
                  });
                const size = { width, height };
                res(size);
                sizes.push(size);
              },
              (reason) => rej(reason)
            )
          );
        }
        setImageSizes(sizes);
      }
    })();
  }, [props.images.length]);

  return { imageSizes, calculateSize };
}

export function calculateSize({
  imageWidth,
  imageHeight,
  maxWidth,
  maxHeight,
}: {
  imageWidth: number;
  imageHeight: number;
  maxWidth: number;
  maxHeight: number;
}) {
  let displayHeight = imageHeight,
    displayWidth = imageWidth,
    ratio = 0;
  if (imageHeight > imageWidth) {
    if (imageHeight > maxHeight) {
      ratio = maxHeight / imageHeight;
      displayWidth = ratio * imageWidth;
      displayHeight = maxHeight;
    }
  } else {
    if (imageWidth > maxWidth) {
      ratio = maxWidth / imageWidth;
      displayHeight = ratio * imageHeight;
      displayWidth = maxWidth;
    }
  }
  if (displayWidth > maxWidth) {
    ratio = maxWidth / displayWidth;
    displayHeight = ratio * displayHeight;
    displayWidth = maxWidth;
  }
  displayHeight = Math.round(displayHeight);
  displayWidth = Math.round(displayWidth);
  // setImageSize({ width: displayWidth, height: displayHeight });
  return { displayHeight, displayWidth };
}
