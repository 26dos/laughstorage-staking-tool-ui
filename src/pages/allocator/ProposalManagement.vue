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
      <template v-slot:body-cell-staking="props">
        <q-td :props="props">
          <q-badge dense v-if="props.row.status === 'submit'" color="grey">
            Waiting f
            or review
          </q-badge>
          <q-badge dense v-if="props.row.status === 'draft'" color="red">
            Not Submitted
          </q-badge>
          <template v-if="!['submit', 'draft'].includes(props.row.status)">
            <q-chip square dense icon="pending_actions" v-if="emptyString(props.row.staking_time)" color="primary">
              {{ formatEther(props.row.staking_amount) }} FIL
            </q-chip>
            <q-chip square dense icon="check_circle" v-else color="green">
              Staked {{ formatEther(props.row.staking_amount) }} FIL
            </q-chip>
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
          <q-btn rounded unelevated color="primary" label="View" @click="viewProposal(props.row)" />
          <q-btn :disable="props.row.status !== 'submit' || props.row.kyc_status !== 'verified'" rounded unelevated
            color="negative" label="Audit" @click="openAuditDialog(props.row)" />
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="viewDialog" full-width persistent>
      <div>
        <q-card class="container">
          <q-card-section class="bg-primary text-white">
            <div class="flex items-center justify-between">
              <div class="text-4xl font-bold">View Proposal</div>
              <q-btn icon="close" outline round v-close-popup />
            </div>
          </q-card-section>
          <proposal-view :proposal="selectedProposal" />
        </q-card>
      </div>
    </q-dialog>
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
              <q-input disable :rules="[(val) => !emptyString(val) || 'Please enter a value']"
                label="Required collateral amount FIL" outlined v-model="auditForm.amount"></q-input>
              <q-select map-options emit-value :options="stakeDaysOptions" label="Pledge Type" outlined
                v-model="auditForm.stake_days"></q-select>
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
  </q-page>
</template>
<script>
import { defineComponent } from 'vue';
import { proposalApi } from 'src/dist/api';
import AddressImg from 'src/components/AddressImg.vue';
import { customAlert, emptyString, handleAddress, toDataCapTB } from 'src/dist/tools';
import { constStatusConfig } from 'src/dist/const-data';
import ProposalView from 'src/components/ProposalView.vue';
import { formatEther } from 'ethers';
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
      auditTab: 'approve',
      viewDialog: false,
      auditDialog: false,
      auditForm: {
        data_cap: null,
        amount: null,
        stake_days: undefined,
      },
      stakeDaysOptions: [
        {
          label: 'Public datasets',
          value: 20,
        },
        {
          label: 'Private datasets',
          value: 40,
        },
      ],
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
          label: 'Staking',
          align: 'left',
          name: 'staking',
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
    }
  },
  watch: {
    'pagination.page': {
      handler() {
        this.getProposals()
      },
      immediate: true,
    },
    'auditForm.data_cap': {
      handler(val) {
        if (emptyString(val)) return;
        const tib = parseFloat(toDataCapTB(val))
        // 10TIB= 1FIL
        const requiredFil = (tib / 10).toFixed(2)
        this.auditForm.amount = requiredFil.toString()
      },
      immediate: true,
    },
  },
  methods: {
    handleAddress,
    emptyString,
    formatEther,
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
    }
  }
});
</script>