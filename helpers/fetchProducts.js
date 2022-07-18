const fetchProducts = async (searchQuery) => {
  try {
    if (!searchQuery) throw new Error('You must provide an url');

    const BASE_URL = 'https://api.mercadolibre.com';
    const ENDPOINT = `/sites/MLB/search?q=${searchQuery}`;
    const url = `${BASE_URL}/${ENDPOINT}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data;
  } catch (error) {
    return error;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
