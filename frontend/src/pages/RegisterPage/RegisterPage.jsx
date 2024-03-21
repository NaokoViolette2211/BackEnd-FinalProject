import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../../ApiServices/AuthService'
import { setUser } from '../../ApiServices/UserService'
import './RegisterPage.scss'

const RegisterPage = () => {
  const [userInfo, setUserInfo] = useState({
    'username': '',
    'email': '',
    'password': '',
  });

  const navigate = useNavigate();

  const handleRegisterClick = async(e) => {
    e.preventDefault()
    const {jwt, success, error} = await register(userInfo);
    console.log('jwt:', jwt, 'success:', success, 'error:', error)
    // jwt: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI1LCJ1c2VybmFtZSI6ImEiLCJpYXQiOjE3MTAzNTEzMTN9.VDcQH1lIstrgeYlPgITz78XFfJVNnsJLYYwUP9RJSsM success: true error: undefined
    if(success){
      localStorage.setItem('recipe-app-jwt', jwt);
      setUser(jwt)
      navigate('/home');
    }else{
      if(error.includes('Email already registered')){
        alert('This email is already registered');
      }else{
        alert('Error registering');
      }
    }
  }

  return (
    <div className="registerPage">
      <div className="registerPage--container container">
        <div className='registerPage--container--img'>
          <img className='logo' src="assets/register-logo.png" alt="my recipe app logo" />
        </div>
        <div className='registerPage--container--form--outer'>
          <form className='registerPage--container--form--outer--inner' onSubmit={handleRegisterClick}>
            <h1 className='registerPage--container--form--outer--inner--title'>Register</h1>
            <label htmlFor="username">Username</label>
            <input 
            type="text" 
            id='username'
            name='username'
            autoComplete='username'
            onChange={(e) => setUserInfo({...userInfo, [e.target.name]:e.target.value})}
            />
            <label htmlFor="email">Email</label>
            <input 
            type="email" 
            id='email'
            name='email'
            autoComplete='email'
            onChange={(e) => setUserInfo({...userInfo, [e.target.name]:e.target.value})}
            />
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id='password'
            name='password'
            autoComplete='off'
            onChange={(e) => setUserInfo({...userInfo, [e.target.name]:e.target.value})}
            />
            <button type='submit'>Register</button>
            <p>Already a member? <Link to='/login'>Log in</Link></p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage