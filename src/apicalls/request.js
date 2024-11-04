import { axiosInstance } from ".";

// get all requests for a user
// export const GetAllRequestsByUser = async () => {
//   try {
//     const { data } = await axiosInstance.get(
//       "/api/transaction/user-requests"
//     );
//     return data;
//   } catch (error) {
//     return error.response.data;
//   }
// };



export const GetAllRequestsByUser = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axiosInstance.get(
      "/api/transaction/user-requests",
      {
        headers: { Authorization: `Bearer ${token}` }, // Ensure token is sent.
      }
    );

    console.log('API Response Data:', data); // Check the API response.

    if (data.success) {
      // Return the transactions directly from the response
      return { success: true, data: data.data }; // Make sure to return the array of transactions.
    }
    
    return { success: false, message: 'Failed to fetch user data' };
  } catch (error) {
    console.error('API Error Response:', error.response?.data);
    return error.response?.data || { success: false, message: 'Unknown error occurred' };
  }
};


// send a request to another user
export const SendRequest = async (request) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/requests/send-request",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
};

// update a request status
export const UpdateRequestStatus = async (request) => {
  try {
    const { data } = await axiosInstance.post(
      "/api/transaction/update-request",
      request
    );
    return data;
  } catch (error) {
    return error.response.data;
  }
}
