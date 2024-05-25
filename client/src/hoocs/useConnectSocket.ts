import { useEffect } from "react"
import SocketApi from "../api/socket_api"

export const useConnectSocket = (currentUserId: number) => {
    const connectSocket = () => {
        SocketApi.createConnection(currentUserId);
    };

    useEffect(() => {
        connectSocket()
    },[currentUserId])
}