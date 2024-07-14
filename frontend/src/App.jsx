import './App.css'
import Signup from './pages/signup'
import { Route, Routes } from "react-router-dom"
import Login from './pages/login'
import Home from './pages/home'
import NotFound from './pages/notfound'

function App() {  

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
