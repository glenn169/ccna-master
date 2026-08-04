import { supplementalQuestions } from './supplementalQuestions'
import { expandedQuestions } from './expandedQuestions'
import { masteryQuestions } from './masteryQuestions'
import { importedQuestions } from './importedQuestions'
import { balancedDomainQuestions } from './balancedDomainQuestions'

export type PracticeQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: number | number[]
  explanation: string
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  choiceOrder?: number[]
}

export type SelectedAnswer = number[]

export function correctAnswerIndexes(question: PracticeQuestion): number[] {
  return Array.isArray(question.answer) ? question.answer : [question.answer]
}

export function isQuestionCorrect(question: PracticeQuestion, selected: SelectedAnswer | number | undefined): boolean {
  if (selected === undefined) return false
  const actual = Array.isArray(selected) ? [...selected].sort((a, b) => a - b) : [selected]
  const expected = correctAnswerIndexes(question).sort((a, b) => a - b)
  return actual.length === expected.length && actual.every((value, index) => value === expected[index])
}

export function answerInstruction(question: PracticeQuestion): string {
  const count = correctAnswerIndexes(question).length
  return count === 1 ? 'Choose one answer' : `Choose ${count} answers`
}

export function shuffleItems<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

export function randomizeQuestion<T extends PracticeQuestion>(question: T): T {
  const order = shuffleItems(question.choices.map((_, index) => index))
  const correct = new Set(correctAnswerIndexes(question))
  const choices = order.map((index) => question.choices[index])
  const indexes = order.flatMap((originalIndex, displayIndex) => correct.has(originalIndex) ? [displayIndex] : [])
  return { ...question, choices, answer: indexes.length === 1 ? indexes[0] : indexes, choiceOrder: order }
}

export function canonicalAnswerIndexes(question: PracticeQuestion, selected: number[] | undefined): number[] {
  return (selected ?? []).map((index) => question.choiceOrder?.[index] ?? index).sort((a, b) => a - b)
}

