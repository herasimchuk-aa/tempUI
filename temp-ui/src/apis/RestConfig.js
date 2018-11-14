
//Applications endpoints
export const PCC_SERVER_APP = "/pccserver"
export const SECURITY_APP = "/security"
export const USER_MANAGEMENT_APP = "/user-management"

// apis for site
export const FETCH_ALL_SITES = PCC_SERVER_APP+"/site/"
export const ADD_SITE = PCC_SERVER_APP+"/site/add"
export const UPDATE_SITE = PCC_SERVER_APP+"/site/update"
export const DELETE_SITES = PCC_SERVER_APP+"/site/delete"

// apis for cluster
export const FETCH_ALL_CLUSTERS = PCC_SERVER_APP+"/cluster/"
export const ADD_CLUSTER = PCC_SERVER_APP+"/cluster/add"
export const UPDATE_CLUSTER = PCC_SERVER_APP+"/cluster/update"
export const DELETE_CLUSTERS = PCC_SERVER_APP+"/cluster/delete"

// apis for role
export const FETCH_ALL_ROLES = PCC_SERVER_APP+"/role/"
export const ADD_ROLE = PCC_SERVER_APP+"/role/add"
export const UPDATE_ROLE = PCC_SERVER_APP+"/role/update"
export const DELETE_ROLES = PCC_SERVER_APP+"/role/delete"

// apis for baseIso
export const FETCH_ALL_ISOS = PCC_SERVER_APP+"/iso/"
export const ADD_ISO = PCC_SERVER_APP+"/iso/add"
export const UPDATE_ISO = PCC_SERVER_APP+"/iso/update"
export const DELETE_ISOS = PCC_SERVER_APP+"/iso/delete"

// apis for kernel
export const FETCH_ALL_KERNELS = PCC_SERVER_APP+"/kernel/"
export const ADD_KERNEL = PCC_SERVER_APP+"/kernel/add"
export const UPDATE_KERNEL = PCC_SERVER_APP+"/kernel/update"
export const DELETE_KERNELS = PCC_SERVER_APP+"/kernel/delete"

// apis for preScript
export const FETCH_ALL_PRESCRIPTS = PCC_SERVER_APP+"/prescript/"
export const ADD_PRESCRIPT = PCC_SERVER_APP+"/prescript/add"
export const UPDATE_PRESCRIPT = PCC_SERVER_APP+"/prescript/update"
export const DELETE_PRESCRIPTS = PCC_SERVER_APP+"/prescript/delete"

// apis for postScript
export const FETCH_ALL_POSTSCRIPTS = PCC_SERVER_APP+"/postscript/"
export const ADD_POSTSCRIPT = PCC_SERVER_APP+"/postscript/add"
export const UPDATE_POSTSCRIPT = PCC_SERVER_APP+"/postscript/update"
export const DELETE_POSTSCRIPTS = PCC_SERVER_APP+"/postscript/delete"

// apis for systemType
export const FETCH_ALL_SYSTEM_TYPES = PCC_SERVER_APP+"/type"
export const ADD_SYSTEM_TYPE = PCC_SERVER_APP+"/type/add"
export const UPDATE_SYSTEM_TYPE = PCC_SERVER_APP+"/type/update"
export const DELETE_SYSTEM_TYPES = PCC_SERVER_APP+"/type/delete"

// apis for goes
export const FETCH_ALL_GOES = PCC_SERVER_APP+"/goes/"
export const ADD_GOES = PCC_SERVER_APP+"/goes/add"
export const UPDATE_GOES = PCC_SERVER_APP+"/goes/update"
export const DELETE_GOES = PCC_SERVER_APP+"/goes/delete"



// apis for modProbe
export const FETCH_ALL_MODPROBE = PCC_SERVER_APP+"/modprobe/"
export const ADD_MODPROBE = PCC_SERVER_APP+"/modprobe/add"
export const UPDATE_MODPROBE = PCC_SERVER_APP+"/modprobe/update"
export const DELETE_MODPROBE = PCC_SERVER_APP+"/modprobe/delete"

// apis for modulesLoad
export const FETCH_ALL_MODULES_LOAD = PCC_SERVER_APP+"/modulesload/"
export const ADD_MODULES_LOAD = PCC_SERVER_APP+"/modulesload/add"
export const UPDATE_MODULES_LOAD = PCC_SERVER_APP+"/modulesload/update"
export const DELETE_MODULES_LOAD = PCC_SERVER_APP+"/modulesload/delete"

// apis for lldp
export const FETCH_ALL_LLDP = PCC_SERVER_APP+"/lldp/"
export const ADD_LLDP = PCC_SERVER_APP+"/lldp/add"
export const UPDATE_LLDP = PCC_SERVER_APP+"/lldp/update"
export const DELETE_LLDP = PCC_SERVER_APP+"/lldp/delete"

