import LoginPage from './Common/LoginPage'
import SignUpPage from './Common/SignUpPage'
import Dashboard from './Common/Dashboard'
import {BrowserRouter as Router,Route,Routes } from "react-router-dom"
import './App.css'
import PrivateRoute from './Common/PrivateRoute'

function App() {
  return (
  <Router>
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignUpPage/>}/>
      <Route path='/dashboard' element={<PrivateRoute/>}/>
    </Routes>
  </Router>
  )
}

export default App