export function randomizeQuestions(questions: readonly PracticeQuestion[]): PracticeQuestion[] {
  return shuffleItems(questions).map(randomizeQuestion)
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
  'topology-architectures': [
    { id: 'ta-1', prompt: 'Which data-center topology connects every leaf switch to every spine switch?', choices: ['Three-tier', 'SOHO', 'Spine-leaf', 'Hub-and-spoke'], answer: 2, explanation: 'In a spine-leaf design, each leaf connects to every spine, providing predictable paths and high east-west bandwidth.', difficulty: 'easy', tags: ['topology', 'spine-leaf'] },
  ],
  'cabling-interfaces': [
    { id: 'ci-1', prompt: 'Which fiber type is normally preferred for the longest-distance links?', choices: ['Multimode fiber', 'Single-mode fiber', 'UTP copper', 'Coaxial cable'], answer: 1, explanation: 'Single-mode fiber uses a smaller core and laser light, supporting longer distances than multimode fiber.', difficulty: 'easy', tags: ['cabling', 'fiber'] },
  ],
  'interface-issues': [
    { id: 'ii-1', prompt: 'Which symptom commonly indicates a duplex mismatch?', choices: ['Late collisions and poor throughput', 'A missing routing table', 'Duplicate IP addresses only', 'An incorrect native VLAN only'], answer: 0, explanation: 'A duplex mismatch commonly causes late collisions, interface errors and severely reduced throughput.', difficulty: 'medium', tags: ['interfaces', 'troubleshooting'] },
  ],
  'private-ipv4': [
    { id: 'pi-1', prompt: 'Which IPv4 block is reserved for private addressing?', choices: ['172.16.0.0/12', '172.0.0.0/8', '192.0.2.0/24', '224.0.0.0/4'], answer: 0, explanation: 'RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 for private use.', difficulty: 'easy', tags: ['ipv4', 'private-addressing'] },
  ],
  'ipv6-addressing': [
    { id: 'ia-1', prompt: 'Which command assigns the IPv6 prefix 2001:db8:1::/64 and generates the interface ID with EUI-64?', choices: ['ipv6 address 2001:db8:1::/64 eui-64', 'ip address 2001:db8:1::/64', 'ipv6 enable eui-64 2001:db8:1::', 'ipv6 prefix 2001:db8:1::/64'], answer: 0, explanation: 'The ipv6 address prefix/prefix-length eui-64 command derives the interface ID automatically.', difficulty: 'medium', tags: ['ipv6', 'configuration'] },
  ],
  'ipv6-types': [
    { id: 'it-1', prompt: 'Which prefix identifies IPv6 link-local addresses?', choices: ['2000::/3', 'FC00::/7', 'FE80::/10', 'FF00::/8'], answer: 2, explanation: 'IPv6 link-local unicast addresses use FE80::/10 and operate only on the local link.', difficulty: 'easy', tags: ['ipv6', 'address-types'] },
  ],
  'ip-parameters': [
    { id: 'ip-1', prompt: 'Which Windows command displays detailed IP address, gateway and DNS information?', choices: ['show ip interface brief', 'ipconfig /all', 'ifconfig route', 'netstat /dns'], answer: 1, explanation: 'ipconfig /all displays detailed TCP/IP configuration for Windows network adapters.', difficulty: 'easy', tags: ['client-os', 'verification'] },
  ],
  'wireless-principles': [
    { id: 'wp-1', prompt: 'Which three 2.4-GHz Wi-Fi channels are commonly used as nonoverlapping channels?', choices: ['1, 5 and 9', '1, 6 and 11', '2, 7 and 12', '3, 8 and 13'], answer: 1, explanation: 'Channels 1, 6 and 11 are the standard nonoverlapping 20-MHz channels in the 2.4-GHz band.', difficulty: 'easy', tags: ['wireless', 'channels'] },
  ],
  'virtualization': [
    { id: 'vf-1', prompt: 'What allows multiple isolated routing tables to exist on one router?', choices: ['VLAN trunking', 'VRF', 'PoE', 'EtherChannel'], answer: 1, explanation: 'Virtual Routing and Forwarding creates separate routing instances on the same physical device.', difficulty: 'medium', tags: ['virtualization', 'vrf'] },
  ],
  'switching-concepts': [
    { id: 'sc-1', prompt: 'What does a switch do with an unknown unicast frame?', choices: ['Drops it immediately', 'Routes it to the default gateway', 'Floods it within the VLAN except the incoming port', 'Sends it only to trunk ports'], answer: 2, explanation: 'When the destination MAC is unknown, the switch floods the frame out other ports in the same VLAN.', difficulty: 'medium', tags: ['switching', 'mac-table'] },
  ],
  'cdp-lldp': [
    { id: 'cl-1', prompt: 'Which discovery protocol is vendor-neutral?', choices: ['CDP', 'LLDP', 'VTP', 'DTP'], answer: 1, explanation: 'LLDP is the IEEE 802.1AB vendor-neutral neighbor discovery protocol; CDP is Cisco proprietary.', difficulty: 'easy', tags: ['lldp', 'discovery'] },
  ],
  'etherchannel': [
    { id: 'ec-1', prompt: 'Which LACP mode actively tries to form an EtherChannel?', choices: ['Auto', 'Desirable', 'Active', 'Passive'], answer: 2, explanation: 'LACP active initiates negotiation; passive responds. At least one side must use active.', difficulty: 'medium', tags: ['etherchannel', 'lacp'] },
  ],
  'rapid-pvst': [
    { id: 'rp-1', prompt: 'Which switch becomes the STP root bridge?', choices: ['Highest bridge ID', 'Lowest bridge ID', 'Highest MAC address', 'Lowest port priority'], answer: 1, explanation: 'STP elects the switch with the lowest bridge ID, which combines priority and MAC address.', difficulty: 'medium', tags: ['stp', 'rapid-pvst'] },
  ],
  'wireless-architectures': [
    { id: 'wa-1', prompt: 'In a controller-based wireless network, what protocol commonly carries AP control traffic to the WLC?', choices: ['CAPWAP', 'LACP', 'HSRP', 'SNMP'], answer: 0, explanation: 'CAPWAP provides control and data tunnels between lightweight access points and a wireless LAN controller.', difficulty: 'medium', tags: ['wireless', 'wlc', 'capwap'] },
  ],
  'ap-connections': [
    { id: 'ap-1', prompt: 'A switch port connecting a lightweight AP that maps multiple WLANs to VLANs is commonly configured as what?', choices: ['Routed port', 'Trunk port', 'SPAN destination', 'Shutdown port'], answer: 1, explanation: 'An AP carrying traffic for multiple VLAN-backed WLANs commonly uses an 802.1Q trunk to the switch.', difficulty: 'medium', tags: ['wireless', 'trunk'] },
  ],
  'wireless-gui': [
    { id: 'wg-1', prompt: 'Which value identifies the wireless network name presented to clients?', choices: ['BSSID table', 'SSID', 'RADIUS secret', 'RF group'], answer: 1, explanation: 'The SSID is the human-readable wireless network name configured for a WLAN.', difficulty: 'easy', tags: ['wireless', 'wlan'] },
  ],
  'forwarding-decision': [
    { id: 'fd-1', prompt: 'If two routes have the same prefix length but come from different routing sources, what is compared next?', choices: ['Administrative distance', 'Destination MAC address', 'Interface bandwidth only', 'Router uptime'], answer: 0, explanation: 'After prefix length, the router prefers the route source with the lower administrative distance.', difficulty: 'medium', tags: ['routing', 'forwarding'] },
  ],
  'fhrp': [
    { id: 'fh-1', prompt: 'What is the primary purpose of a first-hop redundancy protocol?', choices: ['Encrypt routing updates', 'Provide a resilient virtual default gateway', 'Replace spanning tree', 'Assign DHCP leases'], answer: 1, explanation: 'FHRPs let multiple routers present a shared virtual gateway so hosts retain connectivity after a router failure.', difficulty: 'easy', tags: ['fhrp', 'gateway'] },
  ],
  'ntp': [
    { id: 'nt-1', prompt: 'Which command configures a Cisco device to synchronize with NTP server 192.0.2.10?', choices: ['clock server 192.0.2.10', 'ntp server 192.0.2.10', 'time source 192.0.2.10', 'service ntp 192.0.2.10'], answer: 1, explanation: 'The global configuration command ntp server followed by the server address configures an NTP association.', difficulty: 'easy', tags: ['ntp', 'configuration'] },
  ],
  'dhcp-dns': [
    { id: 'dd-1', prompt: 'Which interface command forwards DHCP broadcasts to a server on another subnet?', choices: ['ip dhcp server', 'ip helper-address', 'service dhcp relay', 'ip forward-protocol dhcp-server'], answer: 1, explanation: 'ip helper-address converts selected UDP broadcasts, including DHCP, into unicasts sent to the configured server.', difficulty: 'medium', tags: ['dhcp', 'relay'] },
  ],
  'snmp-syslog': [
    { id: 'sl-1', prompt: 'Which syslog severity number represents the most critical condition?', choices: ['0', '3', '6', '7'], answer: 0, explanation: 'Syslog severity 0 is Emergency, the most severe level; severity 7 is Debugging.', difficulty: 'medium', tags: ['syslog', 'monitoring'] },
  ],
  'qos': [
    { id: 'qo-1', prompt: 'Which QoS action buffers packets during congestion instead of discarding or remarking them?', choices: ['Classification', 'Queuing', 'Policing', 'Marking'], answer: 1, explanation: 'Queuing temporarily stores packets and schedules their transmission when an interface is congested.', difficulty: 'medium', tags: ['qos', 'queuing'] },
  ],
  'ftp-tftp': [
    { id: 'ft-1', prompt: 'Which statement correctly compares TFTP with FTP?', choices: ['TFTP uses TCP and authenticates users', 'TFTP uses UDP and provides no built-in authentication', 'FTP uses UDP port 69', 'Both always encrypt transferred files'], answer: 1, explanation: 'TFTP is a simple UDP-based transfer protocol without built-in authentication; FTP uses TCP and supports login.', difficulty: 'medium', tags: ['tftp', 'ftp'] },
  ],
  'security-concepts': [
    { id: 'se-1', prompt: 'Which part of the CIA triad ensures information is not altered without authorization?', choices: ['Confidentiality', 'Integrity', 'Availability', 'Accounting'], answer: 1, explanation: 'Integrity protects the accuracy and trustworthiness of data against unauthorized modification.', difficulty: 'easy', tags: ['security', 'cia-triad'] },
  ],
  'security-program': [
    { id: 'sp-1', prompt: 'What is the main purpose of security awareness training?', choices: ['Replace technical controls', 'Reduce human-related security risk', 'Configure routing protocols', 'Encrypt every network packet'], answer: 1, explanation: 'Awareness training helps users recognize threats and follow policy, reducing risks such as phishing and social engineering.', difficulty: 'easy', tags: ['security-program', 'awareness'] },
  ],
  'password-policy': [
    { id: 'pp-1', prompt: 'Which authentication approach adds a second verification factor beyond a password?', choices: ['MFA', 'NAT', 'Syslog', 'PortFast'], answer: 0, explanation: 'Multi-factor authentication requires factors from different categories, reducing the risk of password compromise.', difficulty: 'easy', tags: ['authentication', 'mfa'] },
  ],
  'ipsec-vpn': [
    { id: 'iv-1', prompt: 'Which VPN type normally creates an encrypted tunnel between two office gateways?', choices: ['Remote-access VPN', 'Site-to-site VPN', 'Clientless WLAN', 'GRE-only access point'], answer: 1, explanation: 'A site-to-site VPN securely connects entire networks through their VPN gateways.', difficulty: 'easy', tags: ['vpn', 'ipsec'] },
  ],
  'layer2-security': [
    { id: 'ls-1', prompt: 'Which Layer 2 security feature builds a trusted IP-to-MAC binding database from DHCP messages?', choices: ['PortFast', 'DHCP snooping', 'Root guard', 'EtherChannel'], answer: 1, explanation: 'DHCP snooping filters rogue DHCP messages and builds bindings used by features such as Dynamic ARP Inspection.', difficulty: 'medium', tags: ['dhcp-snooping', 'layer2-security'] },
  ],
  'aaa': [
    { id: 'aa-1', prompt: 'Which AAA function records what an authenticated user did?', choices: ['Authentication', 'Authorization', 'Accounting', 'Availability'], answer: 2, explanation: 'Accounting records user activity, commands, session times or resource usage for auditing.', difficulty: 'easy', tags: ['aaa', 'accounting'] },
  ],
  'wireless-security': [
    { id: 'ws-1', prompt: 'Which listed wireless security protocol provides the strongest modern protection?', choices: ['WEP', 'WPA', 'WPA2', 'WPA3'], answer: 3, explanation: 'WPA3 is newer and provides stronger protections than WEP, WPA and WPA2.', difficulty: 'easy', tags: ['wireless', 'wpa3'] },
  ],
  'automation-impact': [
    { id: 'au-1', prompt: 'What is a major advantage of automating repetitive network changes?', choices: ['It removes the need for validation', 'It improves consistency and reduces manual error', 'It prevents all outages', 'It eliminates configuration management'], answer: 1, explanation: 'Automation applies repeatable processes consistently, reducing configuration drift and human typing errors.', difficulty: 'easy', tags: ['automation', 'operations'] },
  ],
  'controller-networking': [
    { id: 'cn-1', prompt: 'Which API direction connects a controller to network devices in the data plane?', choices: ['Northbound', 'Southbound', 'Eastbound only', 'Application-facing'], answer: 1, explanation: 'Southbound APIs connect the controller with infrastructure devices; northbound APIs expose services to applications.', difficulty: 'medium', tags: ['sdn', 'apis'] },
  ],
  'ai-ml': [
    { id: 'am-1', prompt: 'Which AI approach predicts possible network failures from historical telemetry?', choices: ['Generative AI only', 'Predictive machine learning', 'Static routing', 'Packet switching'], answer: 1, explanation: 'Predictive machine-learning models identify patterns in historical data to forecast anomalies or failures.', difficulty: 'medium', tags: ['ai', 'machine-learning'] },
  ],
  'config-management': [
    { id: 'cm-1', prompt: 'Which tool is primarily associated with declarative infrastructure provisioning?', choices: ['Terraform', 'Wireshark', 'TFTP', 'Syslog'], answer: 0, explanation: 'Terraform uses declarative configuration files to provision and manage infrastructure state.', difficulty: 'easy', tags: ['terraform', 'configuration-management'] },
  ],
}

const multipleAnswerQuestions: Record<string, PracticeQuestion[]> = {
  'network-components': [
    { id: 'nc-4', prompt: 'Which two devices commonly make forwarding decisions using IP addresses? (Choose two.)', choices: ['Router', 'Layer 3 switch', 'Layer 2 hub', 'Wireless repeater'], answer: [0, 1], explanation: 'Routers and multilayer switches can route packets by examining Layer 3 destination addresses.', difficulty: 'medium', tags: ['network-devices', 'routing'] },
  ],
  'tcp-udp': [
    { id: 'tu-3', prompt: 'Which two features are provided by TCP? (Choose two.)', choices: ['Sequencing', 'Acknowledgements', 'Best-effort delivery without sessions', 'No retransmission'], answer: [0, 1], explanation: 'TCP uses sequence numbers and acknowledgements to provide ordered, reliable delivery.', difficulty: 'easy', tags: ['tcp', 'transport'] },
  ],
  vlans: [
    { id: 'vl-3', prompt: 'Which two statements describe VLANs? (Choose two.)', choices: ['They create separate broadcast domains', 'Devices in different VLANs require Layer 3 forwarding to communicate', 'They eliminate the need for IP addressing', 'They make every switch port a trunk'], answer: [0, 1], explanation: 'Each VLAN is a distinct Layer 2 broadcast domain, and inter-VLAN communication requires routing.', difficulty: 'medium', tags: ['vlans', 'inter-vlan-routing'] },
  ],
  ospfv2: [
    { id: 'os-3', prompt: 'Which two parameters must match for two OSPFv2 routers to become neighbors on the same link? (Choose two.)', choices: ['Area ID', 'Hello and dead timers', 'Process ID', 'Router hostname'], answer: [0, 1], explanation: 'Neighbors must agree on key link parameters including the area and hello/dead intervals; local process IDs and hostnames need not match.', difficulty: 'hard', tags: ['ospf', 'neighbors'] },
  ],
  nat: [
    { id: 'na-3', prompt: 'Which two statements describe PAT? (Choose two.)', choices: ['It distinguishes sessions with transport-layer port numbers', 'It can map many inside hosts to one public IPv4 address', 'It requires one public address per inside host', 'It translates IPv6 routes into OSPF'], answer: [0, 1], explanation: 'PAT multiplexes many private sessions onto one or a few public addresses by tracking port numbers.', difficulty: 'medium', tags: ['nat', 'pat'] },
  ],
  ssh: [
    { id: 'ss-3', prompt: 'Which two items are required before generating RSA keys for SSH on Cisco IOS? (Choose two.)', choices: ['Hostname', 'IP domain name', 'OSPF process', 'Enable password'], answer: [0, 1], explanation: 'IOS uses the configured hostname and domain name when creating the RSA key pair.', difficulty: 'medium', tags: ['ssh', 'rsa'] },
  ],
  acls: [
    { id: 'ac-3', prompt: 'Which two fields can an extended IPv4 ACL evaluate? (Choose two.)', choices: ['Source and destination IP addresses', 'TCP or UDP port numbers', 'STP bridge priority', 'EtherChannel system ID only'], answer: [0, 1], explanation: 'Extended ACLs can match protocol, source/destination addresses, and transport-layer ports.', difficulty: 'medium', tags: ['acl', 'security'] },
  ],
  'wireless-principles': [
    { id: 'wp-2', prompt: 'Which two factors commonly cause wireless interference? (Choose two.)', choices: ['Overlapping channels', 'Non-Wi-Fi devices using the same frequency band', 'Unique SSIDs', 'Full-duplex Ethernet uplinks'], answer: [0, 1], explanation: 'Co-channel or adjacent-channel use and other radio emitters in the same band can reduce wireless performance.', difficulty: 'medium', tags: ['wireless', 'interference'] },
  ],
  'layer2-security': [
    { id: 'ls-2', prompt: 'Which two protections can use the DHCP snooping binding database? (Choose two.)', choices: ['Dynamic ARP Inspection', 'IP Source Guard', 'OSPF authentication', 'NAT overload'], answer: [0, 1], explanation: 'DAI and IP Source Guard can validate traffic using trusted IP-to-MAC-to-port bindings learned by DHCP snooping.', difficulty: 'hard', tags: ['dhcp-snooping', 'dai', 'ip-source-guard'] },
  ],
  'controller-networking': [
    { id: 'cn-2', prompt: 'Which two characteristics are associated with controller-based networking? (Choose two.)', choices: ['Centralized policy intent', 'APIs for automation and integration', 'Every device must be configured only through console cables', 'The control plane can never be logically centralized'], answer: [0, 1], explanation: 'Controllers centralize policy and expose APIs, allowing consistent automation across managed infrastructure.', difficulty: 'medium', tags: ['sdn', 'controllers'] },
  ],
  json: [
    { id: 'js-3', prompt: 'Which two values are valid JSON data types? (Choose two.)', choices: ['Boolean', 'Array', 'Interface', 'Command'], answer: [0, 1], explanation: 'JSON supports strings, numbers, objects, arrays, booleans and null.', difficulty: 'easy', tags: ['json', 'data-types'] },
  ],
  'config-management': [
    { id: 'cm-2', prompt: 'Which two tools are associated with infrastructure automation or configuration management? (Choose two.)', choices: ['Ansible', 'Terraform', 'Syslog', 'TFTP'], answer: [0, 1], explanation: 'Ansible automates configuration workflows, while Terraform declaratively provisions infrastructure.', difficulty: 'easy', tags: ['ansible', 'terraform'] },
  ],
}

for (const [topicId, questions] of Object.entries(multipleAnswerQuestions)) {
  questionsByTopic[topicId] = [...(questionsByTopic[topicId] ?? []), ...questions]
}

for (const [topicId, questions] of Object.entries(supplementalQuestions)) {
  questionsByTopic[topicId] = [...(questionsByTopic[topicId] ?? []), ...questions]
}
for (const [topicId, questions] of Object.entries(expandedQuestions)) {
  questionsByTopic[topicId] = [...(questionsByTopic[topicId] ?? []), ...questions]
}
for (const [topicId, questions] of Object.entries(masteryQuestions)) {
  questionsByTopic[topicId] = [...(questionsByTopic[topicId] ?? []), ...questions]
}
for (const [topicId, questions] of Object.entries(importedQuestions)) {
  questionsByTopic[topicId] = [...(questionsByTopic[topicId] ?? []), ...questions]
}
for (const [topicId, questions] of Object.entries(balancedDomainQuestions)) {
  questionsByTopic[topicId] = [...(questionsByTopic[topicId] ?? []), ...questions]
}
