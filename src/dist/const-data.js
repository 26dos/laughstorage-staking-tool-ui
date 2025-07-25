import { filecoin } from '@reown/appkit/networks'

export const dAppMetaData = {
  appName: 'Laughstorage staking tool',
  description: 'Staking Filecoin',
  appUrl: 'https://staking.filecoin.io',
  icons: ['https://staking.filecoin.io/favicon.ico'],
}

export const dAppProjectId = '0c6c2bb6a4b6e903a6e679ab3b75709a'

export const networks = [filecoin]

export const viewLink = {
  tx: 'https://filfox.info/zh/message/',
}

export const constStatusConfig = {
  draft: { color: 'negative', label: 'Draft', icon: 'drive_file_rename_outline' },
  submit: { color: 'grey', label: 'Awaiting approval', icon: 'pending_actions' },
  approved: { color: 'green', label: 'Approved', icon: 'check' },
  rejected: { color: 'red', label: 'Rejected', icon: 'close' },
  waiting_staking: { color: 'blue', label: 'Waiting staking', icon: 'pending_actions' },
  waiting_allocation: { color: 'blue', label: 'Waiting allocation', icon: 'pending_actions' },
  reject: { color: 'warning', label: 'Rejected', icon: 'close' },
  success: { color: 'positive', label: 'Success', icon: 'check_circle' },
}

export const constDataCapUnit = ['TiB', 'PiB', 'GiB']

export const constStakeDaysOptions = [
  { label: 'Public datasets', value: 20 },
  { label: 'Private datasets', value: 40 },
]
