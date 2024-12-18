import React, { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

// Tạo context
export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const user = useSelector((state) => state.auth.login.currentUser);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Kết nối với server
        if (user) {
            const socketInstance = io(process.env.EXPO_PUBLIC_API_URL, {
                query: { userId: user?.data.id },
            });
            setSocket(socketInstance);

            // Dọn dẹp khi component unmount
            return () => {
                if (socketInstance) socketInstance.disconnect();
            };
        }
    }, [user]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;