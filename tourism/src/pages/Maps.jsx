import { useState, useEffect, useRef } from "react";
// import "./NavigationPage.css"; // Import your CSS file
import { styled } from "styled-components";

const googleMapsApiKey = "AIzaSyDS6AEeYiBTFX5JF7D33rosR86LmLmqhpI"; // Replace with your actual API key

const Maps = () => {
  const [map, setMap] = useState(null);
  const [attractionMarker, setAttractionMarker] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("attractions");
  const [information, setInformation] = useState([]);

  const searchInputRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=initMap`
        );
        await response.text(); // Load the Google Maps API asynchronously
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    };

    initMap();

    // Clean up function to remove the watchId and prevent memory leaks
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const handleInitMap = (google) => {
    const newMap = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
    });
    setMap(newMap);

    const currentLocationMarker = new google.maps.Marker({
      map: newMap,
      icon: {
        url: "http://maps.gstatic.com/mapfiles/ms2/micons/blue.png",
      },
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        currentLocationMarker.setPosition(pos);
        newMap.panTo(pos);
        updateInformation();
      },
      () => handleLocationError(true, newMap.getCenter())
    );
  };

  const handleSearchPlaces = (event) => {
    if (event.key === "Enter") {
      const searchInput = searchInputRef.current;
      const service = new google.maps.places.PlacesService(map);
      service.textSearch(
        {
          query: searchInput.value,
          location: map.getCenter(),
          radius: 5000,
        },
        callback
      );
    }
  };

  const handleUpdateCategory = (category) => {
    setSelectedCategory(category);
    updateInformation();
  };

  const updateInformation = () => {
    const service = new google.maps.places.PlacesService(map);
    const types = {
      attractions: "tourist_attraction",
      cuisines: "restaurant",
      hotels: "lodging",
    };

    service.nearbySearch(
      {
        location: map.getCenter(),
        radius: 5000,
        type: types[selectedCategory],
      },
      callback
    );
  };

  const callback = (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      results.sort((a, b) => b.rating - a.rating);
      const newInformation = results.map((place) => {
        const service = new google.maps.places.PlacesService(map);
        return new Promise((resolve) => {
          service.getDetails(
            {
              placeId: place.place_id,
            },
            (details, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                const card = document.createElement("div");
                card.className = "card";

                const title = document.createElement("h3");
                title.innerHTML = details.name;
                card.appendChild(title);

                const address = document.createElement("p");
                address.innerHTML = `Address: ${details.formatted_address}`;
                card.appendChild(address);

                if (details.rating) {
                  const rating = document.createElement("p");
                  rating.innerHTML = `Rating: ${details.rating}`;
                  card.appendChild(rating);
                }

                if (details.photos) {
                  const photo = document.createElement("img");
                  photo.src = details.photos[0].getUrl();
                  card.appendChild(photo);
                }

                if (details.formatted_phone_number) {
                  const phone = document.createElement("p");
                  phone.innerHTML = `Phone: ${details.formatted_phone_number}`;
                  card.appendChild(phone);
                }

                card.addEventListener("click", () => {
                  if (attractionMarker) {
                    attractionMarker.setMap(null);
                  }
                  const newMarker = new google.maps.Marker({
                    map: map,
                    position: details.geometry.location,
                  });
                  setAttractionMarker(newMarker);

                  navigator.geolocation.clearWatch(watchId);
                  map.setZoom(12);
                  map.panTo(details.geometry.location);
                  map.setZoom(15);

                  setTimeout(() => {
                    setWatchId(
                      navigator.geolocation.watchPosition(
                        (position) => {
                          const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                          };
                          currentLocationMarker.setPosition(pos);
                        },
                        () => handleLocationError(true, map.getCenter())
                      )
                    );
                  }, 2000);
                });

                resolve(card);
              } else {
                console.error("Error fetching place details:", status);
                resolve(null);
              }
            }
          );
        });
      });

      Promise.all(newInformation).then((cards) => {
        setInformation(cards.filter(Boolean)); // Filter out any null cards
      });
    } else {
      console.error("Error fetching nearby places:", status);
    }
  };

  const handleLocationError = (browserHasGeolocation, pos) => {
    alert(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
  };

  return (
    <Container className="navigation-page">
      <div className="navbar">
        <a href="#home">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <a href="#about">About</a>
      </div>

      <div id="info-container">
        <div id="selection">
          <input
            id="searchInput"
            type="text"
            placeholder="Search..."
            onKeyDown={handleSearchPlaces}
            ref={searchInputRef}
          />
          <button
            id="attractionsButton"
            onClick={() => handleUpdateCategory("attractions")}
          >
            Attractions
          </button>
          <button
            id="cuisinesButton"
            onClick={() => handleUpdateCategory("cuisines")}
          >
            Cuisines
          </button>
          <button
            id="hotelsButton"
            onClick={() => handleUpdateCategory("hotels")}
          >
            Hotels
          </button>
        </div>

        <div id="information">
          <h2>
            Nearby{" "}
            {selectedCategory.charAt(0).toUpperCase() +
              selectedCategory.slice(1)}
          </h2>
          {information.map((card) => (
            <div key={card.innerHTML}>{card}</div>
          ))}
        </div>
      </div>

      <div id="map"></div>

      {window.google && window.google.maps && (
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 0; /* remove default margin */
  background-color: #f5f5f5; /* subtle white */

  .navbar {
    overflow: hidden;
    background-color: #007bff; /* shade of blue */
    margin: 0; /* remove margin */
  }

  .navbar a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  .navbar a:hover {
    background-color: #ddd;
    color: black;
  }

  #selection {
    display: flex; /* Add this line */
    justify-content: space-around; /* Add this line */
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    margin: 10px;
    transition: all 0.3s ease;
  }

  #selection:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* shadow gets bigger on hover */
  }

  #selection select {
    padding: 5px; /* padding for the select element */
    border: none; /* remove default border */
    border-radius: 5px; /* rounded corners for the select element */
    background: #fff; /* white background for the select element */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* subtle shadow for the select element */
  }

  #selection button {
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #selection button:hover {
    background-color: #0056b3;
  }

  #searchInput {
    padding: 5px;
    border: none;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex-grow: 1; /* Allow the input to take up remaining space */
    margin-right: 10px; /* Add some margin to the right */
  }

  #map {
    height: calc(
      100vh - 47px
    ); /* 120px is the height of the navbar and selection div combined */
    width: 65%;
    float: right;
    margin: 0; /* remove margin */
  }

  #info-container {
    width: 35%;
    height: calc(100vh - 95px);
    float: left;
    margin: 0;
  }

  #information {
    height: calc(
      100% - 40px
    ); /* Adjusted to take up remaining height after #selection */
    overflow: auto;
    padding: 10px;
    margin: 0;
  }

  #information h2 {
    padding: 0px;
    color: #000000;
    text-align: center;
    margin: 0px;
  }

  .card {
    background-color: #fff; /* white */
    border: 1px solid #ddd;
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .card img {
    width: 100%;
    height: auto;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  .card h3 {
    margin: 0;
    padding: 0;
    text-align: center;
    color: #333;
  }

  .card p {
    margin: 5px 0;
  }
`;

export default Maps;
