

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
        id: 'type',
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
        id: 'kernel',
        displayName: 'Linux Kernel',
        operation: 'validateKernel',
        colSize: 1
    },
    {
        id: 'iso',
        displayName: 'Base Linux ISO',
        operation: 'validateISO',
        colSize: 2
    },
];

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