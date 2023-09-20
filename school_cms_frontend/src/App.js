import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Template } from './pages/Template';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Courses } from './pages/Courses';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Template />}>
          <Route index='/' element={<Home />}></Route>
          <Route path='/Students' element={<Students />}></Route>
          <Route path='/Courses' element={<Courses />}></Route>
          <Route path='/Teachers' element={<Teachers />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
