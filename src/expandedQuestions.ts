import type { PracticeQuestion } from './questions'

type Difficulty = NonNullable<PracticeQuestion['difficulty']>
function question(id: string, prompt: string, correct: string, distractors: string[], explanation: string, difficulty: Difficulty, tags: string[]): PracticeQuestion {
  const choices = [correct, ...distractors]
  const shift = [...id].reduce((sum, value) => sum + value.charCodeAt(0), 0) % 4
  const rotated = [...choices.slice(shift), ...choices.slice(0, shift)]
  return { id, prompt, choices: rotated, answer: rotated.indexOf(correct), explanation, difficulty, tags }
}

const subnetCases = [
  ['10.0.0.0',26,'10.0.0.63','10.0.0.1','10.0.0.62'], ['10.0.0.64',26,'10.0.0.127','10.0.0.65','10.0.0.126'], ['10.0.1.128',26,'10.0.1.191','10.0.1.129','10.0.1.190'], ['172.16.4.192',26,'172.16.4.255','172.16.4.193','172.16.4.254'],
  ['192.168.1.0',27,'192.168.1.31','192.168.1.1','192.168.1.30'], ['192.168.1.32',27,'192.168.1.63','192.168.1.33','192.168.1.62'], ['192.168.10.96',27,'192.168.10.127','192.168.10.97','192.168.10.126'], ['172.20.8.224',27,'172.20.8.255','172.20.8.225','172.20.8.254'],
  ['10.1.1.0',28,'10.1.1.15','10.1.1.1','10.1.1.14'], ['10.1.1.16',28,'10.1.1.31','10.1.1.17','10.1.1.30'], ['192.168.50.80',28,'192.168.50.95','192.168.50.81','192.168.50.94'], ['172.31.2.240',28,'172.31.2.255','172.31.2.241','172.31.2.254'],
  ['10.2.0.0',29,'10.2.0.7','10.2.0.1','10.2.0.6'], ['10.2.0.8',29,'10.2.0.15','10.2.0.9','10.2.0.14'], ['192.0.2.40',29,'192.0.2.47','192.0.2.41','192.0.2.46'], ['198.51.100.248',29,'198.51.100.255','198.51.100.249','198.51.100.254'],
  ['10.3.0.0',30,'10.3.0.3','10.3.0.1','10.3.0.2'], ['10.3.0.4',30,'10.3.0.7','10.3.0.5','10.3.0.6'], ['192.168.100.20',30,'192.168.100.23','192.168.100.21','192.168.100.22'], ['203.0.113.252',30,'203.0.113.255','203.0.113.253','203.0.113.254'],
] as const

const subnetQuestions = subnetCases.map(([network,prefix,broadcast,first,last], index) => question(`x-ip4-${index+1}`, `What is the broadcast address of subnet ${network}/${prefix}?`, broadcast, [first,last,network], `A /${prefix} subnet beginning at ${network} ends at ${broadcast}; that final address is reserved as the broadcast address.`, prefix >= 29 ? 'medium' : 'hard', ['ipv4','subnetting']))

const wildcardCases = [['/8','0.255.255.255'],['/16','0.0.255.255'],['/20','0.0.15.255'],['/22','0.0.3.255'],['/23','0.0.1.255'],['/24','0.0.0.255'],['/25','0.0.0.127'],['/26','0.0.0.63'],['/27','0.0.0.31'],['/28','0.0.0.15'],['/29','0.0.0.7'],['/30','0.0.0.3']] as const
const wildcardQuestions = wildcardCases.map(([prefix,wildcard], index) => question(`x-acl-${index+1}`, `Which wildcard mask matches an IPv4 ${prefix} prefix?`, wildcard, ['255.255.255.0','0.0.0.0','255.255.255.255'], `A wildcard mask is the bitwise inverse of the subnet mask. The inverse for ${prefix} is ${wildcard}.`, 'medium', ['acl','wildcard-mask']))

const serviceCases = [
  ['SSH','TCP','22'],['Telnet','TCP','23'],['DNS query','UDP','53'],['HTTP','TCP','80'],['HTTPS','TCP','443'],['DHCP server','UDP','67'],['DHCP client','UDP','68'],['TFTP','UDP','69'],['SNMP polling','UDP','161'],['SNMP traps','UDP','162'],['NTP','UDP','123'],['Syslog','UDP','514'],
] as const
const serviceQuestions = serviceCases.map(([service,transport,port], index) => question(`x-svc-${index+1}`, `Which transport protocol and destination port are normally associated with ${service}?`, `${transport}/${port}`, [`${transport === 'TCP' ? 'UDP' : 'TCP'}/${port}`,`UDP/${Number(port)+1}`,`TCP/${Number(port)+100}`], `${service} normally uses ${transport} destination port ${port}.`, index < 4 ? 'easy' : 'medium', ['ports','tcp-udp','services']))

