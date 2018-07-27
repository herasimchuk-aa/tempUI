import { invaderServerAddress } from './config';
import { NotificationManager } from 'react-notifications';

export class StatsEginx {
    constructor(activeConnection, totalConnection, totalHandledConnection, totalRequests, requestsPerConnection, reading, writing, waiting) {
        this.activeConnection = activeConnection
        this.totalConnection = totalConnection
        this.totalHandledConnection = totalHandledConnection
        this.totalRequests = totalRequests
        this.requestsPerConnection = requestsPerConnection
        this.reading = reading
        this.writing = writing
        this.waiting = waiting
    }
    addStats(addStats) {
        this.activeConnection += addStats.activeConnection
        this.totalConnection += addStats.totalConnection
        this.totalHandledConnection += addStats.totalHandledConnection
        this.totalRequests += addStats.totalRequests
        this.requestsPerConnection += addStats.requestsPerConnection
        this.reading += addStats.reading
        this.writing += addStats.writing
        this.waiting += addStats.waiting
    }

    static EginxStatsFromJson(jsonArray) {
        let retStat = StatsEginx.EmptyObj();
        for (let jsonId in jsonArray) {
            let jsonObj = jsonArray[jsonId];
            retStat.activeConnection += jsonObj['ActiveConnections'];
            retStat.totalConnection += jsonObj['TotalConnections'];
            retStat.totalHandledConnection += jsonObj['TotalHandledConnections'];
            retStat.totalRequests += jsonObj['TotalRequests'];
            retStat.requestsPerConnection += jsonObj['RequestsPerConnection'];
            retStat.reading += jsonObj['Reading'];
            retStat.writing += jsonObj['Writing'];
            retStat.waiting += jsonObj['Waiting'];
        }
        return retStat
    }

    static SimulateObj() {
        let activeConnection = Math.floor((Math.random() * 100) + 1)
        let totalConnection = Math.floor((Math.random() * 100000) + 1)
        let totalHandledConnection = Math.floor((Math.random() * 100000) + 1)
        let totalRequests = totalConnection + totalHandledConnection
        return new StatsEginx(activeConnection, totalConnection, totalHandledConnection, totalRequests, 0, 0, 0, 0)
    }
    static EmptyObj() {
        return new StatsEginx(0, 0, 0, 0, 0, 0, 0, 0);
    }
}

class StatsVarnish {
    constructor(clientRequests, cacheHits, cacheMisses) {
        this.clientRequests = clientRequests
        this.cacheHits = cacheHits
        this.cacheMisses = cacheMisses
    }

    addStats(addStats) {
        this.clientRequests += addStats.clientRequests
        this.cacheHits += addStats.cacheHits
        this.cacheMisses += addStats.cacheMisses
    }

    static VarnishStatsFromJson(jsonArray) {
        let retStat = StatsVarnish.EmptyObj()
        for (let jsonId in jsonArray) {
            let jsonObj = jsonArray[jsonId]
            let statArr = jsonObj['stats']
            for (let stat in statArr) {
                let statObj = statArr[stat]
                if (statObj['id'] === 'clientRequests') {
                    retStat.clientRequests += statObj['value']
                } else if (statObj['id'] === 'cacheHits') {
                    retStat.cacheHits += statObj['value']
                } else if (statObj['id'] === 'cacheMisses') {
                    retStat.cacheMisses += statObj['value']
                }
            }
        }
        return retStat
    }

    static SimulateObj() {
        let cacheHits = Math.floor((Math.random() * 100000) + 1);
        let cacheMisses = Math.floor((Math.random() * 100) + 1);
        let clientRequests = cacheHits + cacheMisses;
        return new StatsVarnish(clientRequests, cacheHits, cacheMisses);
    }

    static EmptyObj() {
        return new StatsVarnish(0, 0, 0);
    }
}

//DONE
export class StatsCPU {
    constructor(user, nice, system, idle, iowait, irq) {
        this.user = user;
        this.nice = nice;
        this.system = system;
        this.idle = idle;
        this.iowait = iowait;
        this.irq = irq;
    }

    static CPUStatsFromJson(jsonObj) {
        let cpuAllStats = jsonObj['cpu_all'];
        return new StatsCPU(cpuAllStats['user'], cpuAllStats['nice'],
            cpuAllStats['system'], cpuAllStats['idle'],
            cpuAllStats['iowait'], cpuAllStats['irq']);
    }

    static SimulateObj() {
        let a = Math.floor((Math.random() * 5) + 1);
        let user = Math.floor((Math.random() * 10) + 1) * a;
        let nice = Math.floor((Math.random() * 10) + 1) * a;
        let system = Math.floor((Math.random() * 10) + 1) * a;
        let iowait = Math.floor((Math.random() * 7) + 1);
        let idle = 100 - user - nice - system - iowait - iowait;
        let irq = 0;
        return new StatsCPU(user, nice, system, idle, iowait, irq);
    }

    static EmptyObj() {
        return new StatsCPU(0, 0, 0, 0, 0, 0);
    }
}

//DONE
export class StatsMemory {
    constructor(total, free, available) {
        this.total = total;
        this.free = free;
        this.available = available;
    }

    static MemoryStatsFromJson(jsonObj) {
        return new StatsMemory(jsonObj["mem_total"], jsonObj["mem_free"], jsonObj["mem_available"]);
    }

    static SimulateObj() {
        let total = 16464124;
        let freePercent = Math.floor((Math.random() * 10) + 1) * (30 - 10) + 10;
        let free = total * freePercent / 100;
        let available = 15614996;
        return new StatsMemory(total, free, available);
    }

    static EmptyObj() {
        return new StatsMemory(0, 0, 0);
    }
}

export class StatsDisk {
    constructor(dName, readIOs, readSectors, writeIOs, writeSectors, ticksIO) {
        this.dName = dName;
        this.readIOs = readIOs;
        this.readSectors = readSectors;
        this.writeIOs = writeIOs;
        this.writeSectors = writeSectors;
        this.ticksIO = ticksIO;
    }

    static SimulateObj() {
        let dName = "sda1";
        let readIOs = Math.floor((Math.random() * 15) + 1);
        let readSectors = Math.floor((Math.random() * 85) + 5);
        let writeIOs = Math.floor((Math.random() * 27) + 3);
        let writeSectors = 1188568;
        let ticksIO = Math.floor((Math.random() * 24) - 2);
        return new StatsDisk(dName, readIOs, readSectors, writeIOs, writeSectors, ticksIO);
    }

    static EmptyObj() {
        return new StatsDisk(0, 0, 0, 0, 0, 0);
    }
}

