import { api } from 'src/boot/axios'
import { Cookies } from 'quasar'

export const authApi = {
  // /api/auth/nonce
  nonce: () => api.get('/auth/nonce'),
  // /api/auth/login
  login: (data) => api.post('/auth/login', data),
}

export const proposalApi = {
  // proposals
  create: (data) => api.post('/proposals', data),
  // /api/proposals/my
  myProposals: () => api.get('/proposals/my'),
  // /api/proposals
  proposals: () => api.get('/proposals'),
  // /api/proposals/{p_id}
  proposal: (p_id) => api.get(`/proposals/${p_id}`),
  //  /api/proposals/{id}/proposals-audit
  audit: (p_id, data) => api.post(`/proposals/${p_id}/proposals-audit`, data),
  //  /api/proposals/{pid}/proposals-rejection
  rejection: (p_id, data) => api.post(`/proposals/${p_id}/proposals-rejection`, data),
}

export const userApi = {
  // /api/user
  info: () => api.get('/user'),
  // /api/user/kyc-verify
  kycVerify: (data) => api.post('/user/kyc-verify', data),
}

export const commentApi = {
  // /api/comments/comments/{p_id}
  publish: (p_id, data) => api.post(`/comments/${p_id}`, data),
  // /api/comments/{p_id}
  comments: (p_id, data) =>
    api.get(`/comments/${p_id}`, {
      params: data,
    }),
  // delete  /api/comments/{c_id}
  delete: (c_id) => api.delete(`/comments/${c_id}`),
}

export const userAppToken = {
  key: 'LaughstorageStakingToolUserToken',
  has: function () {
    return Cookies.has(this.key)
  },
  save: function (token) {
    return Cookies.set(this.key, token, {
      path: '/',
    })
  },
  saveAccount: function (account) {
    return Cookies.set(`${this.key}Account`, account, {
      path: '/',
    })
  },
  getAccount: function () {
    return Cookies.get(`${this.key}Account`)
  },
  get: function () {
    return Cookies.get(this.key)
  },
  del: function () {
    const accountKey = `${this.key}Account`
    Cookies.remove(this.key, {
      path: '/',
    })
    Cookies.remove(accountKey, {
      path: '/',
    })
  },
}
