<template>
    <div class="max-w-[1200px] mx-auto p-5">
        <div class="flex items-center justify-between mb-5">
            <button class="bg-white text-black border-none px-4 py-2.5 cursor-pointer text-base" @click="goHome">
                <i class="fas fa-home"></i>
            </button>
            <div class="flex flex-col items-center">
                <div class="text-2xl font-bold">
                    <span class="cursor-pointer px-2.5" @click="previous">&larr;</span>
                    {{ getMonthName(month) }} {{ year }}
                    <span class="cursor-pointer px-2.5" @click="next">&rarr;</span>
                </div>
                <div class="text-center mt-1 text-sm text-gray-600">Click on the thumbnails for a full-size image</div>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
            <ImageThumbnail v-for="(imageUrl, index) in imageUrls" :key="index" :imageUrl="imageUrl"
                @click="openImageOverlay(index)" />
            <div v-if="imageUrls.length === 0" class="text-center p-5 text-base text-gray-600">Fetching images...</div>
        </div>
        <ImageOverlay v-if="showOverlay" :showOverlay="showOverlay" :selectedImage="selectedImage" :selectedDate="selectedDate"
            @close-overlay="closeOverlay" @prvImg="prvImg" @nxtImg="nxtImg" />
    </div>
</template>


<script>
/* eslint-disable no-unused-vars */
import ImageThumbnail from "@/components/ImageThumbnail";
import ImageOverlay from "@/components/ImageOverlay";
import axios from "axios";

export default {
    props: {
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            imageUrls: [],
            showOverlay: false,
            selectedImage: "",
            selectedIndex: 0, // Track the currently selected image index
        };
    },
    components: {
        ImageThumbnail,
        ImageOverlay
    },
    mounted() {
        this.fetchImages();
    },
    watch: {
        month: 'fetchImages',
        year: 'fetchImages',
    },
    methods: {
        async fetchImages() {
            const lastDay = new Date(this.year, this.month, 0).getDate();

            try {
                const newImageUrls = await Promise.all(
                    Array.from({ length: lastDay }, async (_, index) => {
                        const day = index + 1;
                        const formattedDay = day < 10 ? `0${day}` : `${day}`;
                        const formattedMonth = this.month < 10 ? `0${this.month}` : `${this.month}`;
                        const imageUrl = `https://objects.ekskog.net/blotpix/${this.year}/${formattedMonth}/${formattedDay}.jpeg`;
                        console.log('Fetching image from URL:', imageUrl); // Log URL

                        try {
                            const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
                            const base64 = btoa(
                                new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                            );
                            const dataUrl = `data:image/jpeg;base64,${base64}`;
                            console.log('Fetched image for day', day, dataUrl); // Log successful fetch
                            return dataUrl;
                        } catch (error) {
                            console.error(`Error fetching image for day ${day}: ${imageUrl}`, error);
                            return null;
                        }
                    })
                );

                // Filter out any null values from failed requests
                this.imageUrls = newImageUrls.filter(url => url !== null);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        },
        getMonthName(month) {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return monthNames[month - 1] || '';
        },
        goHome() {
            this.$emit('home');
        },
        previous() {
            const previousMonth = this.month === 1 ? 12 : this.month - 1;
            const previousYear = this.month === 1 ? this.year - 1 : this.year;

            console.log('previous clicked: ' + previousMonth);
            console.log('Year:', previousYear);
            this.$emit('navigate', { month: previousMonth, year: previousYear });
        },
        next() {
            const nextMonth = this.month === 12 ? 1 : this.month + 1;
            const nextYear = this.month === 12 ? this.year + 1 : this.year;

            console.log('next clicked: ' + nextMonth);
            console.log('Year:', nextYear);
            this.$emit('navigate', { month: nextMonth, year: nextYear });
        },
        openImageOverlay(index) {
            console.log('Opening image overlay for index', index);
            this.selectedIndex = index;
            this.selectedImage = this.imageUrls[index];
            this.showOverlay = true;
        },
        closeOverlay() {
            this.showOverlay = false;
            this.selectedImage = "";
            this.selectedIndex = 0;
        },
        prvImg() {
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
                this.selectedImage = this.imageUrls[this.selectedIndex];
            } else {
                alert("No previous day in the current month.");
            }
        },
        nxtImg() {
            if (this.selectedIndex < this.imageUrls.length - 1) {
                this.selectedIndex++;
                this.selectedImage = this.imageUrls[this.selectedIndex];
            } else {
                alert("No next day in the current month.");
            }
        },
    },
};
</script>