export class StatsIPVS {
    constructor(connections, inPackets, outPackets, inBytes, outBytes) {
        this.connections = connections;
        this.inPackets = inPackets;
        this.outPackets = outPackets;
        this.inBytes = inBytes;
        this.outBytes = outBytes;
    }
    static SimulateObj() {
        let connections = Math.floor(Math.random() * 1000);
        let inPackets = Math.floor(Math.random() * 1000000);
        let outPackets = Math.floor(Math.random() * 1000000);
        let inBytes = Math.floor(Math.random() * 1000000);
        let outBytes = Math.floor((Math.random() * 1000000));
        return new StatsIPVS(connections, inPackets, outPackets, inBytes, outBytes);
    }

    static EmptyObj() {
        return new StatsIPVS(0, 0, 0, 0, 0, 0);
    }
}

export class HostStats {
    constructor(hName, IPAddress, invPort, ipvsStat, memStat, diskStat, cpuStat, varnishStat, engStat) {
        this.hName = hName;
        this.IPAddress = IPAddress;
        this.invPort = invPort;
        this.ipvsStat = ipvsStat;
        this.memStat = memStat;
        this.diskStat = diskStat;
        this.cpuStat = cpuStat;
        this.varnishStat = varnishStat;
        this.engStat = engStat;
        this.hostType = Host.OTHER;
    }

    static SimulateObj(isEmpty, hName, ipAddress, invPort) {
        let ipvsStat = !isEmpty ? StatsIPVS.SimulateObj() : StatsIPVS.EmptyObj();
        let memStat = !isEmpty ? StatsMemory.SimulateObj() : StatsMemory.EmptyObj();
        let diskStat = !isEmpty ? StatsDisk.SimulateObj() : StatsDisk.EmptyObj();
        let cpuStat = !isEmpty ? StatsCPU.SimulateObj() : StatsCPU.EmptyObj();
        let varnishStat = !isEmpty ? StatsVarnish.SimulateObj() : StatsVarnish.EmptyObj();
        let engStat = !isEmpty ? StatsEginx.SimulateObj() : StatsEginx.EmptyObj();
        return new HostStats(hName, ipAddress, invPort, ipvsStat, memStat, diskStat, cpuStat, varnishStat, engStat);
    }

    diskStats() {
        return [this.diskStat.readIOs, this.diskStat.writeIOs, this.diskStat.ticksIO];
    }

    diskStatsLabels() {
        return ["Read IOs", "Write IOs", "Ticks IO"];
    }

    memoryStatsFunc() {
        return this.memStat.free;
    }

    ipvsStat() {
        return [this.ipvsStat.connections, this.ipvsStat.inBytes, this.ipvsStat.outBytes];
    }

    cpuStatsFunc() {
        return this.cpuStat.idle;
    }

    varnishStats() {
        return [this.varnishStat.clientRequests, this.varnishStat.cacheHits, this.varnishStat.cacheMisses];
    }

    enginxStats() {
        return [this.engStat.totalRequests, this.engStat.activeConnection, this.engStat.totalConnection];
    }
}

export class MonitorStats {
    constructor(invStat, hStats) {
        let dt = new Date();
        this.timeStamp = dt.getTime();
        this.timeLabel = dt.getSeconds().toString();
        this.invaderStats = invStat;
        this.hostsStats = hStats;
    }

}


export class Service {
    constructor(sName, sPort, sType, sProtocol, vIP) {

    }
    static SimulateObj() {
    }
}


export class AnsibleVariable {
    constructor(key, value) {
        if (parseInt(key) > 0) {
            console.log("Ansible Variable now hitting Keys with numbers");
        }
        this.key = key;
        this.value = value;
    }

}
AnsibleVariable.PLAYBOOK_VARIABLE = 15;
AnsibleVariable.HOST_VARIABLE = 10;
AnsibleVariable.GROUP_VARIABLE = 5;
AnsibleVariable.SYS_VARIABLE = 1


export class Host {
    constructor(hName, hType) {
        this.hName = hName;
        this.IPAddress = "";
        this.invaderPort = "";
        this.type = hType;
        this.variables = [];
    }

    static SimulateObj() {
    }

    addService(service) {

    }

    addVariable(key, value) {
        let ansiVar = new AnsibleVariable(key, value);
        this.variables.push(ansiVar);
    }

    generateHostDictionary(variables, groups) {
        //{"sr4": { "vars": { "ansible_host_1": "168.53.142", "inv_port": "eth-14-1", "main_intf_3": "enp130s0", "ssl_engine": "nginx" }, "groups": {"servers":{}}}}
        let varsDict = {};
        varsDict[Host.IPAddressId] = this.IPAddress;
        varsDict[Host.InvaderPort] = this.invaderPort;
        for (let index in variables) {
            let aVar = variables[index];
            varsDict[aVar.key] = aVar.value;
        }

        let groupsDict = {};
        for (let groupId in groups) {
            let grpName = groups[groupId];
            groupsDict[grpName] = {};
        }

        let hostDict = { "vars": varsDict, "groups": groupsDict };
        let retDict = {};
        retDict[this.hName] = hostDict;
        return retDict;
    }

    setupVariable(variableDict) {
        this.variables = [];
        for (let key in variableDict) {
            let val = variableDict[key];
            if (key === Host.IPAddressId)
                this.IPAddress = val;
            else if (key === Host.InvaderPort)
                this.invaderPort = val;
            else
                this.addVariable(key, val);
        }
    }
}

Host.KEY = "host";
Host.OTHER = 0;
Host.INVADER = 1;
Host.UNGROUPED = 5;
Host.SERVER = 10;
Host.IPAddressId = "ansible_host";
Host.InvaderPort = "inv_port";




export class Group {
    constructor(gName, gType) {
        this.gName = gName;
        this.gType = gType;
        this.hosts = {};
        this.variables = [];
    }


    addVariable(key, value) {
        let ansiVar = new AnsibleVariable(key, value);
        this.variables.push(ansiVar);
    }

    setupVariable(variableDict) {
        this.variables = [];
        for (let key in variableDict) {
            let val = variableDict[key];
            this.addVariable(key, val);
        }
    }
}

Group.KEY = "group";
Group.INVADER_KEY = "inv";
Group.SERVER_KEY = "servers";
Group.UNGROUPED = "ungrouped";
Group.VARIABLES = "vars";
Group.SYSTEM_VARIABLES = "all";


export class Action {
    constructor(jsonObj) {
        this.actionId = jsonObj["id"];
        this.actionName = jsonObj["aName"];
        this.description = jsonObj["description"];
        this.keyValues = KeyValueStore.keyValuesFromJson(jsonObj["keyValues"]);
    }

    static actionsFromArray(aArray) {
        let actionArr = [];
        if (aArray !== undefined) {
            for (let index in aArray) {
                let jsonObj = aArray[index];
                let actionObj = new Action(jsonObj);
                actionArr.push(actionObj);
            }
        }
        return actionArr;
    }
}

