<template>
  <q-card class="main-card" v-if="noSubmit">
    <q-card-section>
      <div class="flex flex-col items-center justify-center space-y-4">
        <q-icon name="warning" size="4em" color="negative" />
        <p class="text-negative">You haven't submitted a proposal yet. Click the button below to create one!</p>
        <q-btn label="Create Proposal" push rounded size="lg" color="primary" :to="{ name: 'CreateProposalPage' }" />
      </div>
    </q-card-section>
  </q-card>
  <template v-else>
    <div class="space-y-5">
      <KYCVerification :proposal="userProposal" :reload="getProposal" />
      <template v-if="userProposal.status === 'waiting_staking'">
        <q-card class="main-card">
          <q-card-section class="space-y-3">
            <h1 class="text-3xl font-bold">Staking File Coin</h1>
            <div class="text-lg leading-loose">
              <p>
                Your Data Cap application has been approved, please stake File Coin as soon as possible. The wallet
                address for initiating the pledge needs to be the same as the wallet
                address for submitting the proposal,
                otherwise the pledge will be invalid!
                <q-btn icon-right="arrow_forward" unelevated label="Go Stake" rounded color="primary"
                  @click="openStakingDialog" class="ml-2" />
              </p>

            </div>
          </q-card-section>
        </q-card>
        <StakingCard ref="stakingCard" :proposal="userProposal" />
      </template>
      <template v-if="userProposal.status === 'reject'">
        <q-card class="main-card bg-warning">
          <q-card-section class="text-white">
            <div class="flex items-center space-x-5">
              <q-icon name="warning" size="4em" />
              <h1 class="text-2xl font-bold">Rejected</h1>
            </div>
            <p v-html="userProposal.reason_rejection"></p>
          </q-card-section>
        </q-card>
      </template>
      <q-card class="main-card">
        <q-card-section class="bg-primary text-white">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <q-icon name="description" size="2em" />
                <h1 class="text-2xl font-bold  ">My Proposal</h1>
              </div>
              <q-chip :color="constStatusConfig[userProposal.status]?.color || 'grey'" text-color="white">
                {{ constStatusConfig[userProposal.status]?.label || userProposal.status }}
              </q-chip>
            </div>
            <template v-if="['draft', 'reject'].includes(userProposal.status)">
              <q-btn icon="edit" label="Edit Proposal" push rounded color="warning"
                :to="{ name: 'CreateProposalPage' }" />
            </template>
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
                <q-item-section avatar>
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
    </div>
  </template>
</template>
<script>
import { defineComponent } from 'vue';
import { proposalApi } from 'src/dist/api';
import { useDAppStore } from 'src/stores/d-app';
import { constProposalForm } from 'src/dist/proposal-form';
import KYCVerification from 'src/components/KYCVerification.vue';
import { constStatusConfig } from 'src/dist/const-data';
import StakingCard from 'src/components/StakingCard.vue';
export default defineComponent({
  name: 'UserProposal',
  components: {
    KYCVerification,
    StakingCard
  },
  setup: function () {
    const dAppStore = useDAppStore();
    return {
      dAppStore,

    }
  },
  props: {
    setLoading: {
      type: Function,
      required: true,
    }
  },
  data: function () {
    return {
      constStatusConfig,
      constProposalForm,
      userProposal: {
        status: '',
        wallet: {
          wallet: '',
        }
      },
      noSubmit: false,
      proposalContent: {}
    }
  },
  created: function () {
    this.getProposal();
  },
  methods: {
    getProposal: async function () {
      try {
        this.setLoading(true);
        const res = await proposalApi.myProposals();
        this.userProposal = res.data;
        const proposalContent = JSON.parse(res.data.p_content);
        proposalContent.forEach(item => {
          this.proposalContent[item.key] = item.value;
        });
      } catch (error) {
        if (error.code == 65) {
          this.noSubmit = true;
        }
        console.error(error);
      } finally {
        this.setLoading(false);
      }
    },
    openStakingDialog() {
      this.$refs.stakingCard.openStakingDialog();
    }
  }
});
</script>