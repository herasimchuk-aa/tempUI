export let data = {
    'SJC0': [
        {
            name : 'sjc01-pd1-sp01',
            k8Status: 'Unavailable',
            roles: ['Spine'],
            type: 'PS-3001'
        },
        {
            name : 'sjc01-pd1-lf01',
            k8Status: 'k8Deployed',
            roles: ['Leaf','K8Master','k8Worker','etcD'],
            type: 'PS-3001'
        },
        {
            name : 'sjc01-pd1-lf02',
            k8Status: 'k8Deployed',
            roles: ['Leaf','K8Master','k8Worker','etcD'],
            type: 'PS-3001'
        },
        {
            name : 'sjc01-pd1-sv1',
            k8Status: 'k8Deployed',
            roles: ['K8Worker', 'etcD', 'cache'],
            type: 'SuperMicro x'
        },
        {
            name : 'sjc01-pd1-sv2',
            k8Status: 'k8Deployed',
            roles: ['K8Worker', 'etcD', 'cache'],
            type: 'SuperMicro x'
        },
        {
            name : 'sjc01-pd1-sv3',
            k8Status: 'Available',
            roles: ['K8Worker','cache'],
            type: 'SuperMicro x'
        },
        {
            name : 'sjc01-pd1-sv4',
            k8Status: 'Available',
            roles: ['K8Worker','cache'],
            type: 'SuperMicro x'
        },
    ],
    'LAX0' : [ 
        {
            name: 'lax01-pd1-lf01',
            k8Status: 'k8Deployed',
            roles: ['Leaf', 'K8Master', 'k8Worker', 'etcD'],
            type: 'PS-3001'
        },
        {
            name: 'lax01-pd1-lf02',
            k8Status: 'k8Deployed',
            roles: ['Leaf', 'K8Master', 'k8Worker', 'etcD'],
            type: 'PS-3001'
        },
        {
            name: 'lax01-pd1-sv01',
            k8Status: 'k8Deployed',
            roles: ['K8Worker', 'etcD', 'cache'],
            type: 'SuperMicro x'
        },
        {
            name: 'lax01-pd1-sv02',
            k8Status: 'k8Deployed',
            roles: ['K8Worker', 'cache'],
            type: 'SuperMicro x'
        },

    ]

};