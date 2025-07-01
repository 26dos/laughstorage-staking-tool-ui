<template>
  <q-page padding>
    <q-table :loading="loading" separator="none" :pagination="pagination" flat :columns="columns" :rows="rows">
      <template v-slot:body-cell-user="props">
        <q-td :props="props">
          <div class="flex items-center space-x-2">
            <q-avatar size="30px">
              <address-img :address="props.row.wallet.wallet" />
            </q-avatar>
            <span>{{ handleAddress(props.row.wallet.wallet) }}</span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-kyc_status="props">
        <q-td :props="props">
          <q-badge :color="props.row.kyc_status === 'verified' ? 'green' : 'red'">{{ props.row.kyc_status }}</q-badge>
        </q-td>
      </template>
      <!-- staking_plan -->
      <template v-slot:body-cell-staking_plan="props">
        <q-td :props="props">
          <template v-if="!props.row.plans">
            <q-badge dense color="grey" label="No Plan"></q-badge>
          </template>
          <template v-else>
            <q-btn padding="5px 10px" dense icon="visibility" outline :label="`View ${props.row.plans.length} Plan`"
              rounded unelevated color="primary" @click="viewPlan(props.row)" />
          </template>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="constStatusConfig[props.row.status].color">
            {{ constStatusConfig[props.row.status].label }}
          </q-badge>
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props" class="space-x-2">
          <template v-if="dAppStore.userInfo.role === 'admin'">
            <template v-if="props.row.status === 'success'">
              <q-btn padding="5px 10px" dense icon="add_circle" label="Create Plan" rounded unelevated color="primary"
                @click="openCreatePlanDialog(props.row)" />
            </template>
            <template v-else>
              <q-btn padding="5px 10px" dense icon="admin_panel_settings"
                :disable="props.row.status !== 'submit' || props.row.kyc_status !== 'verified'" rounded unelevated
                color="negative" label="Audit" @click="openAuditDialog(props.row)" />
            </template>
          </template>
          <q-btn padding="5px 10px" dense rounded unelevated outline icon="visibility" color="primary" label="View"
            @click="viewProposal(props.row)" />
        </q-td>
      </template>
    </q-table>
    <!-- view dialog -->
    <q-dialog v-model="viewDialog" full-width persistent>
      <div>
        <q-card class="container">
          <q-card-section class="bg-primary text-white">
            <div class="flex items-center justify-between">
              <div class="text-4xl font-bold">View Proposal</div>
              <q-btn icon="close" outline round v-close-popup />
            </div>
          </q-card-section>
          <proposal-view :proposal="selectedProposal" :hideComments="true" />
        </q-card>
      </div>
    </q-dialog>
    <!-- audit dialog -->
    <q-dialog v-model="auditDialog" persistent>
      <q-card class="main-card lg:w-[400px]">
        <q-card-section class="bg-primary text-white flex items-center justify-between">
          <div class="text-4xl font-bold">Audit Proposal</div>
          <q-btn icon="close" outline round v-close-popup />
        </q-card-section>
        <q-tabs v-model="auditTab" active-color="primary" indicator-color="primary">
          <q-tab name="approve" label="Approve" />
          <q-tab name="reject" label="Reject" />
        </q-tabs>
        <q-tab-panels v-model="auditTab" animated>
          <q-tab-panel name="approve">
            <q-form class="space-y-2" @submit="handleAudit">
              <q-input :rules="[(val) => !emptyString(val) || 'Please enter a value']" label="Approved DataCap Share"
                outlined v-model="auditForm.data_cap"></q-input>
              <div class="!mt-5">
                <q-btn class="w-full" rounded unelevated size="lg" label="Submit" color="primary" type="submit" />
              </div>
            </q-form>
          </q-tab-panel>
          <q-tab-panel name="reject">
            <q-form @submit="handleRejection">
              <q-input :rules="[(val) => !emptyString(val) || 'Please enter a value']" type="textarea" label="Reason"
                outlined v-model="auditForm.reason"></q-input>
              <div class="!mt-5">
                <q-btn class="w-full" rounded unelevated size="lg" label="Submit" color="negative" type="submit" />
              </div>
            </q-form>
          </q-tab-panel>
        </q-tab-panels>
        <q-inner-loading color="primary" :showing="auditLoading">
          <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
        </q-inner-loading>
      </q-card>
    </q-dialog>
    <!-- create plan dialog -->
    <q-dialog v-model="createPlanDialog" persistent>
      <q-card class="main-card lg:w-[400px]">
        <q-card-section class="bg-primary text-white flex items-center justify-between">
          <div class="text-4xl font-bold">Create Plan</div>
          <q-btn icon="close" outline round v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form class="space-y-2" @submit="handleCreatePlan">
            <div class="flex items-center space-x-2">
              <q-input :rules="[(val) => !emptyString(val) || 'Please enter a value']" class="flex-1" outlined
                v-model="planForm.data_cap" label="Data Cap" />
              <q-select :rules="[(val) => !emptyString(val) || 'Please enter a value']" class="w-[120px]" outlined
                v-model="planForm.cap_unit" :options="constDataCapUnit" label="Unit" />
            </div>
            <q-input :rules="[(val) => !emptyString(val) || 'Please enter a value']" disable outlined
              v-model="planForm.amount" label="Staking Amount">
              <template v-slot:append>
                <q-img src="/tokens/filecoin.png" width="20px" height="20px" />
              </template>
            </q-input>
            <q-select outlined v-model="planForm.stake_days" emit-value map-options :options="constStakeDaysOptions"
              label="Staking Days" />
            <div class="!mt-5">
              <q-btn class="w-full" rounded unelevated size="lg" label="Submit" type="submit" color="primary" />
            </div>
            <q-inner-loading color="primary" :showing="createPlanLoading">
              <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
            </q-inner-loading>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- view plan dialog -->
    <q-dialog v-model="viewPlanDialog" persistent>
      <q-card class="main-card lg:w-[400px]">
        <q-card-section class="bg-primary text-white flex items-center justify-between">
          <div class="text-4xl font-bold">View Plan</div>
          <q-btn icon="close" outline round v-close-popup />
        </q-card-section>
        <q-list separator>
          <q-item class="py-4" v-for="(plan, index) in selectedProposal.plans" :key="index">
            <q-item-section avatar>
              <q-icon size="2.5em" name="check_circle" color="green" v-if="plan.status === 'success'" />
              <q-icon size="2.5em" name="pending_actions" color="grey" v-else-if="plan.status === 'pending'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="font-bold">
                Stake {{ plan.staking_amount }} tokens and get {{ plan.data_cap }} tib DataCap
              </q-item-label>
              <q-item-label caption>
                Created on {{ formatDateTime(plan.created_at) }},
                <template v-if="plan.status === 'pending'">
                  not pledged yet
                </template>
                <template v-else>
                  pledged on {{ formatDateTime(plan.staking_time) }}
                </template>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { defineComponent, ref } from 'vue';
