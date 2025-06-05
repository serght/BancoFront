import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BASE_URL } from "../lib/http";

export function useTransaccionesWebSocket() {
  const [transacciones, setTransacciones] = useState([]);
  const [conectado, setConectado] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    console.log("STOMP: iniciando SOCKJS en", `${BASE_URL}/ws`);
    const sock = new SockJS(`${BASE_URL}/ws`);
    const token = localStorage.getItem("token");

    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: () => {
        console.log("STOMP: conectado, suscribiendo a /topic/transacciones");
        setConectado(true);
        client.subscribe("/topic/transacciones", (msg) => {
          console.log("STOMP: recibí mensaje →", msg.body);
          try {
            const nueva = JSON.parse(msg.body);
            setTransacciones((prev) => [nueva, ...prev]);
          } catch (err) {
            console.error("Parse JSON:", err);
          }
        });
      },
      onStompError: (frame) => console.error("STOMP error:", frame.headers.message),
    });

    client.onWebSocketError = (e) => console.error("WS error:", e);

    console.log("STOMP: activando cliente…");
    client.activate();
    clientRef.current = client;
    return () => clientRef.current?.deactivate();
  }, []);

  return { conectado, transacciones };
}
