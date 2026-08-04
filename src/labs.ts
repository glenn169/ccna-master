export type Lab = {
  id: string
  domainId: string
  objective: string
  title: string
  summary: string
  difficulty: 'Beginner' | 'Intermediate' | 'Exam Challenge'
  minutes: number
  devices: string[]
  goals: string[]
  steps: { title: string; instructions: string[]; commands?: string[] }[]
  verify: string[]
  prerequisites?: string[]
  troubleshooting?: string[]
}

import { supplementalLabs } from './supplementalLabs'

const coreLabs: Lab[] = [
  {
    id: 'basic-ipv4-lan', domainId: 'network-fundamentals', objective: '1.6', title: 'Build a Basic IPv4 LAN',
    summary: 'Connect two PCs through a switch, assign IPv4 addresses, and verify end-to-end reachability.', difficulty: 'Beginner', minutes: 20,
    devices: ['1 × Cisco 2960 switch', '2 × PCs', '2 × copper straight-through cables'],
    goals: ['Create a small switched topology', 'Configure valid /24 host addresses', 'Test connectivity with ping'],
    steps: [
      { title: 'Build the topology', instructions: ['Add one 2960 switch and two PCs in Packet Tracer.', 'Connect each PC FastEthernet0 port to a switch FastEthernet port.'] },
      { title: 'Address the hosts', instructions: ['Set PC1 to 192.168.10.10 /24.', 'Set PC2 to 192.168.10.20 /24.', 'Leave the default gateway empty because both hosts are in the same LAN.'] },
      { title: 'Test the LAN', instructions: ['Open Command Prompt on PC1 and ping PC2.'], commands: ['ping 192.168.10.20'] },
    ],
    verify: ['Both switch ports show green.', 'PC1 receives replies from 192.168.10.20.', 'Each PC has a unique address in 192.168.10.0/24.'],
  },
  {
    id: 'vlans-trunks', domainId: 'network-access', objective: '2.1–2.2', title: 'Configure VLANs and an 802.1Q Trunk',
    summary: 'Create two VLANs across two switches and carry both VLANs over a trunk link.', difficulty: 'Beginner', minutes: 35,
    devices: ['2 × Cisco 2960 switches', '4 × PCs', '5 × copper cables'],
    goals: ['Create VLAN 10 and VLAN 20', 'Assign access ports', 'Configure and verify a trunk'],
    steps: [
      { title: 'Create the VLANs', instructions: ['Run these commands on both switches.'], commands: ['enable', 'configure terminal', 'vlan 10', 'name SALES', 'vlan 20', 'name SUPPORT'] },
      { title: 'Assign access ports', instructions: ['Place the PC-facing ports in the correct VLAN.'], commands: ['interface fa0/1', 'switchport mode access', 'switchport access vlan 10', 'interface fa0/2', 'switchport mode access', 'switchport access vlan 20'] },
      { title: 'Configure the trunk', instructions: ['Configure the interswitch port on both switches.'], commands: ['interface fa0/24', 'switchport mode trunk', 'switchport trunk allowed vlan 10,20'] },
    ],
    verify: ['show vlan brief lists the correct access ports.', 'show interfaces trunk lists Fa0/24 and VLANs 10,20.', 'Same-VLAN PCs can ping across the switches; different-VLAN PCs cannot yet ping.'],
  },
  {
    id: 'router-on-a-stick', domainId: 'network-access', objective: '2.1–2.2', title: 'Configure Inter-VLAN Routing',
    summary: 'Use router subinterfaces to route traffic between VLAN 10 and VLAN 20.', difficulty: 'Intermediate', minutes: 40,
    devices: ['1 × Cisco router', '1 × Cisco 2960 switch', '2 × PCs'],
    goals: ['Configure router subinterfaces', 'Use 802.1Q encapsulation', 'Verify inter-VLAN communication'],
    steps: [
      { title: 'Prepare the switch', instructions: ['Create VLANs 10 and 20, assign PC ports, and trunk the router-facing port.'] },
      { title: 'Configure subinterfaces', instructions: ['Configure the router interface connected to the switch.'], commands: ['interface g0/0', 'no shutdown', 'interface g0/0.10', 'encapsulation dot1q 10', 'ip address 192.168.10.1 255.255.255.0', 'interface g0/0.20', 'encapsulation dot1q 20', 'ip address 192.168.20.1 255.255.255.0'] },
      { title: 'Configure hosts', instructions: ['Give each PC an address in its VLAN and use the matching router subinterface as its gateway.'] },
    ],
    verify: ['show ip interface brief shows both subinterfaces up/up.', 'Each PC can ping its default gateway.', 'A VLAN 10 PC can ping a VLAN 20 PC.'],
  },
  {
    id: 'static-routing', domainId: 'ip-connectivity', objective: '3.3', title: 'Configure IPv4 Static Routes',
    summary: 'Connect two routed LANs and add static routes for remote network reachability.', difficulty: 'Beginner', minutes: 35,
    devices: ['2 × Cisco routers', '2 × switches', '2 × PCs'],
    goals: ['Address router interfaces', 'Configure remote network routes', 'Interpret the routing table'],
    steps: [
      { title: 'Address and enable interfaces', instructions: ['Use 10.0.0.0/30 between routers and a separate /24 LAN behind each router.'] },
      { title: 'Add static routes', instructions: ['On R1, route to R2 LAN; on R2, route to R1 LAN.'], commands: ['R1: ip route 192.168.20.0 255.255.255.0 10.0.0.2', 'R2: ip route 192.168.10.0 255.255.255.0 10.0.0.1'] },
      { title: 'Test end to end', instructions: ['Ping the remote PC and use traceroute to observe the routed path.'] },
    ],
    verify: ['show ip route displays an S route on each router.', 'Both routers can ping the remote LAN interface.', 'PC-to-PC ping succeeds.'],
  },
  {
    id: 'single-area-ospf', domainId: 'ip-connectivity', objective: '3.4', title: 'Configure Single-Area OSPFv2',
    summary: 'Form OSPF neighbors and dynamically advertise three routed networks in area 0.', difficulty: 'Intermediate', minutes: 45,
    devices: ['3 × Cisco routers', '3 × PCs or loopback interfaces'],
    goals: ['Enable OSPF with a process ID', 'Set router IDs', 'Verify neighbors and learned routes'],
    steps: [
      { title: 'Address the topology', instructions: ['Use /30 transit networks between routers and a /24 LAN or loopback on each router.'] },
      { title: 'Enable OSPF', instructions: ['Repeat with the correct networks and unique router ID on each router.'], commands: ['router ospf 1', 'router-id 1.1.1.1', 'network 10.0.0.0 0.0.0.3 area 0', 'network 192.168.10.0 0.0.0.255 area 0'] },
      { title: 'Inspect convergence', instructions: ['Wait for adjacency formation, then inspect neighbors and routes.'] },
    ],
    verify: ['show ip ospf neighbor lists FULL adjacencies.', 'show ip route ospf displays remote networks marked O.', 'End-to-end pings succeed.'],
  },
  {
    id: 'dhcp-relay', domainId: 'ip-services', objective: '4.6', title: 'Configure DHCP and Relay',
    summary: 'Serve addresses to a remote subnet by forwarding DHCP broadcasts with ip helper-address.', difficulty: 'Intermediate', minutes: 40,
    devices: ['2 × routers', '1 × server', '1 × switch', '2 × PCs'],
    goals: ['Create a DHCP pool', 'Configure a relay agent', 'Verify dynamic addressing'],
    steps: [
      { title: 'Configure the DHCP service', instructions: ['Create a pool for the remote client LAN and exclude infrastructure addresses.'] },
      { title: 'Configure relay', instructions: ['On the client-facing router interface, point to the DHCP server.'], commands: ['interface g0/0', 'ip helper-address 192.168.50.10'] },
      { title: 'Request an address', instructions: ['Set the client to DHCP and inspect its assigned address, mask, gateway, and DNS values.'] },
    ],
    verify: ['The client receives an address from the intended pool.', 'The default gateway matches the local router interface.', 'The client can ping the DHCP server.'],
  },
  {
    id: 'secure-ssh', domainId: 'ip-services', objective: '4.8', title: 'Secure Remote Access with SSH',
    summary: 'Harden device access with a local user, RSA keys, SSH version 2, and VTY restrictions.', difficulty: 'Beginner', minutes: 30,
    devices: ['1 × Cisco switch or router', '1 × administration PC'],
    goals: ['Generate RSA keys', 'Use local authentication', 'Permit SSH and reject Telnet'],
    steps: [
      { title: 'Prepare identity settings', instructions: ['Configure a hostname, domain name, and local privileged user.'], commands: ['hostname SW1', 'ip domain-name ccna.local', 'username admin privilege 15 secret CcnaLab123!'] },
      { title: 'Enable SSH', instructions: ['Generate keys and enforce SSH version 2.'], commands: ['crypto key generate rsa modulus 2048', 'ip ssh version 2'] },
      { title: 'Secure the VTY lines', instructions: ['Authenticate against the local user database and allow only SSH.'], commands: ['line vty 0 15', 'login local', 'transport input ssh'] },
    ],
    verify: ['show ip ssh reports version 2.', 'SSH login succeeds using the local account.', 'A Telnet connection is rejected.'],
  },
  {
    id: 'standard-acl', domainId: 'security-fundamentals', objective: '5.6', title: 'Configure and Verify a Standard ACL',
    summary: 'Restrict source traffic with a numbered standard ACL and verify the result safely.', difficulty: 'Intermediate', minutes: 35,
    devices: ['2 × routers', '2 × LANs with PCs'],
    goals: ['Write standard ACL entries', 'Place the ACL near the destination', 'Confirm permit and deny behavior'],
    steps: [
      { title: 'Confirm baseline reachability', instructions: ['Verify all required pings work before applying the ACL.'] },
      { title: 'Create and apply the ACL', instructions: ['Deny one source host, permit remaining traffic, then apply outbound near the destination.'], commands: ['access-list 10 deny host 192.168.10.10', 'access-list 10 permit any', 'interface g0/1', 'ip access-group 10 out'] },
      { title: 'Test and inspect counters', instructions: ['Test from denied and permitted hosts, then inspect ACL matches.'] },
    ],
    verify: ['show access-lists displays match counters.', 'The denied host cannot reach the destination LAN.', 'Other permitted hosts retain connectivity.'],
  },
]

export const labs: Lab[] = [...coreLabs, ...supplementalLabs]

export function findLab(labId?: string) { return labs.find((lab) => lab.id === labId) }
