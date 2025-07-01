<template>
  <q-item class="p-2" clickable :active="active">
    <q-item-section avatar class="!pr-2 ">
      <div :class="` ${proposal.bg_color} proposal-item-avatar uppercase`">
        {{ proposal.p_name[0] }}
        <span class="text-xs font-bold">
          {{ proposal.request_data_cap }}
        </span>
      </div>
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1" class="text-lg font-bold">
        {{ proposal.p_name }}
      </q-item-label>
      <q-item-label caption>
        <div class="flex items-center no-wrap space-x-1">
          <q-chip square :icon="emptyString(proposal.staking_time) ? 'pending_actions' : 'check_circle_outline'"
            :color="emptyString(proposal.staking_time) ? 'primary' : 'green'" text-color="white" class="text-xs !mx-0  "
            label="Staking"></q-chip>
          <q-chip square :icon="proposal.kyc_status === 'verified' ? 'check_circle_outline' : 'pending_actions'"
            :color="proposal.kyc_status === 'verified' ? 'green' : 'red'" text-color="white" class="text-xs  "
            label="KYC"></q-chip>
          <q-chip square class="text-xs" :color="constStatusConfig[proposal.status]?.color || 'grey'"
            text-color="white">
            {{ constStatusConfig[proposal.status]?.label || proposal.status }}
          </q-chip>
        </div>
        <ul class="text-xs text-meta flex items-center space-x-2">
          <li> Created {{ dateFromNow(proposal.created_at) }}</li>
          <li> Updated {{ dateFromNow(proposal.update_at) }}</li>
        </ul>
      </q-item-label>
    </q-item-section>
    <q-item-section side v-if="$q.screen.lt.sm">
      <q-icon name="chevron_right" />
    </q-item-section>
  </q-item>
</template>
<script>
import { dateFromNow, emptyString } from 'src/dist/tools';
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'
import { constStatusConfig } from 'src/dist/const-data';
export default defineComponent({
  name: 'ProposalItem',
  props: {
    proposal: {
      type: Object
    },
    active: {
      type: Boolean,
      default: false
    },
  },
  setup: function () {
    const $q = useQuasar()
    return {
      $q
    }
  },
  data: function () {
    return {
      constStatusConfig
    }
  },
  methods: {
    dateFromNow,
    emptyString
  }
})
</script>