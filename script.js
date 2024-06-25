const citymap = {
    delhi: {
      center: { lat: 28.6139, lng: 77.2090 },
      radi: 20000, 
    },
    gurugram: {
      center: { lat: 28.4595, lng: 77.0266 },
      radi: 15000, 
    },
    noida: {
      center: { lat: 28.5355, lng: 77.3910 },
      radi: 15000, 
    },
    mumbai: {
      center: { lat: 19.0760, lng: 72.8777 },
      radi: 10000, 
    },
    bangalore: {
      center: { lat: 12.9716, lng: 77.5946 },
      radi: 10000, 
    },
    kolkata: {
      center: { lat: 22.5726, lng: 88.3639 },
      radi: 10000, 
    },
    jaipur: {
      center: { lat: 26.9124, lng: 75.7873 },
      radi: 10000, 
    },
    lucknow: {
      center: { lat: 26.8467, lng: 80.9462 },
      radi: 15000, 
    },
    patna: {
      center: { lat: 25.5941, lng: 85.1376 },
      radi: 15000, 
    },
    hyderabad: {
      center: { lat: 17.3850, lng: 78.4867 },
      radi: 10000, 
    }
  };
  
  function getCurrentPosition() {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        initMap(currentLocation); 
        checkRedAlertZone(currentLocation); 
      }, function() {
        handleLocationError(true);
      });
    } else {
      
      handleLocationError(false);
    }
  }
  
  function initMap(currentLocation) {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: currentLocation || { lat: 21.7679, lng: 78.8718 },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  
    
    for (const city in citymap) {
      
      const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: citymap[city].center,
        radius: Math.sqrt(citymap[city].radi) * 100,
      });
    }
  
    
    if (currentLocation) {
      const userMarker = new google.maps.Marker({
        position: currentLocation,
        map: map,
        title: 'Your Location',
        
        icon: {
          url: "https://img.icons8.com/?size=100&id=XieTOK4V0QEI&format=png&color=000000"
        }
      });
  
      const userInfoWindow = new google.maps.InfoWindow({
        content: 'You are here!'
      });
  
      userMarker.addListener('click', function() {
        userInfoWindow.open(map, userMarker);
      });
    }
  }
  
  function checkRedAlertZone(currentLocation) {
    const R = 6371e3;
    const lat1 = currentLocation.lat * Math.PI / 180; 
    const lng1 = currentLocation.lng * Math.PI / 180; 
  
    for (const city in citymap) {
      const cityCenter = citymap[city].center;
      const lat2 = cityCenter.lat * Math.PI / 180; 
      const lng2 = cityCenter.lng * Math.PI / 180; 
  
      const Δlat = lat2 - lat1;
      const Δlng = lng2 - lng1;
  
      const a = Math.sin(Δlat / 2) * Math.sin(Δlat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(Δlng / 2) * Math.sin(Δlng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      const distance = R * c;
  
      console.log(`Distance to ${city}: ${distance} meters`);
      console.log(`Radius of ${city}: ${citymap[city].radi} meters`);
  
      if (distance <= citymap[city].radi) {
        alert(`WARNING: Your current location is within a red alert zone (${city}).`);
        break; 
      }
    }
  }
  
  
  function handleLocationError(browserHasGeolocation) {
    const mapCenter = { lat: 21.7679, lng: 78.8718 };
    const infoWindow = new google.maps.InfoWindow({
      position: mapCenter,
      content: browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.'
    });
    infoWindow.open(map);
  }
  
 
  getCurrentPosition();
  
