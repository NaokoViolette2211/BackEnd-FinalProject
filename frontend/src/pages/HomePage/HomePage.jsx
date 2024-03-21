import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './HomePage.scss'
import { deleteRecipe, getRecipes, getSelectedRecipe } from '../../ApiServices/RecipeService'
import { useNavigate } from 'react-router-dom'


const HomePage = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);


  useEffect(() => {
    const fetchSavedRecipes = async() => {
      try {
        const fetchRecipes = await getRecipes();
          setSavedRecipes(fetchRecipes);
      } catch(error){
        console.error('Error fetching saved recipes:', error);
      }
    };
    fetchSavedRecipes();
  },[]);


  const navigate = useNavigate();

  const handleViewRecipe = async(id) => {
    try {
      const fetchSelectedRecipe = await getSelectedRecipe(id);
      const selectedRecipe = fetchSelectedRecipe[0]
      navigate(`/preview/${id}`,{state:{viewRecipe: selectedRecipe}});
    } catch (error) {
      console.error('Error fetching selected recipe:', error)
    }
  }

  const handleEdit = async(id) => {
    const fetchSelectedRecipe = await getSelectedRecipe(id)
    const selectedRecipe = fetchSelectedRecipe[0]
    navigate(`/edit/${id}`,{state: {editRecipe: selectedRecipe}});   
  }

  const handleDelete = async(id) => {
    const confirmation = confirm("Are you sure you want to delete this recipe?");
    if(!confirmation){
      return;
    }
      try{
        const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== id);
        setSavedRecipes(updatedRecipes)
        await deleteRecipe(id);
      }catch(error){
        console.error("Error deleting recipe:", error)
      } 
  }
  
  return (
    <div className='homepage'>
      <Navbar />
      <main className='homepage--main'>
        <div className='container homepage--main--container'>
          <h1 className='main-title'>Saved Recipe</h1>
          <div className='homepage--main--container--contents'>
            {savedRecipes.length > 0? 
            (savedRecipes.map((recipe) => (
              <div 
              key={recipe.id} 
              className="card homepage--main--container--contents--card"
              >
                <div className='card-img-container' onClick={()=> handleViewRecipe(recipe.id)}>
                  <img className='card-img' src='assets/menu-icon.png' alt="my special recipe image" />
                </div>
                <div className="card-body">
                  <h5 className="card-title" onClick={()=> handleViewRecipe(recipe.id)}>{recipe.title}</h5>
                  <div className='btn-container'>
                    <button 
                    className="btn btn-link" 
                    onClick={() => handleEdit(recipe.id)
                    }>Edit</button>
                    <button 
                    className="btn btn-link" 
                    onClick={()=> handleDelete(recipe.id)
                    }>Delete</button>
                  </div>
                </div>
              </div>
            ))
          ):(
            <div className='no-recipe-saved'>There is no recipe saved yet...</div>
          )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage