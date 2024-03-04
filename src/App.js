import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Exercise from './Exercise'
import Login from './Login'
import Register from './Register'
import Records from './Records'
import NavBar from './components/NavBar'

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/exercise' element={<Exercise />} />
          <Route path='/register' element={<Register />} />
          <Route path='/records' element={<Records />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
