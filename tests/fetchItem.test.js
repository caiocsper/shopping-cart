require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fetchItem', () => {
  it('Deve ser uma função', () => {
    expect.assertions(2);
    expect(fetchItem).toBeDefined();
    expect(fetchItem).toBeInstanceOf(Function);
  });

  it('Deve invocar a função fetch ao executar a função fetchItem com um parâmetro válido', async () => {
    expect.assertions(1);
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
  });

  it('Deve invocar a função fetch com o endpoint "https://api.mercadolibre.com/items/MLB1615760527" ao executar a função fetchItem com um parâmetro válido', async () => {
    expect.assertions(1);
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1615760527');
  });

  it('Deve retornar um objeto igual ao objeto "item", ao ser invocada com um parâmetro válido', async () => {
    expect.assertions(1);
    const response = await fetchItem('MLB1615760527');
    expect(response).toStrictEqual(item);
  });

  it('Deve disparar um erro ao executar a função fetchItem sem parâmetros', async () => {
    expect.assertions(1);
    const response = await fetchItem();
    expect(response).toEqual(new Error('You must provide an url'));
  });
});
