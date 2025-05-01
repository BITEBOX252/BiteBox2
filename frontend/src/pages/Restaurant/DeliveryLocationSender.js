import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const DeliveryLocationSender = () => {
    const { orderId, trackingToken } = useParams();
    const wsRef = useRef(null);
    const latestCoords = useRef({ latitude: 0, longitude: 0 });

    useEffect(() => {
        wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/tracking/${orderId}/${trackingToken}/`);

        wsRef.current.onopen = () => console.log("WebSocket Connected (Rider)");
        wsRef.current.onclose = () => console.log("WebSocket Disconnected (Rider)");
        wsRef.current.onerror = (error) => console.error("WebSocket Error:", error);

        if ("geolocation" in navigator) {
            const geoOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    latestCoords.current = { latitude, longitude };
                },
                (error) => console.error("Error getting location:", error),
                geoOptions
            );

            const intervalId = setInterval(() => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify(latestCoords.current));
                    console.log("Sent Location to Backend:", latestCoords.current);
                }
            }, 5000);

            return () => {
                navigator.geolocation.clearWatch(watchId);
                clearInterval(intervalId);
                wsRef.current?.close();
            };
        }
    }, [orderId, trackingToken]);

    return (
        <div>
            <h2>Sending Live Location...</h2>
            <p>Location updates are being sent every 5 seconds.</p>
        </div>
    );
};

export default DeliveryLocationSender;
