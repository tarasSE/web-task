import Worker from "simple-web-worker";

export const grayscaleWorker = Worker.create([
  {
    message: "grayscale",
    func: (imgData, grayscaleIntensity) => {
      const calculateColorValue = (value, average, grayscaleRatio) => value - (value - average) * grayscaleRatio;

      for (let i = 0; i < imgData.data.length; i += 4) {
        const red = imgData.data[i];
        const green = imgData.data[i + 1];
        const blue = imgData.data[i + 2];
        // 4th value is opasity, but it's not required 
        // const alpha = imgData.data[i + 3];

        const grayscaleRatio = grayscaleIntensity / 100;
        const average = (red + green + blue) / 3;

        imgData.data[i] = calculateColorValue(red, average, grayscaleRatio);
        imgData.data[i + 1] = calculateColorValue(green, average, grayscaleRatio);
        imgData.data[i + 2] = calculateColorValue(blue, average, grayscaleRatio);
      }

      return imgData;
    }
  }
]);