<template>
  <q-timeline v-if="proposal">
    <q-timeline-entry title="Created a proposal" :subtitle="formatDateTime(proposal.created_at)" icon="add_circle"
      color="positive" />
    <q-timeline-entry :title="proposal.kyc_status" subtitle="KYC Verification Status" icon="badge"
      :color="proposal.kyc_status === 'verified' ? 'positive' : 'primary'" />
    <q-timeline-entry subtitle="Status" :title="status.label" :icon="status.icon" :color="status.color">
      <template v-if="proposal.status === 'reject'">
        <p v-html="proposal.reason_rejection"></p>
      </template>
    </q-timeline-entry>
    <template v-if="proposal.plans && proposal.plans.length > 0">
      <q-timeline-entry v-for="(plan, index) in proposal.plans" :key="index" :title="`Staking Plan ${index + 1}`"
        :subtitle="formatDateTime(plan.created_at)"
        :icon="plan.status === 'success' ? 'check_circle' : 'pending_actions'"
        :color="plan.status === 'success' ? 'positive' : 'grey'">
        <ol class="list-decimal list-inside">
          <li>
            Stake {{ plan.staking_amount }} tokens and get {{ plan.data_cap }} tib DataCap
          </li>
          <li>
            <template v-if="plan.status === 'pending'">
              not staked yet
            </template>
            <template v-else>
              staked on {{ formatDateTime(plan.staking_time, 'MMMM D, YYYY h:mm A') }}
            </template>
          </li>
          <li>
            <template v-if="plan.status === 'waiting_allocation'">
              DataCap allocation in progress...
            </template>
            <template v-if="plan.status === 'success'">
              DataCap allocated on {{ formatDateTime(plan.allocate_time, 'MMMM D, YYYY h:mm A') }}
            </template>
            <a class="text-blue-500 underline" v-if="plan.status === 'success'"
              :href="`${viewLink.tx}${plan.allocate_tx}`" target="_blank">View Transaction</a>
          </li>
        </ol>
      </q-timeline-entry>
    </template>
  </q-timeline>
</template>
<script>
import { defineComponent } from 'vue';
import { formatDateTime, emptyString } from 'src/dist/tools';
import { formatEther } from 'ethers';
import { constStatusConfig, viewLink } from 'src/dist/const-data';
export default defineComponent({
  name: 'StatusTimeline',
  props: {
    proposal: {
      type: Object,
      required: true,
      default: () => ({
        status: 'draft'
      })
    },
  },
  data: function () {
    return {
      constStatusConfig,
      viewLink,
      status: {
        color: '',
        label: '',
        icon: ''
      }
    }
  },
  watch: {
    proposal: {
      handler(newVal) {
        this.status = this.constStatusConfig[newVal.status];
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    formatDateTime,
    emptyString,
    formatEther,
  },
});
</script>
