import { useLocation, useNavigate} from 'react-router-dom';
import './EditRecipePage .scss'
import { useState, useEffect } from 'react';
import { updateRecipe } from '../../ApiServices/RecipeService';
import Navbar from '../../components/Navbar/Navbar';

const EditRecipePage = () => {
  const location = useLocation()
  const selectedRecipe = location.state;
  const {editRecipe} = selectedRecipe;

  const [editRecipeData, setEditRecipeData] = useState({
    title: editRecipe.title,
    ingredients: editRecipe.ingredients,
    directions: editRecipe.directions,
    notes: editRecipe.notes
  });

  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(editRecipe){
      setEditRecipeData(editRecipe);
      setEditMode(true)
    }
  }, [editRecipe]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditRecipeData(prev => ({...prev, [name]: value})); 
  };

  const handleSaveClick = async(id) => {
    if(editRecipeData.title === ''){
      alert('Please fill out the Title')
    }else{
      try{
        if(editMode){
          await updateRecipe(editRecipeData, id)
          setEditMode(false)
        }
        navigate('/home')
      }catch(error){
        console.error("Error while saving recipe:", error)
      }
    }
  };

  const handleCancelClick = () => {
    navigate('/home')
  };

  return (
    <div className='editRecipePage'>
      <Navbar />
      <main className='createPage--main'>
          <div className="container editRecipePage--main--container">
            <div className='editRecipePage--main--container--nav'>
              <h1 className='title'>Edit Recipe</h1>
              <button 
              className="btn btn-primary"
              onClick={()=> handleSaveClick(editRecipe.id)}>Update Recipe</button>
              <button className='btn cancel-btn' onClick={handleCancelClick}>Cancel</button>
            </div>

            <form className='editRecipePage--main--container--form'>
              <div className='left-container'>
                <label htmlFor="title">Title: <span className='required'>*Required</span></label>
                <input 
                type="text" 
                id='title' 
                name='title' 
                value={editRecipeData.title}
                onChange={handleChange}/>
                <label htmlFor="notes">Notes:</label>
                <textarea 
                name="notes" 
                id="notes" 
                cols="30" 
                rows="12" 
                value={editRecipeData.notes}
                onChange={handleChange}></textarea>
              </div>

              <div className='middle-container'>
                <label htmlFor='ingredients'>Ingredients:</label>
                <textarea 
                name="ingredients" 
                id="ingredients" cols="50" 
                rows="28" 
                value={editRecipeData.ingredients || ''}
                onChange={handleChange}></textarea>
              </div>

              <div className='right-container'>
                <label htmlFor='directions'>Directions:</label>
                <textarea 
                name="directions" 
                id="directions" 
                cols="50" 
                rows="28" 
                value={editRecipeData.directions}
                onChange={handleChange}></textarea>
              </div>
            </form>
          </div>
      </main>
    </div>
  )
}

export default EditRecipePage