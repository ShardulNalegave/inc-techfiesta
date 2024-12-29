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
    return [
      { latitude: 18.4520, longitude: 73.8506, name: "Near Katraj Lake" },
      { latitude: 18.4565, longitude: 73.8537, name: "Near Katraj Chowk" },
      { latitude: 18.4628, longitude: 73.8569, name: "Near Bharati Vidyapeeth" },
      { latitude: 18.4705, longitude: 73.8602, name: "Near Balaji Nagar" },
      { latitude: 18.4783, longitude: 73.8625, name: "Near Padmavati" },
      { latitude: 18.4867, longitude: 73.8663, name: "Near Bibwewadi" },
      { latitude: 18.4951, longitude: 73.8689, name: "Near Market Yard" },
      { latitude: 18.5036, longitude: 73.8718, name: "Near Swargate" },
      { latitude: 18.5117, longitude: 73.8754, name: "Near Shaniwar Wada" },
      { latitude: 18.5204, longitude: 73.8567, name: "Pune Station" },
    ];
  }


      

 