require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fetchProducts', () => {
  it('Deve ser uma função', () => {
    expect.assertions(2);
    expect(fetchProducts).toBeDefined();
    expect(fetchProducts).toBeInstanceOf(Function);
  });

  it('Deve invocar a função fetch ao executar a função fetchProducts com um parâmetro válido', async () => {
    expect.assertions(1);
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalled();
  });

  it('Deve invocar a função fetch com o endpoint "https://api.mercadolibre.com/sites/MLB/search?q=computador" ao executar a função fetchProducts com um parâmetro válido', async () => {
    expect.assertions(1);
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  });

  it('Deve retornar um objeto igual ao objeto "computadorSearch", ao ser invocada com um parâmetro válido', async () => {
    expect.assertions(1);
    const response = await fetchProducts('computador');
    expect(response).toStrictEqual(computadorSearch);
  });

  it('Deve disparar um erro ao executar a função fetchProducts sem parâmetros', async () => {
    expect.assertions(1);
    const response = await fetchProducts();
    expect(response).toEqual(new Error('You must provide an url'));
  });
});
