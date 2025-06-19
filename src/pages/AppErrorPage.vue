<template>
  <q-page>
    <q-card>
      <q-card-section>

      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppErrorPage',
  data() {
    return {
      error: {
        title: 'Error',
        message: 'An error occurred',
      },
    };
  },
});
</script>