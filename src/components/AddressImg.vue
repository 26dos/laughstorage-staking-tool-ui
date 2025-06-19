<template>
  <q-img :src="imgUrl" />
</template>
<script>
import { defineComponent, ref } from 'vue';
import blockies from 'ethereum-blockies';
import { emptyString } from 'src/dist/tools';
export default defineComponent({
  name: 'AddressImg',
  props: {
    address: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      imgUrl: ref(''),
    }
  },
  watch: {
    address: {
      handler() {
        this.getImgUrl();
      },
      immediate: true,
    }
  },
  methods: {
    getImgUrl() {
      if (emptyString(this.address)) return;
      this.imgUrl = blockies.create({
        seed: this.address.toLowerCase(),
        size: 8,
        scale: 10,
        color: '#42b983',
        bgcolor: '#ffffff',
        spotcolor: '#42b983'
      }).toDataURL();
    }
  }
})
</script>