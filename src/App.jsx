import { useRef, useState, useEffect, useCallback } from "react";
import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

function getStoredPlaces() {
  const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

  return storedIds
    .map((id) => AVAILABLE_PLACES.find((place) => place.id === id))
    .filter(Boolean);
}

function App() {
  const selectedPlace = useRef();

  const [modalIsOpen, setModalOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);

  const [pickedPlaces, setPickedPlaces] = useState(() => getStoredPlaces());

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prev) => {
      if (prev.some((p) => p.id === id)) return prev;

      const place = AVAILABLE_PLACES.find((p) => p.id === id);
      return [place, ...prev];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    if (!storedIds.includes(id)) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds]),
      );
    }
  }

  const handleRemovePlace = useCallback(() => {
    setPickedPlaces((prev) =>
      prev.filter((p) => p.id !== selectedPlace.current),
    );

    setModalOpen(false);

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];

    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)),
    );
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          key={modalIsOpen}
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>

      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select places below."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />

        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
