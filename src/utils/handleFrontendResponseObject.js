//utils/handleFrontendResponseObject.js
export default async function handleFrontendResponseObject(responseData) {
  console.log("responseData.error: ", responseData.error);
  if (
    responseData.code === 401 ||
    responseData.error == "invalid_grant" ||
    responseData?.error?.status === "UNAUTHENTICATED" ||
    responseData.error == "No refresh token is set." ||
    responseData.error == "missing access token" ||
    responseData.error == "No access token provided"
  ) {
    localStorage.setItem("loggedOutDueToTokenIssue", "true");
    window.location.href = "/login";
  }
}
