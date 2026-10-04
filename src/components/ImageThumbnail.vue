<template>
  <div class="max-w-full max-h-[200px] overflow-hidden border border-black relative cursor-pointer" @click="handleClick">
    <img :src="imageUrl" @load="onImageLoad" alt="Thumbnail" class="w-full h-auto object-contain" />
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  methods: {
    onImageLoad() {
      //console.log(`Image displayed`);
    },
    handleClick() {
      //console.log("Thumbnail clicked:", this.imageUrl);
    },
  },
};
</script>
