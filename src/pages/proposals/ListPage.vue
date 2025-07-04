<template>
  <div class="container">

    <div class="space-y-5">
      <div class="home-page-header main-card">
        <h1 class="lg:text-3xl text-2xl font-bold text-white uppercase">Laughstorage Staking Tool</h1>
        <p class="text-white mt-3 mb-5 text-lg">
          <span class="font-bold">Laughstorage</span> is a decentralized storage network that allows users to store
          and retrieve data in a secure and efficient manner.
        </p>
        <div>
          <q-btn icon="post_add" push rounded color="white" text-color="primary" label="Create proposal"
            class="font-bold" :to="{ name: 'CreateProposalPage' }"></q-btn>
        </div>
      </div>
      <div class="home-page relative">
        <template v-if="$q.screen.gt.md">
          <q-card class="lg:w-[380px] main-card">
            <q-card-section>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="border-2 h-10 w-10 flex items-center justify-center border-primary rounded-full">
                    <q-icon color="primary" name="dashboard" size="16px" />
                  </div>
                  <h1 class="text-xl font-bold text-primary uppercase">Proposals</h1>
                </div>
              </div>
            </q-card-section>
            <q-scroll-area class="lg:h-[500px]">
              <q-list separator class="proposal-list">
                <template v-for="proposal in proposals" :key="proposal.p_id">
                  <ProposalItem :proposal="proposal" :active="selectedProposal.p_id === proposal.p_id"
                    @click="setSelectedProposal(proposal)" />
                </template>
              </q-list>
            </q-scroll-area>
          </q-card>
          <div class="flex-1">
            <ProposalView v-if="selectedProposal !== undefined" :proposal="selectedProposal" />
          </div>
        </template>
        <template v-else>
          <q-card class="main-card">
            <q-card-section>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="border-2 h-10 w-10 flex items-center justify-center border-primary rounded-full">
                    <q-icon color="primary" name="dashboard" size="16px" />
                  </div>
                  <h1 class="text-xl font-bold text-primary uppercase">Proposals</h1>
                </div>
              </div>
            </q-card-section>
            <q-list separator class="proposal-list">
              <template v-for="proposal in proposals" :key="proposal.p_id">
                <ProposalItem :proposal="proposal" @click="setSelectedProposal(proposal)" />
              </template>
            </q-list>
          </q-card>
        </template>
        <q-inner-loading color="primary" :showing="loading">
          <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
        </q-inner-loading>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { proposalApi } from 'src/dist/api';
import { dateFromNow } from 'src/dist/tools';
import ProposalView from 'src/components/ProposalView.vue';
import ProposalItem from 'src/components/ProposalItem.vue';
import { useQuasar } from 'quasar';

const bgColors = [
  'bg-warning',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-sky-500',
  'bg-blue-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-pink-600'
]


const getRandomBgColor = () => {
  const randomIndex = Math.floor(Math.random() * bgColors.length)
  return bgColors[randomIndex]
}

export default defineComponent({
  name: 'ProposalsListPage',
  components: {
    ProposalView,
    ProposalItem
  },
  setup: function () {
    const $q = useQuasar();
    return {
      $q: ref($q)
    }
  },
  data: function () {
    return {
      proposals: [],
      loading: false,
      getRandomBgColor,
      selectedProposal: undefined,
    }
  },
  created: function () {
    this.getProposals();
  },
  methods: {
    dateFromNow,
    getProposals: async function () {
      try {
        this.loading = true;
        const res = await proposalApi.proposals();
        const list = res.data.data;
        this.selectedProposal = list[0];
        this.proposals = list.map(item => ({
          ...item,
          bg_color: getRandomBgColor()
        }));
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    setSelectedProposal: function (proposal) {
      if (this.$q.screen.gt.md) {
        this.selectedProposal = proposal;
        return;
      }
      this.$router.push({ name: 'ProposalDetailPage', params: { pid: proposal.p_id } });
    }
  }
});
</script>