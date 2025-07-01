<template>
  <ConnectWallet :size="size">
    <template #connected>
      <div class="relative" :class="boxClass">
        <slot name="write-main" :props="{
          write: writeContract,
          writeBefore: writeBefore,
          writeAfter: writeAfter,
          writeError: writeError,
          writeSuccess: writeSuccess,
          loading: loading,
        }"></slot>
        <p v-if="error && !alertErr" class="text-negative text-center text-xs mt-2">{{ error }}</p>
        <q-inner-loading color="primary" :showing="loading">
          <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
        </q-inner-loading>
      </div>
    </template>
  </ConnectWallet>

  <q-dialog persistent v-model="isConfirming">
    <q-card class="min-w-[400px]">
      <q-card-section class="text-center space-y-4">
        <div class="text-warning space-y-2" v-if="!isConfirmed">
          <q-spinner-pie class="mx-auto" color="warning" size="5em" />
          <p id="waiting_tips" class="text-lg font-serif font-bold"></p>
        </div>
        <div class="text-positive space-y-2" v-if="isConfirmed">
          <q-icon name="check_circle" color="positive" size="5em" />
          <p class="text-positive text-lg font-serif font-bold">Transaction confirmed!</p>
        </div>
      </q-card-section>
      <q-card-section align="center" class="space-x-3">
        <q-btn v-if="hash" padding="5px 15px" dense :label="`View on tx: ${handleAddress(hash, 3, 4)}`" unelevated
          color="blue" icon="open_in_new" @click="openTx"></q-btn>
        <q-btn v-if="isConfirmed" padding="5px 15px" icon="close" label="Close" outline dense unelevated
          color="negative" @click="closeWriteContract"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from 'vue'
import ConnectWallet from 'src/components/ConnectWallet.vue'
import { useAppKitProvider } from '@reown/appkit/vue'
import { BrowserProvider, Contract } from 'ethers';
import { handleEthErr, handleAddress, customAlert } from 'src/dist/tools';
import { viewLink } from 'src/dist/const-data';

export default defineComponent({
  name: 'WriteContract',
  components: {
    ConnectWallet,
  },
  setup() {
    return {}
  },
  props: {
    size: {
      type: String,
      default: 'md'
    },
    alertErr: {
      type: Boolean,
      default: false
    },
    boxClass: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      isConfirming: false,
      isConfirmed: false,
      hash: null,
      error: null,
      loading: false,
    }
  },
  methods: {
    handleAddress,
    writeContract: async function ({ address, abi, value, action, args, gasLimit, successCallback }) {
      this.writeBefore()
      try {
        this.writeLoading(true)
        const { walletProvider } = useAppKitProvider('eip155');
        const etherProvider = new BrowserProvider(walletProvider);
        const signer = await etherProvider.getSigner();
        const contract = new Contract(address, abi, signer);
        console.log(value, args)
        let tx;
        if (value !== undefined) {
          let set = {
            value: value,
          };
          if (gasLimit !== undefined) {
            set.gasLimit = gasLimit;
          }
          tx = await contract[action](...args, set);
        } else {
          tx = await contract[action](...args);
        }
        this.hash = tx.hash;
        this.startWaiting();
        await etherProvider.waitForTransaction(tx.hash, 1);
        this.writeSuccess(successCallback)
      } catch (error) {
        let errMsg = await handleEthErr(error);
        const vmErrorMatch = /vm error=\[Error\((.*?)\)\]/.exec(errMsg)
        if (vmErrorMatch && vmErrorMatch[1]) {
          errMsg = vmErrorMatch[1]
        }
        if (this.alertErr) {
          customAlert.error(errMsg);
        }
        this.error = errMsg;
      } finally {
        this.writeLoading(false)
        this.writeAfter()
      }
    },
    writeLoading: function (isLoading) {
      this.loading = isLoading;
    },
    writeBefore: function () {
      this.error = null
    },
    writeAfter: function () { },
    writeError: function () { },
    closeWriteContract: function () {
      this.isConfirming = false;
      this.isConfirmed = false;
      this.hash = null;
      this.error = null;
      this.loading = false;
    },
    startWaiting: function () {
      this.isConfirming = true;
      this.$nextTick(() => {
        const waitingTips = 'Waiting for confirmation.....';
        const waitingTipsElement = document.getElementById('waiting_tips');
        if (waitingTipsElement) {
          let index = 0;
          waitingTipsElement.innerHTML = '';
          const print = () => {
            if (index < waitingTips.length) {
              waitingTipsElement.innerHTML += waitingTips.charAt(index);
              index++;
              setTimeout(print, 100);
            } else {
              setTimeout(() => {
                waitingTipsElement.innerHTML = '';
                index = 0;
                print();
              }, 1000);
            }
          };
          print();
        }
      })
    },
    writeSuccess: function (successCallback) {
      this.isConfirmed = true;
      if (successCallback) {
        successCallback();
      }
    },
    openTx: function () {
      window.open(`${viewLink.tx}/${this.hash}`, '_blank');
    }
  }
})
</script>