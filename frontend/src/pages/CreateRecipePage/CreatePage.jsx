import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './CreatePage.scss'
import { createRecipe } from '../../ApiServices/RecipeService'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

const CreatePage = () => {

  const [newRecipeData, setNewRecipeData] = useState({
    title: '',
    img: '',
    ingredients: '',
    directions: '',
    notes: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewRecipeData(prev => ({...prev, [name]: value})); 
  };

  const handleSaveClick = async() => {
    if(newRecipeData.title === ''){
      alert('Please fill out Title')
    }else{
      try{
          await createRecipe(newRecipeData);
          navigate('/home')
      }catch(error){
        console.error("Error while saving recipe:", error)
      }
    }
  };

  const handleCancelClick = () => {
    navigate('/home')
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveClick();
  };

  const handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault();
    }
  };
  
  return (
    <div className='createPage'>
      <Navbar />
      <main className='createPage--main'>
        <div className="container createPage--main--container">
          <div className='createPage--main--container--nav'>
            <h1 className='title'>New Recipe</h1>
            <button 
            className="btn btn-primary"
            onClick={handleSaveClick}>Save</button>
            <button className='btn btn-outline-dark cancel-btn' onClick={handleCancelClick}>Cancel</button>
          </div>
          <form className='createPage--main--container--form' onSubmit={handleSubmit}>
            <div className='left-container'>
              <label htmlFor="title">Title: <span className='required'>*Required</span></label>
              <input 
              type="text" 
              id='title' 
              name='title' 
              value={newRecipeData.title}
              onChange={handleChange}
              onKeyDown={handleKeyPress}/>
              <label htmlFor="notes">Notes:</label>
              <textarea 
              name="notes" 
              id="notes" 
              cols="30" 
              rows="12" 
              value={newRecipeData.notes}
              onChange={handleChange}></textarea>
            </div>

            <div className='middle-container'>
              <label htmlFor='ingredients'>Ingredients:</label>
              <textarea 
              name="ingredients" 
              id="ingredients" 
              value={newRecipeData.ingredients}
              onChange={handleChange}></textarea>
            </div>

            <div className='right-container'>
              <label htmlFor='directions'>Directions:</label>
              <textarea 
              name="directions" 
              id="directions" 
              value={newRecipeData.directions}
              onChange={handleChange}></textarea>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}


CreatePage.propTypes = {
  editRecipe: PropTypes.object,
}

export default CreatePage

