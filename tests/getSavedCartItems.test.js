const localStorageSimulator = require('../mocks/localStorageSimulator');
const getSavedCartItems = require('../helpers/getSavedCartItems');

localStorageSimulator('getItem');

describe('4 - Teste a função getSavedCartItems', () => {
  it('Deve ser uma função', () => {
    expect.assertions(2);
    expect(getSavedCartItems).toBeDefined();
    expect(getSavedCartItems).toBeInstanceOf(Function);
  });

  it('Deve invocar o método localStorage.setItem ao ser chamada com um argumento válido', () => {
    expect.assertions(1);
    getSavedCartItems();
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('Deve invocar o método localStorage.setItem ao ser chamada com um argumento válido', () => {
    expect.assertions(1);
    getSavedCartItems();
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
  });
});
