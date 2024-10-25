const {axiosInstance} = require(".");


export const LoginUser = async(payload) => {
    try {
        const {data} = await axiosInstance.post("https://wallet-api-j3g6.onrender.com/api/auth/login", payload);
        return data;
    } catch (error) {
       return error.response.data
    }
}




export const RegisterUser = async(payload) => {
    try {
        const {data} = await axiosInstance.post("https://wallet-api-j3g6.onrender.com/api/auth/register", payload);
        return data;
    } catch (error) {
       return error.response.data
    }
}




export const GetUserInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axiosInstance.get(
      "https://wallet-api-j3g6.onrender.com/api/auth/check-auth",
      {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent.
      }
    );
    console.log('API Response Data:', data); // Check the API response.

    if (data.success) {
      return { success: true, user: data.user }; // Return only what is needed.
    }
    return { success: false, message: 'Failed to fetch user data' };
  } catch (error) {
    console.error('API Error Response:', error.response?.data);
    return error.response?.data || { success: false, message: 'Unknown error occurred' };
  }
};


