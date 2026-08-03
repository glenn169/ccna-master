import { Bot, BookOpen, CloudCog, FlaskConical, Network, ShieldCheck, type LucideIcon } from 'lucide-react'

export type Lesson = {
  id: string
  objective: string
  title: string
  duration: number
  available?: boolean
}

export type Module = {
  id: string
  title: string
  weight: number
  description: string
  icon: LucideIcon
  accent: string
  lessons: Lesson[]
}

export const modules: Module[] = [
  {
    id: 'network-fundamentals', title: 'Network Fundamentals', weight: 20,
    description: 'Devices, topologies, cabling, addressing, wireless and virtualization foundations.',
    icon: Network, accent: 'bg-cyan-50 text-cyan-700',
    lessons: [
      { id: 'network-components', objective: '1.1', title: 'Network Components and Their Roles', duration: 12, available: true },
      { id: 'topology-architectures', objective: '1.2', title: 'Network Topology Architectures', duration: 14 },
      { id: 'cabling-interfaces', objective: '1.3', title: 'Cabling and Physical Interfaces', duration: 18 },
      { id: 'interface-issues', objective: '1.4', title: 'Interface and Cable Issues', duration: 12 },
      { id: 'tcp-udp', objective: '1.5', title: 'TCP and UDP', duration: 15 },
      { id: 'ipv4-addressing', objective: '1.6', title: 'IPv4 Addressing and Subnetting', duration: 30 },
      { id: 'private-ipv4', objective: '1.7', title: 'Private IPv4 Addressing', duration: 10 },
      { id: 'ipv6-addressing', objective: '1.8', title: 'IPv6 Addressing and Prefixes', duration: 25 },
      { id: 'ipv6-types', objective: '1.9', title: 'IPv6 Address Types', duration: 18 },
      { id: 'ip-parameters', objective: '1.10', title: 'Verify Client IP Parameters', duration: 12 },
      { id: 'wireless-principles', objective: '1.11', title: 'Wireless Principles', duration: 18 },
      { id: 'virtualization', objective: '1.12', title: 'Virtualization Fundamentals', duration: 14 },
      { id: 'switching-concepts', objective: '1.13', title: 'Basic Switching Concepts', duration: 16 },
    ],
  },
  {
    id: 'network-access', title: 'Network Access', weight: 20,
    description: 'VLANs, trunks, discovery protocols, EtherChannel, spanning tree and wireless access.',
    icon: BookOpen, accent: 'bg-violet-50 text-violet-700',
    lessons: [
      { id: 'vlans', objective: '2.1', title: 'Configure and Verify VLANs', duration: 25 },
      { id: 'trunks', objective: '2.2', title: 'Interswitch Connectivity', duration: 22 },
      { id: 'cdp-lldp', objective: '2.3', title: 'CDP and LLDP', duration: 14 },
      { id: 'etherchannel', objective: '2.4', title: 'Layer 2 and Layer 3 EtherChannel', duration: 28 },
      { id: 'rapid-pvst', objective: '2.5', title: 'Rapid PVST+ Operations', duration: 30 },
      { id: 'wireless-architectures', objective: '2.6', title: 'Cisco Wireless Architectures', duration: 16 },
      { id: 'ap-connections', objective: '2.7', title: 'Access Point and WLC Connections', duration: 14 },
      { id: 'wireless-gui', objective: '2.8', title: 'Configure WLAN Access in the GUI', duration: 25 },
    ],
  },
  {
    id: 'ip-connectivity', title: 'IP Connectivity', weight: 25,
    description: 'Routing tables, forwarding decisions, static routes, OSPF and gateway redundancy.',
    icon: FlaskConical, accent: 'bg-amber-50 text-amber-700',
    lessons: [
      { id: 'routing-table', objective: '3.1', title: 'Interpret the Routing Table', duration: 22 },
      { id: 'forwarding-decision', objective: '3.2', title: 'Router Forwarding Decisions', duration: 18 },
      { id: 'static-routing', objective: '3.3', title: 'IPv4 and IPv6 Static Routing', duration: 32 },
      { id: 'ospfv2', objective: '3.4', title: 'Single-Area OSPFv2', duration: 35 },
      { id: 'fhrp', objective: '3.5', title: 'First Hop Redundancy Protocols', duration: 18 },
    ],
  },
  {
    id: 'ip-services', title: 'IP Services', weight: 10,
    description: 'NAT, NTP, DHCP, DNS, SNMP, syslog, QoS, SSH and file-transfer services.',
    icon: CloudCog, accent: 'bg-blue-50 text-blue-700',
    lessons: [
      { id: 'nat', objective: '4.1', title: 'Inside Source NAT', duration: 28 },
      { id: 'ntp', objective: '4.2', title: 'NTP Client and Server', duration: 18 },
      { id: 'dhcp-dns', objective: '4.3–4.6', title: 'DHCP, DNS and Relay Services', duration: 25 },
      { id: 'snmp-syslog', objective: '4.4–4.5', title: 'SNMP and Syslog', duration: 18 },
      { id: 'qos', objective: '4.7', title: 'Quality of Service Behaviors', duration: 20 },
      { id: 'ssh', objective: '4.8', title: 'Remote Access Using SSH', duration: 22 },
      { id: 'ftp-tftp', objective: '4.9', title: 'FTP and TFTP', duration: 12 },
    ],
  },
  {
    id: 'security-fundamentals', title: 'Security Fundamentals', weight: 15,
    description: 'Threats, device hardening, access control, Layer 2 defenses, AAA, VPNs and wireless security.',
    icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-700',
    lessons: [
      { id: 'security-concepts', objective: '5.1', title: 'Security Concepts and Threats', duration: 20 },
      { id: 'security-program', objective: '5.2', title: 'Security Program Elements', duration: 14 },
      { id: 'local-passwords', objective: '5.3', title: 'Local Password Access Control', duration: 20 },
      { id: 'password-policy', objective: '5.4', title: 'Password Policy and Alternatives', duration: 12 },
      { id: 'ipsec-vpn', objective: '5.5', title: 'Remote-Access and Site-to-Site VPNs', duration: 18 },
      { id: 'acls', objective: '5.6', title: 'IPv4 Access Control Lists', duration: 30 },
      { id: 'layer2-security', objective: '5.7–5.8', title: 'Layer 2 Security Features', duration: 30 },
      { id: 'aaa', objective: '5.9', title: 'Authentication, Authorization and Accounting', duration: 16 },
      { id: 'wireless-security', objective: '5.10–5.11', title: 'Wireless Security and WPA2 PSK', duration: 22 },
    ],
  },
  {
    id: 'automation-programmability', title: 'Automation and Programmability', weight: 10,
    description: 'Automation, controller-based networking, APIs, configuration tools, JSON and AI/ML.',
    icon: Bot, accent: 'bg-rose-50 text-rose-700',
    lessons: [
      { id: 'automation-impact', objective: '6.1', title: 'Impact of Network Automation', duration: 14 },
      { id: 'controller-networking', objective: '6.2–6.3', title: 'Controller-Based Networking', duration: 22 },
      { id: 'ai-ml', objective: '6.4', title: 'AI and Machine Learning in Operations', duration: 18 },
      { id: 'rest-apis', objective: '6.5', title: 'REST APIs and HTTP Operations', duration: 22 },
      { id: 'config-management', objective: '6.6', title: 'Ansible and Terraform', duration: 16 },
      { id: 'json', objective: '6.7', title: 'Interpret JSON Data', duration: 18 },
    ],
  },
]

export function findModule(moduleId?: string) { return modules.find((module) => module.id === moduleId) }
export function findLesson(moduleId?: string, lessonId?: string) { return findModule(moduleId)?.lessons.find((lesson) => lesson.id === lessonId) }
