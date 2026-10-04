<template>
  <div v-if="showOverlay" class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-[1000]">
    <div class="bg-white rounded-lg overflow-hidden shadow-lg max-w-[90%] max-h-[90%] flex flex-col">
      <img :src="selectedImage" alt="Full Image" class="max-w-full max-h-[calc(90vh-60px)] object-contain" />
      <div class="p-4 text-center bg-gray-100 text-base text-gray-700 font-sans">
        {{ selectedDate }}
      </div>
    </div>
    <div class="mt-5 flex justify-center w-full gap-5">
      <span class="text-white text-lg cursor-pointer bg-white/20 px-4 py-2.5 rounded-lg transition-colors duration-300 hover:bg-white/30 active:bg-white/40" @click="prvImg">previous</span>
      <span class="text-white text-lg cursor-pointer bg-white/20 px-4 py-2.5 rounded-lg transition-colors duration-300 hover:bg-white/30 active:bg-white/40" @click="closeImageOverlay">back</span>
      <span class="text-white text-lg cursor-pointer bg-white/20 px-4 py-2.5 rounded-lg transition-colors duration-300 hover:bg-white/30 active:bg-white/40" @click="nxtImg">next</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showOverlay: {
      type: Boolean,
      required: true,
      selectedImage: String,
      selectedDate: String,
    },
    selectedImage: {
      type: String,
      required: true,
    },
    selectedDate: {
      type: String,
      required: true,
    },
  },
  methods: {
    closeImageOverlay() {
      this.$emit("close-overlay");
    },
    prvImg() {
      this.$emit("prvImg");
    },
    nxtImg() {
      this.$emit("nxtImg");
    },
    handleEscapeKey(event) {
      if (event.key === "Escape") this.$emit("close-overlay");
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleEscapeKey);
    console.log("ImageOverlay mounted with date:", this.selectedDate);
  },
  unmounted() {
    document.removeEventListener("keydown", this.handleEscapeKey);
  },
};
</script>
