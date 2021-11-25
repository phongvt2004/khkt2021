import { createContext, useContext, useState } from 'react';


const AppContext = createContext();

export function AppWrapper({ children }) {
    const [userinfo, setUserinfo] = useState({})
    const [ingroups, setIngroups] = useState([])
    const [wtgroups, setWtgroups] = useState([])
    const [socketnoti, setSocketnoti] = useState(null);
    
    const sharedState = {
        uinfo: [userinfo, setUserinfo],
        igroups: [ingroups, setIngroups],
        wgroups: [wtgroups, setWtgroups],
        notisocket: [socketnoti, setSocketnoti],
    }
    
    return (
        <AppContext.Provider value={sharedState}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}