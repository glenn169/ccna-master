import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { NotFound, Progress } from './pages/SimplePages'
import { LabPage, Labs } from './pages/LabPages'
import { Practice, PracticeModulePage, QuizPage } from './pages/PracticePages'
import { Navigate } from 'react-router-dom'

export default function App() { return <AppShell><Routes><Route path="/" element={<Dashboard/>}/><Route path="/learn/*" element={<Navigate to="/practice" replace/>}/><Route path="/labs" element={<Labs/>}/><Route path="/labs/:labId" element={<LabPage/>}/><Route path="/practice" element={<Practice/>}/><Route path="/practice/:moduleId" element={<PracticeModulePage/>}/><Route path="/practice/:moduleId/:topicId" element={<QuizPage/>}/><Route path="/progress" element={<Progress/>}/><Route path="*" element={<NotFound/>}/></Routes></AppShell> }
