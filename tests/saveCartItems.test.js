const localStorageSimulator = require('../mocks/localStorageSimulator');
const saveCartItems = require('../helpers/saveCartItems');

localStorageSimulator('setItem');

describe('3 - Teste a função saveCartItems', () => {
  it('Deve ser uma função', () => {
    expect.assertions(2);
    expect(saveCartItems).toBeDefined();
    expect(saveCartItems).toBeInstanceOf(Function);
  });

  it('Deve invocar o método localStorage.setItem ao ser chamada com um argumento válido', () => {
    expect.assertions(1);
    saveCartItems('<ol><li>Item</li></ol>');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('Deve invocar o método localStorage.setItem ao ser chamada com um argumento válido', () => {
    expect.assertions(1);
    saveCartItems('<ol><li>Item</li></ol>');
    expect(localStorage.setItem).toHaveBeenCalledWith('cartItems', '<ol><li>Item</li></ol>');
  });
});
