

export let nodeHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 1
    },
    {
        id: 'site',
        displayName: 'Site',
        colSize: 1
    },
    {
        id: 'Status',
        displayName: 'Status',
        operation: 'badge',
        colSize: 2
    },
    {
        id: 'roleDetails',
        displayName: 'Roles',
        operation: 'array',
        colSize: 2
    },
    {
        id: 'Type',
        displayName: 'Type',
        operation: 'validateType',
        colSize: 1
    },
    {
        id: 'SN',
        displayName: 'Serial Number',
        operation: 'validateSN',
        colSize: 2
    },
    {
        id: 'Kernel',
        displayName: 'Linux Kernel',
        operation: 'validateKernel',
        colSize: 1
    },
    {
        id: 'BaseISO',
        displayName: 'Base Linux ISO',
        operation: 'validateISO',
        colSize: 2
    },
];

export let connectivityHead = [
    {
        id: 'Name',
        displayName: 'Name',
        colSize: 1
    },
    {
        id: 'Status',
        displayName: 'Status',
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
    // {
    //     id: 'Lldp_matched',
    //     displayName: 'LLDP matched',
    //     operation: 'lldpArray',
    //     colSize: 1
    // }
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
        colSize: 2
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
    },
    {
        id: 'Description',
        displayName: 'Notes',
        colSize: 1
    },
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