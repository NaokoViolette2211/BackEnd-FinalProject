import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { deleteRecipe } from '../../ApiServices/RecipeService'
import './PreviewPage.scss'
import { useEffect, useState } from 'react'
import "bootstrap-icons/font/bootstrap-icons.css";
import { Dropdown} from 'react-bootstrap';

const PreviewPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const selectedRecipe = location.state
  const {viewRecipe} = selectedRecipe;

  const [ editRecipe, setEditRecipe] = useState({});
  
  useEffect(()=> {
    setEditRecipe(viewRecipe)
  },[viewRecipe])

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/edit/${id}`, {state:{editRecipe}})
  }

  const handleDelete = () => {
    const confirmation = confirm('Are you sure you want to delete this recipe?')
    if(confirmation){
      deleteRecipe(id)
      navigate('/home');
    }
    return;
  }

  const handleCancel = () => {
    navigate('/home');
  }

  return (
    <div className='previewPage'>
      <Navbar />
      <main className='previewPage--main'>
        <div className="container previewPage--main--container">
          <div className="previewPage--main--container--top">
            <div className='img-container'>
              <img src="../../assets/menu-icon.png" alt="my recipe logo" />
            </div>
            <div className='title-notes-container'>
              <div className='title-btns-container'>
                <h1 className='title'>{editRecipe.title}</h1>
                <button 
                type="button" 
                className="btn 
                btn-success"
                onClick={()=>handleEdit(editRecipe.id)}>Edit</button>
                <button 
                type="button" 
                className="btn btn-danger"
                onClick={()=> handleDelete(editRecipe.id)}
                >Delete
                </button>
                <button 
                type="button" 
                className="btn btn-cancel"
                onClick={handleCancel}
                >Cancel</button>

                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  <i className="bi bi-list"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item className="edit-btn" onClick={()=>handleEdit(editRecipe.id)}>Edit</Dropdown.Item>
                    <Dropdown.Item className="delete-btn" onClick={()=> handleDelete(editRecipe.id)}>Delete</Dropdown.Item>
                    <Dropdown.Item className="cancel-btn" onClick={handleCancel}>Cancel</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="note-container">
                <h3 className='notes-title'>Notes:</h3>
                <p className='notes'>{editRecipe.notes}</p>
              </div>
            </div>
          </div>
        
          <div className='previewPage--main--container--bottom'>
            <div className='ingredients-container'>
              <h3 className='ingredients-title'>Ingredients:</h3>
              <p>{editRecipe.ingredients}</p>
            </div>
            <div className='directions-container'>
              <h3 className='directions-title'>Directions:</h3>
              <p>{editRecipe.directions}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PreviewPage