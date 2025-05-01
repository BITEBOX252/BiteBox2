/* global L */
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

const CustomerLocationViewer = () => {
    const { orderId, trackingToken } = useParams();
    const [position, setPosition] = useState([0, 0]);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/tracking/${orderId}/${trackingToken}/`);

        wsRef.current.onopen = () => console.log("WebSocket Connected (Customer)");
        wsRef.current.onclose = () => console.log("WebSocket Disconnected (Customer)");
        wsRef.current.onerror = (error) => console.error("WebSocket Error:", error);

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received Location:", data);
            const newPos = [data.latitude, data.longitude];
            setPosition(newPos);
            if (markerRef.current) markerRef.current.setLatLng(newPos);
            if (mapRef.current) mapRef.current.setView(newPos, 17);
        };

        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [orderId, trackingToken]);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([0, 0], 17);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(mapRef.current);

            markerRef.current = L.marker([0, 0]).addTo(mapRef.current)
                .bindPopup("Delivery is here").openPopup();
        }
    }, []);

    return (
        <div>
            <h2>Track Your Delivery</h2>
            <div id="map" style={{ height: "500px", width: "100%" }}></div>
        </div>
    );
};

export default CustomerLocationViewer;
