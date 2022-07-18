const saveCartItems = (itemHtml) => localStorage.setItem('cartItems', itemHtml);

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
