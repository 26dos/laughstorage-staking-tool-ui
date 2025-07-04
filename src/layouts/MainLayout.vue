<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="main-toolbar">
        <div class="flex items-center space-x-5 lg:space-x-10 flex-1">
          <router-link to="/">
            <q-img src="/logo.png" fit="contain" :height="`${$q.screen.lt.sm ? '60px' : '70px'}`"
              :width="`${$q.screen.lt.sm ? '120px' : '160px'}`" />
          </router-link>
          <q-list v-if="!$q.screen.lt.sm" class="main-menu">
            <q-item clickable :to="{ name: 'ProposalPage' }">
              <q-item-section>
                <q-item-label>Proposals</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'PledgeRecord' }">
              <q-item-section>
                <q-item-label>Record</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable :to="{ name: 'HelpPage' }">
              <q-item-section>
                <q-item-label>FAQ</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <ConnectWallet ref="connectWalletRef" :is-w-full="false" btn-type="account" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="px-3 py-2 shadow-lg shadow-blue-100" v-if="$q.screen.lt.sm">
      <q-list dense class="main-menu">
        <q-item class="flex-col items-center justify-center" clickable :to="{ name: 'ProposalPage' }">
          <q-item-section class="!min-w-[auto] !pr-0 mb-1" avatar>
            <q-icon name="home"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Proposals</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="flex-col items-center justify-center" clickable :to="{ name: 'PledgeRecord' }">
          <q-item-section class="!min-w-[auto] !pr-0 mb-1" avatar>
            <q-icon name="list"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Record</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="flex-col items-center justify-center" clickable :to="{ name: 'HelpPage' }">
          <q-item-section class="!min-w-[auto] !pr-0 mb-1" avatar>
            <q-icon name="help"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>FAQ</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="flex-col items-center justify-center" clickable :to="{ name: 'SocialPage' }">
          <q-item-section class="!min-w-[auto] !pr-0 mb-1" avatar>
            <q-icon name="account_tree"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>Social</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-footer>
    <q-footer v-else class="bg-transparent p-3">
      <div class="container">
        <div class="flex items-center justify-center">
          <q-btn href="https://github.com/26dos" target="_blank" flat icon="fa-brands fa-github" color="black" />
        </div>
      </div>
    </q-footer>
    <q-dialog v-model="dAppStore.fullLoading" persistent>
      <q-card class="w-[380px]" flat>
        <div class="bg-primary p-5 flex flex-col items-center justify-center">
          <q-img src="logo.png" width="200px" fit="contain" height="100px"></q-img>
        </div>
        <q-card-section class="flex flex-col items-center justify-center p-10">
          <q-spinner-hourglass color="primary" size="4em" />
          <h5 class="text-center font-bold text-xl mt-5">{{ dAppStore.fullLoadingText }}</h5>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar';
import ConnectWallet from 'src/components/ConnectWallet.vue';
import { defineComponent, ref } from 'vue';
import { useDAppStore } from 'src/stores/d-app';
export default defineComponent({
  components: {
    ConnectWallet,
  },
  name: 'MainLayout',
  setup: function () {
    const $q = useQuasar()
    const dAppStore = useDAppStore()
    dAppStore.getUserInfo()
    return {
      $q: ref($q),
      dAppStore,
    }
  },
  watch: {
    'dAppStore.openLogin': function (open) {
      if (!open) return
      this.$refs.connectWalletRef.login()
      this.dAppStore.setOpenLogin(false, () => {
        this.dAppStore.loginCallback()
      })
    }
  }
})
</script>
