function autocomplete(input, latInput, lngInput) {
  if (!input) return ;
  const dropdown = new google.maps.places.Autocomplete(input); 
  console.log('dropdown : ' +dropdown)
};

export default autocomplete;