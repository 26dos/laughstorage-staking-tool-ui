<template>
  <template v-if="proposal">
    <q-card class="main-card bg-negative text-white" v-if="proposal.kyc_status === 'unverified'">
      <q-card-section class="space-y-3">
        <div class="flex items-center space-x-5">
          <q-icon name="warning" size="4em" />
          <h2 class="text-2xl font-bold">KYC not verified</h2>
        </div>
        <p class="text-lg">
          You have not yet completed KYC verification. If your case has been submitted for review, we will review it
          after you complete KYC verification. You can also complete KYC verification before submitting for review!
        </p>
        <div class="flex justify-end">
          <q-btn @click="showKYCDialog = true" icon="badge" label="Verify KYC" push rounded color="white"
            text-color="negative" />
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showKYCDialog" persistent>

      <q-card class="main-card">
        <q-form @submit="submitKYC">
          <div class="bg-primary p-5 flex flex-col items-center justify-center">
            <q-img src="logo.png" width="200px" fit="contain" height="100px"></q-img>
          </div>
          <q-card-section class="text-center">
            <h1 class="text-2xl font-bold">KYC Verification</h1>
          </q-card-section>
          <q-card-section class="space-y-1">
            <q-select map-options emit-value :rules="[val => !emptyString(val) || 'Please select a document type']"
              outlined v-model="form.document_type" :options="document_types" label="Document type" />
            <div class="flex space-x-2">
              <q-input :rules="[val => !emptyString(val) || 'Please enter your first name']" outlined
                v-model="form.id_first_name" label="ID First Name"></q-input>
              <q-input :rules="[val => !emptyString(val) || 'Please enter your last name']" outlined
                v-model="form.id_last_name" label="ID Last Name"></q-input>
            </div>
            <q-input :rules="[val => !emptyString(val) || 'Please enter your ID number']" outlined
              v-model="form.id_number" label="ID Number"></q-input>
            <template v-if="form.document_type === 'id_card'">
              <template v-for="option in id_card_options" :key="option.name">
                <template v-if="option.type === 'image'">
                  <q-file accept="image/*" :rules="[val => val !== undefined || option.hint]" outlined
                    v-model="form[option.name]" :label="option.label" :hint="option.hint" />
                </template>
              </template>
            </template>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn padding="10px 15px" label="Cancel" icon="close" rounded unelevated color="negative"
              @click="showKYCDialog = false" />
            <q-btn :loading="loading" padding="10px 20px" class="flex-1" label="Submit" icon="check" type="submit"
              color="primary" unelevated rounded />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </template>
</template>
<script>
import { customAlert, emptyString } from 'src/dist/tools'
import { defineComponent } from 'vue'
import { userApi } from 'src/dist/api'


export default defineComponent({
  name: 'KYCVerification',
  props: {
    proposal: {
      type: Object,
      required: true
    },
    reload: {
      type: Function,
      required: true
    }
  },
  setup() {
    return {}
  },
  data() {
    return {
      showKYCDialog: false,
      loading: false,
      form: {
        document_type: '',
        id_first_name: '',
        id_last_name: '',
        id_number: '',
      },
      document_types: [{
        label: 'Chinese Resident Identity Card',
        value: 'id_card'
      }],
      id_card_options: [
        {
          label: 'Front',
          type: 'image',
          name: 'id_card_front',
          hint: 'Please upload the front of your ID card'
        },
        {
          label: 'Back',
          type: 'image',
          name: 'id_card_back',
          hint: 'Please upload the back of your ID card'
        }
      ]
    }
  },
  methods: {
    emptyString,
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    submitKYC: async function () {
      try {
        this.loading = true
        const id_card_front_base64 = await this.fileToBase64(this.form.id_card_front)
        const id_card_back_base64 = await this.fileToBase64(this.form.id_card_back)
        const submitData = {
          ...this.form,
          id_card_front: id_card_front_base64,
          id_card_back: id_card_back_base64
        }
        await userApi.kycVerify(submitData)
        this.showKYCDialog = false
        customAlert.success('KYC verification submitted successfully')
        this.reload()
      } catch (error) {
        customAlert.error(error.message)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>