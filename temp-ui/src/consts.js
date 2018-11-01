export let configs = [
    {
        Name: 'daemons',
        Content: ''
    },
    {
        Name: 'zebra.conf',
        Content: ''
    },
    {
        Name: 'vtysh.conf',
        Content: ''
    },
    {
        Name: 'rpingd.conf',
        Content: ''
    },
    {
        Name: 'ripd.conf',
        Content: ''
    },
    {
        Name: 'pimd.conf',
        Content: ''
    },
    {
        Name: 'ospfd.conf',
        Content: ''
    },
    {
        Name: 'ospf6d.conf',
        Content: ''
    },
    {
        Name: 'ldpd.conf',
        Content: ''
    },
    {
        Name: 'bgpd.conf',
        Content: ''
    },
    {
        Name: 'isisd.conf',
        Content: ''
    },
    {
        Name: 'frr.conf',
        Content: ''
    }
];

export let nodeHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'Host',
        displayName: 'Host',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'site',
        displayName: 'Site',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'clusterName',
        displayName: 'Cluster',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'Status',
        displayName: 'Status',
        operation: 'badge',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'roleDetails',
        displayName: 'Roles',
        operation: 'array',
        colSize: 2,
        showDefault: true
    },
    {
        id: 'Type',
        displayName: 'Type',
        operation: 'validateType',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'SN',
        displayName: 'Serial Number',
        operation: 'validateSN',
        colSize: 2,
        showDefault: true
    },
    {
        id: 'Kernel',
        displayName: 'Linux Kernel',
        operation: 'validateKernel',
        colSize: 1,
        showDefault: true
    },
    {
        id: 'BaseISO',
        displayName: 'Base Linux ISO',
        operation: 'validateISO',
        colSize: 2,
        showDefault: true
    },
    {
        id: 'ExecId',
        displayName: 'Provision status',
        operation: 'provision',
        colSize: 2,
        showDefault: true
    },
    {
        id: 'kernelVersion',
        displayName: 'platina-mk1',
        colSize: 1,
        showDefault: false
    },
    {
        id: 'goes',
        displayName: 'Goes',
        operation: 'list',
        colSize: 1,
        showDefault: false
    },
    {
        id: 'lldp',
        displayName: 'LLDP',
        operation: 'validateLLDP',
        colSize: 1,
        showDefault: false
    },
    {
        id: 'ethTool',
        displayName: 'Ethtool',
        operation: 'validateEthtool',
        colSize: 1,
        showDefault: false
    },
    {
        id: 'frr',
        displayName: 'FRR',
        operation: 'validateFRR',
        colSize: 1,
        showDefault: false
    },
    {
        id: 'ipRoute',
        displayName: 'IpRoute2',
        operation: 'validateIpRoute2',
        colSize: 1,
        showDefault: false
    }
];

export let connectivityHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 1
    },
    {
        id: 'Host',
        displayName: 'Host',
        colSize: 1
    },
    {
        id: 'Status',
        displayName: 'Status',
        operation: 'badge',
        colSize: 1
    },
    {
        id: 'roleDetails',
        displayName: 'Roles',
        operation: 'array',
        colSize: 1
    },
    {
        id: 'type',
        displayName: 'Type',
        colSize: 1
    },
    {
        id: 'interfaces',
        displayName: 'Interfaces',
        operation: 'interfaceArray',
        colSize: 1
    },
    {
        id: 'Ip_address',
        displayName: 'IP Address',
        operation: 'ipArray',
        colSize: 1
    },
    {
        id: 'ConnecteTo',
        displayName: 'Connected To',
        operation: 'connectedToArray',
        colSize: 2
    },
    // {
    //     id: 'Admin_state',
    //     displayName: 'Admin state',
    //     operation: 'adminStateArray',
    //     colSize: 1
    // },
    {
        id: 'Link_status',
        displayName: 'Link',
        operation: 'linkArray',
        colSize: 1
    },
    {
        id: 'Lldp_matched',
        displayName: 'LLDP matched',
        operation: 'lldpArray',
        colSize: 1
    }
    // {
    //     id: 'Interface_alarm',
    //     displayName: 'Interface Alarms',
    //     colSize: 1
    // }
]

