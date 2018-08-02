

export let nodeHead = [
    {
        id: 'name',
        displayName: 'Name',
        colSize: 1
    },
    {
        id: 'site',
        displayName: 'Site',
        colSize: 1
    },
    {
        id: 'status',
        displayName: 'Status',
        operation: 'badge',
        colSize: 2
    },
    {
        id: 'roles',
        displayName: 'Roles',
        operation: 'array',
        colSize: 2
    },
    {
        id: 'nodeType',
        displayName: 'Type',
        operation: 'validateType',
        colSize: 1
    },
    {
        id: 'serialNumber',
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
        id: 'linuxISO',
        displayName: 'Base Linux ISO',
        operation: 'validateISO',
        colSize: 2
    },
];

export let roleHead = [
    {
        id: 'label',
        displayName: 'Name',
        colSize: 3
    },
    {
        id: 'parent',
        displayName: 'Parent Role',
        colSize: 4
    },
    {
        id: 'description',
        displayName: 'Description',
        colSize: 4
    },
];

export let typeHead = [
    {
        id: 'label',
        displayName: 'Name',
        colSize: 2
    },
    {
        id: 'vendor',
        displayName: 'Vendor',
        colSize: 1
    },
    {
        id: 'rackUnit',
        displayName: 'Rack Unit',
        colSize: 1
    },
    {
        id: 'airflow',
        displayName: 'AirFlow',
        colSize: 1
    },
    {
        id: 'numFrontPanelInterface',
        displayName: 'Front panel Interfaces',
        colSize: 2
    },
    {
        id: 'speedFrontPanelInterface',
        displayName: 'Speed Front Panel Interface',
        colSize: 2
    },
    {
        id: 'numMgmtInterface',
        displayName: 'Management Interfaces',
        colSize: 1
    },
    {
        id: 'speedMgmtInterafce',
        displayName: 'Speed/Type',
        colSize: 1
    },
    {
        id: 'description',
        displayName: 'Notes',
        colSize: 1
    },
];

export let kernelHead = [
    {
        id: 'label',
        displayName: 'Name',
        colSize: 4
    },
    {
        id: 'location',
        displayName: 'Location',
        colSize: 4
    },
    {
        id: 'description',
        displayName: 'Description',
        colSize: 4
    }
];

export let isoHead = [
    {
        id: 'label',
        displayName: 'Name',
        colSize: 4
    },
    {
        id: 'location',
        displayName: 'Location',
        colSize: 4
    },
    {
        id: 'description',
        displayName: 'Description',
        colSize: 4
    }
];

export let siteHead = [
    {
        id: 'label',
        displayName: 'Name',
        colSize: 6
    },
    {
        id: 'description',
        displayName: 'Description',
        colSize: 6
    }
];