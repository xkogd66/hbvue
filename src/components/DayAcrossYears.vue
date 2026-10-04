<template>
    <div class="day-across-years p-5">
        <div class="flex items-center justify-between mb-5">
            <button class="bg-green-500 text-white border-none px-4 py-2.5 text-center text-base cursor-pointer rounded hover:bg-green-600" @click="goHome">
                <i class="fas fa-home"></i>
            </button>
            <div class="flex flex-col items-center">
                <div class="text-2xl font-bold">
                    <span class="cursor-pointer px-2.5" @click="previousDay">&larr;</span>
                    {{ day }} {{ getMonthName(month) }}
                    <span class="cursor-pointer px-2.5" @click="nextDay">&rarr;</span>
                </div>
                <div class="text-center mt-1 text-sm text-gray-600">Click on the thumbnails for a full-size image</div>
            </div>
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-5">
            <div v-for="(image, index) in images" :key="index" class="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div class="w-full h-0 pb-[100%] relative cursor-pointer" @click="openImageOverlay(index)">
                    <img :src="image.url" :alt="`Image for ${image.year}`" class="absolute w-full h-full object-cover" />
                </div>
                <div class="p-2.5 text-center bg-gray-100 text-sm">{{ image.year }}</div>
            </div>
        </div>
        <ImageOverlay :showOverlay="showOverlay" :selectedImage="selectedImage" :selectedDate="selectedDate"
            @close-overlay="closeOverlay" @prvImg="prvImg" @nxtImg="nxtImg" />
    </div>
</template>


<script>
import ImageOverlay from "@/components/ImageOverlay";

export default {
    name: 'DayAcrossYears',
    components: {
        ImageOverlay
    },
    props: {
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            images: [],
            showOverlay: false,
            selectedImage: "",
            selectedDate: "",
            selectedIndex: 0,
        };
    },
    methods: {
        getMonthName(monthNumber) {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            return monthNames[monthNumber - 1];
        },
        goHome() {
            this.$emit('home');
        },
        previousDay() {
            let newDay = this.day - 1;
            let newMonth = this.month;
            if (newDay < 1) {
                newMonth = newMonth - 1;
                if (newMonth < 1) newMonth = 12;
                newDay = new Date(new Date().getFullYear(), newMonth, 0).getDate();
            }
            this.$emit('navigate', { day: newDay, month: newMonth });
        },
        nextDay() {
            let newDay = this.day + 1;
            let newMonth = this.month;
            const daysInMonth = new Date(new Date().getFullYear(), this.month, 0).getDate();
            if (newDay > daysInMonth) {
                newDay = 1;
                newMonth = newMonth + 1;
                if (newMonth > 12) newMonth = 1;
            }
            this.$emit('navigate', { day: newDay, month: newMonth });
        },
        fetchImages() {
            const currentYear = new Date().getFullYear();
            const startYear = 2010;

            this.images = [];
            for (let year = startYear; year <= currentYear; year++) {
                const formattedMonth = this.month.toString().padStart(2, '0');
                const formattedDay = this.day.toString().padStart(2, '0');
                const imageUrl = `https://objects.ekskog.net/blotpix/${year}/${formattedMonth}/${formattedDay}.jpeg`;
                this.images.push({ url: imageUrl, year: year });
            }
        },
        openImageOverlay(index) {
            this.selectedIndex = index;
            this.selectedImage = this.images[index].url;
            this.selectedDate = `${this.day} ${this.getMonthName(this.month)} ${this.images[index].year}`;
            this.showOverlay = true;
        },
        closeOverlay() {
            this.showOverlay = false;
            this.selectedImage = "";
            this.selectedDate = "";
            this.selectedIndex = 0;
        },
        prvImg() {
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
                this.selectedImage = this.images[this.selectedIndex].url;
                this.selectedDate = `${this.day} ${this.getMonthName(this.month)} ${this.images[this.selectedIndex].year}`;
            }
        },
        nxtImg() {
            if (this.selectedIndex < this.images.length - 1) {
                this.selectedIndex++;
                this.selectedImage = this.images[this.selectedIndex].url;
                this.selectedDate = `${this.day} ${this.getMonthName(this.month)} ${this.images[this.selectedIndex].year}`;
            }
        },
    },
    mounted() {
        console.log('Fetching images for Month:', this.month, 'and Day:', this.day);
        this.fetchImages();
    },
    watch: {
        day() {
            this.fetchImages();
        },
        month() {
            this.fetchImages();
        },
    },
};
</script>