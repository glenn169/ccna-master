import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { NotFound, Progress } from './pages/SimplePages'
import { LabPage, Labs } from './pages/LabPages'
import { Practice, PracticeModulePage, QuizPage } from './pages/PracticePages'
import { Navigate } from 'react-router-dom'
import { Exam, ExamHistory } from './pages/ExamPages'
import { AccountPage } from './pages/AccountPage'

export default function App() { return <AppShell><Routes><Route path="/" element={<Dashboard/>}/><Route path="/learn/*" element={<Navigate to="/practice" replace/>}/><Route path="/labs" element={<Labs/>}/><Route path="/labs/:labId" element={<LabPage/>}/><Route path="/practice" element={<Practice/>}/><Route path="/practice/:moduleId" element={<PracticeModulePage/>}/><Route path="/practice/:moduleId/:topicId" element={<QuizPage/>}/><Route path="/exam" element={<Exam/>}/><Route path="/exam/history" element={<ExamHistory/>}/><Route path="/progress" element={<Progress/>}/><Route path="/account" element={<AccountPage/>}/><Route path="*" element={<NotFound/>}/></Routes></AppShell> }
