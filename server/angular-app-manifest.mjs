
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/qubit/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/qubit/home",
    "route": "/qubit"
  },
  {
    "renderMode": 2,
    "route": "/qubit/home"
  },
  {
    "renderMode": 2,
    "route": "/qubit/about"
  },
  {
    "renderMode": 2,
    "route": "/qubit/contact"
  },
  {
    "renderMode": 2,
    "route": "/qubit/events"
  },
  {
    "renderMode": 2,
    "route": "/qubit/gallery"
  },
  {
    "renderMode": 2,
    "route": "/qubit/blog"
  },
  {
    "renderMode": 2,
    "route": "/qubit/blog/write"
  },
  {
    "renderMode": 2,
    "route": "/qubit/login"
  },
  {
    "renderMode": 2,
    "route": "/qubit/sign-up"
  },
  {
    "renderMode": 2,
    "route": "/qubit/student/profile"
  },
  {
    "renderMode": 2,
    "route": "/qubit/admin/gallery"
  },
  {
    "renderMode": 2,
    "route": "/qubit/admin/feedback"
  },
  {
    "renderMode": 2,
    "route": "/qubit/admin/events"
  },
  {
    "renderMode": 2,
    "route": "/qubit/admin/members"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-UEMYESJ5.js"
    ],
    "route": "/qubit/tab-release-info"
  },
  {
    "renderMode": 2,
    "route": "/qubit/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23668, hash: 'c5ebd9483d75a72cc6b56436f1bf86ce79dc83db26b9271b9b40101159a4be65', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17242, hash: 'f3c009970f29264cd068c895b8aebf4fad75ce51c2e0c76a86fcf637f2a08ca4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'about/index.html': {size: 34140, hash: '32aa7f1b240243442b7db99a6ccd0b7bb4ec944969a81518c5ce8089845538f9', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 31599, hash: '3bd02a5085fdb9c8dfbb0d74500aec90c64eb823f03db6df5d4200749274c4f7', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 31255, hash: '1060c3f846f0ea90f176716c739a91d41a7955aa117e2400ac1ef731764fda07', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'blog/index.html': {size: 35591, hash: '6ad3c1e7ef1b16c4f92f4499993d47963895f36fe1bca36a2c3784ad5a73c47d', text: () => import('./assets-chunks/blog_index_html.mjs').then(m => m.default)},
    'blog/write/index.html': {size: 28908, hash: '3f45d2f637adaaa0e36cf0c179d3aca9e6fbace3a66b80e79ab6409591a4cef0', text: () => import('./assets-chunks/blog_write_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 28260, hash: '8d1319910ec50298cee5618352665c706b5ae674351c489e769598c904687f70', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'sign-up/index.html': {size: 114657, hash: 'e6e3968be72c27ec9230d1e33d580aed9ca37e1e38ffcb9c20420584c0898f83', text: () => import('./assets-chunks/sign-up_index_html.mjs').then(m => m.default)},
    'student/profile/index.html': {size: 28260, hash: '8d1319910ec50298cee5618352665c706b5ae674351c489e769598c904687f70', text: () => import('./assets-chunks/student_profile_index_html.mjs').then(m => m.default)},
    'admin/gallery/index.html': {size: 25883, hash: 'c0f822b4acb59e16a33d2547c35447886b5a98fa563290bf05b647efaee0792b', text: () => import('./assets-chunks/admin_gallery_index_html.mjs').then(m => m.default)},
    'admin/feedback/index.html': {size: 25883, hash: 'c0f822b4acb59e16a33d2547c35447886b5a98fa563290bf05b647efaee0792b', text: () => import('./assets-chunks/admin_feedback_index_html.mjs').then(m => m.default)},
    'admin/events/index.html': {size: 25883, hash: 'c0f822b4acb59e16a33d2547c35447886b5a98fa563290bf05b647efaee0792b', text: () => import('./assets-chunks/admin_events_index_html.mjs').then(m => m.default)},
    'admin/members/index.html': {size: 25883, hash: 'c0f822b4acb59e16a33d2547c35447886b5a98fa563290bf05b647efaee0792b', text: () => import('./assets-chunks/admin_members_index_html.mjs').then(m => m.default)},
    'tab-release-info/index.html': {size: 25650, hash: 'd116ea216e4dbcfce4c90bed747925dd3f1cdde8e22941bd675df5168ae6618e', text: () => import('./assets-chunks/tab-release-info_index_html.mjs').then(m => m.default)},
    'events/index.html': {size: 898748, hash: 'fe9db8aec2dfbcbfcf8f5cffc3a37203e646e6d1a7579377142f6fab21c1d835', text: () => import('./assets-chunks/events_index_html.mjs').then(m => m.default)},
    'gallery/index.html': {size: 9222979, hash: '3a4fa52b3005e624bd15a91b5b8fc5073754c4ad0f4a7da8958b204edb1ccdc8', text: () => import('./assets-chunks/gallery_index_html.mjs').then(m => m.default)},
    'styles-HXGWKUQ7.css': {size: 31211, hash: 'uFgaRDTO+Bo', text: () => import('./assets-chunks/styles-HXGWKUQ7_css.mjs').then(m => m.default)}
  },
};