// apis for ethtool
export const FETCH_ALL_ETHTOOL = PCC_SERVER_APP+"/ethtool/"
export const ADD_ETHTOOL = PCC_SERVER_APP+"/ethtool/add"
export const UPDATE_ETHTOOL = PCC_SERVER_APP+"/ethtool/update"
export const DELETE_ETHTOOL = PCC_SERVER_APP+"/ethtool/delete"

// apis for ipRoute
export const FETCH_ALL_IPROUTE = PCC_SERVER_APP+"/iproute/"
export const ADD_IPROUTE = PCC_SERVER_APP+"/iproute/add"
export const UPDATE_IPROUTE = PCC_SERVER_APP+"/iproute/update"
export const DELETE_IPROUTE = PCC_SERVER_APP+"/iproute/delete"

// apis for frr
export const FETCH_ALL_FRR = PCC_SERVER_APP+"/frr/"
export const ADD_FRR = PCC_SERVER_APP+"/frr/add"
export const UPDATE_FRR = PCC_SERVER_APP+"/frr/update"
export const DELETE_FRR = PCC_SERVER_APP+"/frr/delete"


// apis for node
export const FETCH_ALL_NODES = PCC_SERVER_APP+"/node"
export const ADD_NODE = PCC_SERVER_APP+"/node/add"
export const UPDATE_NODES = PCC_SERVER_APP+"/node/update"
export const DELETE_NODES = PCC_SERVER_APP+"/node/delete"


// apis for interface
export const FETCH_ALL_INTERFACES = PCC_SERVER_APP+"/interface"
export const ADD_INTERFACES = PCC_SERVER_APP+"/interface/add"
export const UPDATE_INTERFACES = PCC_SERVER_APP+"/interface/update"
export const DELETE_INTERFACES = PCC_SERVER_APP+"/interface/delete"

// apis for k8s
export const FETCH_ALL_KUBERNETES = PCC_SERVER_APP+"/kubernetes"

//apis for discover
export const DISCOVER = PCC_SERVER_APP+"/node/discover"

//apis for provision
export const PROVISION = PCC_SERVER_APP+"/provision/"
export const GET_PROVISION = PCC_SERVER_APP+"/provision/status/"
export const ROLLBACK_PROVISION = PCC_SERVER_APP+"/provision/rollback/"

//apis for constants
export const FETCH_ALL_SPEEDS = PCC_SERVER_APP+"/speed"
export const FETCH_ALL_FECS = PCC_SERVER_APP+"/fec"
export const FETCH_ALL_MEDIAS = PCC_SERVER_APP+"/media"

//apis for entity
export const FETCH_ALL_ENTITIES = PCC_SERVER_APP+"/rbac/entity"
export const ADD_ENTITY = PCC_SERVER_APP+"/rbac/entity/add"
export const UPDATE_ENTITY = PCC_SERVER_APP+"/rbac/entity/update"
export const DELETE_ENTITIES = PCC_SERVER_APP+"/rbac/entity/delete"

//apis for user
export const FETCH_ALL_USERS = USER_MANAGEMENT_APP+"/user/list"
export const UPDATE_USER = PCC_SERVER_APP+"/user/update" //TODO[Aucta] wait for security service request support
export const DELETE_USERS = USER_MANAGEMENT_APP+"/user/delete"
export const ADD_USER = USER_MANAGEMENT_APP+"/user/register"
export const FORGOT_PASSWORD = USER_MANAGEMENT_APP+"/user/recovery"
export const UPDATE_PASSWORD = USER_MANAGEMENT_APP+"/user/set-password"

//apis for rbac role
export const FETCH_ALL_RBAC_ROLES = USER_MANAGEMENT_APP+"/role/list"
export const ADD_RBAC_ROLE = PCC_SERVER_APP+"/rbac/role/add" //TODO[Aucta] Map new aaa requests
export const UPDATE_RBAC_ROLE = PCC_SERVER_APP+"/rbac/role/update"
export const DELETE_RBAC_ROLES = PCC_SERVER_APP+"/rbac/role/delete"

//apis for permission
//export const FETCH_ALL_PERMISSIONS = USER_MANAGEMENT_APP+"/entity/list" //TODO[Aucta] Map new aaa requests
export const FETCH_ALL_PERMISSIONS = PCC_SERVER_APP+"/rbac/permission"
export const ADD_PERMISSION = PCC_SERVER_APP+"/rbac/permission/add"
export const UPDATE_PERMISSION = PCC_SERVER_APP+"/rbac/permission/update"
export const DELETE_PERMISSIONS = PCC_SERVER_APP+"/rbac/permission/delete"

//apis for user security
export const FETCH_LOGIN_DATA = SECURITY_APP+"/auth"

//apis for graphs
export const GRAPH_DASHBOARD = "/dashboard"
export const GRAPH_FLOW = "/flow-logs"