import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Labs, Learn, NotFound, Practice, Progress } from './pages/SimplePages'

export default function App() { return <AppShell><Routes><Route path="/" element={<Dashboard/>}/><Route path="/learn" element={<Learn/>}/><Route path="/labs" element={<Labs/>}/><Route path="/practice" element={<Practice/>}/><Route path="/progress" element={<Progress/>}/><Route path="*" element={<NotFound/>}/></Routes></AppShell> }
