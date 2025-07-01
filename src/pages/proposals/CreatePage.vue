<template>
  <q-page>
    <div class="container">
      <WalletLogin>
        <template #after>
          <q-btn padding="0" icon="arrow_back" flat label="Back" @click="goBack" />
          <div class="home-page-header main-card mt-5">
            <h1 class="text-3xl font-bold text-white uppercase">Create Proposal</h1>
            <p class="text-white mt-3 mb-5">
              Fill out the form below to create a new proposal. Once you click the "Submit for Review" button, your
              proposal
              will be received, reviewed, and the appropriate DataCap quota will be allocated!
            </p>
          </div>
          <q-form class="space-y-5 relative" @submit="handleSubmit">
            <template v-for="group in constProposalForm" :key="group.group">
              <q-card class="main-card">
                <q-card-section class="space-y-4">
                  <h3 class="text-xl font-bold">{{ group.group }}</h3>
                  <div class="grid grid-cols-12 gap-4">
                    <div v-for="field in group.fields" :key="field.label"
                      :class="field.col ? `cols-${field.col}` : 'cols-12'">
                      <q-input outlined dense v-model="form[field.key]" :label="field.label" :type="field.type"
                        v-if="field.type != 'select' && field.type != 'checkbox'" :hint="field.hint"
                        :rules="field.rules">
                        <template v-slot:prepend v-if="field.required">
                          <span class="text-red-500 text-base">*</span>
                        </template>
                      </q-input>
                      <q-select outlined dense v-model="form[field.key]" :label="field.label" :options="field.options"
                        v-if="field.type == 'select'" :hint="field.hint" :rules="field.rules">
                        <template v-slot:prepend v-if="field.required">
                          <span class="text-red-500 text-base">*</span>
                        </template>
                      </q-select>
                      <div v-if="field.type == 'checkbox'" class="space-y-2">
                        <div class="flex items-center space-x-2">
                          <h5 class="font-bold">{{ field.label }}</h5>
                          <span class="text-red-500 text-base" v-if="field.required">*</span>
                        </div>
                        <q-checkbox outlined dense v-model="form[field.key]" :label="field.data"></q-checkbox>
                        <p class="text-xs text-gray-500">{{ field.hint }}</p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </template>
            <q-card class="main-card font-bold" :class="{
              'bg-blue-500 text-white': saveProposal.status == 'submit',
              'bg-green-500 text-white': saveProposal.status == 'success',
            }">
              <q-card-section>
                <template v-if="['draft', 'reject'].includes(saveProposal.status)">
                  <div class="flex items-center justify-center space-x-5">
                    <q-btn label="Save Draft" type="button" @click="handleSubmit('draft')" color="primary" outline />
                    <q-btn unelevated label="Submit Review" type="submit" color="primary" />
                  </div>
                </template>
                <template v-if="saveProposal.status == 'submit'">
                  <div class="flex items-center space-x-5">
                    <q-icon name="check_circle" size="2em" color="white" />
                    <p>
                      The current proposal has been submitted, please wait for our team to review!
                    </p>
                    <q-btn label="View Detail" outline rounded text-color="white" :to="{ name: 'PledgeRecord' }" />
                  </div>
                </template>
                <template v-if="saveProposal.status == 'success'">
                  <div class="flex items-center space-x-5 flex-nowrap">
                    <q-icon name="check_circle" size="2em" color="white" />
                    <p class="flex-1">
                      The proposal has been passed, please pay attention to the pledge plan. DataCap shares will only be
                      issued when the pledge plan appears and the pledge is successful!
                    </p>
                    <q-btn label="View Detail" outline rounded text-color="white" :to="{ name: 'PledgeRecord' }" />
                  </div>
                </template>
                <p v-if="error" class=" text-red-500 text-center text-xs mt-2">{{ error }}</p>
              </q-card-section>
              <q-inner-loading color="primary" :showing="loading">
                <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
              </q-inner-loading>
            </q-card>
            <q-inner-loading color="primary" :showing="pageLoading">
              <q-spinner-hourglass class="mx-auto" color="primary" size="3em" />
            </q-inner-loading>
          </q-form>
        </template>
      </WalletLogin>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { constProposalForm } from 'src/dist/proposal-form';
import { proposalApi } from 'src/dist/api';
import { useDAppStore } from 'src/stores/d-app';
import WalletLogin from 'src/components/WalletLogin.vue';
import { customAlert, emptyString } from 'src/dist/tools';


export default defineComponent({
  name: 'CreateProposal',
  setup: function () {
    const dAppStore = useDAppStore()
    return {
      dAppStore
    }
  },
  components: {
    WalletLogin
  },
  data: function () {
    return {
      constProposalForm,
      form: {
        custom_multisig: false,
        is_public_dataset: false,
        data_owner_name: undefined,
        datacap_amount: undefined,
      },
      loading: false,
      error: undefined,
      pageLoading: false,
      saveProposal: {
        status: 'draft'
      }
    }
  },
  watch: {
    'dAppStore.userInfo': {
      handler: function (newVal) {
        if (newVal) {
          this.getProposal()
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    emptyString,
    goBack: function () {
      this.$router.back();
    },
    getProposal: function () {
      if (emptyString(this.dAppStore.userInfo.wallet)) return;
      this.pageLoading = true
      proposalApi.myProposals().then((res) => {
        this.saveProposal = res.data;
        const proposal = JSON.parse(res.data.p_content);
        proposal.forEach(item => {
          this.form[item.key] = item.value;
        });
      }).finally(() => {
        this.pageLoading = false
      })
    },
    handleSubmit: function (type) {
      this.error = undefined
      this.loading = true
      let data = [];
      for (const key in this.form) {
        data.push({
          key,
          value: this.form[key]
        })
      }
      if (type !== 'draft') {
        type = 'submit'
      }
      proposalApi.create({
        data: JSON.stringify(data),
        submit_type: type,
        p_name: this.form.data_owner_name,
        request_data_cap: this.form.datacap_amount
      }).then(() => {
        if (type == 'draft') {
          customAlert.success('Proposal saved successfully!')
          return;
        }
        customAlert.success('Proposal submitted successfully!')
        this.$router.push({
          name: 'PledgeRecord',
        })
      }).catch((err) => {
        if (err.code == 61) {
          this.dAppStore.setOpenLogin(true, () => {
            this.handleSubmit(type)
          })
          return;
        }
        this.error = err.message
      }).finally(() => {
        this.loading = false
      })
    }
  }
});
</script>