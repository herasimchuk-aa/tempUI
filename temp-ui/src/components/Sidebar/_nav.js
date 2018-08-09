export default {
  items: [
    {
      name: 'Dashboard',
      url: '/pcc/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: ''
      }
    },
    {
      title: true,
      name: 'Infrastructure',
    },
    {
      name: 'Node',
      url: '/pcc/node',
      icon: 'icon-puzzle',

      children: [
        {
          name: 'Summary',
          url: '/pcc/node/Summary',
          icon: 'icon-cursor',
        },
        {
          name: 'Node Config',
          url: '/pcc/node/NodeConfigSummary',
          icon: 'icon-layers',
        },
        {
          name: 'Roles',
          url: '/pcc/node/Roles',
          icon: 'icon-pie-chart',
        },
        {
          name: 'Types',
          url: '/pcc/node/Types',
          icon: 'icon-note',
        },
        {
          name: 'Linux Kernel',
          url: '/pcc/node/Linuxkernel',
          icon: 'icon-map',
        },
        {
          name: 'Site',
          url: '/pcc/node/Site',
          icon: 'icon-map',
        },
        {
          name: 'Base Linux ISO',
          url: '/pcc/node/BaseLinuxIso',
          icon: 'icon-bell',
        }
      ],
    },
    {
      name: 'Connectivity',
      url: '/pcc/connectivity',
      icon: 'icon-pencil',
      children: [
        {
          name: 'Summary',
          url: '/pcc/connectivity/Summary',
          icon: 'icon-star',
        }
      ],
    },
    {
      name: 'Monitoring',
      url: '/pcc/monitoring',
      icon: 'icon-calculator',
      children: [{
        name: 'BMC Monitor',
        url: '/pcc/monitoring/BmcMonitor',
        icon: 'icon-calculator',
      },
      {
        name: 'Tiles-App',
        url: '/pcc/monitoring/TilesApp',
        icon: 'icon-layers',
      },
        // {
        //   name: 'IPVS',
        //   url: '/monitoring/ipvs',
        //   icon: 'icon-graph',
        // },
      ]
    },
    {
      name: 'Kubernetes',
      url: '/pcc/kubernetes',
      icon: 'icon-vector',
    },
    // {
    //   title: true,
    //   name: 'Operations',
    //   wrapper: {            
    //     element: '',        
    //     attributes: {}      
    //   },
    //   class: ''             
    // },
    // {
    //   name: 'Inventory',
    //   url: '/operation/inventory',
    //   icon: 'icon-layers',
    // },
    // {
    //   name: 'Actions',
    //   url: '/operation/playbook',
    //   icon: 'icon-control-play',
    // },
    // {
    //   name: 'Monitor',
    //   url: '/operation/monitor',
    //   icon: 'icon-graph',
    // },
  ]
};
