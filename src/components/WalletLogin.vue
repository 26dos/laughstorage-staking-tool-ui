<template>
  <q-card class="main-card" v-if="emptyString(dAppStore.userAddress) || !dAppStore.isLogin">
    <q-card-section>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-5">
          <div class="border-solid border-2 border-primary rounded-full p-2">
            <q-icon name="lock" size="3rem" color="primary" />
          </div>
          <div class="space-y-3">
            <h3 class="text-2xl font-bold">Wallet Authentication</h3>
            <p class="text-sm text-gray-500" v-if="emptyString(dAppStore.userAddress)">
              You need to connect your wallet to continue!
            </p>
            <p class="text-sm text-gray-500" v-else>
              You need to login to continue!
            </p>
          </div>
        </div>
        <div>
          <template v-if="emptyString(dAppStore.userAddress)">
            <ConnectWallet :is-w-full="false" btn-type="connect" />
          </template>
          <template v-else>
            <q-btn label="Login using wallet" color="primary" unelevated rounded @click="loginUsingWallet" />
          </template>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <slot name="after" v-else></slot>
</template>
<script>
import { defineComponent } from 'vue';
import { useDAppStore } from 'src/stores/d-app';
import { emptyString } from 'src/dist/tools';
import ConnectWallet from 'src/components/ConnectWallet.vue';
export default defineComponent({
  name: 'WalletLogin',
  setup: function () {
    const dAppStore = useDAppStore()
    return {
      dAppStore
    }
  },
  components: {
    ConnectWallet
  },
  methods: {
    emptyString,
    loginUsingWallet: function () {
      this.dAppStore.setOpenLogin(true, () => { })
    }
  }
})
</script>