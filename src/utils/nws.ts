"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import messageApi from "@/redux/features/message/message.api";

export const useNotificationWS = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Get token from cookie (client-side)
        const getCookie = (name: string) => {
            if (typeof document === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const token = getCookie("access");
        if (!token) return;

        const wsUrl = `ws://10.10.12.15:8001/ws/asc/notifications/?access_token=${token}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("Notification WebSocket connected");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("New notification received:", data);
            
            // Invalidate notification queries to trigger refetch
            dispatch(messageApi.util.invalidateTags(["messages"]));
        };

        socket.onclose = () => {
            console.log("Notification WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("Notification WebSocket error:", error);
        };

        return () => {
            socket.close();
        };
    }, [dispatch]);
};
