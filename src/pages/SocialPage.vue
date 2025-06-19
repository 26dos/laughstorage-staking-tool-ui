<template>
  <q-page class="flex flex-center">
    <q-card class="main-card">
      <div class="bg-primary p-5 flex flex-col items-center justify-center">
        <q-img src="logo.png" width="200px" fit="contain" height="100px"></q-img>
      </div>
      <q-card-section class="!pb-0">
        <h1 class="text-2xl font-bold text-primary text-center mb-5">Laughstorage Staking Tool</h1>
      </q-card-section>
      <q-list>
        <q-item clickable href="https://github.com/26dos" target="_blank">
          <q-item-section avatar class="!min-w-[auto]">
            <q-icon name="fa-brands fa-github"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-lg font-bold">Github</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon size="1.5em" name="arrow_forward_ios" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SocialPage',
});
</script>