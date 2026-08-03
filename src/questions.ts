export type PracticeQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

export const questionsByTopic: Record<string, PracticeQuestion[]> = {
  'network-components': [
    { id: 'nc-1', prompt: 'Which device forwards packets between different IP networks?', choices: ['Layer 2 switch', 'Router', 'Access point', 'Repeater'], answer: 1, explanation: 'A router uses its routing table to forward packets between separate IP networks.' },
    { id: 'nc-2', prompt: 'Which device provides wireless clients with access to a wired LAN?', choices: ['Firewall', 'Router', 'Access point', 'IPS'], answer: 2, explanation: 'An access point bridges wireless client traffic onto the wired network.' },
    { id: 'nc-3', prompt: 'What can Power over Ethernet provide through an Ethernet cable?', choices: ['Only electrical power', 'Power and network data', 'Only network data', 'An IP address'], answer: 1, explanation: 'PoE carries electrical power alongside Ethernet data to devices such as APs, cameras and IP phones.' },
  ],
  'tcp-udp': [
    { id: 'tu-1', prompt: 'Which transport protocol provides reliable, connection-oriented delivery?', choices: ['IP', 'UDP', 'TCP', 'ICMP'], answer: 2, explanation: 'TCP establishes a connection and uses sequencing, acknowledgements and retransmissions.' },
    { id: 'tu-2', prompt: 'Which application commonly uses UDP because low delay is more important than retransmission?', choices: ['Real-time voice', 'SSH', 'HTTPS', 'File transfer'], answer: 0, explanation: 'Real-time voice commonly uses UDP because late retransmitted audio is less useful than timely delivery.' },
  ],
  'ipv4-addressing': [
    { id: 'ip4-1', prompt: 'How many usable host addresses exist in a /26 IPv4 subnet?', choices: ['30', '62', '64', '126'], answer: 1, explanation: 'A /26 leaves 6 host bits: 2^6 = 64 total addresses, minus network and broadcast = 62 usable hosts.' },
    { id: 'ip4-2', prompt: 'What is the broadcast address for 10.0.0.0/26?', choices: ['10.0.0.1', '10.0.0.62', '10.0.0.63', '10.0.0.64'], answer: 2, explanation: 'The first /26 range is 10.0.0.0 through 10.0.0.63; .63 is the broadcast address.' },
    { id: 'ip4-3', prompt: 'Which address is a valid gateway interface in 10.0.0.0/26?', choices: ['10.0.0.0', '10.0.0.63', '10.0.0.62', '10.0.0.64'], answer: 2, explanation: '10.0.0.62 is the last usable host. .0 is the network address and .63 is the broadcast address.' },
  ],
  'vlans': [
    { id: 'vl-1', prompt: 'What is the main purpose of a VLAN?', choices: ['Increase cable speed', 'Create separate Layer 2 broadcast domains', 'Replace IP routing', 'Encrypt switch traffic'], answer: 1, explanation: 'A VLAN logically separates switch ports into distinct Layer 2 broadcast domains.' },
    { id: 'vl-2', prompt: 'Which command assigns an access port to VLAN 20?', choices: ['switchport trunk vlan 20', 'vlan access 20', 'switchport access vlan 20', 'interface vlan 20'], answer: 2, explanation: 'Under the physical interface, switchport access vlan 20 assigns the access port to VLAN 20.' },
  ],
  'trunks': [
    { id: 'tr-1', prompt: 'Which IEEE standard identifies VLANs on an Ethernet trunk?', choices: ['802.1Q', '802.3af', '802.11ac', '802.1X'], answer: 0, explanation: 'IEEE 802.1Q inserts a VLAN tag into Ethernet frames carried over a trunk.' },
    { id: 'tr-2', prompt: 'How is native VLAN traffic normally sent on an 802.1Q trunk?', choices: ['Double tagged', 'Untagged', 'Encrypted', 'Blocked'], answer: 1, explanation: 'By default, frames in the native VLAN traverse an 802.1Q trunk without a tag.' },
  ],
  'routing-table': [
    { id: 'rt-1', prompt: 'What does the code C represent in a Cisco IPv4 routing table?', choices: ['Candidate default', 'Connected route', 'Controller route', 'Computed route'], answer: 1, explanation: 'C marks a directly connected network learned from an up/up routed interface.' },
    { id: 'rt-2', prompt: 'Which rule does a router apply first when several routes match a destination?', choices: ['Lowest metric', 'Oldest route', 'Longest prefix match', 'Highest next-hop address'], answer: 2, explanation: 'The route with the most specific prefix—the longest prefix match—is selected first.' },
  ],
  'static-routing': [
    { id: 'sr-1', prompt: 'Which command creates an IPv4 default route?', choices: ['ip route 0.0.0.0 0.0.0.0 next-hop', 'ip default-gateway 255.255.255.255', 'route default next-hop', 'ip route any any next-hop'], answer: 0, explanation: '0.0.0.0 with mask 0.0.0.0 matches any IPv4 destination not covered by a more specific route.' },
    { id: 'sr-2', prompt: 'What makes a floating static route act as a backup?', choices: ['A lower prefix length', 'A higher administrative distance', 'A lower metric than the primary route', 'A broadcast next hop'], answer: 1, explanation: 'A higher administrative distance makes the static route less preferred until the primary route disappears.' },
  ],
  'ospfv2': [
    { id: 'os-1', prompt: 'Which OSPF value is used first to elect a DR on a broadcast network?', choices: ['Router ID', 'Interface priority', 'Cost', 'Process ID'], answer: 1, explanation: 'The highest OSPF interface priority wins; router ID breaks a tie.' },
    { id: 'os-2', prompt: 'Which command verifies OSPF neighbor adjacencies?', choices: ['show ip route ospf', 'show ip ospf neighbor', 'show interfaces trunk', 'show cdp neighbors detail'], answer: 1, explanation: 'show ip ospf neighbor displays neighbor state, router ID, priority and adjacency details.' },
  ],
  'nat': [
    { id: 'na-1', prompt: 'What is an inside local address in NAT terminology?', choices: ['The public address of an inside host', 'The private address assigned to an inside host', 'The public address of an outside server', 'The router WAN address only'], answer: 1, explanation: 'Inside local is the address used by the internal host on the inside network, typically a private address.' },
    { id: 'na-2', prompt: 'Which command displays active NAT translations?', choices: ['show ip nat translations', 'show access-lists nat', 'show ip route nat', 'show interfaces translation'], answer: 0, explanation: 'show ip nat translations lists inside local/global and outside local/global mappings.' },
  ],
  'ssh': [
    { id: 'ss-1', prompt: 'Which command generates RSA keys required for SSH on Cisco IOS?', choices: ['crypto key generate rsa', 'ip ssh generate key', 'crypto rsa enable', 'ssh key create'], answer: 0, explanation: 'crypto key generate rsa creates the RSA key pair used by the SSH server.' },
    { id: 'ss-2', prompt: 'Which command forces a Cisco IOS device to use SSH version 2?', choices: ['ssh version 2', 'ip ssh version 2', 'transport input version 2', 'crypto ssh v2'], answer: 1, explanation: 'The global configuration command ip ssh version 2 selects SSHv2.' },
  ],
  'acls': [
    { id: 'ac-1', prompt: 'Where should an extended ACL generally be placed?', choices: ['As close to the source as practical', 'As close to the destination as practical', 'Only on the default gateway', 'Only on outbound interfaces'], answer: 0, explanation: 'Extended ACLs are normally placed near the source so unwanted traffic is stopped early.' },
    { id: 'ac-2', prompt: 'What implicit entry exists at the end of every IPv4 ACL?', choices: ['permit ip any any', 'deny ip any any', 'permit host any', 'log all'], answer: 1, explanation: 'Any traffic not matched by an explicit ACL entry is denied by the implicit deny.' },
  ],
  'local-passwords': [
    { id: 'lp-1', prompt: 'Which command stores a privileged EXEC password using a stronger one-way hash?', choices: ['enable password', 'enable secret', 'service password-encryption', 'password cisco'], answer: 1, explanation: 'enable secret is preferred over enable password because it stores a stronger one-way hash.' },
    { id: 'lp-2', prompt: 'Which VTY command tells IOS to check the local username database?', choices: ['login', 'login local', 'transport input local', 'username login'], answer: 1, explanation: 'login local makes the line authenticate users against locally configured username entries.' },
  ],
  'rest-apis': [
    { id: 're-1', prompt: 'Which HTTP method normally retrieves a resource without changing it?', choices: ['POST', 'DELETE', 'GET', 'PATCH'], answer: 2, explanation: 'GET requests a representation of a resource and should not alter it.' },
    { id: 're-2', prompt: 'Which HTTP status code means a request completed successfully?', choices: ['200', '301', '404', '500'], answer: 0, explanation: '200 OK indicates that the request succeeded.' },
  ],
  'json': [
    { id: 'js-1', prompt: 'Which characters enclose a JSON object?', choices: ['Square brackets', 'Parentheses', 'Curly braces', 'Angle brackets'], answer: 2, explanation: 'A JSON object is enclosed in curly braces and contains key-value pairs.' },
    { id: 'js-2', prompt: 'Which characters enclose a JSON array?', choices: ['Square brackets', 'Curly braces', 'Quotation marks', 'Parentheses'], answer: 0, explanation: 'A JSON array is an ordered collection enclosed in square brackets.' },
  ],
}