const commandCases = [
  ['display learned MAC addresses','show mac address-table'],['display VLAN membership','show vlan brief'],['verify 802.1Q trunks','show interfaces trunk'],['verify an EtherChannel bundle','show etherchannel summary'],['display directly connected and learned IPv4 routes','show ip route'],['verify OSPF adjacencies','show ip ospf neighbor'],['display active NAT mappings','show ip nat translations'],['verify DHCP relay on an interface','show running-config interface'],['display configured IPv4 ACLs','show access-lists'],['verify SSH settings','show ip ssh'],['display CDP neighbors with IP details','show cdp neighbors detail'],['display LLDP neighbors with details','show lldp neighbors detail'],
] as const
const commandQuestions = commandCases.map(([goal,command], index) => question(`x-cmd-${index+1}`, `Which Cisco IOS command is most appropriate to ${goal}?`, command, ['show startup-config only','show controllers serial','debug all'], `${command} provides the relevant operational verification output for this task.`, index < 5 ? 'easy' : 'medium', ['ios','verification']))

const automationCases = [
  ['retrieve a REST resource without changing it','GET'],['create a child resource in a REST collection','POST'],['replace a REST resource representation','PUT'],['partially modify a REST resource','PATCH'],['remove a REST resource','DELETE'],['indicate a successful HTTP request','200 OK'],['indicate a successfully created resource','201 Created'],['indicate that authentication is required or failed','401 Unauthorized'],['indicate that an authenticated client lacks permission','403 Forbidden'],['indicate that a resource cannot be found','404 Not Found'],['represent a JSON list','square brackets [ ]'],['separate a JSON object key from its value','a colon :'],
] as const
const automationQuestions = automationCases.map(([goal,answer], index) => question(`x-auto-${index+1}`, `Which value is used to ${goal}?`, answer, ['302 Found','CONNECT','angle brackets < >'], `${answer} is the standard REST/HTTP or JSON construct used to ${goal}.`, index < 5 ? 'medium' : 'easy', ['automation','rest','json']))

const conceptCases = [
  ['network-components','x-con-1','separate IP networks','Router','A router makes Layer 3 forwarding decisions between IP networks.'],
  ['switching-concepts','x-con-2','learn source MAC addresses and forward Ethernet frames','Layer 2 switch','A Layer 2 switch builds a MAC address table from source MAC addresses.'],
  ['cabling-interfaces','x-con-3','connect unlike legacy Ethernet devices without auto-MDIX','Straight-through copper cable','Straight-through cabling was traditionally used between unlike Ethernet device types.'],
  ['interface-issues','x-con-4','indicate a duplex mismatch','Late collisions and poor throughput','A duplex mismatch commonly produces late collisions, errors and severe performance loss.'],
  ['ipv6-types','x-con-5','reach all IPv6 nodes on the local link','FF02::1','FF02::1 is the link-local all-nodes multicast address.'],
  ['wireless-principles','x-con-6','reduce 2.4 GHz channel overlap','Use channels 1, 6 and 11','Channels 1, 6 and 11 are the standard non-overlapping 20 MHz choices in 2.4 GHz WLANs.'],
  ['rapid-pvst','x-con-7','protect an edge port from unexpected BPDUs','BPDU Guard','BPDU Guard can error-disable a PortFast edge port that receives a BPDU.'],
  ['etherchannel','x-con-8','form an LACP EtherChannel actively','channel-group 1 mode active','LACP active mode initiates negotiation and can form with active or passive.'],
  ['fhrp','x-con-9','give hosts a resilient default gateway','Virtual IP address','Hosts use the FHRP virtual IP rather than a router physical address.'],
  ['layer2-security','x-con-10','block rogue DHCP server replies on untrusted ports','DHCP snooping','DHCP snooping permits server messages only on trusted ports and builds a binding table.'],
  ['aaa','x-con-11','record user commands and session activity','Accounting','AAA accounting records what authenticated users do.'],
  ['controller-networking','x-con-12','provide centralized policy and network abstraction','SDN controller','A controller centralizes intent and exposes abstractions through APIs.'],
] as const
const conceptQuestions = conceptCases.map(([topic,id,goal,answer,explanation], index) => ({ topic, item: question(id, `Which option is best suited to ${goal}?`, answer, ['NTP server','Syslog severity','TFTP block size'], explanation, index % 3 === 0 ? 'hard' : 'medium', ['ccna','concepts']) }))

export const expandedQuestions: Record<string, PracticeQuestion[]> = {
  'ipv4-addressing': subnetQuestions,
  acls: wildcardQuestions,
  'tcp-udp': serviceQuestions,
  'ip-parameters': commandQuestions,
  'rest-apis': automationQuestions,
}
for (const {topic,item} of conceptQuestions) expandedQuestions[topic] = [...(expandedQuestions[topic] ?? []), item]
