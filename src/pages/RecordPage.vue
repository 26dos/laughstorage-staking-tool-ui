<template>
  <q-page padding>
    <div class="container">
      <WalletLogin>
        <template #after>
          <div class="space-y-5">
            <q-card class="main-card">
              <q-card-section class="flex items-center justify-between py-0 pl-0">
                <q-tabs indicator-color="primary" active-color="white" active-bg-color="primary" align="left"
                  v-model="pageTab">
                  <q-tab label="Proposal" name="proposal"></q-tab>
                  <q-tab label="Stack" name="stack"></q-tab>
                </q-tabs>
                <div class="flex items-center space-x-2" v-if="pageTab === 'stack'">
                  <q-checkbox v-model="filter.active" label="Active" />
                  <q-checkbox v-model="filter.inactive" label="Inactive" />
                </div>
              </q-card-section>
            </q-card>
            <div class="relative min-h-[270px]">
              <q-tab-panels class="bg-transparent" v-model="pageTab" animated>
                <!-- proposal -->
                <q-tab-panel name="proposal" class="p-0">
                  <UserProposal :setLoading="setLoading" />
                </q-tab-panel>
                <!-- record -->
                <q-tab-panel name="stack" class="p-0">
                  <ul class="flex items-center space-x-2 lg:space-x-5 font-bold text-zinc-400">
                    <li class="flex items-center space-x-2">
                      <span>Total</span>
                      <span class="text-primary">
                        <template v-if="overview.total > 0">
                          {{ overview.total }} ({{ weiToEther(`${overview.totalAmount}`) }} FIL)
                        </template>
                        <template v-else>
                          --
                        </template>
                      </span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <span>Active</span>
                      <span class="text-primary">
                        <template v-if="overview.active > 0">
                          {{ overview.active }} ({{ weiToEther(`${overview.activeAmount}`) }} FIL)
                        </template>
                        <template v-else>
                          --
                        </template>
                      </span>
                    </li>
                    <li class="flex items-center space-x-2">
                      <span>Inactive</span>
                      <span class="text-primary">
                        <template v-if="overview.inactive > 0">
                          {{ overview.inactive }} ({{ weiToEther(`${overview.inactiveAmount}`) }} FIL)
                        </template>
                        <template v-else>
                          --
                        </template>
                      </span>
                    </li>
                  </ul>
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                    <template v-for="(item, index) in record" v-bind:key="index">
                      <pledge-list :item="item"></pledge-list>
                    </template>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
              <q-inner-loading color="primary" :showing="loading">
                <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
              </q-inner-loading>
            </div>
          </div>
        </template>
      </WalletLogin>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { useDAppStore } from 'src/stores/d-app';
import { Contract, BrowserProvider } from 'ethers';
import { stakingContractAddress, stakingContractAbi } from 'src/dist/staking-abi';
import { useAppKitNetwork, useAppKitProvider } from '@reown/appkit/vue';
import { weiToEther } from 'src/dist/tools';
import PledgeList from 'src/components/PledgeList.vue'
import { emptyString } from 'src/dist/tools';
import WalletLogin from 'src/components/WalletLogin.vue';
import UserProposal from 'src/components/UserProposal.vue';

export default defineComponent({
  name: 'RecordPage',
  components: {
    PledgeList,
    WalletLogin,
    UserProposal,
  },
  setup() {
    const dAppStore = useDAppStore();
    const { network } = useAppKitNetwork();
    return {
      dAppStore: ref(dAppStore),
      network: ref(network),
    }
  },
  watch: {
    'pageTab': {
      handler(val) {
        if (val === 'stack') {
          this.getRecord();
        }
      },
      immediate: true,
    },
    filter: {
      handler: function () {
        this.filterRecord();
      },
      deep: true
    }
  },
  data: function () {
    return {
      loading: false,
      record: [],
      allRecord: [],
      overview: {
        total: 0,
        totalAmount: 0,
        active: 0,
        activeAmount: 0,
        inactive: 0,
        inactiveAmount: 0,
      },
      filter: {
        active: true,
        inactive: true,
      },
      pageTab: 'proposal',
      userProposal: {},
    }
  },
  methods: {
    weiToEther,
    filterRecord: function () {
      if (this.filter.active && this.filter.inactive) {
        return this.record = this.allRecord;
      }
      if (this.filter.active) {
        return this.record = this.allRecord.filter(item => item.active);
      }
      if (this.filter.inactive) {
        return this.record = this.allRecord.filter(item => !item.active);
      }
    },
    getRecord: async function () {
      try {
        if (this.pageTab !== 'stack') return;
        const userAddress = this.dAppStore.userAddress;
        if (emptyString(userAddress)) {
          this.record = [];
          this.allRecord = [];
          return;
        }
        this.loading = true;
        const { walletProvider } = useAppKitProvider('eip155');
        const provider = new BrowserProvider(walletProvider);
        const contract = new Contract(
          stakingContractAddress,
          stakingContractAbi,
          provider,
        );
        let record = await contract['getAllStakeInfo'](userAddress);
        this.overview.total = record.length;
        this.overview.active = record.filter(item => item.active).length;
        this.overview.inactive = record.filter(item => !item.active).length;
        this.overview.totalAmount = record.reduce((acc, item) => acc + Number(item.amount), 0);
        this.overview.activeAmount = record.filter(item => item.active).reduce((acc, item) => acc + Number(item.amount), 0);
        this.overview.inactiveAmount = record.filter(item => !item.active).reduce((acc, item) => acc + Number(item.amount), 0);
        record = [...record].sort((a, b) => {
          if (b.stakeId > a.stakeId) return 1;
          if (b.stakeId < a.stakeId) return -1;
          return 0;
        });
        this.allRecord = record;
        this.record = record;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    setLoading: function (val) {
      this.loading = val;
    }
  }
})
</script>
