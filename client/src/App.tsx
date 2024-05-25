import Dashboard from './components/Dashboard';
import Mainbody from './components/Mainbody';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Mainbody />} />
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>
    </Router>
  )
}

export default App
