import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CaseStudyMVI from './pages/CaseStudyMVI';
import Lab from './pages/Lab';
import HowBuilt from './pages/HowBuilt';
import AIForTeams from './pages/AIForTeams';
import NotFound from './pages/NotFound';
import ValueExplorer from './lab/ValueExplorer';
import AIPatterns from './lab/AIPatterns';
import DriftPage from './lab/DriftPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work/mvi" element={<CaseStudyMVI />} />
        <Route path="lab" element={<Lab />} />
        <Route path="lab/value-explorer" element={<ValueExplorer />} />
        <Route path="lab/ai-patterns" element={<AIPatterns />} />
        <Route path="lab/drift" element={<DriftPage />} />
        <Route path="how-this-was-built" element={<HowBuilt />} />
        <Route path="ai-for-design-teams" element={<AIForTeams />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
