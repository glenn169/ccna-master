import { Cloud, Monitor, Router, Server, Waypoints } from 'lucide-react'
import type { LabTopology, TopologyNode } from '../labTopologies'

const nodeColors: Record<TopologyNode['role'], string> = {
  router: '#0891b2', switch: '#4f46e5', host: '#0f766e', server: '#b45309', cloud: '#64748b',
}

function DeviceIcon({ role }: { role: TopologyNode['role'] }) {
  const props = { size: 19, strokeWidth: 2.4, 'aria-hidden': true }
  if (role === 'router') return <Router {...props}/>
  if (role === 'switch') return <Waypoints {...props}/>
  if (role === 'server') return <Server {...props}/>
  if (role === 'cloud') return <Cloud {...props}/>
  return <Monitor {...props}/>
}

export function NetworkTopology({ topology }: { topology: LabTopology }) {
  const byId = new Map(topology.nodes.map((node) => [node.id, node]))
  return <section className="card overflow-hidden" aria-labelledby="topology-heading">
    <div className="border-b border-slate-200 p-6">
      <p className="eyebrow">Build this first</p>
      <h2 id="topology-heading" className="mt-1 text-xl font-black text-navy-950">Network topology</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{topology.caption}</p>
    </div>
    <div className="overflow-x-auto bg-slate-950 p-3 sm:p-5">
      <div className="relative mx-auto h-[390px] min-w-[720px] max-w-[980px] overflow-hidden rounded-2xl border border-slate-700 bg-[radial-gradient(circle_at_center,_#1e293b_0,_#0f172a_70%)]" role="img" aria-label={`Topology with ${topology.nodes.map((node) => node.label).join(', ')}`}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 390" aria-hidden="true">
          {topology.links.map((link, index) => {
            const from = byId.get(link.from); const to = byId.get(link.to)
            if (!from || !to) return null
            const x1 = from.x * 10; const y1 = from.y * 3.9; const x2 = to.x * 10; const y2 = to.y * 3.9
            const dash = link.style === 'trunk' ? '10 6' : link.style === 'etherchannel' ? '3 5' : undefined
            const color = link.style === 'wan' ? '#f59e0b' : link.style === 'trunk' ? '#22d3ee' : link.style === 'etherchannel' ? '#a78bfa' : '#94a3b8'
            return <g key={`${link.from}-${link.to}-${index}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={link.style === 'etherchannel' ? 7 : 3} strokeDasharray={dash}/>
              <rect x={(x1+x2)/2-82} y={(y1+y2)/2-14} width="164" height="28" rx="8" fill="#0f172a" stroke="#475569"/>
              <text x={(x1+x2)/2} y={(y1+y2)/2+4} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="700">{link.label}</text>
            </g>
          })}
        </svg>
        {topology.nodes.map((node) => <div key={node.id} className="absolute w-32 -translate-x-1/2 -translate-y-1/2 text-center" style={{left: `${node.x}%`, top: `${node.y}%`}}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white/70 text-white shadow-lg" style={{backgroundColor: nodeColors[node.role]}}><DeviceIcon role={node.role}/></div>
          <div className="mt-1 rounded-lg bg-slate-950/90 px-2 py-1 shadow"><p className="text-xs font-black text-white">{node.label}</p>{node.detail && <p className="mt-0.5 text-[10px] font-semibold leading-3 text-cyan-200">{node.detail}</p>}</div>
        </div>)}
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-black text-navy-950">Addressing and port plan</h3>
      <p className="mt-1 text-xs text-slate-500">Use these exact values unless a lab step asks you to calculate them.</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Device</th><th className="px-4 py-3">Interface</th><th className="px-4 py-3">Address / setting</th><th className="px-4 py-3">Purpose</th></tr></thead>
          <tbody>{topology.addresses.map((row, index) => <tr key={`${row.device}-${row.interface}-${index}`} className="border-t border-slate-100"><td className="px-4 py-3 font-black text-navy-950">{row.device}</td><td className="px-4 py-3 font-mono text-xs text-slate-600">{row.interface}</td><td className="px-4 py-3 font-mono text-xs font-bold text-cyan-700">{row.address}</td><td className="px-4 py-3 text-slate-600">{row.purpose ?? '—'}</td></tr>)}</tbody>
        </table>
      </div>
      {topology.note && <p className="mt-4 rounded-xl bg-cyan-50 p-4 text-sm font-semibold leading-6 text-cyan-900">{topology.note}</p>}
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-500"><span><i className="mr-1 inline-block h-0.5 w-6 bg-slate-400 align-middle"/>Access / routed link</span><span><i className="mr-1 inline-block w-6 border-t-2 border-dashed border-cyan-500 align-middle"/>802.1Q trunk</span><span><i className="mr-1 inline-block h-1.5 w-6 bg-violet-400 align-middle"/>EtherChannel</span><span><i className="mr-1 inline-block h-0.5 w-6 bg-amber-500 align-middle"/>WAN / transit</span></div>
    </div>
  </section>
}
