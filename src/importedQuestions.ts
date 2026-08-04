import type { PracticeQuestion } from './questions'

export const importedQuestions: Record<string, PracticeQuestion[]> = {
  ospfv2: [
    { id: 'pdf-os-1', prompt: 'An OSPF router loses its current route to a destination. Four alternate OSPF paths have costs 20, 30, 40, and 50. Which path is installed?', choices: ['The path with cost 20', 'The path with cost 30', 'The path with cost 40', 'The path with cost 50'], answer: 0, explanation: 'When prefix length and route source are equal, OSPF selects the path with the lowest accumulated cost.', difficulty: 'medium', tags: ['pdf-import', 'ospf', 'metric'] },
  ],
  vlans: [
    { id: 'pdf-vl-1', prompt: 'Which configuration correctly creates router subinterface Ethernet0/0.20 for VLAN 20 with gateway address 10.20.20.1/24?', choices: ['interface Ethernet0/0.20; encapsulation dot1q 20; ip address 10.20.20.1 255.255.255.0', 'interface Ethernet0/0; encapsulation dot1q 20; ip address 10.20.20.1 255.255.255.0', 'interface Ethernet0/0.20; ip address 10.20.20.1 255.255.255.0', 'interface vlan 20; switchport access vlan 20'], answer: 0, explanation: 'Router-on-a-stick requires a logical subinterface, an 802.1Q VLAN association, and the Layer 3 gateway address.', difficulty: 'medium', tags: ['pdf-import', 'router-on-a-stick', 'subinterface'] },
  ],
  'routing-table': [
    { id: 'pdf-rt-1', prompt: 'A router learns the same prefix through OSPF on F0/5 with [110/6292], OSPF on F0/8 with [110/28805], RIP on F0/10 with [120/11], and RIP on F0/18 with [120/4]. Which exit interface is selected?', choices: ['F0/5', 'F0/8', 'F0/10', 'F0/18'], answer: 0, explanation: 'OSPF wins over RIP because 110 is lower than 120. Between the OSPF routes, metric 6292 is lower than 28805, so F0/5 is selected.', difficulty: 'hard', tags: ['pdf-import', 'administrative-distance', 'metric'] },
  ],
  'ipv4-addressing': [
    { id: 'pdf-ip4-1', prompt: 'Hosts 192.168.25.100/25 and 192.168.25.128/25 must communicate directly on one local subnet. Which mask should be configured on both hosts?', choices: ['255.255.255.0', '255.255.255.224', '255.255.255.248', '255.255.255.252'], answer: 0, explanation: 'The original /25 boundary separates the addresses. A /24 mask places both in subnet 192.168.25.0/24.', difficulty: 'medium', tags: ['pdf-import', 'subnetting', 'host-addressing'] },
  ],
  'wireless-security': [
    { id: 'pdf-ws-1', prompt: 'What is the minimum valid length of an ASCII WPA2 pre-shared key on a Cisco wireless LAN controller?', choices: ['6 characters', '8 characters', '12 characters', '64 characters'], answer: 1, explanation: 'A WPA/WPA2 ASCII pre-shared key contains 8 to 63 characters; a hexadecimal key contains exactly 64 hexadecimal characters.', difficulty: 'easy', tags: ['pdf-import', 'wpa2', 'psk'] },
  ],
  'tcp-udp': [
    { id: 'pdf-tu-1', prompt: 'Which statement correctly compares the minimum TCP and UDP header sizes without optional fields?', choices: ['TCP is 20 bytes and UDP is 8 bytes', 'TCP is 8 bytes and UDP is 20 bytes', 'Both are 20 bytes', 'Both are 8 bytes'], answer: 0, explanation: 'A TCP header is at least 20 bytes, while the fixed UDP header is 8 bytes.', difficulty: 'medium', tags: ['pdf-import', 'tcp', 'udp', 'headers'] },
  ],
  'cabling-interfaces': [
    { id: 'pdf-ci-1', prompt: 'Which copper Ethernet cable is traditionally required between two like devices when auto-MDIX is unavailable?', choices: ['Crossover cable', 'Straight-through cable', 'Rollover cable', 'Console cable'], answer: 0, explanation: 'A crossover cable swaps transmit and receive pairs for legacy connections between like Ethernet device types.', difficulty: 'easy', tags: ['pdf-import', 'cabling', 'auto-mdix'] },
    { id: 'pdf-ci-2', prompt: 'Which two characteristics are associated with single-mode fiber? (Choose two.)', choices: ['Supports long-distance links', 'Uses a narrow core', 'Commonly supplies PoE to endpoints', 'Is more vulnerable to electromagnetic interference than copper'], answer: [0, 1], explanation: 'Single-mode fiber uses a small core and is suited to high-bandwidth, long-distance links. Fiber does not carry PoE and is immune to electromagnetic interference.', difficulty: 'medium', tags: ['pdf-import', 'fiber', 'single-mode'] },
  ],
  trunks: [
    { id: 'pdf-tr-1', prompt: 'Which command places a switch interface in a passive DTP mode that becomes a trunk when the neighbor is configured as trunk or dynamic desirable?', choices: ['switchport mode trunk', 'switchport mode dynamic auto', 'switchport mode dynamic desirable', 'switchport mode access'], answer: 1, explanation: 'Dynamic auto waits for the neighboring port to initiate trunk formation; trunk and dynamic desirable actively form or request a trunk.', difficulty: 'medium', tags: ['pdf-import', 'dtp', 'trunking'] },
  ],
  'topology-architectures': [
    { id: 'pdf-ta-1', prompt: 'How are switches interconnected in a standard spine-and-leaf data-center topology?', choices: ['Every leaf connects to every spine', 'Every leaf connects to only one spine', 'Leaf switches connect in a Layer 2 ring', 'Each spine connects through a central leaf'], answer: 0, explanation: 'Each leaf has an uplink to every spine, providing predictable path length and resilient equal-cost paths.', difficulty: 'easy', tags: ['pdf-import', 'spine-leaf', 'topology'] },
  ],
  'static-routing': [
    { id: 'pdf-sr-1', prompt: 'A router already has a preferred default route through 192.168.2.2. Which command adds a backup default route through 192.168.1.2 with administrative distance 10?', choices: ['ip route 0.0.0.0 0.0.0.0 192.168.1.2 10', 'ip route 0.0.0.0 0.0.0.0 192.168.1.2', 'ip route 192.168.1.2 255.255.255.255 10', 'ip default-gateway 192.168.1.2 10'], answer: 0, explanation: 'A floating static route uses the default prefix plus an administrative distance higher than the primary route.', difficulty: 'medium', tags: ['pdf-import', 'floating-static-route', 'default-route'] },
  ],
  'cdp-lldp': [
    { id: 'pdf-cl-1', prompt: 'Which global command prevents a Cisco device from advertising its management IP address in LLDP while LLDP remains enabled?', choices: ['no lldp tlv-select management-address', 'no lldp run', 'no lldp transmit', 'no lldp receive'], answer: 0, explanation: 'Disabling selection of the management-address TLV suppresses that information without globally disabling LLDP.', difficulty: 'hard', tags: ['pdf-import', 'lldp', 'tlv'] },
  ],
  'snmp-syslog': [
    { id: 'pdf-sl-1', prompt: 'Which syslog severity number represents Informational messages?', choices: ['0', '2', '4', '6'], answer: 3, explanation: 'Syslog severity 6 is Informational. Lower numbers represent increasingly severe conditions, while 7 is Debugging.', difficulty: 'easy', tags: ['pdf-import', 'syslog', 'severity'] },
  ],
  virtualization: [
    { id: 'pdf-vf-1', prompt: 'Which two characteristics are core capabilities of cloud computing? (Choose two.)', choices: ['On-demand self-service', 'Rapid elasticity', 'Fixed capacity for every tenant', 'Manual provisioning for every request'], answer: [0, 1], explanation: 'Cloud services commonly provide resources on demand and scale them rapidly; fixed capacity and mandatory manual provisioning conflict with those characteristics.', difficulty: 'medium', tags: ['pdf-import', 'cloud', 'virtualization'] },
  ],
}
