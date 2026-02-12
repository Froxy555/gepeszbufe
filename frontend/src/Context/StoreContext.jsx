import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = import.meta.env.PROD ? "https://gepeszbufe-backend.onrender.com" : "http://localhost:4000";
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [specialRequest, setSpecialRequest] = useState(""); // Added state for special request
    const [searchTerm, setSearchTerm] = useState("");
    const [profileName, setProfileName] = useState("");
    const [profileAvatar, setProfileAvatar] = useState(""); // dataURL vagy backend URL
    const currency = " Ft";
    const deliveryCharge = 0;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = food_list.find((product) => product._id === item);
                    totalAmount += itemInfo.price * cartItems[item];
                }
            } catch (error) {

            }

        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    const [userData, setUserData] = useState({}); // Added to store full user profile

    const loadProfile = async (tokenValue) => {
        try {
            const response = await axios.get(url + "/api/user/profile", {
                headers: { token: tokenValue }
            });
            if (response.data.success && response.data.user) {
                const { name, avatarUrl, email, phone, address } = response.data.user; // Assume these fields exist
                setProfileName(name || "");
                setProfileAvatar(avatarUrl || "");
                setUserData(response.data.user); // Store full user data

                // opcionálisan: cache localStorage-ban, de a forrás a backend marad
                localStorage.setItem('profileName', name || "");
                localStorage.setItem('profileAvatar', avatarUrl || "");
            }
        } catch (err) {
            console.error('Profil betöltési hiba', err);
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData({ token: storedToken });
                await loadProfile(storedToken);
            } else {
                // fallback: ha nincs token, csak a localStorage-ben lévő vizuális adatok
                const storedName = localStorage.getItem('profileName');
                const storedAvatar = localStorage.getItem('profileAvatar');
                if (storedName) setProfileName(storedName);
                if (storedAvatar) setProfileAvatar(storedAvatar);
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        specialRequest,     // Added to context value
        setSpecialRequest,  // Added to context value
        searchTerm,
        setSearchTerm,
        profileName,
        setProfileName,
        profileAvatar,
        setProfileAvatar,
        loadProfile,
        userData // Added to context value
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;
