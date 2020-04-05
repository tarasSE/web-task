<template>
  <div id="app">
    <md-field class="image-selector">
      <label>Upload image</label>
      <md-file @change="previewFiles" />
    </md-field>
    <vue-slider class="slider" v-model="grayscaleIntensity" v-on:drag-end="grayscale" />
    <div class="show-button-container">
      <md-button
        v-on:mousedown="showOriginal = true"
        v-on:mouseup="showOriginal = false"
        class="md-icon-button md-raised"
      >
        <md-icon>remove_red_eye</md-icon>
      </md-button>
      <md-button v-on:click="generateLink" class="md-icon-button md-raised">
        <md-icon>link</md-icon>
      </md-button>
      <span>{{url}}</span>
    </div>
    <div v-show="image !== null" class="image-container">
      <img v-show="showOriginal" id="image" alt="image" :src="image" v-on:load="grayscale" />
      <canvas v-show="!showOriginal" id="calculation-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import { imageEncode, makeGrayscale } from "./utils/ImageUtils";
import { downloadBlob } from "./utils/BlobUtils";

export default {
  name: "App",
  components: {
    VueSlider
  },
  data: () => ({
    showOriginal: false,
    image: require("./assets/logo.png"),
    grayscaleIntensity: 50,
    url: "",
    token: ""
  }),
  mounted: function() {
    const result = location.hash
      .split("&")
      .filter(item => item.includes("access_token"));
    if (result.length > 0) {
      this.token = result[0].split("=")[1];
    }
  },
  methods: {
    grayscale() {
      const canvas = document.getElementById("calculation-canvas");
      const image = document.getElementById("image");
      canvas.width = image.width;
      canvas.height = image.height;

      makeGrayscale(image, this.grayscaleIntensity, canvas);
    },
    async previewFiles(event) {
      const buffer = await event.target.files[0].arrayBuffer();
      this.image = imageEncode(buffer);
    },
    async generateLink() {
      const canvas = document.getElementById("calculation-canvas");

      canvas.toBlob(
        async blob => {
          downloadBlob("image.png", blob);

          const data = new FormData();
          data.append("file", blob);

          fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.token}`
            },
            data: blob
          });
        },
        "image/png",
        1
      );
    }
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}

.image-container {
  padding: 2%;
}

.image-selector {
  width: unset !important;
}

.slider {
  width: 80% !important;
}

.show-button-container {
  padding-top: 2% !important;
}
</style>
