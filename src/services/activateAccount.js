import axios from 'axios';

const activateAccount = async (uid, token) => {
  const url = `${import.meta.env.VITE_APP_API_URL}/auth/activate/${uid}/${token}/`;
  
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    throw error; 
  }
}

export default activateAccount;