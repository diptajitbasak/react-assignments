export const googlePlaceSearch = (searchValue) => {
  return new Promise((resolve, reject) => {
    if (searchValue) {
      const searchedPlaces = [];
      let config = {
        input: searchValue,
        componentRestrictions: {
          country: "US",
        },
      };
      const googleService = new window.google.maps.places.AutocompleteService();
      // console.log("googleService", googleService);
      googleService.getPlacePredictions(config, (predictions) => {
        // console.log("Predictions", predictions);
        if (predictions) {
          predictions.forEach((prediction) => {
            searchedPlaces.push(prediction);
          });
        }
        resolve(searchedPlaces);
      });
    } else {
      resolve([]);
    }
  });
};

export const googlePlaceDetails = (placeId) => {
  return new Promise((resolve, reject) => {
    if (placeId) {
      const placesService = new window.google.maps.Geocoder();
      placesService.geocode({ placeId }, (result) => {
        if (result) {
          resolve(_formatAddress(result));
        } else {
          resolve([]);
        }
      });
    } else {
      resolve([]);
    }
  });
};

export const _formatAddress = (result) => {
  // Create an object containing required fields
  const addressComponents = {};
  result[0].address_components.forEach((component) => {
    component.types.forEach((type) => {
      if (!(addressComponents[type] && addressComponents[type].length)) {
        addressComponents[type] = [];
      }
      addressComponents[type].push(component.long_name);
    });
  });
  // Required: Street address, City, State, ZIP/PIN, Country
  let sublocalities = "";
  if (addressComponents.sublocality && addressComponents.sublocality.length) {
    addressComponents.sublocality.forEach((sublocality) => {
      sublocalities += sublocality + " ";
    });
  }
  return {
    address:
      (addressComponents.street_number?.length
        ? addressComponents.street_number[0]
        : "") +
      (addressComponents.route?.length
        ? ` ${addressComponents.route[0]}`
        : "") +
      (addressComponents?.subpremise?.length
        ? ` ${addressComponents?.subpremise[0]}`
        : "") +
      `${sublocalities?.trim().length ? ` ${sublocalities.trim()}` : ""}`,
    county:
      addressComponents.administrative_area_level_2 &&
      addressComponents.administrative_area_level_2.length
        ? addressComponents.administrative_area_level_2[0]
        : "",
    city:
      addressComponents.locality && addressComponents.locality.length
        ? addressComponents.locality[0]
        : addressComponents.administrative_area_level_2 &&
          addressComponents.administrative_area_level_2.length
        ? addressComponents.administrative_area_level_2[0]
        : "",
    state:
      addressComponents.administrative_area_level_1 &&
      addressComponents.administrative_area_level_1.length
        ? addressComponents.administrative_area_level_1[0]
        : "",
    country:
      addressComponents.country && addressComponents.country.length
        ? addressComponents.country[0]
        : "",
    postal:
      addressComponents.postal_code && addressComponents.postal_code.length
        ? addressComponents.postal_code[0]
        : "",
    lat:
      result?.length && result[0]?.geometry?.location?.lat()
        ? result[0].geometry.location.lat()
        : undefined,
    lng:
      result?.length && result[0]?.geometry?.location?.lng()
        ? result[0].geometry.location.lng()
        : undefined,
  };
};