export let roleHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'ParentName',
        displayName: 'Parent Role',
        colSize: 4
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 4
    },
];

export let typeHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 2
    },
    {
        id: 'Vendor',
        displayName: 'Vendor',
        colSize: 1
    },
    {
        id: 'RackUnit',
        displayName: 'Rack Unit',
        colSize: 1
    },
    {
        id: 'Airflow',
        displayName: 'Airflow',
        colSize: 1
    },
    {
        id: 'FrontPanelInterfaces',
        displayName: 'Front panel Interfaces',
        colSize: 2
    },
    {
        id: 'SpeedFrontPanelInterfaces',
        displayName: 'Speed Front Panel Interface',
        colSize: 3
    },
    {
        id: 'ManagementInterfaces',
        displayName: 'Management Interfaces',
        colSize: 1
    },
    {
        id: 'SpeedType',
        displayName: 'Speed/Type',
        colSize: 1
    }
];

export let kernelHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 4
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 4
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 4
    }
];

export let preScriptHead = [
    {
        id: 'Name',
        displayName: 'Name',
    },
    {
        id: 'Description',
        displayName: 'Description',
    }
];

export let postScriptHead = [
    {
        id: 'Name',
        displayName: 'Name',
    },
    {
        id: 'Description',
        displayName: 'Description',
    }
];

export let ipRouteHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    },
    {
        id: 'Version',
        displayName: 'Version',
        colSize: 3
    }
];

export let frrHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    },
    {
        id: 'Version',
        displayName: 'Version',
        colSize: 3
    }
];

export let goesHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    },
    {
        id: 'Version',
        displayName: 'Version',
        colSize: 3
    }
];


export let modProbeHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    }
];

export let modulesLoadHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    }
];

export let lldpHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    },
    {
        id: 'Version',
        displayName: 'Version',
        colSize: 3
    }
];

export let ethHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 3
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 3
    },
    {
        id: 'Version',
        displayName: 'Version',
        colSize: 3
    }
];

export let isoHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 4
    },
    {
        id: 'Location',
        displayName: 'Location',
        colSize: 4
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 4
    }
];

export let siteHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 6
    },
    {
        id: 'Description',
        displayName: 'Description',
        colSize: 6
    }
];

export let clusterHead = [
    {
        id: 'Name',
        displayName: 'Name'
    },
    {
        id: 'SiteName',
        displayName: 'Site',
    },
    {
        id: 'Description',
        displayName: 'Description'
    }
];



export let entityHead = [
    {
        id: 'Name',
        displayName: 'Name',
    },
    {
        id: 'Description',
        displayName: 'Description',
    }
];

export let permissionHead = [
    {
        id: 'Name',
        displayName: 'Name'
    },
    {
        id: 'EntityName',
        displayName: 'Entity'
    },
    {
        id: 'create',
        displayName: 'Create',
        operation: 'boolean'
    },
    {
        id: 'read',
        displayName: 'Read',
        operation: 'boolean'
    },
    {
        id: 'update',
        displayName: 'Update',
        operation: 'boolean'
    },
    {
        id: 'delete',
        displayName: 'Delete',
        operation: 'boolean'
    },
    {
        id: 'execute',
        displayName: 'Execute',
        operation: 'boolean'
    }

];

export let userHead = [
    {
        id: 'Name',
        displayName: 'Name',
    },
    {
        id: 'Username',
        displayName: 'User Name',
    },
    {
        id: 'Email',
        displayName: 'Email ID',
    },
    {
        id: 'UserRoles',
        displayName: 'Roles',
        operation: 'array',
        showDefault: true
    }
];

export let userRoleHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 6
    },
    {
        id: 'Permissions',
        displayName: 'Permission',
        operation: 'array',
        colSize: 6,
        showDefault: true
    }
];