import { jwtDecode } from "jwt-decode";

function isTokenValid(token){
    if (!token) return false;

    try{
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken && decodedToken.exp > currentTime && decodedToken.iat <= currentTime;
    }catch(error){
        console.log('Error decoding token: ', error);
        return false;
    }

}

export default isTokenValid;
