
import './App.css'
import CodeEditor from './utilities/CodeEditor'
import QuestionsList from './components/QuestionsList'
import ProblemPage from './components/ProblemPage'
import Login from './pages/login'
import Signup from './pages/Signup'
import Signuppage from './pages/Signuppage'
import Authenter from './components/Authenter'
import { Routes, Route } from "react-router-dom";
import Loginpage from './pages/Loginpage'



function App() {

return(
   <Routes>
      <Route path="/" element={<QuestionsList />}></Route>
      <Route path="/problems/:slug" element={<Authenter />}></Route>
      <Route path="/login" element={<Loginpage />}></Route>
      <Route path="/Signup" element={<Signuppage />}></Route>
      <Route path="*" element={<p>Page not found</p>} />
   </Routes>
)
  
}

export default App
