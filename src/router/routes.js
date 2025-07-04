const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/proposals',
    children: [
      {
        path: '/proposals',
        component: () => import('src/pages/ProposalPage.vue'),
        name: 'ProposalPage',
        meta: {
          title: 'Proposals',
        },
        redirect: '/proposals',
        children: [
          {
            path: '',
            component: () => import('src/pages/proposals/ListPage.vue'),
            name: 'ProposalsListPage',
          },
          {
            path: '/detail/:pid',
            component: () => import('src/pages/proposals/DetailPage.vue'),
            name: 'ProposalDetailPage',
          },
          {
            path: 'create-proposal',
            component: () => import('src/pages/proposals/CreatePage.vue'),
            name: 'CreateProposalPage',
          },
        ],
      },
      {
        path: 'record',
        component: () => import('src/pages/RecordPage.vue'),
        name: 'PledgeRecord',
      },
      {
        path: 'social',
        component: () => import('pages/SocialPage.vue'),
        name: 'SocialPage',
      },
      {
        path: 'help',
        component: () => import('src/pages/HelpPage.vue'),
        name: 'HelpPage',
      },
    ],
  },
  {
    path: '/allocator',
    component: () => import('layouts/AllocatorLayout.vue'),
    name: 'AllocatorLayout',
    redirect: '/allocator',
    children: [
      {
        path: '',
        component: () => import('src/pages/allocator/ProposalManagement.vue'),
        name: 'ProposalManagement',
        meta: {
          title: 'Proposal Management',
        },
      },
    ],
  },
  {
    path: '/error/:code',
    component: () => import('src/pages/AppErrorPage.vue'),
    name: 'AppErrorPage',
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
