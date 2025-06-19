<template>
  <q-dialog v-model="dialog">
    <q-card class="main-card stake-card">
      <div class="bg-primary p-5 flex flex-col items-center justify-center">
        <q-img src="logo.png" width="200px" fit="contain" height="100px"></q-img>
      </div>
      <q-card-section>
        <h1 class="text-2xl font-bold text-primary text-center mb-5">Stake FIL to obtain DC</h1>
        <q-form>
          <q-list separator>
            <q-item>
              <q-item-section side>
                <q-item-label>
                  Approved DC quota
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-bold">
                  {{ proposal.data_cap }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label>
                  File coin Amount
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-bold">
                  {{ formatEther(proposal.staking_amount) }} FIL
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label>
                  Pledge Type
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-bold">
                  {{ proposal.stake_days === 20 ? 'Public datasets' : 'Private datasets' }}
                  ({{ proposal.stake_days }} Days)
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="mt-10">
            <WriteContract size="lg">
              <template #write-main="{ props }">
                <q-btn rounded no-caps size="lg" push class="w-full"
                  :label="`Stake ${formatEther(proposal.staking_amount)} FIL`" color="primary"
                  @click="write(props)"></q-btn>
              </template>
            </WriteContract>
          </div>
          <p v-if="!emptyString(error)" class="text-red-500 text-center mt-2">{{ error }}</p>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { emptyString, toDataCapTB } from 'src/dist/tools';
import { defineComponent } from 'vue';
import WriteContract from 'src/components/WriteContract.vue'
import { stakingContractAddress, stakingContractAbi } from 'src/dist/staking-abi';
import { parseEther, formatEther } from 'ethers';
export default defineComponent({
  name: 'StakingCard',
  components: {
    WriteContract,
  },
  data: function () {
    return {
      dcAmount: undefined,
      error: undefined,
      dialog: false,

    }
  },
  props: {
    proposal: {
      type: Object,
      default: null,
    },
  },
  methods: {
    emptyString,
    formatEther,
    parseEther,
    openStakingDialog() {
      this.dialog = true;
    },
    write: function (props) {
      const dcAmountTb = toDataCapTB(this.proposal.data_cap);
      const stakeType = this.proposal.stake_days == 20 ? 0 : 1;
      const tokenAmountWei = this.proposal.staking_amount;
      console.log(dcAmountTb, stakeType, tokenAmountWei);
      props.write({
        address: stakingContractAddress,
        abi: stakingContractAbi,
        value: tokenAmountWei,
        action: 'stake',
        args: [dcAmountTb, stakeType],
      })
    },
  }
}
)
</script>