export class KeyValueStore {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    static keyValuesFromJson(keyValueArray) {
        let objArr = [];
        if (keyValueArray !== undefined) {
            for (let index in keyValueArray) {
                let kvPair = keyValueArray[index];
                let kvObj = new KeyValueStore(kvPair["key"]);
                objArr.push(kvObj);
            }
        }
        return objArr;
    }
}


function simulateAllStats() {

}


export class ServerTransaction {
    constructor(tranId, tranStatus) {
        this.Id = tranId;
        this.status = tranStatus;
        this.percentComplete = 0;
        this.message = "";
        this.errMessage = "";
    }

    static TransactionWithJson(jsonObj) {
        let tran = new ServerTransaction(jsonObj.id, jsonObj.status);
        tran.percentComplete = jsonObj.percentcomplete;
        tran.message = jsonObj.message;
        tran.errMessage = jsonObj.errmessage;
        return tran;
    }

    statusStr() {
        // 'started = 1', 'running = 5', 'completed = 10'
        switch (this.status) {
            case 1:
                return "Created";
            case 5:
                return "Running";
            case 10:
                return "Completed";
        }
        return "err";
    }
}


export class ServerNode {
    constructor(jsonObj) {
        this.serialNumber = jsonObj.serialNumber;
        this.name = jsonObj.name;
        this.site = jsonObj.site;
        if (jsonObj.labels == null)
            this.labels = [];
        else
            this.labels = jsonObj.labels;
        if (jsonObj.roles == null)
            this.roles = [];
        else
            this.roles = jsonObj.roles;
        this.nodeType = jsonObj.type;
        this.kernel = jsonObj.kernel;
        this.kernelVersion = jsonObj.kernelVersion;
        this.linuxISO = jsonObj.linuxISO;
        this.linuxISODesc = jsonObj.linuxISODesc;
        this.cpuInGHz = jsonObj.cpuInGHz;
        this.memoryInGB = jsonObj.memoryInGB;
        this.storageInGB = jsonObj.storageInGB;
        this.hostNameIP = jsonObj.hostNameIP;
        this.goesVersion = jsonObj.goesVersion;
        this.coreBootVersion = jsonObj.coreBootVersion;
        this.mainInterface = new ServerInterface(jsonObj.mainInterface);
        this.bmcInterface = new ServerInterface(jsonObj.bmcInterface);
        this.allInterfaces = ServerNode.SetupInterface(jsonObj.interfaces);
    }

    static SetupInterface(allInterfaces) {
        let aInterface = [];
        for (let iCtr in allInterfaces) {
            aInterface[iCtr] = new ServerInterface(allInterfaces[iCtr]);
        }
        return aInterface;
    }
}

export class ServerInterface {
    constructor(jsonObj) {
        this.port = jsonObj.port;
        this.type = jsonObj.type;
        this.IPAddress = jsonObj.ip;
        this.admin = jsonObj.admin;
        this.alarms = jsonObj.alarms;
        this.macAddress = jsonObj.macAddress;
        this.connectedTo = new ServerConnectedTo(jsonObj.connectedTo);
    }
}

export class ServerConnectedTo {
    constructor(jsonObj) {
        this.serverPort = jsonObj.port;
        this.serverName = jsonObj.name;
        this.lldpMatched = jsonObj.lldpMatched;
        this.link = jsonObj.link;
    }
}

export class ServerISO {
    constructor(jsonObj) {
        this.value = jsonObj.Name;
        this.label = jsonObj.Name;
        this.location = jsonObj.Location;
        this.description = jsonObj.Description;
    }
}

export class ServerKernelTypes {
    constructor(jsonObj) {
        this.value = jsonObj.Name;
        this.label = jsonObj.Name;
        this.location = jsonObj.Location;
        this.description = jsonObj.Description;
    }
}

export class ServerLabels {
    constructor(jsonObj) {
        this.label = jsonObj.Name;
        this.value = jsonObj.Name;
        this.parent = jsonObj.Parent;
        this.description = jsonObj.Description;
        this.children = jsonObj.Childern;
    }
}

export class ServerSystemType {
    constructor(jsonObj) {
        this.value = jsonObj.Id;
        this.label = /* jsonObj.Vendor + ":" + */ jsonObj.Id;
        this.vendor = jsonObj.Vendor;
        //this.description = jsonObj.Description;
        this.rackUnit = jsonObj.RackUnit;
        this.airflow = jsonObj.Airflow;
        this.numFrontPanelInterface = jsonObj.NumFrontPanelInterface
        this.speedFrontPanelInterface = jsonObj.SpeedFrontPanelInterface;
        this.numMgmtInterface = jsonObj.NumMgmtInterface;
        this.speedMgmtInterafce = jsonObj.SpeedMgmtInterafce;
    }
}

export class ServerAPI {
    constructor() {
        this.allGroups = new Object();
        this.allHosts = new Object();
        this.allNodes = [];
        this.allISOs = [];
        this.allKernelTypes = [];
        this.allLabels = [];
        this.allSystemTypes = [];

        //this.invaderServerAddress = "http://192.168.101.122:8080";
        // client api address
        // this.invaderServerAddress = "http://192.168.53.130:8080";
        //    this.invaderServerAddress = "http://172.17.2.37:8080";
        this.invaderServerAddress = invaderServerAddress;
        this.fetchAllNodeSetupInfo();
    }

    DefaultInvader() {
        return this.invaderServerAddress;
    }

    updateInvaderAddress(invaderAddress) {
        this.invaderServerAddress = invaderAddress;
        // If IP address is changing we need to update Inventory information.
        this.fetchAllNodeSetupInfo();
    }

    static DefaultServer() {
        return defaultAPIServer;
    }
    
