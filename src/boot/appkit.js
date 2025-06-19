import { boot } from 'quasar/wrappers'
import { createAppKit } from '@reown/appkit/vue'
import { dAppMetaData, dAppProjectId, networks } from 'src/dist/const-data'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
export default boot(({ app }) => {
  const metadata = {
    name: dAppMetaData.appName,
    description: dAppMetaData.description,
    url: dAppMetaData.appUrl,
    icons: dAppMetaData.icons,
  }

  const appKit = createAppKit({
    adapters: [new EthersAdapter()],
    metadata,
    networks,
    projectId: dAppProjectId,
    features: {
      analytics: true,
      email: false,
      socials: [],
      history: true,
    },
    allowUnsupportedChain: false,
    themeMode: 'light',
    themeVariables: {
      '--w3m-accent': 'var(--q-primary)',
      '--w3m-font-family': 'inherit',
      '--w3m-z-index': 999999999,
    },
  })

  app.config.globalProperties.$appkit = appKit
})
