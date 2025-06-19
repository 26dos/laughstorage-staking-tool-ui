<template>
  <q-card :class="`main-card record-card list  ${!item.active ? 'opacity-50' : ''}`">
    <template v-if="item.active">
      <q-card-section class="px-3 text-white font-mono justify-between flex items-center"
        :class="{ 'bg-positive': !isEnded(item.startTime, item.lockTime), 'bg-primary': isEnded(item.startTime, item.lockTime) }">
        <div class="flex items-center space-x-2">
          <q-icon name="lock_clock" size="24px" />
          <template v-if="isEnded(item.startTime, item.lockTime)">
            <h5 class="text-lg font-bold">Can unlock</h5>
          </template>
          <template v-else>
            <EndCountdown :startTime="item.startTime" :lockTime="item.lockTime" />
          </template>
        </div>
        <write-contract :alert-err="true">
          <template #write-main="{ props }">
            <q-btn :disable="!isEnded(item.startTime, item.lockTime)" :loading="props.loading" icon="lock_open"
              padding="5px 10px" outline dense label="unlock" @click="unlock(props, item)"></q-btn>
          </template>
        </write-contract>
      </q-card-section>
    </template>
    <template v-else>
      <q-card-section class="bg-zinc-400 px-3 text-white font-mono justify-between flex items-center">
        <div class="flex items-center space-x-2">
          <q-icon name="lock_open" size="24px"></q-icon>
          <h5 class="text-lg font-bold">Stake unlocked</h5>
        </div>
      </q-card-section>
    </template>
    <q-list separator>
      <q-item>
        <q-item-section side>
          Stake ID:
        </q-item-section>
        <q-item-section>
          <q-item-label class="font-bold">
            {{ item.stakeId }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          Amount:
        </q-item-section>
        <q-item-section>
          <q-item-label class="flex items-center space-x-2">
            <span class="font-bold">{{ weiToEther(item.amount) }}</span>
            <q-img height="20px" width="20px" src="tokens/filecoin.png"></q-img>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          DataCap Quotas:
        </q-item-section>
        <q-item-section>
          <q-item-label class="flex items-center space-x-2">
            <span class="font-bold">{{ calculateDcAmount(item.amount) }}</span>
            <span>TB</span>
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          Start Time:
        </q-item-section>
        <q-item-section>
          <q-item-label class="font-bold">
            {{ formatDate(item.startTime) }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          Lock days:
        </q-item-section>
        <q-item-section>
          <q-item-label class="font-bold">
            {{ toDays(item.lockTime) }} Days
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section side>
          End Time:
        </q-item-section>
        <q-item-section>
          <q-item-label class="font-bold">
            {{ getEndTime(item.startTime, item.lockTime) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>
<script>
import { defineComponent } from 'vue';
import { weiToEther, formatDate, toDays } from 'src/dist/tools';
import dayjs from 'dayjs';
import { stakingContractAddress, stakingContractAbi } from 'src/dist/staking-abi';
import EndCountdown from 'src/components/EndCountdown.vue';
import WriteContract from 'src/components/WriteContract.vue';
export default defineComponent({
  name: "PledgeList",
  props: {
    item: {
      type: Object
    }
  },
  components: {
    EndCountdown,
    WriteContract,
  },
  methods: {
    toDays,
    weiToEther,
    formatDate,
    dayjs,
    getEndTime: function (startTime, lockTime) {
      const endTime = startTime + lockTime;
      return formatDate(endTime);
    },
    isEnded: function (startTime, lockTime) {
      const endTime = (Number(startTime) + Number(lockTime)) * 1000;
      const now = Date.now();
      return endTime < now;
    },
    unlock: function (props, item) {
      props.write({
        address: stakingContractAddress,
        abi: stakingContractAbi,
        action: 'unlock',
        args: [item.stakeId],
      })
    },
    calculateDcAmount(amount) {
      const tokenAmountNumber = weiToEther(amount);
      return tokenAmountNumber * 10;
    }
  }
})
</script>