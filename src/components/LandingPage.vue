<template>
  <div class="max-w-[900px] mx-auto p-5">
    <div class="bg-white rounded-xl shadow-md p-10 mt-10">
      <h1 class="text-center mb-8 text-gray-800 text-4xl">EKSKOG 365</h1>
      <div class="flex gap-10 flex-col md:flex-row">
        <div class="flex-1 p-5">
          <RandomPicture @pictureFetched="updateRandomImage" />
        </div>
        <div class="flex-1 p-5">
          <form @submit.prevent class="form">
            <div class="mb-4">
              <label for="month" class="block mb-1 font-bold text-gray-600">Select Month:</label>
              <select v-model="selectedMonth" id="month" required
                class="w-full p-2 border border-gray-300 rounded text-base appearance-none bg-no-repeat bg-right pr-8"
                style="background-image: url('data:image/svg+xml,%3csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3cpath d='M0 0h24v24H0z' fill='none'/%3e%3c/svg%3e'); background-position-x: 100%; background-position-y: 50%;">
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
            </div>
            <div class="mb-4">
              <label for="day" class="block mb-1 font-bold text-gray-600">Enter Day (optional for month):</label>
              <input type="text" v-model="selectedDay" id="day" placeholder="Day"
                class="w-full p-2 border border-gray-300 rounded text-base" />
            </div>
            <div class="mb-4">
              <label for="year" class="block mb-1 font-bold text-gray-600">Select Year (From 2010):</label>
              <input type="number" v-model="selectedYear" id="year" placeholder="Enter Year" min="2010" :max="currentYear" class="w-full p-2 border border-gray-300 rounded text-base" />
            </div>
            <div class="flex flex-col gap-2.5 mt-5">
              <button type="button" @click="submitForm('month')"
                class="px-5 py-2.5 border-none rounded text-base cursor-pointer bg-green-600 text-white transition-colors duration-300 hover:bg-green-700 active:bg-green-700">
                Browse Month
              </button>
              <button type="button" @click="submitForm('dayAcrossYears')" :disabled="!selectedDay"
                class="px-5 py-2.5 border-none rounded text-base cursor-pointer bg-green-600 text-white transition-colors duration-300 hover:bg-green-700 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Browse Day Across Years
              </button>
            </div>
            <div v-if="validationMessage" class="mt-5 p-2.5 bg-green-50 border border-green-200 rounded text-green-700 text-center">
              {{ validationMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import RandomPicture from "@/components/RandomPicture";

export default {
  components: {
    RandomPicture,
  },
  data() {
    return {
      selectedMonth: "",
      selectedDay: "",
      selectedYear: "",
      currentYear: new Date().getFullYear(),
      validationMessage: "",
      months: [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
      ],
    };
  },
  methods: {
    updateRandomImage({ imageUrl, formattedDate }) {
      this.randomImageUrl = imageUrl;
      this.randomImageDate = formattedDate;
    },
    submitForm(viewType) {
      console.log("submitForm called with viewType:", viewType);
      console.log("Current form data:", {
        month: this.selectedMonth,
        day: this.selectedDay,
        year: this.selectedYear
      });

      if (this.validateInputs(viewType)) {
        console.log("Inputs validated successfully");
        if (viewType === 'month') {
          this.$emit("form-submitted", {
            type: 'month',
            month: this.selectedMonth,
            year: this.selectedYear,
          });
        } else {
          this.$emit("form-submitted", {
            type: 'dayAcrossYears',
            month: this.selectedMonth,
            day: this.selectedDay,
          });
        }
      } else {
        console.log("Input validation failed");
        
        if (viewType === 'month') {
          alert("Please enter valid month and year.");
        } else {
          alert("Please enter valid month and day.");
        }
      }
    },
    validateInputs(viewType) {
      const enteredMonth = parseInt(this.selectedMonth, 10);
      
      if (isNaN(enteredMonth) || enteredMonth < 1 || enteredMonth > 12) {
        return false;
      }

      if (viewType === 'month') {
        const enteredYear = parseInt(this.selectedYear, 10);
        return !isNaN(enteredYear) && enteredYear >= 2010 && enteredYear <= this.currentYear;
      } else if (viewType === 'dayAcrossYears') {
        const enteredDay = parseInt(this.selectedDay, 10);
        const daysInMonth = new Date(this.currentYear, enteredMonth, 0).getDate();
        
        return !isNaN(enteredDay) && enteredDay >= 1 && enteredDay <= daysInMonth;
      }

      return false;
    },
  },
};
</script>