export default function getBackendErrorResponseObject(error){
    console.error("Google API error:", error);
    
      let normalizedError = "Unknown error";
    
      if (error?.response?.data?.error) {
        normalizedError = error.response.data.error;
      } else if (error?.errors?.length) {
        normalizedError = error.errors[0].message;
      } else if (error?.message) {
        normalizedError = error.message;
      }
    
    //   res.status(400).json({ error: normalizedError,  code: error?.code || null });
 return ({responseObject:{ error: normalizedError,  code: error?.code || null }})
}
    