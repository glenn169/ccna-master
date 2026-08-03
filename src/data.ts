import { BookOpen, FlaskConical, Network, ShieldCheck, type LucideIcon } from 'lucide-react'

export type Module = { title: string; description: string; progress: number; icon: LucideIcon; accent: string }

export const modules: Module[] = [
  { title: 'Network Fundamentals', description: 'Models, cabling, IPv4, IPv6 and wireless foundations.', progress: 42, icon: Network, accent: 'bg-cyan-50 text-cyan-700' },
  { title: 'Network Access', description: 'VLANs, trunks, EtherChannel and spanning tree.', progress: 18, icon: BookOpen, accent: 'bg-violet-50 text-violet-700' },
  { title: 'IP Connectivity', description: 'Routing tables, static routes and single-area OSPF.', progress: 8, icon: FlaskConical, accent: 'bg-amber-50 text-amber-700' },
  { title: 'Security Fundamentals', description: 'Device hardening, ACLs, Layer 2 security and VPNs.', progress: 0, icon: ShieldCheck, accent: 'bg-emerald-50 text-emerald-700' },
]
