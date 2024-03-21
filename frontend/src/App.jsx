import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.scss'
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import CreatePage from './pages/CreateRecipePage/CreatePage';
import PreviewPage from './pages/PreviewPage/PreviewPage';
import EditRecipePage from './pages/EditRecipePage/EditRecipePage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RegisterPage />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/home' element={<HomePage />}></Route>
        <Route path='/create' element={<CreatePage />}></Route>
        <Route path='/preview/:id' element={<PreviewPage />}></Route>
        <Route path='/edit/:id' element={<EditRecipePage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
