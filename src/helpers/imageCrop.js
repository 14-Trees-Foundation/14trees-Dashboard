export const GetCroppedImg = (imageFile, pixelCrop, fileName) => {
  const canvas = document.createElement("canvas");

  const scaleX = imageFile.naturalWidth / imageFile.width;
  const scaleY = imageFile.naturalHeight / imageFile.height;
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    imageFile,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;

        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
};
