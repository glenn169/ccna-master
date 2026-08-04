import type { PracticeQuestion } from './questions'

// Two additional blueprint-aligned questions for every topic outside Network Fundamentals.
export const balancedDomainQuestions: Record<string, PracticeQuestion[]> = {
  vlans: [
    { id: 'bal-vl-1', prompt: 'Which command creates VLAN 30 and enters VLAN configuration mode?', choices: ['vlan 30', 'interface vlan 30', 'switchport access vlan 30', 'switchport mode vlan 30'], answer: 0, explanation: 'The global configuration command vlan 30 creates the VLAN and enters VLAN configuration mode.', difficulty: 'easy' },
    { id: 'bal-vl-2', prompt: 'A switch port must carry traffic for only one user VLAN. Which mode should be configured?', choices: ['Access', 'Trunk', 'Dynamic desirable', 'Routed'], answer: 0, explanation: 'An access port carries traffic for one access VLAN and is the normal choice for an end-device connection.', difficulty: 'easy' },
  ],
  trunks: [
    { id: 'bal-tr-1', prompt: 'Which command limits an 802.1Q trunk to VLANs 10, 20, and 30?', choices: ['switchport trunk allowed vlan 10,20,30', 'switchport access vlan 10,20,30', 'switchport trunk native vlan 10,20,30', 'vlan trunk list 10-30'], answer: 0, explanation: 'switchport trunk allowed vlan specifies which VLANs may cross a trunk.', difficulty: 'medium' },
    { id: 'bal-tr-2', prompt: 'What problem can occur when the native VLAN differs at opposite ends of a trunk?', choices: ['Traffic can be placed into the wrong VLAN', 'The switch loses its IOS image', 'All access ports become routed ports', 'Ethernet speed changes automatically'], answer: 0, explanation: 'A native VLAN mismatch can cause untagged traffic to be associated with different VLANs at the two ends.', difficulty: 'medium' },
  ],
  'cdp-lldp': [
    { id: 'bal-cl-1', prompt: 'Which command displays detailed CDP information including a neighbor IP address?', choices: ['show cdp neighbors detail', 'show lldp traffic', 'show interfaces status', 'show ip protocols'], answer: 0, explanation: 'show cdp neighbors detail includes platform, port, capabilities, and management address information.', difficulty: 'easy' },
    { id: 'bal-cl-2', prompt: 'Which command globally enables LLDP on Cisco IOS?', choices: ['lldp run', 'cdp run', 'lldp enable all', 'service lldp'], answer: 0, explanation: 'The global command lldp run enables the vendor-neutral discovery protocol.', difficulty: 'easy' },
  ],
  etherchannel: [
    { id: 'bal-ec-1', prompt: 'Which pair of LACP modes can successfully form an EtherChannel?', choices: ['Active and passive', 'Passive and passive', 'Auto and auto', 'Desirable and passive'], answer: 0, explanation: 'At least one LACP side must be active; active-passive and active-active combinations can form.', difficulty: 'medium' },
    { id: 'bal-ec-2', prompt: 'What is required of physical links bundled into the same Layer 2 EtherChannel?', choices: ['They must have compatible speed, duplex, and switchport settings', 'They must use different native VLANs', 'They must have unique access VLANs', 'They must connect to different logical neighbors'], answer: 0, explanation: 'Member interfaces require consistent operational and Layer 2 settings to bundle correctly.', difficulty: 'hard' },
  ],
  'rapid-pvst': [
    { id: 'bal-rp-1', prompt: 'Which RSTP port role provides the best alternate path toward the root bridge?', choices: ['Alternate', 'Designated', 'Disabled', 'Backup gateway'], answer: 0, explanation: 'An alternate port provides a backup path to the root and can transition quickly if the root port fails.', difficulty: 'medium' },
    { id: 'bal-rp-2', prompt: 'Where should PortFast normally be enabled?', choices: ['On access ports connected to end devices', 'On every interswitch trunk', 'Only on the root bridge', 'On routed WAN interfaces'], answer: 0, explanation: 'PortFast is intended for edge ports connected to endpoints, where no Layer 2 loop is expected.', difficulty: 'easy' },
  ],
  'wireless-architectures': [
    { id: 'bal-wa-1', prompt: 'Which wireless AP type is centrally managed by a WLC?', choices: ['Lightweight AP', 'Autonomous-only AP', 'Workgroup bridge only', 'Mesh client'], answer: 0, explanation: 'A lightweight AP uses CAPWAP to receive control and configuration from a wireless LAN controller.', difficulty: 'easy' },
    { id: 'bal-wa-2', prompt: 'What is a main benefit of controller-based wireless architecture?', choices: ['Centralized policy and configuration', 'Elimination of all RF interference', 'No requirement for IP connectivity', 'Every AP operates with unrelated settings'], answer: 0, explanation: 'A WLC centralizes WLAN configuration, policy, monitoring, and roaming support.', difficulty: 'easy' },
  ],
  'ap-connections': [
    { id: 'bal-ap-1', prompt: 'Which technology commonly powers an access point through its Ethernet connection?', choices: ['PoE', 'NAT', 'OSPF', 'IPsec'], answer: 0, explanation: 'Power over Ethernet supplies power and data over the AP Ethernet cable.', difficulty: 'easy' },
    { id: 'bal-ap-2', prompt: 'Which two CAPWAP UDP ports are used for control and data by default? (Choose two.)', choices: ['5246', '5247', '67', '1812'], answer: [0, 1], explanation: 'CAPWAP uses UDP 5246 for control and UDP 5247 for data.', difficulty: 'hard' },
  ],
  'wireless-gui': [
    { id: 'bal-wg-1', prompt: 'What mapping connects wireless client traffic to a wired VLAN on a WLC?', choices: ['WLAN/interface or policy-profile mapping', 'OSPF process mapping', 'STP root mapping', 'NAT pool mapping'], answer: 0, explanation: 'The WLAN is associated with controller policy/interface settings that place client traffic into the appropriate VLAN.', difficulty: 'medium' },
    { id: 'bal-wg-2', prompt: 'Which security setting is needed when configuring a WPA2-Personal WLAN?', choices: ['A pre-shared key', 'An OSPF area ID', 'A DHCP snooping trust port', 'An enable secret for every client'], answer: 0, explanation: 'WPA2-Personal authenticates clients using a shared passphrase or PSK.', difficulty: 'easy' },
  ],
  'routing-table': [
    { id: 'bal-rt-1', prompt: 'In the route entry [110/20], what does 110 represent?', choices: ['Administrative distance', 'Metric', 'Prefix length', 'Next-hop address'], answer: 0, explanation: 'Cisco displays routes as [administrative distance/metric].', difficulty: 'easy' },
    { id: 'bal-rt-2', prompt: 'What route code identifies an OSPF-learned route in show ip route?', choices: ['O', 'S', 'D', 'R'], answer: 0, explanation: 'O identifies a route learned through OSPF; S identifies static and R identifies RIP.', difficulty: 'easy' },
  ],
  'forwarding-decision': [
    { id: 'bal-fd-1', prompt: 'A router has routes 10.0.0.0/8 and 10.1.0.0/16. Which route matches destination 10.1.2.3?', choices: ['10.1.0.0/16', '10.0.0.0/8', 'Both are discarded', 'Only a default route'], answer: 0, explanation: 'The /16 is the longest, most-specific matching prefix.', difficulty: 'medium' },
    { id: 'bal-fd-2', prompt: 'If equal-length routes from the same protocol have different metrics, which is preferred?', choices: ['The route with the lower metric', 'The route with the higher metric', 'The oldest route', 'The route with the highest next hop'], answer: 0, explanation: 'After prefix length and route source are resolved, the routing protocol prefers its lower metric.', difficulty: 'medium' },
  ],
  'static-routing': [
    { id: 'bal-sr-1', prompt: 'Which IPv6 route represents a default route?', choices: ['::/0', '::1/128', 'FE80::/10', 'FF00::/8'], answer: 0, explanation: 'The IPv6 prefix ::/0 matches any destination without a more-specific route.', difficulty: 'easy' },
    { id: 'bal-sr-2', prompt: 'Why is a link-local next hop on an IPv6 static route normally accompanied by an exit interface?', choices: ['Link-local addresses are only unique on a link', 'It changes the route into OSPF', 'It enables NAT overload', 'It disables neighbor discovery'], answer: 0, explanation: 'Because the same link-local address may exist on multiple links, the router needs the outgoing interface for scope.', difficulty: 'hard' },
  ],
  ospfv2: [
    { id: 'bal-os-1', prompt: 'Which OSPF network type elects a DR and BDR by default?', choices: ['Broadcast multiaccess', 'Point-to-point', 'Loopback', 'Point-to-multipoint only'], answer: 0, explanation: 'Ethernet broadcast networks elect a DR and BDR to reduce adjacency and LSA overhead.', difficulty: 'medium' },
    { id: 'bal-os-2', prompt: 'How can an OSPF router ID be manually set?', choices: ['router-id 1.1.1.1 under the OSPF process', 'ip ospf id 1.1.1.1 globally', 'network router-id 1.1.1.1', 'ospf hostname 1.1.1.1'], answer: 0, explanation: 'The router-id command under router ospf explicitly sets the 32-bit router ID.', difficulty: 'medium' },
  ],
  fhrp: [
    { id: 'bal-fh-1', prompt: 'Which HSRP router forwards traffic sent to the virtual gateway?', choices: ['Active router', 'Standby router simultaneously', 'Listening router only', 'Every router by default'], answer: 0, explanation: 'The active HSRP router owns the virtual forwarding role; the standby is prepared to take over.', difficulty: 'easy' },
    { id: 'bal-fh-2', prompt: 'What does HSRP preemption allow?', choices: ['A higher-priority router to retake the active role', 'Both routers to use different virtual IPs for one group', 'A switch to bypass STP', 'Hosts to select an OSPF DR'], answer: 0, explanation: 'Preemption lets a higher-priority router become active after it returns.', difficulty: 'medium' },
  ],
  nat: [
    { id: 'bal-na-1', prompt: 'Which NAT term describes the public address representing an inside host?', choices: ['Inside global', 'Inside local', 'Outside local', 'Outside global'], answer: 0, explanation: 'The inside global address is the globally routable address used to represent an inside host.', difficulty: 'medium' },
    { id: 'bal-na-2', prompt: 'Which keyword enables PAT when a NAT pool or interface is used?', choices: ['overload', 'inside', 'translate', 'dynamic'], answer: 0, explanation: 'The overload keyword permits multiple inside sessions to share global addresses using port numbers.', difficulty: 'medium' },
  ],
  ntp: [
    { id: 'bal-nt-1', prompt: 'What does a lower NTP stratum number indicate?', choices: ['A source closer to the reference clock', 'A less accurate clock by definition', 'A larger timezone offset', 'A disabled NTP association'], answer: 0, explanation: 'Stratum represents distance from a reference clock; lower valid strata are closer to it.', difficulty: 'medium' },
    { id: 'bal-nt-2', prompt: 'Which command verifies NTP synchronization status on Cisco IOS?', choices: ['show ntp associations', 'show clock source only', 'show ip ntp route', 'show time protocol'], answer: 0, explanation: 'show ntp associations displays configured peers and indicates the synchronized source.', difficulty: 'easy' },
  ],
  'dhcp-dns': [
    { id: 'bal-dd-1', prompt: 'Which DHCP message does a client initially broadcast to locate servers?', choices: ['DHCPDISCOVER', 'DHCPOFFER', 'DHCPACK', 'DHCPNAK'], answer: 0, explanation: 'A client begins DORA by broadcasting DHCPDISCOVER.', difficulty: 'easy' },
    { id: 'bal-dd-2', prompt: 'What is the primary function of DNS?', choices: ['Resolve names to IP addresses', 'Assign VLANs to switch ports', 'Encrypt remote CLI sessions', 'Elect an OSPF DR'], answer: 0, explanation: 'DNS maps names to records such as IPv4 A and IPv6 AAAA addresses.', difficulty: 'easy' },
  ],
  'snmp-syslog': [
    { id: 'bal-sl-1', prompt: 'Which SNMP message is sent unsolicited by an agent to report an event?', choices: ['Trap', 'Get', 'Set', 'Response poll'], answer: 0, explanation: 'An SNMP trap is an unsolicited event notification from an agent to a manager.', difficulty: 'easy' },
    { id: 'bal-sl-2', prompt: 'Which syslog severity number represents Warning?', choices: ['4', '0', '6', '7'], answer: 0, explanation: 'Syslog severity 4 is Warning; lower numbers are more severe.', difficulty: 'medium' },
  ],
  qos: [
    { id: 'bal-qo-1', prompt: 'Which QoS action drops or remarks traffic that exceeds a configured rate?', choices: ['Policing', 'Shaping', 'Classification only', 'Queuing only'], answer: 0, explanation: 'Policing enforces a rate immediately by dropping or remarking excess traffic.', difficulty: 'medium' },
    { id: 'bal-qo-2', prompt: 'Which traffic type is most sensitive to delay, jitter, and packet loss?', choices: ['Real-time voice', 'Email transfer', 'Nightly backup', 'TFTP image storage'], answer: 0, explanation: 'Interactive voice has strict latency and jitter requirements and is harmed by loss.', difficulty: 'easy' },
  ],
  ssh: [
    { id: 'bal-ss-1', prompt: 'Which VTY command permits SSH but rejects Telnet?', choices: ['transport input ssh', 'login ssh', 'ip ssh only', 'access-class ssh'], answer: 0, explanation: 'transport input ssh restricts inbound VTY transport to SSH.', difficulty: 'easy' },
    { id: 'bal-ss-2', prompt: 'Why is SSH preferred over Telnet?', choices: ['SSH encrypts the management session', 'SSH requires no authentication', 'SSH operates only at Layer 2', 'SSH automatically configures ACLs'], answer: 0, explanation: 'SSH protects credentials and commands with encryption; Telnet sends them in cleartext.', difficulty: 'easy' },
  ],
  'ftp-tftp': [
    { id: 'bal-ft-1', prompt: 'Which transport protocol and well-known port does TFTP use?', choices: ['UDP 69', 'TCP 21', 'UDP 53', 'TCP 22'], answer: 0, explanation: 'TFTP initiates transfers using UDP port 69.', difficulty: 'easy' },
    { id: 'bal-ft-2', prompt: 'Which IOS command begins copying an image from flash to a TFTP server?', choices: ['copy flash: tftp:', 'copy tftp: flash:', 'move flash tftp', 'backup ios ftp-only'], answer: 0, explanation: 'copy flash: tftp: selects local flash as the source and TFTP as the destination.', difficulty: 'easy' },
  ],
  'security-concepts': [
    { id: 'bal-se-1', prompt: 'Which attack overwhelms a service so legitimate users cannot access it?', choices: ['Denial of service', 'Reconnaissance only', 'Data classification', 'Configuration backup'], answer: 0, explanation: 'A denial-of-service attack targets availability by exhausting resources or capacity.', difficulty: 'easy' },
    { id: 'bal-se-2', prompt: 'What is a vulnerability?', choices: ['A weakness that a threat can exploit', 'The person who owns an asset', 'A guaranteed security incident', 'A completed backup'], answer: 0, explanation: 'A vulnerability is a weakness in design, implementation, configuration, or process that may be exploited.', difficulty: 'easy' },
  ],
  'security-program': [
    { id: 'bal-sp-1', prompt: 'What does a bring-your-own-device policy govern?', choices: ['Use of personally owned devices for organizational access', 'OSPF neighbor formation', 'Trunk native VLAN selection', 'Public IPv4 allocation'], answer: 0, explanation: 'A BYOD policy defines acceptable use, security requirements, and access for personal devices.', difficulty: 'easy' },
    { id: 'bal-sp-2', prompt: 'Which control helps employees recognize fraudulent credential requests?', choices: ['Phishing awareness training', 'EtherChannel negotiation', 'NAT overload', 'Route summarization'], answer: 0, explanation: 'Security awareness training helps users identify social engineering and phishing attempts.', difficulty: 'easy' },
  ],
  'local-passwords': [
    { id: 'bal-lp-1', prompt: 'Which command creates a local user with a protected secret?', choices: ['username admin secret value', 'user admin password clear', 'login local admin', 'enable username admin'], answer: 0, explanation: 'username name secret value creates a local account using a one-way protected secret.', difficulty: 'medium' },
    { id: 'bal-lp-2', prompt: 'What does exec-timeout 5 0 configure on a console or VTY line?', choices: ['Logout after five idle minutes', 'Five failed logins before shutdown', 'A five-minute password lifetime', 'SSH version 5'], answer: 0, explanation: 'exec-timeout minutes seconds ends an idle EXEC session after the configured interval.', difficulty: 'medium' },
  ],
  'password-policy': [
    { id: 'bal-pp-1', prompt: 'Which practice best reduces risk from password reuse?', choices: ['Use unique passwords stored in a password manager', 'Use one complex password everywhere', 'Disable account lockout', 'Share a team password'], answer: 0, explanation: 'Unique passwords prevent one compromised credential from unlocking multiple services.', difficulty: 'easy' },
    { id: 'bal-pp-2', prompt: 'Which factor is an example of something a user has?', choices: ['Hardware token', 'Password', 'Fingerprint', 'Username'], answer: 0, explanation: 'A hardware token is a possession factor; a password is knowledge and a fingerprint is inherence.', difficulty: 'medium' },
  ],
  'ipsec-vpn': [
    { id: 'bal-iv-1', prompt: 'Which VPN is designed for an individual user connecting securely to an organization?', choices: ['Remote-access VPN', 'Site-to-site VPN', 'EtherChannel', 'CAPWAP tunnel'], answer: 0, explanation: 'A remote-access VPN securely connects an individual client to an organizational network.', difficulty: 'easy' },
    { id: 'bal-iv-2', prompt: 'What security property does IPsec encryption primarily provide?', choices: ['Confidentiality', 'Physical availability', 'VLAN segmentation', 'Route summarization'], answer: 0, explanation: 'Encryption protects confidentiality by preventing unauthorized parties from reading captured traffic.', difficulty: 'easy' },
  ],
  acls: [
    { id: 'bal-ac-1', prompt: 'What can a standard IPv4 ACL match?', choices: ['Source IPv4 address', 'Destination TCP port', 'Source and destination ports', 'Ethernet frame checksum'], answer: 0, explanation: 'A standard IPv4 ACL filters using only the source IPv4 address.', difficulty: 'easy' },
    { id: 'bal-ac-2', prompt: 'Which wildcard mask matches exactly subnet 192.168.10.0/24?', choices: ['0.0.0.255', '255.255.255.0', '0.0.0.0', '255.255.255.255'], answer: 0, explanation: 'A /24 subnet mask inverts to wildcard mask 0.0.0.255.', difficulty: 'medium' },
  ],
  'layer2-security': [
    { id: 'bal-ls-1', prompt: 'Which feature validates ARP messages against trusted bindings?', choices: ['Dynamic ARP Inspection', 'PortFast', 'NAT', 'HSRP'], answer: 0, explanation: 'DAI checks ARP information, commonly against the DHCP snooping binding database.', difficulty: 'medium' },
    { id: 'bal-ls-2', prompt: 'Which port-security violation mode drops offending frames and can place the port into err-disabled state?', choices: ['Shutdown', 'Protect', 'Restrict', 'Monitor'], answer: 0, explanation: 'Shutdown is the default violation mode and err-disables the port after a violation.', difficulty: 'medium' },
  ],
  aaa: [
    { id: 'bal-aa-1', prompt: 'Which AAA function determines what an authenticated user is permitted to do?', choices: ['Authorization', 'Authentication', 'Accounting', 'Availability'], answer: 0, explanation: 'Authorization applies permissions after identity has been authenticated.', difficulty: 'easy' },
    { id: 'bal-aa-2', prompt: 'Which protocol commonly centralizes device-administration AAA and encrypts the entire payload?', choices: ['TACACS+', 'RADIUS', 'TFTP', 'Syslog'], answer: 0, explanation: 'TACACS+ is commonly used for device administration and encrypts the packet payload beyond its header.', difficulty: 'medium' },
  ],
  'wireless-security': [
    { id: 'bal-ws-1', prompt: 'Which WPA2 mode authenticates enterprise users through an 802.1X/RADIUS server?', choices: ['Enterprise', 'Personal', 'Open', 'WEP shared key'], answer: 0, explanation: 'WPA2-Enterprise uses 802.1X with an authentication server rather than one shared PSK.', difficulty: 'medium' },
    { id: 'bal-ws-2', prompt: 'Which encryption algorithm is associated with WPA2?', choices: ['AES-CCMP', 'DES', 'ROT13', 'MD5 only'], answer: 0, explanation: 'WPA2 uses AES-based CCMP for strong wireless data protection.', difficulty: 'easy' },
  ],
  'automation-impact': [
    { id: 'bal-au-1', prompt: 'What is configuration drift?', choices: ['Devices gradually differing from the intended configuration', 'A routing loop caused only by OSPF', 'Normal wireless roaming', 'A scheduled software backup'], answer: 0, explanation: 'Configuration drift occurs when actual device state diverges from the approved intended state.', difficulty: 'medium' },
    { id: 'bal-au-2', prompt: 'Why are idempotent automation operations valuable?', choices: ['Repeated execution produces the same intended state', 'They always erase device configuration', 'They require manual CLI approval per command', 'They prevent all network failures'], answer: 0, explanation: 'Idempotence lets automation run repeatedly without creating unintended additional changes.', difficulty: 'hard' },
  ],
  'controller-networking': [
    { id: 'bal-cn-1', prompt: 'In software-defined networking, which plane forwards user packets?', choices: ['Data plane', 'Control plane', 'Management plane only', 'Policy plane only'], answer: 0, explanation: 'The data plane performs packet forwarding based on rules supplied by control functions.', difficulty: 'easy' },
    { id: 'bal-cn-2', prompt: 'Which controller API is generally consumed by business or automation applications?', choices: ['Northbound API', 'Southbound API', 'Console API only', 'Data-link API'], answer: 0, explanation: 'Northbound APIs expose controller services and abstractions to applications.', difficulty: 'medium' },
  ],
  'ai-ml': [
    { id: 'bal-am-1', prompt: 'Which use of machine learning can help network operations teams detect unusual traffic patterns?', choices: ['Anomaly detection', 'Static cabling', 'Manual VLAN naming', 'Console password recovery'], answer: 0, explanation: 'Models can learn normal telemetry patterns and flag deviations for investigation.', difficulty: 'easy' },
    { id: 'bal-am-2', prompt: 'Why must AI-generated network changes still be validated?', choices: ['AI output can be incorrect or unsafe', 'AI always uses Telnet', 'AI cannot process telemetry', 'Validation disables automation'], answer: 0, explanation: 'AI systems can produce inaccurate recommendations, so controlled review and verification remain necessary.', difficulty: 'medium' },
  ],
  'rest-apis': [
    { id: 'bal-re-1', prompt: 'Which HTTP method normally creates a new subordinate resource?', choices: ['POST', 'GET', 'DELETE', 'HEAD'], answer: 0, explanation: 'POST commonly submits a representation to create a resource beneath a collection endpoint.', difficulty: 'easy' },
    { id: 'bal-re-2', prompt: 'Which HTTP status code means the requested resource was not found?', choices: ['404', '200', '201', '500'], answer: 0, explanation: '404 Not Found indicates that the server could not locate the requested resource.', difficulty: 'easy' },
  ],
  'config-management': [
    { id: 'bal-cm-1', prompt: 'Which format is commonly used for an Ansible playbook?', choices: ['YAML', 'PCAP', 'JPEG', 'Binary IOS only'], answer: 0, explanation: 'Ansible playbooks are normally written in human-readable YAML.', difficulty: 'easy' },
    { id: 'bal-cm-2', prompt: 'Which statement correctly contrasts Ansible and Terraform?', choices: ['Ansible commonly configures systems; Terraform commonly provisions infrastructure declaratively', 'Ansible is a routing protocol; Terraform is a switch protocol', 'Both are packet-capture formats', 'Terraform can only manage physical cables'], answer: 0, explanation: 'Ansible is widely used for configuration automation, while Terraform focuses on declarative infrastructure provisioning and state.', difficulty: 'medium' },
  ],
  json: [
    { id: 'bal-js-1', prompt: 'Which JSON value represents the absence of a value?', choices: ['null', 'undefined', 'none', 'empty()'], answer: 0, explanation: 'null is a valid JSON literal used to represent no value.', difficulty: 'easy' },
    { id: 'bal-js-2', prompt: 'Which JSON snippet is syntactically valid?', choices: ['{"enabled": true}', "{'enabled': True}", '{enabled: true}', '{"enabled" = true}'], answer: 0, explanation: 'JSON requires double-quoted property names, a colon separator, and lowercase true.', difficulty: 'medium' },
  ],
}
