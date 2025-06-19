<template>
  <q-page padding>
    <div class="proposal-view space-y-5">
      <q-btn padding="0" icon="arrow_back" flat label="Back" @click="goBack" />
      <q-card class="main-card">
        <q-card-section class="text-primary">
          <div class="flex items-center space-x-2">
            <q-icon name="description" size="2em" />
            <h1 class="text-2xl font-bold">{{ proposal.p_name }}</h1>
          </div>
        </q-card-section>
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
      </q-card>
      <q-card class="main-card" v-if="!loading">
        <q-card-section class="proposal-timeline">
          <StatusTimeline :proposal="proposal" />
        </q-card-section>
      </q-card>
      <proposal-comments :p_id="proposal.p_id" :proposal="proposal" />
      <q-inner-loading color="primary" :showing="loading">
        <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
      </q-inner-loading>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from 'vue';
import { constProposalForm } from 'src/dist/proposal-form';
import { formatDateTime } from 'src/dist/tools';
import { constStatusConfig } from 'src/dist/const-data';
import { proposalApi } from 'src/dist/api';
import StatusTimeline from 'src/components/StatusTimeline.vue';
import ProposalComments from 'src/components/ProposalComments.vue';
export default defineComponent({
  name: 'ProposalDetailPage',
  components: {
    StatusTimeline,
    ProposalComments
  },
  data: function () {
    return {
      proposalContent: {},
      constProposalForm,
      constStatusConfig,
      status: {
        color: '',
        label: '',
        icon: ''
      },
      proposal: {
        status: 'draft',
        created_at: '',
        p_id: '',
      },
      loading: true
    }
  },
  methods: {
    formatDateTime,
    goBack: function () {
      this.$router.back();
    }
  },
  created: function () {
    this.loading = true;
    proposalApi.proposal(this.$route.params.pid).then(res => {
      this.proposal = res.data;
    }).finally(() => {
      this.loading = false;
    });
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
