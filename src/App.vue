<template>
  <div id="app" class="font-sans antialiased">
    <LandingPage @form-submitted="handleFormSubmission" v-if="currentView === 'landing'" />
    
    <ImageGrid 
      v-if="currentView === 'month'" 
      :month="selectedMonth" 
      :year="selectedYear" 
      @home="goToLandingPage" 
      @navigate="navigateToMonth" 
    />
    
    <DayAcrossYears 
       v-if="currentView === 'dayAcrossYears'" 
       :month="selectedMonth" 
       :day="selectedDay" 
       @home="goToLandingPage"
       @navigate="navigateToDay"
     />
     
   </div>
</template>

<script>
import LandingPage from "@/components/LandingPage";
import ImageGrid from "@/components/ImageGrid";
import DayAcrossYears from "@/components/DayAcrossYears";

export default {
   data() {
     return {
       currentView: 'landing',
       selectedMonth: null,
       selectedYear: null,
       selectedDay: null,
     };
   },
   methods: {
     handleFormSubmission(data) {
       console.log('Form submitted with data:', data);
       if (data.type === 'month') {
         this.selectedMonth = Number(data.month);
         this.selectedYear = Number(data.year);
         this.currentView = 'month';
       } else if (data.type === 'dayAcrossYears') {
         this.selectedMonth = Number(data.month);
         this.selectedDay = Number(data.day);
         this.currentView = 'dayAcrossYears';
       }
     },
     goToLandingPage() {
       console.log("Navigating to landing page");
       this.currentView = 'landing';
     },
     navigateToMonth({ month, year }) {
       console.log("Navigating to month:", month, "year:", year);
       this.selectedMonth = Number(month);
       this.selectedYear = Number(year);
     },
     navigateToDay({ day, month }) {
       console.log("Navigating to day:", day, "month:", month);
       this.selectedDay = Number(day);
       this.selectedMonth = Number(month);
     },
   },
   components: {
     LandingPage,
     ImageGrid,
     DayAcrossYears,
   },
};
</script>