import { proposalApi } from 'src/dist/api';
import AddressImg from 'src/components/AddressImg.vue';
import { customAlert, emptyString, handleAddress, toDataCapTB, formatDateTime } from 'src/dist/tools';
import { constStatusConfig, constDataCapUnit, constStakeDaysOptions } from 'src/dist/const-data';
import ProposalView from 'src/components/ProposalView.vue';
import { formatEther } from 'ethers';
import { useDAppStore } from 'src/stores/d-app';
export default defineComponent({
  name: 'ProposalManagement',
  components: {
    AddressImg,
    ProposalView,
  },
  data() {
    return {
      loading: false,
      constStatusConfig,
      constDataCapUnit,
      auditTab: 'approve',
      viewDialog: false,
      auditDialog: false,
      auditForm: {
        data_cap: null,
      },
      viewPlanDialog: false,
      constStakeDaysOptions,
      columns: [
        {
          name: 'p_name',
          label: 'Proposal Name',
          field: 'p_name',
          align: 'left',
        }, {
          name: 'user',
          label: 'User',
          align: 'left',
        }, {
          field: 'request_data_cap',
          label: 'Request Data Cap',
          align: 'left',
        }, {
          field: 'data_cap',
          label: 'Approved Data Cap',
          align: 'left',
        }, {
          field: 'kyc_status',
          label: 'KYC Status',
          align: 'left',
          name: 'kyc_status',
        }, {
          label: 'Staking Plan',
          align: 'left',
          name: 'staking_plan',
        }, {
          label: 'Status',
          align: 'left',
          name: 'status',
          field: 'status'
        }, {
          align: 'right',
          name: 'action'
        }
      ],
      rows: [],
      pagination: {
        rowsPerPage: 10,
        page: 1,
      },
      selectedProposal: null,
      auditLoading: false,
      createPlanDialog: false,
      planForm: {
        data_cap: null,
        amount: null,
        stake_days: undefined,
        cap_unit: undefined,
        set_cap: null,
      },
      createPlanLoading: false,
    }
  },
  watch: {
    'pagination.page': {
      handler() {
        this.getProposals()
      },
      immediate: true,
    },
    'planForm.data_cap': {
      handler() {
        this.inputSetCap()
      },
      immediate: true,
    },
    'planForm.cap_unit': {
      handler() {
        this.inputSetCap()
      },
      immediate: true,
    },
    'planForm.set_cap': {
      handler(val) {
        if (emptyString(val)) return;
        const tib = parseFloat(toDataCapTB(val))
        // 10TIB= 1FIL
        const requiredFil = (tib / 10).toFixed(2)
        this.planForm.amount = requiredFil.toString()
      },
      immediate: true,
    },
  },
  setup() {
    const dAppStore = useDAppStore();
    return {
      dAppStore: ref(dAppStore),
    }
  },
  methods: {
    handleAddress,
    emptyString,
    formatEther,
    formatDateTime,
    inputSetCap() {
      const { data_cap, cap_unit } = this.planForm
      if (emptyString(data_cap) || emptyString(cap_unit)) return;
      this.planForm.set_cap = `${data_cap} ${cap_unit}`;
    },
    openCreatePlanDialog(proposal) {
      this.selectedProposal = proposal;
      this.createPlanDialog = true;
    },
    getProposals() {
      this.loading = true;
      proposalApi.proposals().then((response) => {
        this.rows = response.data.data
      }).finally(() => {
        this.loading = false;
      })
    },
    viewProposal(proposal) {
      this.selectedProposal = proposal;
      this.viewDialog = true;
    },
    openAuditDialog(proposal) {
      this.selectedProposal = proposal;
      this.auditForm.data_cap = proposal.request_data_cap;
      this.auditDialog = true;
    },
    handleAudit() {
      this.auditLoading = true;
      proposalApi.audit(this.selectedProposal.p_id, this.auditForm).then((res) => {
        this.updateProposal(res.data)
        customAlert.success('Audit successful');
        this.auditDialog = false;
      }).catch((error) => {
        customAlert.error(error.message);
      }).finally(() => {
        this.auditLoading = false;
      })
    },
    handleCreatePlan() {
      this.createPlanLoading = true;
      proposalApi.createPlan(this.selectedProposal.p_id, this.planForm).then((res) => {
        this.updateProposal(res.data)
        customAlert.success('Create plan successful');
        this.createPlanDialog = false;
      }).catch((error) => {
        customAlert.error(error.message);
      }).finally(() => {
        this.createPlanLoading = false;
      })
    },
    updateProposal(proposal) {
      const rows = this.rows
      const index = rows.findIndex((row) => row.p_id === proposal.p_id)
      rows[index] = proposal
      this.rows = rows
    },
    handleRejection() {
      this.auditLoading = true;
      proposalApi.rejection(this.selectedProposal.p_id, this.auditForm).then((res) => {
        this.updateProposal(res.data)
        this.auditDialog = false;
        customAlert.success('Rejection successful');
      }).catch((error) => {
        customAlert.error(error.message);
      }).finally(() => {
        this.auditLoading = false;
      })
    },
    viewPlan(proposal) {
      this.selectedProposal = proposal;
      this.viewPlanDialog = true;
    },
  }
});
</script>
