import React, { useState, createContext } from 'react';

// Context 생성
export const CommonContext = createContext();

// Provider 컴포넌트 생성
export const CommonProvider = ({ children }) => {
    // http://intosky-ok.iptime.org:8000/
    // http://127.0.0.1:8000/
    const [DRONEKIT_API, setDRONEKIT_API] = useState('http://127.0.0.1:8000/');

    return (
        <CommonContext.Provider value={{ DRONEKIT_API, setDRONEKIT_API }}>
            {children}
        </CommonContext.Provider>
    );
};
