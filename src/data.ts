import { BookOpen, FlaskConical, Network, ShieldCheck, type LucideIcon } from 'lucide-react'

export type Module = { id: string; title: string; description: string; icon: LucideIcon; accent: string }

export const modules: Module[] = [
  { id: 'network-fundamentals', title: 'Network Fundamentals', description: 'Models, cabling, IPv4, IPv6 and wireless foundations.', icon: Network, accent: 'bg-cyan-50 text-cyan-700' },
  { id: 'network-access', title: 'Network Access', description: 'VLANs, trunks, EtherChannel and spanning tree.', icon: BookOpen, accent: 'bg-violet-50 text-violet-700' },
  { id: 'ip-connectivity', title: 'IP Connectivity', description: 'Routing tables, static routes and single-area OSPF.', icon: FlaskConical, accent: 'bg-amber-50 text-amber-700' },
  { id: 'security-fundamentals', title: 'Security Fundamentals', description: 'Device hardening, ACLs, Layer 2 security and VPNs.', icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-700' },
]
