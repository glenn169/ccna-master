import type { Lab } from './labs'

export type LabAssessment = {
  labId: string
  minutes: number
  scenario: string
  objectives: string[]
  successCriteria: string[]
  fault: { evidence: string[]; question: string; options: string[]; answer: number; explanation: string }
  hints: string[]
}

const faultPatterns = [
  { evidence: ['The physical links are up.', 'A local ping succeeds, but traffic to another network fails.', 'The routing table does not contain the expected remote prefix.'], question: 'Which area should you inspect first?', options: ['Remote routing information', 'Console baud rate', 'Device hostname', 'NTP stratum'], answer: 0, explanation: 'Working local connectivity with a missing remote route points to routing configuration or route learning.' },
  { evidence: ['Connected interfaces report up/up.', 'Hosts in one broadcast domain communicate.', 'Traffic that must cross a VLAN boundary fails.'], question: 'Which configuration is the most likely cause?', options: ['Inter-VLAN gateway, trunk, or subinterface configuration', 'DNS domain name', 'CDP hold timer', 'Console password'], answer: 0, explanation: 'Connectivity within a VLAN but not across VLANs focuses troubleshooting on trunks, SVIs/subinterfaces, and gateways.' },
  { evidence: ['The client has a valid local IP address.', 'The default gateway responds.', 'The required service or permitted destination is unreachable.'], question: 'What should be checked next?', options: ['Policy, translation, or service-specific configuration', 'Ethernet cable colour', 'Router banner', 'Switch hostname'], answer: 0, explanation: 'Once Layer 1–3 local reachability is proven, inspect the feature controlling or providing the required service.' },
]

export function assessmentFor(lab: Lab): LabAssessment {
  const pattern = faultPatterns[lab.domainId === 'network-access' ? 1 : lab.domainId === 'ip-services' || lab.domainId === 'security-fundamentals' ? 2 : 0]
  return {
    labId: lab.id,
    minutes: Math.max(20, Math.round(lab.minutes * 0.75)),
    scenario: `Build the ${lab.title} topology and satisfy every objective without using the guided command list. Treat this as an exam-style Packet Tracer task.`,
    objectives: lab.goals,
    successCriteria: lab.verify,
    fault: pattern,
    hints: [
      `Start at the lowest relevant OSI layer and verify the ${lab.devices[0].replace(/^\d+ × /, '')} before changing configuration.`,
      `Use show commands to compare operational state with the addressing and port plan. Focus on objective ${lab.objective}.`,
      lab.troubleshooting?.[0] ?? `Recheck the configuration required to: ${lab.goals[0].toLowerCase()}.`,
    ],
  }
}
