const socket = io();

// try {
//     if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//             (pos) => {
//                 const { latitude, longitude } = pos.coords;
//                 socket.emit("user-location", { latitude, longitude });
//             },
//             (err) => {
//                 console.error(err);
//             },
//             {
//                 enableHighAccuracy: true,
//                 maximumAge: 0,
//                 timeout: 5000
//             }
//         );
//     }
// } catch (e) {
//     console.error(e);
// }
// const map = L.map("map").setView([0,0],15)
// let marker = [];
// socket.on("update-location",(data)=>{
//     const {id,latitude,longitude} = data;
//     if(marker[id])
//     {
//         marker[id].setLatLng({latitude,longitude})
//     }
//     else{
//         marker[id] = L.marker([latitude,longitude],15).addto(map);
//     }
//     if(id == socket.id)
//     {
//         L.map(map).setView([latitude,longitude],15)
//     }
        
    
// })
// socket.on("disconnect",(id)=>{
//     map.removeLayer(marker[id]);
//     delete marker[id];
// })







//////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////






try {
    // Check if location of  broowwser
    if (navigator.geolocation) {
        console.log("Geolocation is supported by this browser.");
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords; //brosers lat and long
                socket.emit("user-location", { latitude, longitude });
            },
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy: true, // marker acuracy
                timeout: 5000, //5 sec refresh
                maximumAge: 0 // no cache
            }
        );
    }
} catch (error) {
    console.error(error);
}










//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////










const map = L.map("map").setView([0, 0],13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("update-location", (data) => {
    const { id, data: { latitude, longitude } } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }

    if (id === socket.id) {
        map.setView([latitude, longitude], 14.5); // only on self
    }
});
socket.on("user-disconnected", (data) => {
    const { id } = data;

    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
