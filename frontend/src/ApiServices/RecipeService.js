import { API_URL } from "../environment";
import { getJwt } from "./JwtService";

export const createRecipe = async(body) => {
  const response = await fetch(`${API_URL}/create`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getJwt()}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  return data;
}

export const getRecipes = async() => {
  const response = await fetch(`${API_URL}/recipes`,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getJwt()}`
    }
  });

  const data = await response.json();

  return data;
}

export const getSelectedRecipe = async(recipeId) => {
  const response = await fetch(`${API_URL}/recipes/${recipeId}`,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getJwt()}`
    }
  });

  const data = await response.json();

  return data;
}

export const deleteRecipe = async(recipeId) => {
  const response = await fetch(`${API_URL}/recipe/${recipeId}`,{
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getJwt()}`
    }
  });

  const data = await response.json();

  return data;
}

export const updateRecipe = async(body, recipeId) => {
  const response = await fetch(`${API_URL}/recipe/${recipeId}`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getJwt()}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  return data;
}