import type { PracticeQuestion } from './questions'

export const supplementalQuestions: Record<string, PracticeQuestion[]> = {
  'ipv4-addressing': [
    { id: 'ip4-4', prompt: 'Which subnet mask represents a /27 prefix?', choices: ['255.255.255.0', '255.255.255.192', '255.255.255.224', '255.255.255.240'], answer: 2, explanation: 'A /27 has 27 one-bits, producing the dotted-decimal mask 255.255.255.224.', difficulty: 'medium', tags: ['ipv4', 'subnetting'] },
  ],
  'ipv6-addressing': [
    { id: 'ia-2', prompt: 'How many hexadecimal digits are in a complete 128-bit IPv6 address?', choices: ['8', '16', '32', '64'], answer: 2, explanation: 'Each hexadecimal digit represents 4 bits, so 128 bits require 32 hexadecimal digits.', difficulty: 'easy', tags: ['ipv6', 'format'] },
  ],
  'wireless-principles': [
    { id: 'wp-3', prompt: 'What happens to usable wireless throughput as more clients contend for the same channel?', choices: ['It generally decreases', 'It always doubles', 'It becomes full duplex', 'It is unaffected'], answer: 0, explanation: 'Wi-Fi clients share a half-duplex medium, so additional contention and overhead generally reduce usable throughput.', difficulty: 'medium', tags: ['wireless', 'contention'] },
  ],
  'switching-concepts': [
    { id: 'sc-2', prompt: 'From which field does a switch learn entries for its MAC address table?', choices: ['Destination MAC address', 'Source MAC address', 'Source IP address', 'EtherType'], answer: 1, explanation: 'A switch learns the source MAC address and associates it with the ingress port and VLAN.', difficulty: 'easy', tags: ['switching', 'mac-table'] },
  ],

  vlans: [
    { id: 'vl-4', prompt: 'Which command creates VLAN 30 from global configuration mode?', choices: ['interface vlan 30', 'vlan 30', 'switchport vlan 30', 'create vlan 30'], answer: 1, explanation: 'The vlan 30 command enters VLAN configuration mode and creates VLAN 30 if it does not exist.', difficulty: 'easy', tags: ['vlans', 'configuration'] },
    { id: 'vl-5', prompt: 'Which command displays VLAN membership on a Cisco switch?', choices: ['show interfaces trunk', 'show vlan brief', 'show ip interface brief', 'show spanning-tree root'], answer: 1, explanation: 'show vlan brief lists VLANs, their status, names and assigned access ports.', difficulty: 'easy', tags: ['vlans', 'verification'] },
  ],
  trunks: [
    { id: 'tr-3', prompt: 'Which command statically configures a switch port as an 802.1Q trunk?', choices: ['switchport mode trunk', 'switchport trunk native', 'encapsulation trunk on', 'interface trunk'], answer: 0, explanation: 'switchport mode trunk places a Layer 2 switch interface into permanent trunking mode.', difficulty: 'easy', tags: ['trunk', 'configuration'] },
    { id: 'tr-4', prompt: 'What can result from a native VLAN mismatch between two trunk endpoints?', choices: ['Traffic leakage and spanning-tree warnings', 'Automatic routed-port conversion', 'All VLANs become encrypted', 'The trunk gains bandwidth'], answer: 0, explanation: 'A native VLAN mismatch can place untagged traffic into different VLANs and is reported by protocols such as CDP.', difficulty: 'hard', tags: ['trunk', 'native-vlan'] },
  ],
  'cdp-lldp': [
    { id: 'cl-2', prompt: 'Which command displays detailed CDP information including neighbor IP addresses?', choices: ['show cdp neighbors detail', 'show lldp traffic', 'show interfaces status', 'show mac address-table'], answer: 0, explanation: 'show cdp neighbors detail includes management addresses, platform, software and connected-port information.', difficulty: 'easy', tags: ['cdp', 'verification'] },
  ],
  etherchannel: [
    { id: 'ec-2', prompt: 'Which command is commonly used to verify EtherChannel status and member ports?', choices: ['show etherchannel summary', 'show interfaces switchport', 'show spanning-tree vlan', 'show lacp route'], answer: 0, explanation: 'show etherchannel summary provides a compact view of port channels, protocols and member-port states.', difficulty: 'easy', tags: ['etherchannel', 'verification'] },
    { id: 'ec-3', prompt: 'Which two interface properties must be compatible across Layer 2 EtherChannel members? (Choose two.)', choices: ['Speed and duplex', 'Access or trunk mode', 'Interface description', 'CDP timer'], answer: [0, 1], explanation: 'Bundled links must have compatible physical settings and matching Layer 2 switchport characteristics.', difficulty: 'hard', tags: ['etherchannel', 'consistency'] },
  ],
  'rapid-pvst': [
    { id: 'rp-2', prompt: 'Which RSTP port role provides the best alternate path toward the root bridge?', choices: ['Designated', 'Alternate', 'Disabled', 'Backup gateway'], answer: 1, explanation: 'An alternate port offers a backup path toward the root and can rapidly transition when the root port fails.', difficulty: 'medium', tags: ['rstp', 'port-roles'] },
    { id: 'rp-3', prompt: 'On which switch ports should PortFast normally be enabled?', choices: ['Ports connected to end devices', 'All interswitch trunks', 'Root ports only', 'EtherChannel members only'], answer: 0, explanation: 'PortFast is intended for edge ports connected to end devices, allowing them to transition quickly to forwarding.', difficulty: 'easy', tags: ['stp', 'portfast'] },
  ],
  'wireless-architectures': [
    { id: 'wa-2', prompt: 'Which AP mode depends on a wireless LAN controller for centralized control?', choices: ['Autonomous AP', 'Lightweight AP', 'Workgroup bridge only', 'Repeater-only AP'], answer: 1, explanation: 'A lightweight AP establishes CAPWAP connectivity to a WLC for centralized configuration and control.', difficulty: 'easy', tags: ['wireless', 'lightweight-ap'] },
  ],
  'ap-connections': [
    { id: 'ap-2', prompt: 'Which technology commonly powers an access point through its Ethernet connection?', choices: ['PoE', 'NAT', 'NTP', 'VRF'], answer: 0, explanation: 'Power over Ethernet supplies DC power and data over the same copper Ethernet cabling.', difficulty: 'easy', tags: ['wireless', 'poe'] },
  ],
  'wireless-gui': [
    { id: 'wg-2', prompt: 'Which WLC mapping connects a WLAN to the wired network?', choices: ['WLAN to dynamic interface/VLAN', 'SSID to OSPF process', 'Radio to NAT pool', 'BSSID to console line'], answer: 0, explanation: 'A WLAN is mapped to a controller interface associated with the appropriate wired VLAN.', difficulty: 'medium', tags: ['wlc', 'vlan-mapping'] },
  ],

  'routing-table': [
    { id: 'rt-3', prompt: 'What does the gateway of last resort represent in an IPv4 routing table?', choices: ['The selected default route', 'The newest connected route', 'The OSPF DR address', 'The router ID'], answer: 0, explanation: 'The gateway of last resort is the next hop used when no more-specific route matches the destination.', difficulty: 'easy', tags: ['routing-table', 'default-route'] },
    { id: 'rt-4', prompt: 'What do the bracketed values [110/20] on an OSPF route represent?', choices: ['Administrative distance and metric', 'VLAN and port', 'Prefix and wildcard lengths', 'Hello and dead timers'], answer: 0, explanation: 'Cisco route entries show administrative distance first and the route metric second.', difficulty: 'medium', tags: ['routing-table', 'administrative-distance'] },
    { id: 'rt-5', prompt: 'Which route source has the lowest default administrative distance?', choices: ['Directly connected', 'Static', 'OSPF', 'External BGP'], answer: 0, explanation: 'Directly connected routes have an administrative distance of 0.', difficulty: 'medium', tags: ['routing', 'administrative-distance'] },
  ],
  'forwarding-decision': [
    { id: 'fd-2', prompt: 'After selecting a connected route, how does a router discover the destination host MAC address on Ethernet?', choices: ['ARP', 'DNS', 'NTP', 'SNMP'], answer: 0, explanation: 'For IPv4 Ethernet forwarding on a directly connected network, ARP resolves the destination IP address to a MAC address.', difficulty: 'medium', tags: ['forwarding', 'arp'] },
    { id: 'fd-3', prompt: 'When forwarding to a remote IPv4 network, which MAC address is used as the frame destination?', choices: ['The next-hop router MAC', 'The remote host MAC', 'The source host MAC', 'The broadcast address always'], answer: 0, explanation: 'The Layer 2 frame is addressed to the local next hop; the packet retains the remote IP destination.', difficulty: 'hard', tags: ['forwarding', 'encapsulation'] },
  ],
  'static-routing': [
    { id: 'sr-3', prompt: 'Which command configures an IPv6 default route through next hop 2001:db8:1::1?', choices: ['ipv6 route ::/0 2001:db8:1::1', 'ip route ::/0 2001:db8:1::1', 'ipv6 default-gateway 2001:db8:1::1', 'route ipv6 any 2001:db8:1::1'], answer: 0, explanation: 'The IPv6 default prefix is ::/0 and is configured with the ipv6 route command.', difficulty: 'medium', tags: ['ipv6', 'static-route'] },
    { id: 'sr-4', prompt: 'What is a fully specified IPv4 static route?', choices: ['A route with both exit interface and next-hop address', 'A route with no next hop', 'A route learned through OSPF', 'A route with administrative distance 0'], answer: 0, explanation: 'A fully specified static route includes both the outgoing interface and the next-hop IP address.', difficulty: 'hard', tags: ['static-route', 'configuration'] },
    { id: 'sr-5', prompt: 'Which command removes the static route 192.0.2.0/24 via 10.0.0.1?', choices: ['no ip route 192.0.2.0 255.255.255.0 10.0.0.1', 'clear ip route 192.0.2.0', 'delete route 192.0.2.0/24', 'no route static 192.0.2.0'], answer: 0, explanation: 'Prepending no to the exact static-route configuration removes it from the running configuration.', difficulty: 'medium', tags: ['static-route', 'configuration'] },
  ],
  ospfv2: [
    { id: 'os-4', prompt: 'Which OSPF network type elects a DR and BDR by default?', choices: ['Broadcast', 'Point-to-point', 'Loopback', 'Point-to-multipoint only'], answer: 0, explanation: 'Broadcast multiaccess networks such as Ethernet elect a DR and BDR.', difficulty: 'medium', tags: ['ospf', 'dr-bdr'] },
    { id: 'os-5', prompt: 'How is the OSPF router ID selected when no router-id command or loopback exists?', choices: ['Highest active physical-interface IPv4 address', 'Lowest physical-interface IPv4 address', 'Default gateway address', 'First learned neighbor address'], answer: 0, explanation: 'Without manual or loopback IDs, OSPF selects the highest IPv4 address on an active physical interface when the process starts.', difficulty: 'hard', tags: ['ospf', 'router-id'] },
    { id: 'os-6', prompt: 'Which OSPF interface command advertises a network without forming neighbor relationships?', choices: ['passive-interface', 'shutdown ospf', 'ip ospf silent', 'network passive'], answer: 0, explanation: 'A passive OSPF interface advertises its network but does not send or receive OSPF hello packets.', difficulty: 'medium', tags: ['ospf', 'passive-interface'] },
    { id: 'os-7', prompt: 'What primarily determines OSPF interface cost by default?', choices: ['Reference bandwidth divided by interface bandwidth', 'Hop count', 'Delay only', 'Router priority'], answer: 0, explanation: 'OSPF derives cost from reference bandwidth divided by interface bandwidth unless cost is manually set.', difficulty: 'medium', tags: ['ospf', 'cost'] },
    { id: 'os-8', prompt: 'Which command displays OSPF-enabled interfaces and their process details?', choices: ['show ip ospf interface brief', 'show ip protocols trunk', 'show route ospf links', 'show interfaces ospf-only'], answer: 0, explanation: 'show ip ospf interface brief summarizes OSPF interfaces, process IDs, areas, costs and states.', difficulty: 'easy', tags: ['ospf', 'verification'] },
  ],
  fhrp: [
    { id: 'fh-2', prompt: 'Which address do hosts use when an FHRP is configured?', choices: ['The virtual IP address', 'The active router physical address only', 'The switch management address', 'The OSPF router ID'], answer: 0, explanation: 'Hosts use the shared virtual IP address as their default gateway.', difficulty: 'easy', tags: ['fhrp', 'virtual-ip'] },
    { id: 'fh-3', prompt: 'What allows a higher-priority HSRP router to retake the active role after recovery?', choices: ['Preemption', 'PortFast', 'Route poisoning', 'Split horizon'], answer: 0, explanation: 'HSRP preemption permits a higher-priority router to become active when it becomes available.', difficulty: 'medium', tags: ['hsrp', 'preempt'] },
    { id: 'fh-4', prompt: 'Which two resources are shared by routers participating in an FHRP group? (Choose two.)', choices: ['Virtual IP address', 'Virtual MAC address', 'Physical interface IP address', 'OSPF process ID'], answer: [0, 1], explanation: 'An FHRP group presents a shared virtual IP and virtual MAC to attached hosts.', difficulty: 'medium', tags: ['fhrp', 'virtual-gateway'] },
  ],

  nat: [
    { id: 'na-4', prompt: 'Which interface command marks a router interface as being on the private side of NAT?', choices: ['ip nat inside', 'ip nat local', 'nat private', 'ip inside enable'], answer: 0, explanation: 'ip nat inside identifies the interface connected toward inside local addresses.', difficulty: 'easy', tags: ['nat', 'configuration'] },
  ],
  ntp: [
    { id: 'nt-2', prompt: 'What does a lower NTP stratum number indicate?', choices: ['A time source closer to the reference clock', 'A less accurate interface speed', 'A higher syslog severity', 'A longer polling interval only'], answer: 0, explanation: 'NTP stratum describes distance from an authoritative reference clock; lower valid strata are closer to that source.', difficulty: 'medium', tags: ['ntp', 'stratum'] },
  ],
  'dhcp-dns': [
    { id: 'dd-2', prompt: 'What is the correct DHCPv4 message order for a new client?', choices: ['Discover, Offer, Request, Acknowledge', 'Offer, Discover, Acknowledge, Request', 'Request, Discover, Offer, Acknowledge', 'Discover, Request, Offer, Acknowledge'], answer: 0, explanation: 'DHCPv4 address allocation follows DORA: Discover, Offer, Request, Acknowledge.', difficulty: 'medium', tags: ['dhcp', 'dora'] },
  ],
  'snmp-syslog': [
    { id: 'sl-2', prompt: 'Which SNMP message is sent unsolicited by an agent to report an event?', choices: ['Trap', 'Get', 'Set', 'Response poll'], answer: 0, explanation: 'An SNMP trap is an unsolicited notification from an agent to a manager.', difficulty: 'easy', tags: ['snmp', 'trap'] },
  ],

  'security-concepts': [
    { id: 'se-2', prompt: 'Which attack attempts to overwhelm a service so legitimate users cannot reach it?', choices: ['Denial of service', 'Reconnaissance only', 'Privilege accounting', 'Data normalization'], answer: 0, explanation: 'A denial-of-service attack targets availability by exhausting resources or network capacity.', difficulty: 'easy', tags: ['security', 'dos'] },
  ],
  'password-policy': [
    { id: 'pp-2', prompt: 'Which password practice provides the strongest protection against guessing attacks?', choices: ['Use a long unique passphrase', 'Reuse one complex password everywhere', 'Change one character each month', 'Store passwords in interface descriptions'], answer: 0, explanation: 'A long, unique passphrase increases guessing difficulty and prevents one breach from exposing multiple accounts.', difficulty: 'easy', tags: ['passwords', 'security-policy'] },
  ],
  acls: [
    { id: 'ac-4', prompt: 'Which wildcard mask matches a /24 IPv4 network?', choices: ['0.0.0.255', '255.255.255.0', '0.0.0.0', '255.255.255.255'], answer: 0, explanation: 'A wildcard mask is the inverse of the subnet mask; 255.255.255.0 becomes 0.0.0.255.', difficulty: 'medium', tags: ['acl', 'wildcard-mask'] },
  ],
  'layer2-security': [
    { id: 'ls-3', prompt: 'Which switch feature limits the MAC addresses learned on an access port?', choices: ['Port security', 'Root guard', 'Storm routing', 'OSPF authentication'], answer: 0, explanation: 'Port security can restrict the number or identity of source MAC addresses allowed on a switch port.', difficulty: 'easy', tags: ['port-security', 'layer2-security'] },
  ],
  aaa: [
    { id: 'aa-2', prompt: 'Which AAA function determines which commands an authenticated user may execute?', choices: ['Authorization', 'Authentication', 'Accounting', 'Availability'], answer: 0, explanation: 'Authorization controls the services and actions permitted after identity is established.', difficulty: 'easy', tags: ['aaa', 'authorization'] },
  ],

  'automation-impact': [
    { id: 'au-2', prompt: 'What is configuration drift?', choices: ['Unplanned differences between intended and actual configurations', 'A routing loop caused by OSPF', 'Normal packet delay variation', 'A wireless roaming event'], answer: 0, explanation: 'Configuration drift occurs when deployed device state gradually diverges from the approved source of truth.', difficulty: 'medium', tags: ['automation', 'configuration-drift'] },
  ],
  'rest-apis': [
    { id: 're-3', prompt: 'Which HTTP method normally replaces an entire resource representation?', choices: ['PUT', 'GET', 'DELETE', 'OPTIONS'], answer: 0, explanation: 'PUT is conventionally used to replace a resource at a known URI; PATCH applies a partial modification.', difficulty: 'medium', tags: ['rest', 'http'] },
  ],
  json: [
    { id: 'js-4', prompt: 'Which JSON literal represents an absent value?', choices: ['null', 'undefined', 'none', 'empty()'], answer: 0, explanation: 'JSON supports the literal null; undefined and none are not JSON values.', difficulty: 'easy', tags: ['json', 'data-types'] },
  ],
}