    kubernetesDeployment() {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/kubernetes/deploy";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
        }
        xhr.onerror = function () {
        }
        xhr.send();
    }

    fetchAllNodeSetupInfo(callback, instance) {
        let serverInstance = this;
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/node/setup_info";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonSetup = jsonObj.setup;
                    {
                        let mainCtr = 0;
                        // generate all kernel
                        let kernels = jsonSetup.kernel;
                        serverInstance.allKernelTypes = [];
                        for (let kCtr in kernels) {
                            let k = kernels[kCtr];
                            let kernel = new ServerKernelTypes(k);
                            serverInstance.allKernelTypes[mainCtr] = kernel;
                            mainCtr++;
                        }

                        mainCtr = 0;
                        // generate all ISO's
                        let isoS = jsonSetup.linuxiso;
                        serverInstance.allISOs = [];
                        for (let ctr in isoS) {
                            let i = isoS[ctr];
                            let iso = new ServerISO(i);
                            serverInstance.allISOs[mainCtr] = iso;
                            mainCtr++;
                        }

                        // generate all Labels/Roles/Groups different names same thing
                        mainCtr = 0;
                        let labels = jsonSetup.role;
                        serverInstance.allLabels = [];
                        for (let ctr in labels) {
                            let jLabel = labels[ctr];
                            let label = new ServerLabels(jLabel);
                            serverInstance.allLabels[mainCtr] = label;
                            mainCtr++;
                        }

                        // generate System Types
                        mainCtr = 0;
                        let types = jsonSetup.type;
                        serverInstance.allSystemTypes = [];
                        for (let ctr in types) {
                            let i = types[ctr];
                            let type = new ServerSystemType(i);
                            serverInstance.allSystemTypes[mainCtr] = type;
                            mainCtr++
                        }
                    }
                    callback(instance, serverInstance);
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            serverInstance.allKernelTypes = [];
            serverInstance.allISOs = [];
            serverInstance.allLabels = [];
            serverInstance.allSystemTypes = [];
        }
        xhr.send();
    }

    // MN:: TODO:: Currently only added Wipe as that is the only feature supported by backend calls
    // Later need to support Upgrade whcih will require Type of OS / ISO details.
    upgradeOrWipeServerNode(node, callback, instance) {
        let serverInstance = this;
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/node/wipe/" + node.name;
        // MN:: TODO:: Need to change below from GET TO POST once information needs to be passed.
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let wipeInfo = jsonObj.wipe;
                    callback(instance, wipeInfo);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                    callback(instance, null);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();

    }

    fetchAllServerNodes(callback, instance) {
        let serverInstance = this;
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/node/";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonNodes = jsonObj.nodes;
                    let retNodes = [];
                    let nodeCtr = 0;
                    for (nodeCtr in jsonNodes) {
                        let jNode = jsonNodes[nodeCtr];
                        let node = new ServerNode(jNode);
                        retNodes[nodeCtr] = node;
                    }
                    callback(instance, retNodes);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    deleteNode(callback, instance, name) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/node/id/" + name;
        xhr.open("DELETE", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        callback(instance);
                    }
                    else
                        alert("Something went wrong!")
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    fetchAllRoles(callback, instance) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/role/";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonRoles = jsonObj.roles;
                    let retRoles = [];
                    let roleCtr = 0;
                    for (roleCtr in jsonRoles) {
                        let jRole = jsonRoles[roleCtr];
                        let role = new ServerLabels(jRole);
                        retRoles[roleCtr] = role;
                    }
                    callback(instance, retRoles);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    deleteRole(callback, instance, name) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/role/id/" + name;
        xhr.open("DELETE", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        callback(instance);
                        NotificationManager.success('Deleted Successfully', 'Role');
                    }
                    else if (jsonObj.ErrorMessage) {
                        NotificationManager.error(jsonObj.ErrorMessage, 'Role');
                    }
                    else {
                        NotificationManager.error("Something went wrong", 'Role');
                    }
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance);
        }
        xhr.send();
    }

    fetchAllIso(callback, instance) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/iso/";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonIsoTypes = jsonObj.isoTypes;
                    let retIsoTypes = [];
                    let isoCtr = 0;
                    for (isoCtr in jsonIsoTypes) {
                        let jIsoType = jsonIsoTypes[isoCtr];
                        let isoType = new ServerISO(jIsoType);
                        retIsoTypes[isoCtr] = isoType;
                    }
                    callback(instance, retIsoTypes);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    fetchAllKubernetes(callback, instance) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/kubernetes/";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonIsoTypes = jsonObj.kubernetes;
                    /* let retIsoTypes = [];
                    let isoCtr = 0;
                    for (isoCtr in jsonIsoTypes) {
                        let jIsoType = jsonIsoTypes[isoCtr];
                        let isoType = new ServerISO(jIsoType);
                        retIsoTypes[isoCtr] = isoType;
                    } */
                    callback(instance, jsonIsoTypes);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    deleteIso(callback, instance, name) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/iso/id/" + name;
        xhr.open("DELETE", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        callback(instance);
                        NotificationManager.success(name + " deleted successfully", "Base Linux ISO");
                    }
                    else if (jsonObj.ErrorMessage) {
                        NotificationManager.error(jsonObj.ErrorMessage, "Base Linux ISO");
                    }
                    else {
                        NotificationManager.error("Something went wrong", 'Base Linux ISO');
                    }
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    fetchAllKernels(callback, instance) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/kernel/";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonKernelTypes = jsonObj.kernelTypes;
                    let retKernelTypes = [];
                    let kernelCtr = 0;
                    for (kernelCtr in jsonKernelTypes) {
                        let jKernelTypes = jsonKernelTypes[kernelCtr];
                        let kernelType = new ServerKernelTypes(jKernelTypes);
                        retKernelTypes[kernelCtr] = kernelType;
                    }
                    callback(instance, retKernelTypes);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    deleteKernel(callback, instance, name) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/kernel/id/" + name;
        xhr.open("DELETE", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        callback(instance);
                        NotificationManager.success(name + ' deleted successfully', 'Linux Kernel');
                    }
                    else if (jsonObj.ErrorMessage) {
                        NotificationManager.error(jsonObj.ErrorMessage, "Linux Kernel")
                    }
                    else {
                        NotificationManager.error("Something went wrong", 'Linux Kernel');
                    }
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    fetchAllSystemTypes(callback, instance) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/systemtype/";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let jsonSystemTypes = jsonObj.systemTypes;
                    let retSystemTypes = [];
                    let typeCtr = 0;
                    for (typeCtr in jsonSystemTypes) {
                        let jSystemTypes = jsonSystemTypes[typeCtr];
                        let systemType = new ServerSystemType(jSystemTypes);
                        retSystemTypes[typeCtr] = systemType;
                    }
                    callback(instance, retSystemTypes);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    deleteSystemType(callback, instance, name) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/systemtype/id/" + name;
        xhr.open("DELETE", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        callback(instance);
                        NotificationManager.success(name + ' deleted successfully', 'System Type');

                    }
                    else if (jsonObj.ErrorMessage) {
                        NotificationManager.error(jsonObj.ErrorMessage, "System Type");
                    }
                    else {
                        NotificationManager.error("Something went wrong", "System Type");
                    }
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
            callback(instance, null);
        }
        xhr.send();
    }

    addNode(callback, instance, data) {
        console.log(data)
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/node/add";
        xhr.open("POST", sourceURL, { data });
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);

                    if (jsonObj.success) {
                        let node = jsonObj.Node
                        let a = {
                            'name': node.name,
                            'site': node.site,
                            'status': node.status,
                            'roles': node.roles,
                            'nodeType': node.type,
                            'serialNumber': node.serialNumber,
                            'kernel': node.kernel,
                            'linuxISO': node.linuxISO
                        }
                        callback(instance, a);

                    }
                    else {
                        NotificationManager.error('something went wrong', 'Node');
                    }
                } catch (err) {
                    console.log("Error" + err);
                }
            }
        };
    }

    updateNode(callback, instance, data, flag) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/node/modify/";
        xhr.open("POST", sourceURL, { data });
        xhr.setRequestHeader("Content-type", "application/json");
        data.nodes[0].interfaces = data.nodes[0].allInterfaces
        data.nodes[0].interfaces.map((intrfc) => {
            intrfc.ip = intrfc.IPAddress
            intrfc.connectedTo.port = intrfc.connectedTo.serverPort
            intrfc.connectedTo.name = intrfc.connectedTo.serverName
        })
        data.nodes[0].type = data.nodes[0].nodeType

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        let a = {
                            'name': jsonObj.name

                        }
                        callback(instance, a);
                    }
                    else {
                        alert("Faliure");
                    }
                } catch (err) {
                    console.log("Error" + err);
                }
            }
        };
        xhr.onerror = function () {
            let tran = new ServerTransaction("Errr", 0);
            callback(instance, tran);
        };

        xhr.send(JSON.stringify(data.nodes[0]));
    }




    addRole(callback, instance, data) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/role/add";
        xhr.open("POST", sourceURL, { data });
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        let a = {
                            'parent': jsonObj.role.Parent,
                            'label': jsonObj.role.Name,
                            'value': jsonObj.role.Name,
                            'description': jsonObj.role.Description,
                        }
                        callback(instance, a);
                        NotificationManager.success(jsonObj.role.Name + " added successfully", "Role");
                    }
                    else {
                        NotificationManager.error(jsonObj.role.Name + " was not added", "Role");
                    }
                } catch (err) {
                    console.log("Error" + err);
                }
            }
        };

    }

    addIso(callback, instance, data) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/iso/add";
        xhr.open("POST", sourceURL, { data });
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        let a = {
                            'label': jsonObj.iso.Name,
                            'location': jsonObj.iso.Location,
                            'description': jsonObj.iso.Description
                        }
                        callback(instance, a);
                        NotificationManager.success(jsonObj.iso.Name + " added successfully", "Base Linux ISO");
                    }
                    else {
                        NotificationManager.error(jsonObj.iso.Name + " was not added", "Base Linux ISO");
                    }
                } catch (err) {
                    console.log("Error" + err);
                }
            }
        };

    }

    addKernel(callback, instance, data) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/kernel/add";
        xhr.open("POST", sourceURL, { data });
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        let a = {
                            'label': jsonObj.kernel.Name,
                            'location': jsonObj.kernel.Location,
                            'description': jsonObj.kernel.Description
                        }
                        callback(instance, a);
                        NotificationManager.success(jsonObj.kernel.Name + " added successfully", "Linux Kernel");
                    }
                    else {
                        NotificationManager.error(jsonObj.kernel.Name + " was not added", "Linux Kernel");
                    }
                } catch (err) {
                    console.log("Error" + err);
                }
            }
        };

    }

    addSystemTypes(callback, instance, data) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/systemtype/add";
        xhr.open("POST", sourceURL, { data });
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (jsonObj.success) {
                        let a = {
                            'label': jsonObj.system.Id,
                            'vendor': jsonObj.system.Vendor,
                            'rackUnit': jsonObj.system.RackUnit,
                            'airflow': jsonObj.system.Airflow,
                            'numFrontPanelInterface': jsonObj.system.NumFrontPanelInterface,
                            'speedFrontPanelInterface': jsonObj.system.SpeedFrontPanelInterface,
                            'numMgmtInterface': jsonObj.system.NumMgmtInterface,
                            'speedMgmtInterafce': jsonObj.system.SpeedMgmtInterafce
                        }
                        callback(instance, a);
                        NotificationManager.success(jsonObj.system.Id + " added successfully", "System Type");
                    }
                    else {
                        NotificationManager.error(jsonObj.system.Id + " was not added", "System Type");
                    }
                } catch (err) {
                    console.log("Error" + err);
                }
            }
            else if (xhr.readyState === 4 && xhr.status === 500) {
                alert("Something went wrong!");
            }
        };

    }



    fetchHosts() {
        return '{"hosts":["127.0.0.1","inv7","sr3","sr2"]}';
    }

    allServerHostNames() {
        let grp = this.allGroups[Group.SERVER_KEY];
        return grp.hosts;
    }

    allInvaderNames() {
        let grp = this.allGroups[Group.INVADER_KEY];
        return grp.hosts;
    }

    runAnsibleTransactionStatus(transaction, callback, instance) {
        if (transaction.status > 0) { // no err
            let transactionId = transaction.Id;
            let xhr = new XMLHttpRequest();
            let sourceURL = this.DefaultInvader() + "/config/execplaybook/" + transactionId;
            xhr.open("GET", sourceURL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        let jsonObj = JSON.parse(xhr.responseText);
                        let tran = ServerTransaction.TransactionWithJson(jsonObj);
                        callback(instance, tran);
                    } catch (err) {
                        let tran = new ServerTransaction("Errr", 0);
                        callback(instance, tran);
                    }
                }
            };
            xhr.onerror = function () {
                let tran = new ServerTransaction("Errr", 0);
                callback(instance, tran);
            };
            xhr.send();
        }
    }

    runAnsiblePlaybook(playbook, callback, instance) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/config/execplaybook";
        xhr.open("POST", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let tran = ServerTransaction.TransactionWithJson(jsonObj);
                    callback(instance, tran);
                } catch (err) {
                    let tran = new ServerTransaction("Errr", 0);
                    callback(instance, tran);
                }
            }
        };
        xhr.onerror = function () {
            let tran = new ServerTransaction("Errr", 0);
            callback(instance, tran);
        };
        let playbookObj = { "playbook": playbook.actionId, "arguments": playbook.keyValues };
        let requstJson = JSON.stringify(playbookObj);
        xhr.send(requstJson);
    }

    updateHostVariables(callback, instance, host, variables, groups) {
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/config/host/" + host.hName;
        let serverInstance = this;
        xhr.open("POST", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    if (host.hName in jsonObj) {
                        let hostSuccess = jsonObj[host.hName];
                        if (hostSuccess["success"]) {
                            for (let grpId in serverInstance.allGroups) {
                                let grp = serverInstance.allGroups[grpId];
                                if (grpId in groups) {
                                    if (!host.hName in grp.hosts) {
                                        grp.hosts[host.hName] = host.hName;
                                    }
                                } else if (host.hName in grp.hosts) {
                                    delete grp.hosts[host.hName]
                                }
                                serverInstance.allGroups[grpId] = grp;
                            }
                            callback(instance, serverInstance.allGroups);
                        }
                    }
                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
        };
        let requstJson = JSON.stringify(host.generateHostDictionary(variables, groups));
        console.log("HOst update:: " + requstJson);
        xhr.send(requstJson);
    }

    setupInventory(callback, instance) {
        let serverInstance = this;
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/config/all";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    //let serverInstance = ServerAPI.DefaultServer();
                    serverInstance.allGroups = new Object();
                    serverInstance.allHosts = new Object();
                    let invaderHosts = [];
                    let serverHosts = [];

                    let jsonObj = JSON.parse(xhr.responseText);
                    let inventoryAll = jsonObj["all"];
                    let allHostDict = inventoryAll[Host.KEY];
                    let inventoryGroups = inventoryAll[Group.KEY];

                    for (let groupName in inventoryGroups) {
                        let groupDict = inventoryGroups[groupName];
                        let hostType = Host.OTHER;
                        if (groupName === Group.INVADER_KEY)
                            hostType = Host.INVADER;
                        else if (groupName === Group.SERVER_KEY)
                            hostType = Host.SERVER;
                        else if (groupName === Group.UNGROUPED)
                            hostType = Host.UNGROUPED;

                        let grp = new Group(groupName, hostType);
                        if (groupName === Group.SYSTEM_VARIABLES) {
                            grp.setupVariable(groupDict);
                        } else {
                            let grpHostsArray = groupDict["hosts"];
                            if (grpHostsArray !== undefined) {
                                for (let hIndex in grpHostsArray) {
                                    let hostName = grpHostsArray[hIndex];
                                    let host = serverInstance.allHosts[hostName];
                                    if (host === undefined) {
                                        host = new Host(hostName, hostType);
                                        let hostDict = allHostDict[hostName];
                                        if (hostDict !== undefined) {
                                            let hostVars = hostDict["vars"];
                                            host.setupVariable(hostVars);
                                        }
                                        serverInstance.allHosts[hostName] = host;
                                    } else if (hostType > Host.OTHER) {
                                        if (host.type == Host.OTHER)
                                            host.type = hostType;
                                        else
                                            console.log("ERROR :: Host :: " + hostName + " :: belongs to both 'Server' and 'Invader' Groups");
                                    }
                                    grp.hosts[hostName] = hostName;
                                }
                            }
                            let grpVars = groupDict[Group.VARIABLES];
                            grp.setupVariable(grpVars);
                        }
                        serverInstance.allGroups[groupName] = grp;
                    }
                    callback(instance);
                    //setTimeout(callback, 1000, instance);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
        }
        xhr.send();
    }

    fetchAllPlaybookNames(callback, instance) {
        //let jsonStr = this.fetchPlaybooks();
        //let jsonObj = JSON.parse(jsonStr);
        //return jsonObj["playbooks"];
        let serverInstance = this;
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/config/playbook";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    callback(instance, jsonObj["playbooks"]);
                    //setTimeout(callback, 1000, instance);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
        }
        xhr.send();
    }

    fetchAllActions(callback, instance) {
        //let jsonStr = this.fetchPlaybooks();
        //let jsonObj = JSON.parse(jsonStr);
        //return jsonObj["playbooks"];
        let serverInstance = this;
        let xhr = new XMLHttpRequest();
        let sourceURL = this.DefaultInvader() + "/config/actions";
        xhr.open("GET", sourceURL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    let jsonObj = JSON.parse(xhr.responseText);
                    let actions = Action.actionsFromArray(jsonObj["actions"])
                    callback(instance, actions);
                    //setTimeout(callback, 1000, instance);

                } catch (err) {
                    console.log("POST :: ERROR :: " + err);
                }
            }
        };
        xhr.onerror = function () {
            console.log("POST :: Error :: ");
        }
        xhr.send();
    }

    fetchMonitorServerStat(callback, instance) {
        let serverInstance = this;

        let invaderStat = undefined;
        let hostsStats = {};
        let statsCounter = 0;
        for (let hostName in this.allHosts) {
            let host = this.allHosts[hostName];
            let hostStatObj = HostStats.SimulateObj(true, host.hName, host.IPAddress, host.invaderPort);
            if (host.type == Host.INVADER) {
                hostStatObj.hostType = Host.INVADER;
                invaderStat = hostStatObj;
            } else if (host.type == Host.SERVER) {
                hostStatObj.hostType = Host.SERVER;
                hostsStats[hostName] = hostStatObj;
            }
        }

        let xhrCPU = new XMLHttpRequest();
        let cpuURL = this.DefaultInvader() + "/stats/allcpu";
        xhrCPU.open("GET", cpuURL, true);
        xhrCPU.setRequestHeader("Content-type", "application/json");
        xhrCPU.onreadystatechange = function () {
            if (xhrCPU.readyState === 4 && xhrCPU.status === 200) {
                try {
                    statsCounter--;
                    let jsonObj = JSON.parse(xhrCPU.responseText);
                    for (let hostName in serverInstance.allHosts) {
                        if (hostName in jsonObj) {
                            let cpuJsonObj = jsonObj[hostName];
                            let cpuStat = StatsCPU.CPUStatsFromJson(cpuJsonObj);
                            let host = serverInstance.allHosts[hostName];
                            if (host.type == Host.INVADER) {
                                invaderStat.cpuStat = cpuStat;
                            } else if (host.type == Host.SERVER) {
                                let hostStats = hostsStats[hostName];
                                hostStats.cpuStat = cpuStat;
                                hostsStats[hostName] = hostStats;
                            }
                        }
                    }
                } catch (err) {
                    console.log("POST :: CPU ERROR :: " + err);
                }
            }
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        xhrCPU.onerror = function () {
            statsCounter--;
            console.log("POST :: CPU Error :: ");
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        statsCounter++;
        xhrCPU.send();

        let xhrMem = new XMLHttpRequest();
        let memURL = this.DefaultInvader() + "/stats/allmemory";
        xhrMem.open("GET", memURL, true);
        xhrMem.setRequestHeader("Content-type", "application/json");
        xhrMem.onreadystatechange = function () {
            if (xhrMem.readyState === 4 && xhrMem.status === 200) {
                try {
                    statsCounter--;
                    let jsonObj = JSON.parse(xhrMem.responseText);
                    for (let hostName in serverInstance.allHosts) {
                        if (hostName in jsonObj) {
                            let memJsonObj = jsonObj[hostName];
                            let memStat = StatsMemory.MemoryStatsFromJson(memJsonObj);
                            let host = serverInstance.allHosts[hostName];
                            if (host.type == Host.INVADER) {
                                invaderStat.memStat = memStat;
                            } else if (host.type == Host.SERVER) {
                                let hostStats = hostsStats[hostName];
                                hostStats.memStat = memStat;
                                hostsStats[hostName] = hostStats;
                            }
                        }
                    }
                } catch (err) {
                    console.log("POST :: Mem ERROR :: " + err);
                }
            }
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        xhrMem.onerror = function () {
            statsCounter--;
            console.log("POST :: MEM Error :: ");
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        statsCounter++;
        xhrMem.send();

        //let xhrDisk = new XMLHttpRequest();
        //let diskURL = this.DefaultInvader() + "/stats/alldisk";
        //xhrDisk.open("GET", diskURL, true);
        //xhrDisk.setRequestHeader("Content-type", "application/json");
        //xhrDisk.onreadystatechange = function () {
        //    if (xhrDisk.readyState === 4 && xhrDisk.status === 200) {
        //        try {
        //            statsCounter--;
        //            let jsonObj = JSON.parse(xhrDisk.responseText);
        //        } catch (err) {
        //            console.log("POST :: Disk ERROR :: " + err);
        //        }
        //    }
        //    if (statsCounter <= 0) {
        //        let monitorStats = new MonitorStats(invaderStat, hostsStats);
        //        callback(instance, monitorStats);
        //    }
        //}
        //xhrDisk.onerror = function () {
        //    statsCounter--;
        //    console.log("POST :: Disk Error :: ");
        //    if (statsCounter <= 0) {
        //        let monitorStats = new MonitorStats(invaderStat, hostsStats);
        //        callback(instance, monitorStats);
        //    }
        //}
        //statsCounter++;
        //xhrDisk.send();

        let xhrVarn = new XMLHttpRequest();
        let varnURL = this.DefaultInvader() + "/stats/varnish";
        xhrVarn.open("GET", varnURL, true);
        xhrVarn.setRequestHeader("Content-type", "application/json");
        xhrVarn.onreadystatechange = function () {
            if (xhrVarn.readyState === 4 && xhrVarn.status === 200) {
                try {
                    statsCounter--;
                    let jsonObj = JSON.parse(xhrVarn.responseText);
                    for (let hostName in serverInstance.allHosts) {
                        if (hostName in jsonObj) {
                            let varnJsonObj = jsonObj[hostName];
                            let varnStat = StatsVarnish.VarnishStatsFromJson(varnJsonObj);
                            let host = serverInstance.allHosts[hostName];
                            if (host.type == Host.SERVER) {
                                let hostStats = hostsStats[hostName];
                                hostStats.varnishStat = varnStat;
                                hostsStats[hostName] = hostStats;
                                invaderStat.varnishStat.addStats(varnStat);
                            }
                        }
                    }
                } catch (err) {
                    console.log("POST :: Varnish ERROR :: " + err);
                }
            }
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        xhrVarn.onerror = function () {
            statsCounter--;
            console.log("POST :: Varnish Error :: ");
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        statsCounter++;
        xhrVarn.send();

        let xhrNginx = new XMLHttpRequest();
        let nginxURL = this.DefaultInvader() + "/stats/nginx";
        xhrNginx.open("GET", nginxURL, true);
        xhrNginx.setRequestHeader("Content-type", "application/json");
        xhrNginx.onreadystatechange = function () {
            if (xhrNginx.readyState === 4 && xhrNginx.status === 200) {
                try {
                    statsCounter--;
                    let jsonObj = JSON.parse(xhrNginx.responseText);
                    for (let hostName in serverInstance.allHosts) {
                        if (hostName in jsonObj) {
                            let eginxJsonObj = jsonObj[hostName];
                            let eginxStat = StatsEginx.EginxStatsFromJson(eginxJsonObj);
                            let host = serverInstance.allHosts[hostName];
                            if (host.type == Host.SERVER) {
                                let hostStats = hostsStats[hostName];
                                hostStats.engStat = eginxStat;
                                hostsStats[hostName] = hostStats;
                                invaderStat.engStat.addStats(eginxStat);
                            }
                        }
                    }
                } catch (err) {
                    console.log("POST :: Varnish ERROR :: " + err);
                }
            }
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        xhrNginx.onerror = function () {
            statsCounter--;
            console.log("POST :: Varnish Error :: ");
            if (statsCounter <= 0) {
                let monitorStats = new MonitorStats(invaderStat, hostsStats);
                callback(instance, monitorStats);
            }
        }
        statsCounter++;
        xhrNginx.send();
    }

    fetchMonitorZeroStates(isEmpty) {
        let invaderStatObj;
        let hostsStats = {};
        for (let hostName in this.allHosts) {
            let host = this.allHosts[hostName];
            if (host.type == Host.INVADER) {
                invaderStatObj = HostStats.SimulateObj(isEmpty, host.hName, host.IPAddress, host.invaderPort);
            } else if (host.type == Host.SERVER) {
                hostsStats[hostName] = HostStats.SimulateObj(isEmpty, host.hName, host.IPAddress, host.invaderPort);
            }
        }
        return new MonitorStats(invaderStatObj, hostsStats);
    }
    /*
        fetchInvetoryAll() {
            return '{"all":{"group":{"all":{"client_ip":"10.10.30.110","containers":4,"vip":"4.3.2.1"},"clients":{"hosts":["inv7"]},"inv":{"hosts":["127.0.0.1"],"vars":{"ansible_connection":"local","check_digest":"0ac91d27021904d30dbafce186223c81","check_url":"/","keepalived_conf":"/etc/keepalived/keepalived.conf","keepalived_daemon":"/usr/sbin/keepalived","lb_intfs":"eth-14-1 eth-16-1","script_inv":"/home/ansible/ipvs_inv.sh"}},"servers":{"hosts":["sr3","sr2"]}},"host":{"127.0.0.1":{"vars":{}},"inv7":{"vars":{}},"sr2":{"vars":{"ansible_host":"192.168.101.222","inv_port":"eth-14-1","main_intf":"enp130s0","server_num":1,"ssl_engine":"nginx"}},"sr3":{"vars":{"ansible_host":"192.168.101.223","inv_port":"eth-16-1","main_intf":"enp130s0","server_num":2,"ssl_engine":"hitch"}}}}}';
        }
    
        fetchCPUStats() {
            return '{"inv2":{"cpu_all":{"id":"cpu","user":720493,"nice":0,"system":193706,"idle":281232312,"iowait":2204,"irq":0,"softirq":305516,"steal":0,"guest":0,"guest_nice":0},"intr":1602162025,"ctxt":878408125,"btime":"2018-03-15T11:41:44-07:00","processes":329682,"procs_running":2,"procs_blocked":0},"sr2":{"cpu_all":{"id":"cpu","user":172163,"nice":0,"system":96379,"idle":10776440,"iowait":14326,"irq":0,"softirq":79093,"steal":0,"guest":0,"guest_nice":0},"intr":134144739,"ctxt":63361338,"btime":"2018-03-19T12:28:26-07:00","processes":10306,"procs_running":2,"procs_blocked":0},"sr3":{"cpu_all":{"id":"","user":0,"nice":0,"system":0,"idle":0,"iowait":0,"irq":0,"softirq":0,"steal":0,"guest":0,"guest_nice":0},"intr":0,"ctxt":0,"btime":"0001-01-01T00:00:00Z","processes":0,"procs_running":0,"procs_blocked":0}}';
        }
    
        fetchDiskStats() {
            return '{"inv2":[{"major":7,"minor":0,"name":"loop0","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":1,"name":"loop1","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":2,"name":"loop2","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":3,"name":"loop3","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":4,"name":"loop4","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":5,"name":"loop5","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":6,"name":"loop6","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":7,"minor":7,"name":"loop7","read_ios":0,"read_merges":0,"read_sectors":0,"read_ticks":0,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":0,"time_in_queue":0},{"major":8,"minor":0,"name":"sda","read_ios":16103,"read_merges":163,"read_sectors":858184,"read_ticks":13432,"write_ios":27806,"write_merges":80984,"write_sectors":1188568,"write_ticks":54144,"in_flight":0,"io_ticks":24492,"time_in_queue":67556},{"major":8,"minor":1,"name":"sda1","read_ios":15806,"read_merges":163,"read_sectors":853546,"read_ticks":13296,"write_ios":27781,"write_merges":80984,"write_sectors":1188568,"write_ticks":54124,"in_flight":0,"io_ticks":24448,"time_in_queue":67400},{"major":8,"minor":2,"name":"sda2","read_ios":31,"read_merges":0,"read_sectors":62,"read_ticks":8,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":8,"time_in_queue":8},{"major":8,"minor":5,"name":"sda5","read_ios":157,"read_merges":0,"read_sectors":2824,"read_ticks":76,"write_ios":0,"write_merges":0,"write_sectors":0,"write_ticks":0,"in_flight":0,"io_ticks":52,"time_in_queue":76}]}';
        }
    
        fetchMemoryStats() {
            return '{"inv2":{"mem_total":16464124,"mem_free":15180960,"mem_available":15614996,"buffers":84460,"cached":856396,"swap_cached":0,"active":559036,"inactive":562992,"active_anon":224052,"inactive_anon":335928,"active_file":334984,"inactive_file":227064,"unevictable":0,"mlocked":0,"swap_total":5105660,"swap_free":5105660,"dirty":0,"write_back":0,"anon_pages":181288,"mapped":397016,"shmem":378812,"slab":79268,"s_reclaimable":51168,"s_unclaim":28100,"kernel_stack":4448,"page_tables":7548,"nfs_unstable":0,"bounce":0,"writeback_tmp":0,"commit_limit":13337720,"committed_as":10151596,"vmalloc_total":34359738367,"vmalloc_used":0,"vmalloc_chunk":0,"hardware_corrupted":0,"anon_huge_pages":0,"huge_pages_total":0,"huge_pages_free":0,"huge_pages_rsvd":0,"huge_pages_surp":0,"hugepagesize":2048,"direct_map_4k":96000,"direct_map_2M":4081664,"direct_map_1G":14680064},"sr2":{"mem_total":16398104,"mem_free":14543220,"mem_available":14869020,"buffers":28824,"cached":564608,"swap_cached":0,"active":582284,"inactive":408972,"active_anon":398356,"inactive_anon":9024,"active_file":183928,"inactive_file":399948,"unevictable":84,"mlocked":84,"swap_total":33479676,"swap_free":33479676,"dirty":10468,"write_back":10188,"anon_pages":398252,"mapped":252916,"shmem":9468,"slab":258312,"s_reclaimable":59020,"s_unclaim":199292,"kernel_stack":63712,"page_tables":6460,"nfs_unstable":0,"bounce":0,"writeback_tmp":0,"commit_limit":41678728,"committed_as":1650980,"vmalloc_total":34359738367,"vmalloc_used":0,"vmalloc_chunk":0,"hardware_corrupted":0,"anon_huge_pages":0,"huge_pages_total":0,"huge_pages_free":0,"huge_pages_rsvd":0,"huge_pages_surp":0,"hugepagesize":2048,"direct_map_4k":250952,"direct_map_2M":6004736,"direct_map_1G":12582912},"sr3":{"mem_total":0,"mem_free":0,"mem_available":0,"buffers":0,"cached":0,"swap_cached":0,"active":0,"inactive":0,"active_anon":0,"inactive_anon":0,"active_file":0,"inactive_file":0,"unevictable":0,"mlocked":0,"swap_total":0,"swap_free":0,"dirty":0,"write_back":0,"anon_pages":0,"mapped":0,"shmem":0,"slab":0,"s_reclaimable":0,"s_unclaim":0,"kernel_stack":0,"page_tables":0,"nfs_unstable":0,"bounce":0,"writeback_tmp":0,"commit_limit":0,"committed_as":0,"vmalloc_total":0,"vmalloc_used":0,"vmalloc_chunk":0,"hardware_corrupted":0,"anon_huge_pages":0,"huge_pages_total":0,"huge_pages_free":0,"huge_pages_rsvd":0,"huge_pages_surp":0,"hugepagesize":0,"direct_map_4k":0,"direct_map_2M":0,"direct_map_1G":0}}';
        }
    
        fetchEGINXStats() {
            return '{"sr2":[{"serviceId":"varnish1","ActiveConnections":0,"TotalConnections":464039,"TotalHandledConnections":452205,"TotalRequests":1298410,"RequestsPerConnection":"\\u0002","Reading":0,"Writing":1,"Waiting":0}]}';
        }
    
        fetchVarnishStats() {
            return '{"sr2":[{"serviceId":"varnish1","stats":[{"id":"clientRequests","value":6933853},{"id":"cacheHits","value":6933850},{"id":"cacheMisses","value":3}]}]}';
        }
    
        fetchIPVSStats() {
            return '[{"protocol":"TCP","virtualIp":"4.3.2.1","port":"80","serviceType":"varnish","stats":{"connections":"0","inPackets":"0","outPackets":"0","inBytes":"0","outBytes":"0"},"servers":[{"realIp":"10.14.1.1","port":"80","serverName":"sr2","serviceId":"1","stats":{"connections":"0","inPackets":"0","outPackets":"0","inBytes":"0","outBytes":"0"}}]},{"protocol":"TCP","virtualIp":"4.3.2.1","port":"443","serviceType":"nginx","stats":{"connections":"0","inPackets":"0","outPackets":"0","inBytes":"0","outBytes":"0"},"servers":[{"realIp":"10.14.1.1","port":"443","serverName":"sr2","serviceId":"1","stats":{"connections":"0","inPackets":"0","outPackets":"0","inBytes":"0","outBytes":"0"}}]}]';
        }
    
        fetchPlaybooks() {
            return '{"playbooks":["adjust_containers.yml","install-docker.yml","install-ipvs.yml","ping.yml","uninstall-ipvs.yml"]}';
        }
    
        fetchGroups() {
            return '{"groups":["servers","inv","clients"]}';
        }
    */
}

let defaultAPIServer = new ServerAPI();

