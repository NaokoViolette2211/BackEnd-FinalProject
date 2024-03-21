import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { login } from "../../ApiServices/AuthService"
import { setUser } from "../../ApiServices/UserService"
import './LoginPage.scss'

const LoginPage = () => {
  const [userInfo, setUserInfo] = useState({
    'email': '',
    'password': '',
  });
  
  const navigate = useNavigate();

  const handleLoginClick = async(e) => {
    e.preventDefault();
    const { jwt, success } = await login(userInfo);
    if(success){
      setUser(jwt);
      localStorage.setItem('recipe-app-jwt', jwt);
      navigate('/home');
    }else {
      alert('Incorrect email or password')
    }
  };

  return (
    <div className="loginPage">
      <div className="loginPage--container container">
        <div className='loginPage--container--img'>
          <img className='logo' src="assets/register-logo.png" alt="my recipe app logo" />
        </div>
        <div className="loginPage--container--form--outer">
          <form className='loginPage--container--form--outer--inner' onSubmit={handleLoginClick}>
            <h1 className='loginPage--container--form--outer--inner--title'>Log in</h1>
            <label htmlFor="email">Email</label>
            <input 
            type="text" 
            id='email'
            name="email"
            autoComplete='email'
            onChange={(e) => setUserInfo({...userInfo, [e.target.name]: e.target.value})}
            />
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            id='password'
            name="password"
            autoComplete='off'
            onChange={(e) => setUserInfo({...userInfo, [e.target.name]: e.target.value})}
            />
            <button type="submit">Log in</button>
            <p>Don&rsquo;t have an account? <Link to='/'>Register</Link></p>
          </form>
        </div>
      </div>
  </div>
  )
}

export default LoginPage