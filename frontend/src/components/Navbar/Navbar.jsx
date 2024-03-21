import { removeJwt } from '../../ApiServices/JwtService';
import './Navbar.scss'
import { useNavigate } from 'react-router-dom'
import { Dropdown} from 'react-bootstrap';

const Navbar = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home')
  }
  
  const handleCreateRecipeClick = () => {
    navigate('/create');
  }
  
  const logOut = () => {
    removeJwt();
    navigate('/login');
  }

  return (
    <div className='navbar'>
      <div className="navbar--container container">
        <h1 className='navbar--container--title' onClick={handleHomeClick}>Recipe App</h1>
        <ul className='navbar--container--ul'>
          <li className='navbar--container--ul--li' onClick={handleCreateRecipeClick}>Create Recipe</li>
        </ul>
        <button className='navbar--container--logout-btn' onClick={logOut}>Log out</button>

        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          <i className="bi bi-list"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="create-btn" onClick={handleCreateRecipeClick}>Create Recipe</Dropdown.Item>
            <Dropdown.Item className="logout-btn" onClick={logOut}>Log Out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default Navbar