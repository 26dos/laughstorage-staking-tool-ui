import { defineStore, acceptHMRUpdate } from 'pinia'
import { userApi, userAppToken } from 'src/dist/api'

export const useDAppStore = defineStore('dApp', {
  state: () => ({
    userAddress: '',
    isConnected: false,
    connectWalletAction: () => {},
    fullLoading: false,
    fullLoadingText: '',
    openLogin: false,
    loginCallback: () => {},
    isLogin: false,
    userInfo: {
      wallet: undefined,
    },
  }),

  actions: {
    setFullLoading(loading, text) {
      this.fullLoading = loading
      this.fullLoadingText = text
    },
    setOpenLogin(open, callback) {
      this.openLogin = open
      this.loginCallback = callback
    },
    setUserAddress(address) {
      this.userAddress = address
      this.isConnected = true
      const { wallet } = this.userInfo
      if (wallet !== undefined) {
        const walletCompare = wallet.toLowerCase()
        if (walletCompare !== address.toLowerCase()) {
          this.loginOut()
        }
      }
      this.connectWalletAction()
    },
    setConnectWalletAction(action) {
      this.connectWalletAction = action
    },
    loginOut() {
      this.userInfo = {}
      this.isLogin = false
      userAppToken.del()
    },
    clearUserAddress() {
      this.userAddress = ''
      this.isConnected = false
    },
    async getUserInfo() {
      try {
        const res = await userApi.info()
        this.userInfo = res.data
        this.isLogin = true
      } catch (error) {
        console.error(error)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDAppStore, import.meta.hot))
}
