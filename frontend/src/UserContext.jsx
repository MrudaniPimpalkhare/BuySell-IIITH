import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";


export const UserContext = createContext({});


export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get('/profile', { withCredentials: true });
            setUser(res.data);
            console.log("From user context",user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    // on rerendering, user is null, so we need to check if user is null, but cookie is present
    // if cookie is present, we need to get the user info from the server
    useEffect(() => {
        fetchUserProfile();
    }, []);


    return (
        <div>
            <UserContext.Provider value={{ user, setUser,loading }}>
                {children}
            </UserContext.Provider>
        </div>
    )
}