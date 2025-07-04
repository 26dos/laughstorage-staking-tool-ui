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
                <q-item-label class="w-[130px]">
                  Approved DC quota
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-bold">
                  {{ plan.data_cap }} TiB
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label class="w-[130px]">
                  File coin Amount
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-bold">
                  {{ plan.staking_amount }} FIL
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label class="w-[130px]">
                  Pledge Type
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="font-bold">
                  {{constStakeDaysOptions.find(option => option.value === plan.staking_days).label}}
                  ({{ plan.staking_days }} Days)
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <div class="mt-5">
            <div class="flex items-center justify-between space-x-3">
              <q-btn color="red" icon="close" outline round v-close-popup />
              <WriteContract size="lg" box-class="flex-1">
                <template #write-main="{ props }">
                  <q-btn class="w-full" rounded no-caps size="lg" push :label="`Stake ${plan.staking_amount} FIL`"
                    color="primary" @click="write(props)"></q-btn>
                </template>
              </WriteContract>
            </div>
          </div>
          <p v-if="!emptyString(error)" class="text-red-500 text-center mt-2">{{ error }}</p>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { emptyString } from 'src/dist/tools';
import { defineComponent } from 'vue';
import WriteContract from 'src/components/WriteContract.vue'
import { stakingContractAddress, stakingContractAbi } from 'src/dist/staking-abi';
import { parseEther, formatEther } from 'ethers';
import { constStakeDaysOptions } from 'src/dist/const-data';
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
      plan: null,
      constStakeDaysOptions
    }
  },
  props: {
    proposal: {
      type: Object,
      default: null,
    },
    reloadData: {
      type: Function,
      default: null,
    }
  },
  methods: {
    emptyString,
    formatEther,
    parseEther,
    openStakingDialog(plan) {
      this.plan = plan;
      this.dialog = true;
    },
    write: function (props) {
      const { data_cap, staking_amount, staking_days } = this.plan;
      const dcAmountTb = data_cap;
      const stakeType = staking_days == 20 ? 0 : 1;
      const tokenAmountWei = parseEther(staking_amount);
      console.log(dcAmountTb, stakeType, tokenAmountWei);
      props.write({
        address: stakingContractAddress,
        abi: stakingContractAbi,
        value: tokenAmountWei,
        action: 'stake',
        args: [dcAmountTb, stakeType],
        successCallback: () => {
          this.dialog = false;
          this.reloadData();
        }
      })
    },
  }
}
)
</script>
