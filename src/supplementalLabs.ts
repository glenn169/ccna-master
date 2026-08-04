import type { Lab } from './labs'

export const supplementalLabs: Lab[] = [
  {
    id: 'ipv4-subnetting-vlsm', domainId: 'network-fundamentals', objective: '1.6', title: 'Design and Address a VLSM Network',
    summary: 'Subnet one /24 for four differently sized LANs, assign gateways, and prove that no ranges overlap.', difficulty: 'Intermediate', minutes: 40,
    devices: ['2 × Cisco routers', '2 × switches', '4 × PCs'], prerequisites: ['IPv4 prefix lengths', 'Network, host, and broadcast addresses'],
    goals: ['Allocate largest subnets first', 'Use efficient prefix lengths', 'Document every usable range'],
    steps: [
      { title: 'Build the address plan', instructions: ['Divide 192.168.50.0/24 for LANs needing 100, 50, 25, and 10 hosts.', 'Record each network, prefix, first host, last host, and broadcast address.'] },
      { title: 'Configure infrastructure', instructions: ['Use the first usable address of each subnet on its router LAN interface.', 'Use a /30 transit network between routers.'], commands: ['interface g0/0', 'ip address <gateway> <mask>', 'no shutdown', 'show ip interface brief'] },
      { title: 'Address and test hosts', instructions: ['Assign a valid address and gateway to one PC in each LAN.', 'Confirm local gateway reachability before testing remote networks.'] },
    ],
    verify: ['No subnet ranges overlap.', 'Every PC can ping its local gateway.', 'show ip interface brief displays the planned addresses.'], troubleshooting: ['A .0 or .255 address is not always the network/broadcast address after subnetting.', 'Check masks on both ends when local pings fail.'],
  },
  {
    id: 'dual-stack-ipv6', domainId: 'network-fundamentals', objective: '1.8–1.10', title: 'Configure a Dual-Stack IPv4/IPv6 LAN',
    summary: 'Enable IPv6 routing, configure global and link-local addresses, and verify neighbor discovery.', difficulty: 'Beginner', minutes: 30,
    devices: ['1 × Cisco router', '1 × switch', '2 × PCs'], goals: ['Enable IPv6 forwarding', 'Configure /64 prefixes', 'Inspect IPv6 neighbors'],
    steps: [
      { title: 'Enable dual stack', instructions: ['Configure IPv4 and IPv6 on the LAN interface.'], commands: ['ipv6 unicast-routing', 'interface g0/0', 'ip address 192.168.10.1 255.255.255.0', 'ipv6 address 2001:DB8:10::1/64', 'ipv6 address FE80::1 link-local', 'no shutdown'] },
      { title: 'Configure clients', instructions: ['Give each PC a unique IPv4 address and IPv6 address in 2001:DB8:10::/64.', 'Use FE80::1 as the IPv6 default gateway.'] },
      { title: 'Inspect discovery', instructions: ['Generate traffic, then inspect the router neighbor table.'], commands: ['show ipv6 interface brief', 'show ipv6 neighbors', 'ping 2001:DB8:10::10'] },
    ], verify: ['IPv4 and IPv6 pings both succeed.', 'The router shows global and link-local addresses.', 'Neighbor entries appear after traffic is generated.'], troubleshooting: ['Enable ipv6 unicast-routing before expecting router advertisements.', 'Every LAN should normally use a distinct /64.'],
  },
  {
    id: 'cdp-lldp-discovery', domainId: 'network-access', objective: '2.3', title: 'Map a Network with CDP and LLDP',
    summary: 'Discover neighboring devices, ports, platform details, and management addresses without a topology diagram.', difficulty: 'Beginner', minutes: 25,
    devices: ['2 × switches', '1 × router'], goals: ['Interpret CDP output', 'Enable and verify LLDP', 'Build a neighbor map'],
    steps: [
      { title: 'Discover with CDP', instructions: ['Run summary and detailed discovery commands on every device.'], commands: ['show cdp neighbors', 'show cdp neighbors detail'] },
      { title: 'Enable LLDP', instructions: ['Enable LLDP globally, wait for advertisements, and inspect neighbors.'], commands: ['configure terminal', 'lldp run', 'end', 'show lldp neighbors', 'show lldp neighbors detail'] },
      { title: 'Document the topology', instructions: ['Record each local port, neighbor hostname, remote port, platform, and management IP.'] },
    ], verify: ['CDP and LLDP identify the correct adjacent devices.', 'Local and remote port IDs match the cables.', 'The completed map matches Packet Tracer.'], troubleshooting: ['Discovery protocols only reveal directly connected neighbors.', 'Check that the protocol is enabled globally and on the interface.'],
  },
  {
    id: 'lacp-etherchannel', domainId: 'network-access', objective: '2.4', title: 'Build an LACP EtherChannel',
    summary: 'Bundle parallel links between switches with LACP and troubleshoot a deliberate configuration mismatch.', difficulty: 'Intermediate', minutes: 40,
    devices: ['2 × Cisco 2960 switches', '4 × parallel Ethernet links'], goals: ['Configure channel-group mode active', 'Create a trunk Port-channel', 'Recognize suspended links'],
    steps: [
      { title: 'Prepare member ports', instructions: ['Apply identical speed, duplex, trunk, and allowed-VLAN settings to all members on both switches.'], commands: ['interface range fa0/21-24', 'switchport mode trunk', 'switchport trunk allowed vlan 10,20', 'channel-group 1 mode active'] },
      { title: 'Configure the logical interface', instructions: ['Verify settings on the Port-channel rather than treating members independently.'], commands: ['interface port-channel 1', 'switchport mode trunk', 'switchport trunk allowed vlan 10,20'] },
      { title: 'Test a mismatch', instructions: ['Temporarily change one member to access mode, inspect the bundle, then restore the trunk configuration.'] },
    ], verify: ['show etherchannel summary displays Po1(SU).', 'All intended members show (P).', 'show interfaces trunk lists Port-channel1.'], troubleshooting: ['Member interfaces must have compatible Layer 2 settings.', 'Use active/active or active/passive; passive/passive will not form LACP.'],
  },
  {
    id: 'rapid-pvst-root', domainId: 'network-access', objective: '2.5', title: 'Control Rapid PVST+ Root Selection',
    summary: 'Create a redundant switched triangle, predict blocked ports, and tune a different root for two VLANs.', difficulty: 'Exam Challenge', minutes: 50,
    devices: ['3 × Cisco switches', '3 × PCs'], prerequisites: ['VLANs and trunks', 'STP root and port roles'], goals: ['Predict root election', 'Configure primary and secondary roots', 'Verify alternate ports'],
    steps: [
      { title: 'Build redundancy', instructions: ['Connect three switches in a triangle and trunk all interswitch links.', 'Create VLANs 10 and 20 on every switch.'] },
      { title: 'Tune root bridges', instructions: ['Make SW1 root for VLAN 10 and SW2 root for VLAN 20.'], commands: ['SW1(config)# spanning-tree vlan 10 root primary', 'SW1(config)# spanning-tree vlan 20 root secondary', 'SW2(config)# spanning-tree vlan 20 root primary', 'SW2(config)# spanning-tree vlan 10 root secondary'] },
      { title: 'Observe convergence', instructions: ['Record root, designated, and alternate ports.', 'Shut one forwarding trunk and observe reconvergence.'], commands: ['show spanning-tree vlan 10', 'show spanning-tree vlan 20'] },
    ], verify: ['SW1 is root for VLAN 10.', 'SW2 is root for VLAN 20.', 'The alternate link transitions after a forwarding link fails.'], troubleshooting: ['Root priority is evaluated per VLAN.', 'A lower bridge ID wins; MAC address breaks priority ties.'],
  },
  {
    id: 'ipv6-static-routing', domainId: 'ip-connectivity', objective: '3.3', title: 'Configure IPv6 Static and Default Routes',
    summary: 'Route two IPv6 LANs across a point-to-point link using next-hop, exit-interface, and default routes.', difficulty: 'Intermediate', minutes: 40,
    devices: ['2 × routers', '2 × switches', '2 × PCs'], goals: ['Configure IPv6 static routes', 'Use a default route', 'Verify longest-prefix matching'],
    steps: [
      { title: 'Address the network', instructions: ['Use 2001:DB8:12::/64 between routers and separate /64 LAN prefixes.', 'Enable IPv6 unicast routing on both routers.'] },
      { title: 'Add routes', instructions: ['Configure R1 with a route to the R2 LAN and R2 with a default route toward R1.'], commands: ['R1(config)# ipv6 route 2001:DB8:20::/64 2001:DB8:12::2', 'R2(config)# ipv6 route ::/0 2001:DB8:12::1'] },
      { title: 'Trace the path', instructions: ['Ping between LANs and inspect routing decisions.'], commands: ['show ipv6 route static', 'traceroute 2001:DB8:20::10'] },
    ], verify: ['Static routes appear with code S.', 'The default route appears as ::/0.', 'End-to-end IPv6 pings succeed.'], troubleshooting: ['A link-local next hop also requires an exit interface.', 'Confirm ipv6 unicast-routing is enabled.'],
  },
  {
    id: 'ospf-passive-default', domainId: 'ip-connectivity', objective: '3.4', title: 'Harden and Tune Single-Area OSPF',
    summary: 'Add passive interfaces, reference bandwidth, default-route propagation, and deterministic router IDs to an OSPF topology.', difficulty: 'Exam Challenge', minutes: 55,
    devices: ['3 × routers', '3 × switches', '3 × PCs'], prerequisites: ['Working single-area OSPF topology'], goals: ['Suppress unnecessary hellos', 'Advertise a default route', 'Interpret OSPF cost'],
    steps: [
      { title: 'Make LANs passive', instructions: ['Advertise each LAN without forming adjacencies toward clients.'], commands: ['router ospf 1', 'passive-interface default', 'no passive-interface g0/1'] },
      { title: 'Standardize cost calculation', instructions: ['Use the same reference bandwidth on every OSPF router.'], commands: ['router ospf 1', 'auto-cost reference-bandwidth 10000'] },
      { title: 'Originate a default', instructions: ['Create a static default on the edge router and inject it into OSPF.'], commands: ['ip route 0.0.0.0 0.0.0.0 <next-hop>', 'router ospf 1', 'default-information originate'] },
    ], verify: ['No neighbor forms on a passive LAN.', 'Internal routers learn O*E2 0.0.0.0/0.', 'All routers use the intended router IDs.'], troubleshooting: ['default-information originate needs an existing default route unless always is used.', 'Changing router ID may require clearing the OSPF process.'],
  },
  {
    id: 'static-nat-pat', domainId: 'ip-services', objective: '4.1', title: 'Configure Static NAT, Dynamic NAT, and PAT',
    summary: 'Translate an inside server statically and client addresses dynamically, then compare NAT table entries.', difficulty: 'Exam Challenge', minutes: 55,
    devices: ['2 × routers', '2 × switches', '1 × server', '2 × PCs'], goals: ['Mark NAT inside/outside interfaces', 'Build a dynamic pool', 'Verify translations and counters'],
    steps: [
      { title: 'Define NAT boundaries', instructions: ['Mark the LAN-facing interface inside and ISP-facing interface outside.'], commands: ['interface g0/0', 'ip nat inside', 'interface g0/1', 'ip nat outside'] },
      { title: 'Configure translations', instructions: ['Map the server statically and permit client addresses for a pool.'], commands: ['ip nat inside source static 192.168.10.10 203.0.113.10', 'access-list 1 permit 192.168.10.0 0.0.0.255', 'ip nat pool PUBLIC 203.0.113.20 203.0.113.24 netmask 255.255.255.0', 'ip nat inside source list 1 pool PUBLIC overload'] },
      { title: 'Generate and inspect traffic', instructions: ['Ping or browse from inside clients and reach the translated server from outside.'], commands: ['show ip nat translations', 'show ip nat statistics'] },
    ], verify: ['The server has a permanent static entry.', 'Client traffic creates inside-local/inside-global entries.', 'Overload allows multiple sessions.'], troubleshooting: ['Confirm routing works before diagnosing NAT.', 'Inside/outside roles and ACL source ranges are common errors.'],
  },
  {
    id: 'ntp-syslog', domainId: 'ip-services', objective: '4.2, 4.5', title: 'Synchronize Time and Centralize Syslog',
    summary: 'Configure one router as an NTP master, synchronize clients, and send timestamped events to a syslog server.', difficulty: 'Intermediate', minutes: 35,
    devices: ['2 × routers', '1 × Packet Tracer server'], goals: ['Configure NTP client/server roles', 'Send logs remotely', 'Verify clock synchronization'],
    steps: [
      { title: 'Configure time service', instructions: ['Use R1 as the lab time source and point R2 to it.'], commands: ['R1(config)# ntp master 3', 'R2(config)# ntp server <R1-IP>'] },
      { title: 'Configure syslog', instructions: ['Enable the Syslog service on the server and configure both routers.'], commands: ['service timestamps log datetime msec', 'logging host <server-IP>', 'logging trap warnings'] },
      { title: 'Generate an event', instructions: ['Shut and restore an unused interface, then inspect the server log.'] },
    ], verify: ['show ntp associations marks the selected peer.', 'show clock is synchronized on both routers.', 'Syslog displays timestamped interface events.'], troubleshooting: ['NTP may need several polling intervals to synchronize.', 'Verify reachability and the configured logging severity.'],
  },
  {
    id: 'extended-acl', domainId: 'security-fundamentals', objective: '5.6', title: 'Filter Applications with an Extended ACL',
    summary: 'Permit web and DNS traffic while blocking Telnet from one user subnet without disrupting other services.', difficulty: 'Exam Challenge', minutes: 45,
    devices: ['2 × routers', '2 × switches', '2 × PCs', '1 × server'], prerequisites: ['Wildcard masks', 'TCP/UDP port numbers'], goals: ['Write protocol-specific ACEs', 'Place an extended ACL near the source', 'Read hit counters'],
    steps: [
      { title: 'Confirm services', instructions: ['Verify HTTP, DNS, ping, and Telnet before filtering.'] },
      { title: 'Build the named ACL', instructions: ['Allow DNS and web, deny Telnet, then explicitly permit remaining IP traffic.'], commands: ['ip access-list extended USER-FILTER', 'permit udp 192.168.10.0 0.0.0.255 any eq domain', 'permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq www', 'deny tcp 192.168.10.0 0.0.0.255 any eq telnet', 'permit ip any any'] },
      { title: 'Apply and validate', instructions: ['Apply inbound on the source LAN interface and test each flow.'], commands: ['interface g0/0', 'ip access-group USER-FILTER in', 'show access-lists USER-FILTER'] },
    ], verify: ['HTTP and DNS remain available.', 'Telnet from the user LAN fails.', 'ACL counters increment on the expected lines.'], troubleshooting: ['ACE order matters because processing stops at the first match.', 'Remember the implicit deny at the end.'],
  },
  {
    id: 'switch-port-security', domainId: 'security-fundamentals', objective: '5.7', title: 'Secure Access Ports and Defend Layer 2',
    summary: 'Combine port security, DHCP snooping, and PortFast/BPDU Guard on user-facing switch ports.', difficulty: 'Intermediate', minutes: 45,
    devices: ['2 × switches', '1 × DHCP server', '3 × PCs'], goals: ['Learn sticky MAC addresses', 'Trust only infrastructure ports', 'Protect the STP edge'],
    steps: [
      { title: 'Configure secure access ports', instructions: ['Enable PortFast, BPDU Guard, and sticky port security.'], commands: ['interface range fa0/1-10', 'switchport mode access', 'spanning-tree portfast', 'spanning-tree bpduguard enable', 'switchport port-security', 'switchport port-security mac-address sticky', 'switchport port-security maximum 2', 'switchport port-security violation restrict'] },
      { title: 'Enable DHCP snooping', instructions: ['Enable snooping for the client VLAN and trust only the uplink toward the DHCP server.'], commands: ['ip dhcp snooping', 'ip dhcp snooping vlan 10', 'interface fa0/24', 'ip dhcp snooping trust'] },
      { title: 'Test violations', instructions: ['Connect an additional host and inspect counters without shutting the port.'], commands: ['show port-security interface fa0/1', 'show ip dhcp snooping binding'] },
    ], verify: ['Sticky MAC addresses appear in the running configuration.', 'A violation increments the counter in restrict mode.', 'Valid DHCP clients appear in the snooping binding table.'], troubleshooting: ['Do not enable PortFast on switch-to-switch links.', 'Trust only ports toward legitimate DHCP infrastructure.'],
  },
  {
    id: 'integrated-troubleshooting', domainId: 'ip-connectivity', objective: '1.4, 2.1–2.5, 3.3–3.4', title: 'CCNA Integrated Troubleshooting Challenge',
    summary: 'Repair a deliberately broken multi-VLAN routed network using a layered verification method and minimal configuration changes.', difficulty: 'Exam Challenge', minutes: 75,
    devices: ['3 × routers', '3 × switches', '6 × PCs'], prerequisites: ['VLANs, trunks, EtherChannel, OSPF, DHCP, ACLs'], goals: ['Troubleshoot from Layer 1 upward', 'Use show commands before changing configuration', 'Document root cause and fix'],
    steps: [
      { title: 'Establish symptoms', instructions: ['Test local gateway, same-VLAN, remote-VLAN, and server reachability from each client.', 'Record exactly which flows fail.'] },
      { title: 'Inspect Layer 1 and Layer 2', instructions: ['Check interface status, VLAN membership, trunks, EtherChannel, and spanning tree.'], commands: ['show interfaces status', 'show vlan brief', 'show interfaces trunk', 'show etherchannel summary', 'show spanning-tree'] },
      { title: 'Inspect Layer 3', instructions: ['Check addressing, routes, OSPF neighbors, ACL placement, and DHCP relay.'], commands: ['show ip interface brief', 'show ip route', 'show ip ospf neighbor', 'show access-lists', 'show running-config | include helper-address'] },
      { title: 'Repair and prove', instructions: ['Change only confirmed faults.', 'Repeat the original test matrix and save the corrected configuration.'], commands: ['copy running-config startup-config'] },
    ], verify: ['All required user-to-service flows succeed.', 'OSPF adjacencies are FULL and routes are present.', 'The final notes identify symptom, root cause, command evidence, and fix.'], troubleshooting: ['Do not make several changes at once.', 'A successful local gateway ping narrows the fault beyond the host LAN.'],
  },
]
