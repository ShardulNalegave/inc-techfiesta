
import { atom } from "recoil";

export const userstate = atom({
  key: "userstate", 
  default: "", 
});
export const isloggedd=atom({
    key:"isloggedd",
    default:false
})
export const loadingg =atom({
    key:"loadingg",
    default:false
})
export const userLocationatom = atom({
  key: "userLocation", 
  default: {accuracy: 100, altitude: 599.7999877929688, altitudeAccuracy: 100, heading: 0,latitude: 18.4536475, longitude: 73.848829, speed: 0}, 
});

export const mapregionatom=atom({
  key:"mapregionatom",
  default:{
    latitude: 18.4536475,
    longitude: 73.848829,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }
})


export const destinationLocation = atom({
  key: "destinationLocation", 
  default: { latitude: 0, longitude: 0 }, 
});

export const policeloadingatom=atom({
  key:"policeloadingatom",
  default:false,
})

