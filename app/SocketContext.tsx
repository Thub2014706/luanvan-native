import React, { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

// Tạo context
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Kết nối với server
        const socketInstance = io(process.env.EXPO_PUBLIC_API_URL, {
            query: { userId: user.data.id },
        });
        setSocket(socketInstance);

        // Dọn dẹp khi component unmount
        return () => {
            if (socketInstance) socketInstance.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
