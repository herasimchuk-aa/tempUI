export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
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
      url : '/node',
      icon: 'icon-puzzle',
      
      children: [
        {
          name: 'Summary',
          url: '/node/Summary',
          icon: 'icon-cursor',
        },
        {
          name: 'Node Config',
          url: '/node/NodeConfigSummary',
          icon: 'icon-layers',
        },
        {
          name: 'Roles',
          url: '/node/Roles',
          icon: 'icon-pie-chart',
        },
        {
          name: 'Types',
          url: '/node/Types',
          icon: 'icon-note',
        },
        {
          name: 'Linux Kernel',
          url: '/node/Linuxkernel',
          icon: 'icon-map',
        },
        {
          name: 'Site',
          url: '/node/Site',
          icon: 'icon-map',
        },
        {
          name: 'Base Linux ISO',
          url: '/node/BaseLinuxIso',
          icon: 'icon-bell',
        }
      ],
    },
    {
      name: 'Connectivity',
      url : '/connectivity',
      icon: 'icon-pencil',
      children: [
       {
         name: 'Summary',
         url: '/connectivity/Summary',
         icon: 'icon-star',
       }
      ],
    },
    {
      name: 'Monitoring',
      url: '/monitoring',
      icon: 'icon-calculator',
      children: [{
        name: 'BMC Monitor',
        url: '/monitoring/BmcMonitor',
        icon: 'icon-calculator',
      },
      {
         name: 'Tiles-App',
         url: '/monitoring/TilesApp',
         icon: 'icon-layers',
       },
      {
        name: 'IPVS',
        url: '/monitoring/ipvs',
        icon: 'icon-graph',
      },]
    },
    {
      name: 'Kubernetes',
      url: '/kubernetes',
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
