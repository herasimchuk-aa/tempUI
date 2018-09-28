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
          icon: 'icon-book-open',
        },
        {
          name: 'Node Config',
          url: '/pcc/node/NodeConfigSummary',
          // icon: 'icon-layers',
          icon: 'icon-note'
        },
        {
          name: 'Roles',
          url: '/pcc/node/Roles',
          icon: 'icon-organization',
        },
        {
          name: 'Types',
          url: '/pcc/node/Types',
          icon: 'icon-notebook',
        },
/*         {
          name: 'Linux Kernel',
          url: '/pcc/node/Linuxkernel',
          icon: 'icon-map',
        },
        {
          name: 'Goes',
          url: '/pcc/node/Goes',
          icon: 'icon-map',
        },
        {
          name: 'LLDP',
          url: '/pcc/node/Lldp',
          icon: 'icon-map',
        },
        {
          name: 'EthTool',
          url: '/pcc/node/EthTool',
          icon: 'icon-map',
        },*/
        {
          name: 'Site',
          url: '/pcc/node/Site',
          icon: 'icon-map',
        },
        /*{
          name: 'Base Linux ISO',
          url: '/pcc/node/BaseLinuxIso',
          icon: 'icon-bell',
        },*/ 
        {
          name: 'Linux',
          url: '/pcc/node/linux',
          icon: 'icon-disc',
        },
        {
          name: 'Apps',
          url: '/pcc/node/apps',
          icon: 'icon-vector',
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
    },/*
    /*{
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
    },*/
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
