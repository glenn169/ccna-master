export type TopologyNode = {
  id: string
  label: string
  role: 'router' | 'switch' | 'host' | 'server' | 'cloud'
  x: number
  y: number
  detail?: string
}

export type TopologyLink = {
  from: string
  to: string
  label: string
  style?: 'trunk' | 'etherchannel' | 'wan'
}

export type AddressRow = { device: string; interface: string; address: string; purpose?: string }

export type LabTopology = {
  caption: string
  nodes: TopologyNode[]
  links: TopologyLink[]
  addresses: AddressRow[]
  note?: string
}

const n = (id: string, label: string, role: TopologyNode['role'], x: number, y: number, detail?: string): TopologyNode => ({ id, label, role, x, y, detail })
const l = (from: string, to: string, label: string, style?: TopologyLink['style']): TopologyLink => ({ from, to, label, style })
const a = (device: string, iface: string, address: string, purpose?: string): AddressRow => ({ device, interface: iface, address, purpose })

export const labTopologies: Record<string, LabTopology> = {
  'basic-ipv4-lan': {
    caption: 'One broadcast domain: both hosts communicate through SW1 without a default gateway.',
    nodes: [n('pc1','PC1','host',15,50,'192.168.10.10/24'), n('sw1','SW1','switch',50,50,'Cisco 2960'), n('pc2','PC2','host',85,50,'192.168.10.20/24')],
    links: [l('pc1','sw1','Fa0 ↔ Fa0/1'), l('sw1','pc2','Fa0/2 ↔ Fa0')],
    addresses: [a('PC1','FastEthernet0','192.168.10.10 /24','No gateway'), a('PC2','FastEthernet0','192.168.10.20 /24','No gateway')],
  },
  'vlans-trunks': {
    caption: 'VLAN 10 and VLAN 20 extend across the 802.1Q trunk between SW1 and SW2.',
    nodes: [n('p1','PC1','host',10,20,'VLAN 10'), n('p2','PC2','host',10,80,'VLAN 20'), n('s1','SW1','switch',38,50,'Fa0/24 trunk'), n('s2','SW2','switch',68,50,'Fa0/24 trunk'), n('p3','PC3','host',94,20,'VLAN 10'), n('p4','PC4','host',94,80,'VLAN 20')],
    links: [l('p1','s1','Fa0/1 · access 10'), l('p2','s1','Fa0/2 · access 20'), l('s1','s2','Fa0/24 ↔ Fa0/24','trunk'), l('s2','p3','Fa0/1 · access 10'), l('s2','p4','Fa0/2 · access 20')],
    addresses: [a('PC1','Fa0','192.168.10.10 /24','VLAN 10'), a('PC3','Fa0','192.168.10.30 /24','VLAN 10'), a('PC2','Fa0','192.168.20.20 /24','VLAN 20'), a('PC4','Fa0','192.168.20.40 /24','VLAN 20')],
    note: 'Same-VLAN pings should work across the trunk. Inter-VLAN pings require routing and should fail in this lab.',
  },
  'router-on-a-stick': {
    caption: 'R1 routes between VLANs through two subinterfaces carried over one trunk.',
    nodes: [n('r1','R1','router',50,15,'G0/0.10 + G0/0.20'), n('sw1','SW1','switch',50,50,'G0/1 trunk'), n('pc1','PC1','host',20,82,'VLAN 10'), n('pc2','PC2','host',80,82,'VLAN 20')],
    links: [l('r1','sw1','G0/0 ↔ G0/1 · VLANs 10,20','trunk'), l('sw1','pc1','Fa0/1 · access 10'), l('sw1','pc2','Fa0/2 · access 20')],
    addresses: [a('R1','G0/0.10','192.168.10.1 /24','Gateway VLAN 10'), a('R1','G0/0.20','192.168.20.1 /24','Gateway VLAN 20'), a('PC1','Fa0','192.168.10.10 /24','GW 192.168.10.1'), a('PC2','Fa0','192.168.20.20 /24','GW 192.168.20.1')],
  },
  'static-routing': {
    caption: 'Each router needs one static route pointing across the /30 transit network.',
    nodes: [n('pc1','PC1','host',6,70,'192.168.10.10'), n('s1','SW1','switch',22,70), n('r1','R1','router',38,45,'10.0.0.1/30'), n('r2','R2','router',64,45,'10.0.0.2/30'), n('s2','SW2','switch',80,70), n('pc2','PC2','host',96,70,'192.168.20.20')],
    links: [l('pc1','s1','Fa0 ↔ Fa0/1'), l('s1','r1','G0/1 ↔ G0/0'), l('r1','r2','G0/1 · 10.0.0.0/30 · G0/1','wan'), l('r2','s2','G0/0 ↔ G0/1'), l('s2','pc2','Fa0/1 ↔ Fa0')],
    addresses: [a('R1','G0/0','192.168.10.1 /24','LAN gateway'), a('R1','G0/1','10.0.0.1 /30','Transit'), a('R2','G0/1','10.0.0.2 /30','Transit'), a('R2','G0/0','192.168.20.1 /24','LAN gateway'), a('PC1','Fa0','192.168.10.10 /24','GW .10.1'), a('PC2','Fa0','192.168.20.20 /24','GW .20.1')],
  },
  'single-area-ospf': {
    caption: 'Three routers form two area 0 adjacencies and advertise one LAN each.',
    nodes: [n('r1','R1','router',18,35,'RID 1.1.1.1'), n('r2','R2','router',50,35,'RID 2.2.2.2'), n('r3','R3','router',82,35,'RID 3.3.3.3'), n('p1','LAN 10','host',18,82,'192.168.10.0/24'), n('p2','LAN 20','host',50,82,'192.168.20.0/24'), n('p3','LAN 30','host',82,82,'192.168.30.0/24')],
    links: [l('r1','r2','10.0.12.0/30 · area 0','wan'), l('r2','r3','10.0.23.0/30 · area 0','wan'), l('r1','p1','G0/0 · .10.1'), l('r2','p2','G0/0 · .20.1'), l('r3','p3','G0/0 · .30.1')],
    addresses: [a('R1','G0/1','10.0.12.1 /30'), a('R2','G0/1','10.0.12.2 /30'), a('R2','G0/2','10.0.23.1 /30'), a('R3','G0/1','10.0.23.2 /30'), a('R1/R2/R3','G0/0','192.168.10.1 / 20.1 / 30.1','LAN gateways')],
  },
  'dhcp-relay': {
    caption: 'R2 relays the client broadcast as unicast to the DHCP server behind R1.',
    nodes: [n('srv','DHCP Server','server',8,75,'192.168.50.10'), n('sw1','SW1','switch',23,75), n('r1','R1','router',40,45,'192.168.50.1'), n('r2','R2','router',65,45,'192.168.10.1'), n('sw2','SW2','switch',80,75), n('pc','DHCP Client','host',95,75,'Address: automatic')],
    links: [l('srv','sw1','Fa0 ↔ Fa0/1'), l('sw1','r1','G0/0'), l('r1','r2','10.0.0.0/30','wan'), l('r2','sw2','G0/0'), l('sw2','pc','Fa0/1 ↔ Fa0')],
    addresses: [a('Server','Fa0','192.168.50.10 /24','GW 192.168.50.1'), a('R1','G0/0','192.168.50.1 /24'), a('R1/R2','G0/1','10.0.0.1 / .2 /30','Transit'), a('R2','G0/0','192.168.10.1 /24','ip helper-address 192.168.50.10'), a('Client','Fa0','DHCP','Pool 192.168.10.0/24')],
  },
  'secure-ssh': {
    caption: 'The administration PC reaches the device management address using SSH only.',
    nodes: [n('pc','Admin PC','host',20,50,'192.168.10.10'), n('sw','SW1','switch',70,50,'VLAN 1: 192.168.10.2')],
    links: [l('pc','sw','Fa0 ↔ Fa0/1 · SSH TCP/22')],
    addresses: [a('Admin PC','Fa0','192.168.10.10 /24'), a('SW1','interface VLAN 1','192.168.10.2 /24','SSH target')],
    note: 'From the PC, test with ssh -l admin 192.168.10.2. Telnet should be rejected.',
  },
  'standard-acl': {
    caption: 'Apply the standard ACL outbound on R2, close to the destination LAN.',
    nodes: [n('pc1','Denied PC','host',5,25,'192.168.10.10'), n('pc2','Allowed PC','host',5,78,'192.168.10.20'), n('r1','R1','router',33,50), n('r2','R2','router',64,50,'ACL 10 OUT'), n('dst','Destination LAN','host',93,50,'192.168.20.0/24')],
    links: [l('pc1','r1','Source LAN'), l('pc2','r1','Source LAN'), l('r1','r2','10.0.0.0/30','wan'), l('r2','dst','G0/1 · ACL OUT')],
    addresses: [a('Denied PC','Fa0','192.168.10.10 /24','GW .10.1'), a('Allowed PC','Fa0','192.168.10.20 /24','GW .10.1'), a('R1/R2','Transit','10.0.0.1 / .2 /30'), a('R2','G0/1','192.168.20.1 /24','ACL 10 outbound')],
  },
  'ipv4-subnetting-vlsm': {
    caption: 'Use the largest-first VLSM plan; the router interfaces become each LAN’s first usable address.',
    nodes: [n('a','LAN A','host',8,18,'100 hosts · /25'), n('b','LAN B','host',8,78,'50 hosts · /26'), n('r1','R1','router',38,48,'10.0.0.1/30'), n('r2','R2','router',64,48,'10.0.0.2/30'), n('c','LAN C','host',94,18,'25 hosts · /27'), n('d','LAN D','host',94,78,'10 hosts · /28')],
    links: [l('a','r1','192.168.50.0/25'), l('b','r1','192.168.50.128/26'), l('r1','r2','10.0.0.0/30','wan'), l('r2','c','192.168.50.192/27'), l('r2','d','192.168.50.224/28')],
    addresses: [a('R1','G0/0','192.168.50.1 /25','LAN A GW'), a('R1','G0/1','192.168.50.129 /26','LAN B GW'), a('R2','G0/0','192.168.50.193 /27','LAN C GW'), a('R2','G0/1','192.168.50.225 /28','LAN D GW'), a('R1/R2','G0/2','10.0.0.1 / .2 /30','Transit')],
  },
  'dual-stack-ipv6': {
    caption: 'One LAN carries IPv4 and IPv6 simultaneously; FE80::1 is the IPv6 gateway.',
    nodes: [n('r','R1','router',50,15,'Dual-stack gateway'), n('s','SW1','switch',50,50), n('p1','PC1','host',20,82,'v4 + v6'), n('p2','PC2','host',80,82,'v4 + v6')],
    links: [l('r','s','G0/0 ↔ G0/1'), l('s','p1','Fa0/1'), l('s','p2','Fa0/2')],
    addresses: [a('R1','G0/0','192.168.10.1 /24','IPv4 gateway'), a('R1','G0/0','2001:DB8:10::1 /64 · FE80::1','IPv6 gateway'), a('PC1','Fa0','192.168.10.10 · 2001:DB8:10::10 /64','GW .10.1 / FE80::1'), a('PC2','Fa0','192.168.10.20 · 2001:DB8:10::20 /64','GW .10.1 / FE80::1')],
  },
  'cdp-lldp-discovery': {
    caption: 'Start without labels in Packet Tracer, then use CDP and LLDP to discover this physical map.',
    nodes: [n('r','R1','router',15,50,'G0/0'), n('s1','SW1','switch',50,25,'G0/1 + G0/2'), n('s2','SW2','switch',82,65,'G0/1')],
    links: [l('r','s1','R1 G0/0 ↔ SW1 G0/1'), l('s1','s2','SW1 G0/2 ↔ SW2 G0/1')],
    addresses: [a('R1','G0/0','192.168.10.1 /24'), a('SW1','VLAN 1','192.168.10.2 /24'), a('SW2','VLAN 1','192.168.10.3 /24')],
  },
  'lacp-etherchannel': {
    caption: 'Four physical trunks operate as one logical Port-channel 1 using LACP.',
    nodes: [n('s1','SW1','switch',20,50,'Po1 · LACP active'), n('s2','SW2','switch',80,50,'Po1 · LACP active')],
    links: [l('s1','s2','Fa0/21–24 ↔ Fa0/21–24 · Po1','etherchannel')],
    addresses: [a('SW1','Port-channel 1','Trunk VLANs 10,20','LACP active'), a('SW2','Port-channel 1','Trunk VLANs 10,20','LACP active')],
    note: 'All member ports must match for speed, duplex, trunk mode, native VLAN, and allowed VLANs.',
  },
  'rapid-pvst-root': {
    caption: 'Redundant trunks form a triangle; root selection and the blocked port are decided independently per VLAN.',
    nodes: [n('s1','SW1','switch',50,15,'Root VLAN 10'), n('s2','SW2','switch',18,76,'Root VLAN 20'), n('s3','SW3','switch',82,76,'Alternate port here')],
    links: [l('s1','s2','802.1Q trunk','trunk'), l('s1','s3','802.1Q trunk','trunk'), l('s2','s3','Redundant trunk','trunk')],
    addresses: [a('SW1','Bridge','Root primary VLAN 10','Secondary VLAN 20'), a('SW2','Bridge','Root primary VLAN 20','Secondary VLAN 10'), a('All switches','Trunks','Allowed VLANs 10,20')],
  },
  'ipv6-static-routing': {
    caption: 'R1 uses a specific route to LAN 20; R2 uses an IPv6 default route toward R1.',
    nodes: [n('pc1','PC1','host',5,70,'2001:DB8:10::10'), n('r1','R1','router',35,45,'2001:DB8:12::1'), n('r2','R2','router',65,45,'2001:DB8:12::2'), n('pc2','PC2','host',95,70,'2001:DB8:20::10')],
    links: [l('pc1','r1','2001:DB8:10::/64'), l('r1','r2','2001:DB8:12::/64','wan'), l('r2','pc2','2001:DB8:20::/64')],
    addresses: [a('R1','G0/0','2001:DB8:10::1 /64','LAN 10 GW'), a('R1','G0/1','2001:DB8:12::1 /64'), a('R2','G0/1','2001:DB8:12::2 /64'), a('R2','G0/0','2001:DB8:20::1 /64','LAN 20 GW')],
  },
  'ospf-passive-default': {
    caption: 'R1 is the edge router; LAN interfaces are passive while inter-router links form OSPF neighbors.',
    nodes: [n('isp','ISP','cloud',8,18,'Default route'), n('r1','R1 Edge','router',28,45,'Originate default'), n('r2','R2','router',55,45), n('r3','R3','router',82,45), n('l1','LAN 10','host',28,85), n('l2','LAN 20','host',55,85), n('l3','LAN 30','host',82,85)],
    links: [l('isp','r1','203.0.113.0/30','wan'), l('r1','r2','10.0.12.0/30 · OSPF'), l('r2','r3','10.0.23.0/30 · OSPF'), l('r1','l1','Passive'), l('r2','l2','Passive'), l('r3','l3','Passive')],
    addresses: [a('R1','ISP link','203.0.113.2 /30','Default via .1'), a('R1/R2','Transit','10.0.12.1 / .2 /30'), a('R2/R3','Transit','10.0.23.1 / .2 /30'), a('R1/R2/R3','LAN','192.168.10.1 / 20.1 / 30.1','Passive OSPF')],
  },
  'static-nat-pat': {
    caption: 'R1 translates private inside addresses before traffic crosses the public link to the ISP router.',
    nodes: [n('srv','Inside Server','server',5,22,'192.168.10.10'), n('pc','Inside PCs','host',5,78,'192.168.10.20–21'), n('sw','SW1','switch',25,50), n('r1','R1 NAT','router',52,50,'Inside ↔ Outside'), n('isp','ISP R2','router',78,50,'203.0.113.1'), n('web','Outside Host','server',96,78,'198.51.100.10')],
    links: [l('srv','sw','Inside'), l('pc','sw','Inside'), l('sw','r1','G0/0 · ip nat inside'), l('r1','isp','203.0.113.0/24 · outside','wan'), l('isp','web','198.51.100.0/24')],
    addresses: [a('R1','G0/0','192.168.10.1 /24','NAT inside'), a('R1','G0/1','203.0.113.2 /24','NAT outside'), a('Server','Fa0','192.168.10.10 /24','Static global 203.0.113.10'), a('Clients','Fa0','192.168.10.20–21 /24','PAT pool .20–.24'), a('ISP R2','G0/0','203.0.113.1 /24')],
  },
  'ntp-syslog': {
    caption: 'R1 supplies time to R2; both routers send timestamped syslog messages to the server.',
    nodes: [n('r1','R1','router',18,35,'NTP master 3'), n('r2','R2','router',52,35,'NTP client'), n('srv','Syslog Server','server',82,72,'192.168.20.10')],
    links: [l('r1','r2','10.0.0.0/30 · NTP UDP/123','wan'), l('r2','srv','192.168.20.0/24 · Syslog UDP/514')],
    addresses: [a('R1','G0/0','10.0.0.1 /30','NTP source'), a('R2','G0/0','10.0.0.2 /30','ntp server 10.0.0.1'), a('R2','G0/1','192.168.20.1 /24'), a('Server','Fa0','192.168.20.10 /24','Syslog destination')],
  },
  'extended-acl': {
    caption: 'The named extended ACL is placed inbound on R1, near the source user LAN.',
    nodes: [n('pc','User PC','host',5,72,'192.168.10.10'), n('r1','R1','router',34,48,'USER-FILTER IN'), n('r2','R2','router',63,48), n('srv','Web/DNS Server','server',94,72,'192.168.20.10')],
    links: [l('pc','r1','G0/0 · ACL inbound'), l('r1','r2','10.0.0.0/30','wan'), l('r2','srv','192.168.20.0/24')],
    addresses: [a('PC','Fa0','192.168.10.10 /24','GW .10.1'), a('R1','G0/0','192.168.10.1 /24','USER-FILTER in'), a('R1/R2','Transit','10.0.0.1 / .2 /30'), a('Server','Fa0','192.168.20.10 /24','HTTP + DNS')],
  },
  'switch-port-security': {
    caption: 'Only the uplink toward the DHCP server is trusted; PC-facing ports are secured edge ports.',
    nodes: [n('srv','DHCP Server','server',8,18,'Trusted source'), n('s1','SW1','switch',35,45,'Fa0/24 trusted'), n('s2','SW2','switch',65,45,'Access switch'), n('p1','PC1','host',82,15,'Fa0/1 secure'), n('p2','PC2','host',94,48,'Fa0/2 secure'), n('rogue','Test Host','host',82,82,'Violation test')],
    links: [l('srv','s1','Fa0/24 · DHCP trusted'), l('s1','s2','Trunk · trusted uplink','trunk'), l('s2','p1','Access VLAN 10'), l('s2','p2','Access VLAN 10'), l('s2','rogue','Connect to test restrict')],
    addresses: [a('Server','Fa0','192.168.10.10 /24','Legitimate DHCP'), a('SW1/SW2','Uplink','Trunk VLAN 10','DHCP snooping trust'), a('SW2','Fa0/1–10','Access VLAN 10','PortFast + BPDU Guard + sticky MAC')],
  },
  'integrated-troubleshooting': {
    caption: 'Use this reference design to compare the intended physical and logical path while locating injected faults.',
    nodes: [n('u1','Users VLAN 10','host',5,18,'DHCP clients'), n('u2','Users VLAN 20','host',5,80,'DHCP clients'), n('s1','SW1','switch',25,48,'Access'), n('s2','SW2','switch',43,48,'Po1 trunk'), n('r1','R1','router',61,48,'Inter-VLAN'), n('r2','R2','router',77,25,'OSPF'), n('r3','R3','router',77,75,'OSPF'), n('srv','Server LAN','server',96,48,'192.168.30.10')],
    links: [l('u1','s1','Access VLAN 10'), l('u2','s1','Access VLAN 20'), l('s1','s2','Po1 · VLANs 10,20','etherchannel'), l('s2','r1','802.1Q trunk','trunk'), l('r1','r2','10.0.12.0/30 · OSPF'), l('r1','r3','10.0.13.0/30 · OSPF'), l('r2','srv','Server path'), l('r3','srv','Redundant path')],
    addresses: [a('R1','G0/0.10','192.168.10.1 /24','VLAN 10 GW'), a('R1','G0/0.20','192.168.20.1 /24','VLAN 20 GW'), a('R1/R2','Transit','10.0.12.1 / .2 /30','OSPF area 0'), a('R1/R3','Transit','10.0.13.1 / .2 /30','OSPF area 0'), a('Server','Fa0','192.168.30.10 /24','Application target')],
    note: 'Treat the diagram as the intended state. Verify cabling, VLANs, trunks, EtherChannel, subinterfaces, routing, DHCP relay, and ACLs in that order.',
  },
}

export function findLabTopology(labId: string) { return labTopologies[labId] }
