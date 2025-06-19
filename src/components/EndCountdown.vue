<template>
  <ul class="flex items-center font-bold text-lg">
    <li class="number">
      {{ days }}
    </li>
    <li class="ml-1 mr-2">
      D
    </li>
    <li class="number ">
      {{ hours }}
    </li>
    <li class="ml-1 mr-2">
      H
    </li>
    <li class="number ">
      {{ minutes }}
    </li>
    <li class="ml-1 mr-2">
      M
    </li>
    <li class="number">
      {{ seconds }}
    </li>
    <li class="ml-1 mr-2">
      S
    </li>
  </ul>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'EndCountdown',
  props: {
    startTime: {
      type: BigInt,
      required: true,
    },
    lockTime: {
      type: BigInt,
      required: true,
    }
  },
  created: function () {
    this.startCountdown();
  },
  data: function () {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      interval: null,
    }
  },
  methods: {
    getEndTime: function () {
      const endTime = (Number(this.startTime) + Number(this.lockTime)) * 1000;
      const now = Date.now();
      const diff = endTime - now;
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    },
    startCountdown: function () {
      this.getEndTime();
      this.interval = setInterval(() => {
        this.getEndTime();
      }, 1000);
    },
  },
});
</script>