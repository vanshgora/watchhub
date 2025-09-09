import axios from "axios";
const API_URL = 'http://localhost:8000'

const signup = async (data) => {
    try {
        data.name = data.firstName + " " + data.lastName;
        delete data.firstName;
        delete data.lastName;
        delete data.confirmPassword;

        console.log(data);

        const res = await axios.post(`${API_URL}/signup`, data, {
            withCredentials: true
        });

        return res;
    } catch (err) {
        console.log("Error while signup", err);
    }
}

const login = async (data) => {
    try {
        console.log(data);
        const res = await axios.post(`${API_URL}/login`, data, {
            withCredentials: true
        });
        return res;
    } catch (err) {
        console.log("Error while login", err);
    }
}

const getAllProducts = async () => {
    try {
        const res = await axios.get(`${API_URL}/getproducts`, {
            withCredentials: true
        });
        return res;
    } catch (err) {
        console.log("Error getting products", err);
    }
}

const getUserCart = async () => {
    try {
        const res = await axios.get(`${API_URL}/getusercart`, {
            withCredentials: true
        });
        return res;
    } catch (err) {
        console.log("Error while getting user cart data", err);
    }
}

const updateUserCart = async (data) => {
    try {
        console.log(data);
        const res = await axios.patch(`/updateusercart/${productId}`);
        return res;
    } catch (err) {
        console.log("Error while updating the cart", err);
    }
}

export { signup, login, updateUserCart, getAllProducts, getUserCart };