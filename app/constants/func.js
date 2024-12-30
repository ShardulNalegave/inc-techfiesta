export const safeMapStyle = [
    {
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }], // Very Light Gray Background for Calm Feel
    },
    {
      elementType: 'labels.icon',
      stylers: [{ visibility: 'on' }],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{ color: '#607d8b' }], // Muted Grayish-Blue for Labels
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ffffff' }], // Light Stroke for Labels
    },
    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#80d0f1' }], // Soft Light Blue for Administrative Areas
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#607d8b' }], // Muted Grayish-Blue for Points of Interest
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#e1f5fe' }], // Soft Blue Roads for Subtlety
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#b3e5fc' }], // Light Blue for Water Areas
    },
  ];

  export const ROUTESFetch =async(startLocation,endLocation,type)=>{
    //type yaha pai hai like safest route /lightest route
    //startLocation.latitude tujhe latitude de dega and startLocation.longitude tujhe longitude de daga and similar for endlocation
    return[
      { latitude: 22.5958, longitude: 88.2636, name: "Howrah Bridge" },
      { latitude: 22.5448, longitude: 88.3426, name: "Victoria Memorial" },
      { latitude: 22.5645, longitude: 88.3433, name: "Eden Gardens" },
      { latitude: 22.5542, longitude: 88.3639, name: "Park Street" },
      { latitude: 22.6515, longitude: 88.3560, name: "Dakshineswar Temple" },
      { latitude: 22.5727, longitude: 88.3997, name: "Science City" },
      { latitude: 22.5958, longitude: 88.3771, name: "Salt Lake City" },
      { latitude: 22.5769, longitude: 88.3793, name: "Nicco Park" },
      { latitude: 22.5854, longitude: 88.3172, name: "Alipore Zoo" }
    ];
    
  }


      

 