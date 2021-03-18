export default [
  {
    path: '/',
    component: '../layouts/BasicLayout2',
  },
  // {
  //   path: '/',
  //   component: '../layouts/BasicLayout2',
  //   routes: [
  //     {
  //       path: '/user',
  //       component: '../layouts/UserLayout',
  //       routes: [
  //         {
  //           name: 'login',
  //           path: '/user/login',
  //           component: './User/login',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/',
  //       component: '../layouts/SecurityLayout',
  //       routes: [
  //         {
  //           path: '/',
  //           component: '../layouts/BasicLayout',
  //           authority: ['admin', 'user'],
  //           routes: [
  //             {
  //               path: '/',
  //               redirect: '/welcome',
  //             },
  //             {
  //               path: '/welcome',
  //               name: 'welcome',
  //               icon: 'smile',
  //               component: './Welcome',
  //             },
  //             {
  //               name: 'Redis连接管理',
  //               icon: 'PartitionOutlined',
  //               path: '/redisConnectionManage',
  //               component: './RedisConnectionManage',
  //             },
  //             {
  //               name: 'Redis数据管理',
  //               icon: 'DatabaseOutlined',
  //               path: '/redisDataManage',
  //               component: './redisDataManage',
  //             },
  //             {
  //               name: 'Redis数据管理2',
  //               icon: 'DatabaseOutlined',
  //               path: '/redisDataManage2',
  //               component: './redisDataManage2',
  //             },
  //             {
  //               component: './404',
  //             },
  //           ],
  //         },
  //         {
  //           component: './404',
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    component: './404',
  },
];
