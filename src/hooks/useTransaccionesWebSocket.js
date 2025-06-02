// src/hooks/useTransaccionesWebSocket.js
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export function useTransaccionesWebSocket() {
  const [transacciones, setTransacciones] = useState([]);
  const [conectado, setConectado] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const baseUrl =
      import.meta.env.VITE_API_URL || "http://localhost:8081";
    const sock = new SockJS(`${baseUrl.replace(/\/$/, "")}/ws`);

    const token = localStorage.getItem("token");

    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      connectHeaders: token
        ? { Authorization: `Bearer ${token}` } 
        : {},
      onConnect: () => setConectado(true),
      onStompError: (frame) =>
        console.error("STOMP error →", frame.headers.message),
    });

    client.onWebSocketError = (e) => console.error("WebSocket error:", e);
    client.activate();
    clientRef.current = client;

    client.onConnect = () => {
      client.subscribe("/topic/transacciones", (msg) => {
        try {
          const nueva = JSON.parse(msg.body);
          setTransacciones((prev) => [nueva, ...prev]); // prepend
        } catch (err) {
          console.error("Parse JSON Tx:", err);
        }
      });
    };

    return () => clientRef.current?.deactivate();
  }, []);

  return { conectado, transacciones };
}
