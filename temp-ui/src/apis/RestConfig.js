// apis for site
export const FETCH_ALL_SITES = "/site/"
export const ADD_SITE = "/site/add"
export const UPDATE_SITE = "/site/update"
export const DELETE_SITES = "/site/delete"

// apis for cluster
export const FETCH_ALL_CLUSTERS = "/cluster/"
export const ADD_CLUSTER = "/cluster/add"
export const UPDATE_CLUSTER = "/cluster/update"
export const DELETE_CLUSTERS = "/cluster/delete"

// apis for role
export const FETCH_ALL_ROLES = "/role/"
export const ADD_ROLE = "/role/add"
export const UPDATE_ROLE = "/role/update"
export const DELETE_ROLES = "/role/delete"

// apis for baseIso
export const FETCH_ALL_ISOS = "/iso/"
export const ADD_ISO = "/iso/add"
export const UPDATE_ISO = "/iso/update"
export const DELETE_ISOS = "/iso/delete"

// apis for kernel
export const FETCH_ALL_KERNELS = "/kernel/"
export const ADD_KERNEL = "/kernel/add"
export const UPDATE_KERNEL = "/kernel/update"
export const DELETE_KERNELS = "/kernel/delete"

// apis for preScript
export const FETCH_ALL_PRESCRIPTS = "/prescript/"
export const ADD_PRESCRIPT = "/prescript/add"
export const UPDATE_PRESCRIPT = "/prescript/update"
export const DELETE_PRESCRIPTS = "/prescript/delete"

// apis for postScript
export const FETCH_ALL_POSTSCRIPTS = "/postscript/"
export const ADD_POSTSCRIPT = "/postscript/add"
export const UPDATE_POSTSCRIPT = "/postscript/update"
export const DELETE_POSTSCRIPTS = "/postscript/delete"

// apis for systemType
export const FETCH_ALL_SYSTEM_TYPES = "/type"
export const ADD_SYSTEM_TYPE = "/type/add"
export const UPDATE_SYSTEM_TYPE = "/type/update"
export const DELETE_SYSTEM_TYPES = "/type/delete"

// apis for goes
export const FETCH_ALL_GOES = "/goes/"
export const ADD_GOES = "/goes/add"
export const UPDATE_GOES = "/goes/update"
export const DELETE_GOES = "/goes/delete"



// apis for modProbe
export const FETCH_ALL_MODPROBE = "/modprobe/"
export const ADD_MODPROBE = "/modprobe/add"
export const UPDATE_MODPROBE = "/modprobe/update"
export const DELETE_MODPROBE = "/modprobe/delete"

// apis for modulesLoad
export const FETCH_ALL_MODULES_LOAD = "/modulesload/"
export const ADD_MODULES_LOAD = "/modulesload/add"
export const UPDATE_MODULES_LOAD = "/modulesload/update"
export const DELETE_MODULES_LOAD = "/modulesload/delete"

// apis for lldp
export const FETCH_ALL_LLDP = "/lldp/"
export const ADD_LLDP = "/lldp/add"
export const UPDATE_LLDP = "/lldp/update"
export const DELETE_LLDP = "/lldp/delete"

// apis for ethtool
export const FETCH_ALL_ETHTOOL = "/ethtool/"
export const ADD_ETHTOOL = "/ethtool/add"
export const UPDATE_ETHTOOL = "/ethtool/update"
export const DELETE_ETHTOOL = "/ethtool/delete"

// apis for ipRoute
export const FETCH_ALL_IPROUTE = "/iproute/"
export const ADD_IPROUTE = "/iproute/add"
export const UPDATE_IPROUTE = "/iproute/update"
export const DELETE_IPROUTE = "/iproute/delete"

// apis for frr
export const FETCH_ALL_FRR = "/frr/"
export const ADD_FRR = "/frr/add"
export const UPDATE_FRR = "/frr/update"
export const DELETE_FRR = "/frr/delete"


// apis for node
export const FETCH_ALL_NODES = "/node"
export const ADD_NODE = "/node/add"
export const UPDATE_NODES = "/node/update"
export const DELETE_NODES = "/node/delete"


// apis for interface
export const FETCH_ALL_INTERFACES = "/interface"
export const ADD_INTERFACES = "/interface/add"
export const UPDATE_INTERFACES = "/interface/update"
export const DELETE_INTERFACES = "/interface/delete"

// apis for k8s
export const FETCH_ALL_KUBERNETES = "/kubernetes"

//apis for discover
export const DISCOVER = "/node/discover"

//apis for provision
export const PROVISION = "/provision/"
export const GET_PROVISION = "/provision/status/"
export const ROLLBACK_PROVISION = "/provision/rollback/"

//apis for constants
export const FETCH_ALL_SPEEDS = "/speed"
export const FETCH_ALL_FECS = "/fec"
export const FETCH_ALL_MEDIAS = "/media"

//apis for entity
export const FETCH_ALL_ENTITIES = "/rbac/entity"
export const ADD_ENTITY = "/rbac/entity/add"
export const UPDATE_ENTITY = "/rbac/entity/update"
export const DELETE_ENTITIES = "/rbac/entity/delete"

//apis for user
export const FETCH_ALL_USERS = "/rbac/user"
//export const ADD_USER = "/rbac/user/add"
export const ADD_USER = "/user-management/user/register"
export const UPDATE_USER = "/rbac/user/update"
export const DELETE_USERS = "/rbac/user/delete"

//apis for rbac role
export const FETCH_ALL_RBAC_ROLES = "/rbac/role"
export const ADD_RBAC_ROLE = "/rbac/role/add"
export const UPDATE_RBAC_ROLE = "/rbac/role/update"
export const DELETE_RBAC_ROLES = "/rbac/role/delete"

//apis for permission
export const FETCH_ALL_PERMISSIONS = "/rbac/permission"
export const ADD_PERMISSION = "/rbac/permission/add"
export const UPDATE_PERMISSION = "/rbac/permission/update"
export const DELETE_PERMISSIONS = "/rbac/permission/delete"

//apis for login
//export const FETCH_LOGIN_DATA = "/rbac/login"
//export const FORGOT_PASSWORD = ""/rbac/user/forgotpasswd""
//export const UPDATE_PASSWORD = "/rbac/user/changepasswd"
export const FETCH_LOGIN_DATA = "/security/auth"
export const FORGOT_PASSWORD = "/user-management/user/recovery"
export const UPDATE_PASSWORD = "/user-management/user/set-password"