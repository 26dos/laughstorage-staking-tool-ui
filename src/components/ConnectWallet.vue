<template>
  <template v-if="isShowElement">
    <q-btn :outline="outline" :loading="loading" v-if="!accountData.isConnected" icon="wallet"
      :rounded="btnType === 'connect'" :class="isWFull ? 'w-full' : ''" push color="negative" @click="openConnect"
      label="Connect Wallet" />
    <template v-else>
      <q-btn :outline="outline" :rounded="rounded" :class="`account-btn ${isWFull ? 'w-full' : ''}`" :loading="loading"
        :icon="`img:${avatar}`" icon-right="arrow_drop_down" v-if="btnType === 'account'" unelevated color="primary"
        @click="openAccount" :label="handleAddress(accountData.address)" />
      <slot name="connected"></slot>
    </template>
  </template>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { useAppKitAccount, useAppKit, useAppKitState, useAppKitProvider } from '@reown/appkit/vue'
import { handleAddress, emptyString, customToast, customAlert } from 'src/dist/tools';
import blockies from 'ethereum-blockies';
import { useDAppStore } from 'src/stores/d-app';
import { authApi, userAppToken } from 'src/dist/api';
import { SiweMessage } from 'siwe';
import { BrowserProvider } from 'ethers';

export default defineComponent({
  name: 'ConnectWallet',
  props: {
    btnType: {
      type: String,
      default: 'connect'
    },
    isWFull: {
      type: Boolean,
      default: true
    },
    isShowElement: {
      type: Boolean,
      default: true
    },
    outline: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const accountData = useAppKitAccount()
    const { open } = useAppKit();
    const appKitState = useAppKitState();
    const dAppStore = useDAppStore();
    return {
      accountData: ref(accountData),
      open,
      appKitState,
      dAppStore,
    }
  },
  data: function () {
    return {
      loading: false,
      avatar: ''
    }
  },
  watch: {
    appKitState: {
      handler: function (v) {
        this.loading = v.open;
      },
      deep: true,
    },
    accountData: {
      handler: function (val) {
        console.log(val.status)
        if (val.status === "connecting") return;
        if (emptyString(val.address)) {
          this.dAppStore.clearUserAddress();
          return;
        }
        this.login();
        this.getAvatar();
      },
      deep: true,
    }
  },
  methods: {
    handleAddress,
    openConnect: function () {
      this.open({
        view: 'Connect'
      })
    },
    openAccount: function () {
      this.open({
        view: 'Account'
      })
    },
    login: async function () {
      if (userAppToken.has()) {
        return;
      }
      try {
        this.dAppStore.setFullLoading(true, 'Please sign in with your wallet...')
        const res = await authApi.nonce()
        const { walletProvider } = useAppKitProvider('eip155');
        const etherProvider = new BrowserProvider(walletProvider);
        const signer = await etherProvider.getSigner();
        const nonce = res.data;
        const message = new SiweMessage({
          domain: window.location.host,
          address: signer.address,
          statement: 'Sign in with your wallet to the app.',
          uri: window.location.origin,
          version: '1',
          nonce: nonce,
          chainId: Number(walletProvider.chainId),
        })

        const messageString = message.prepareMessage()
        const signature = await signer.signMessage(messageString);
        this.dAppStore.setFullLoading(true, "Logging in, please wait...")
        const loginRes = await authApi.login({
          address: signer.address,
          signature: signature,
          nonce: nonce,
          message: messageString,
        })
        userAppToken.save(loginRes.data)
        this.dAppStore.getUserInfo()
        customToast('success', 'Signed in successfully')
        this.dAppStore.loginCallback()
      } catch (error) {
        customAlert.error(error.message)
      } finally {
        this.dAppStore.setFullLoading(false, '')
      }
    },
    getAvatar: function () {
      this.dAppStore.setUserAddress(this.accountData.address);
      const icon = blockies.create({
        seed: this.accountData.address.toLowerCase(),
        size: 8,
        scale: 10,
        color: '#42b983',  // 添加主题色
        bgcolor: '#ffffff', // 白色背景
        spotcolor: '#42b983' // 点缀色
      });
      this.avatar = icon.toDataURL();
    }
  }
})
</script>