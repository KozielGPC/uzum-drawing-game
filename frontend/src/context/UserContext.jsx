import {createContext, useEffect, useState} from 'react';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user && room) {
            if (user.id === room.room_adm_id) {
                setIsAdmin(true);
            }
            else{
                setIsAdmin(false);
            }
            
        }
    }, [user, room])
    
    return <UserContext.Provider value={{user, room, isAdmin, setUser, setRoom, setIsAdmin}}>
            {children}
        </UserContext.Provider>
}