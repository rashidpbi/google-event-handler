export default async function handleFrontendResponseObject(responseData) {

 console.log("respons: ", responseData);
        console.log("respnse not ok");
        console.log("responseData.error: ", responseData.error);
        if (
          responseData.code === 401 ||
          responseData.error == "invalid_grant" ||
          responseData?.error?.status === "UNAUTHENTICATED" ||
          responseData.error == "No refresh token is set." ||
          responseData.error == "missing access token"
        ) {
          // console.log("invalid ");
          localStorage.setItem("loggedOutDueToTokenIssue", "true");
          window.location.href = "http://localhost:3000/login";
        }
}
