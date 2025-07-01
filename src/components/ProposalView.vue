<template>
  <div class="grid grid-cols-12 gap-4 proposal-view">
    <div class="col-span-9 space-y-5">
      <q-card class="main-card">
        <q-card-section class=" text-primary">
          <div class="flex items-center space-x-2">
            <q-icon name="description" size="2em" />
            <h1 class="text-2xl font-bold">{{ proposal.p_name }}</h1>
          </div>
        </q-card-section>
        <q-scroll-area class="lg:h-[600px]">
          <template v-for="(item, index) in constProposalForm" :key="index">
            <q-list separator class="proposal-form-list">
              <q-item-label header class="text-xl font-bold">
                <div class="flex items-center space-x-2">
                  <span class="h-10 w-10 bg-zinc-500 rounded-full text-white flex items-center justify-center">
                    <q-icon :name="`fa-solid fa-${index + 1}`" size="1em" />
                  </span>
                  <span>{{ item.group }}</span>
                </div>
              </q-item-label>
              <template v-for="field in item.fields" :key="field.key">
                <q-item :class="`item-${field.type}`">
                  <q-item-section side>
                    <q-item-label>{{ field.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section class="content">
                    <template v-if="proposalContent[field.key] !== undefined">
                      <q-item-label>{{ proposalContent[field.key] }}</q-item-label>
                    </template>
                    <template v-else>
                      <q-item-label>--</q-item-label>
                    </template>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </template>
        </q-scroll-area>
      </q-card>
      <proposal-comments v-if="!hideComments" :p_id="proposal.p_id" :proposal="proposal" />
    </div>
    <q-card class="main-card col-span-3">
      <q-card-section class="proposal-timeline">
        <status-timeline :proposal="proposal" />
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { constProposalForm } from 'src/dist/proposal-form';
import { emptyString, formatDateTime } from 'src/dist/tools';
import { constStatusConfig } from 'src/dist/const-data';
import { formatEther } from 'ethers';
import ProposalComments from 'src/components/ProposalComments.vue';
import StatusTimeline from 'src/components/StatusTimeline.vue';
export default defineComponent({
  name: 'ProposalView',
  components: {
    ProposalComments,
    StatusTimeline
  },
  props: {
    proposal: {
      type: Object,
      required: true,
      default: () => ({
        status: 'draft'
      })
    },
    hideComments: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      proposalContent: {
        created_at: '',
      },
      constProposalForm,
      constStatusConfig,
      status: {
        color: '',
        label: '',
        icon: ''
      }
    }
  },
  methods: {
    formatDateTime,
    emptyString,
    formatEther
  },
  watch: {
    proposal: {
      handler: function (newVal) {
        if (!newVal.p_content) return;
        const obj = JSON.parse(newVal.p_content);
        obj.forEach(element => {
          this.proposalContent[element.key] = element.value;
        });
        this.status = constStatusConfig[newVal.status];
      },
      immediate: true
    }
  },
})
</script>
