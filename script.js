const cartItemsCounter = document.getElementById('cartItemsCounter');
const searchBtnElement = document.getElementById('searchBtn');
const searchQueryElement = document.getElementById('search');
const productsContainer = document.querySelector('.productItemsContainer');
const totalCartPriceElement = document.querySelector('.totalPrice');
const cartItemsContainer = document.querySelector('.cartItemsContainer');
const emptyCartBtnElement = document.querySelector('.emptyCart');
const addToCartBtnElements = productsContainer.getElementsByClassName('itemAddToCart');
const cartElements = document.getElementsByClassName('cartItem');
const headerElement = document.querySelector('.header');
const cartItemAnimationDelay = 750;

const getActiveSortOrderElement = () => document.querySelector('.activeOption');

const getSkuFromProductItem = (ele) => ele.querySelector('span.itemSku').innerText;

const getPriceElementFromItem = (ele) => ele.querySelector('.priceNum');

const getBasePriceFromItem = (ele) => ele.querySelector('.priceNum').getAttribute('data-basePrice');

const formatPriceToComma = (price) => price.replace(/\x2e/, ',');

const formatPriceToDot = (price) => price.replace(/\x2c/, '.');

const getCartItemQuantityElement = (ele) => ele.querySelector('.quantityNum');

const calcPrice = (acc, ele) => {
  const productPrice = getBasePriceFromItem(ele);
  const productQuantity = getCartItemQuantityElement(ele).innerText;

  return parseFloat(acc) + (Number(productPrice) * Number(productQuantity));
};

const loadCartItemsFromStorage = () => { cartItemsContainer.innerHTML = getSavedCartItems(); };

const calcTotalCartItens = (acc, ele) => {
  const quantityElement = getCartItemQuantityElement(ele);
  const quantityNumber = Number(quantityElement.innerText);
  return acc + quantityNumber;
};

const renderCartItemsCount = () => {
  if (cartElements.length > 0) {
    const totalCartItems = Array.from(cartElements).reduce(calcTotalCartItens, 0);
    cartItemsCounter.innerText = totalCartItems;
  } else {
    cartItemsCounter.innerText = 0;
  }
};

const emptyContainer = (ele) => { while (ele.firstChild) ele.lastChild.remove(); };

const createCustomElement = (element, classesName, innerHTML) => {
  const createdElement = document.createElement(element);

  createdElement.classList.add(...classesName.split(' '));
  if (classesName === 'priceNum') {
    const formattedPrice = formatPriceToDot(innerHTML);
    createdElement.setAttribute('data-basePrice', formattedPrice);
  }
  if (innerHTML) createdElement.innerHTML = innerHTML;

  return createdElement;
};

const createProductImageElement = (imageSource) => {
  const itemImageContainer = createCustomElement('figure', 'itemFigure');
  const img = document.createElement('img');

  img.classList.add('itemImage');
  img.setAttribute('src', imageSource);
  itemImageContainer.appendChild(img);

  return itemImageContainer;
};

const renderCartTotalPrice = () => {
  const totalPrice = Array.from(cartElements).reduce(calcPrice, 0);

  totalCartPriceElement.innerText = formatPriceToComma(totalPrice.toFixed(2));
};

const renderCartItemPrice = (ele) => {
  const elementPrice = getPriceElementFromItem(ele);
  const basePrice = getBasePriceFromItem(ele);
  const elementQuantity = getCartItemQuantityElement(ele);
  const quantityNumber = Number(elementQuantity.innerText);
  const totalPrice = basePrice * quantityNumber;
  elementPrice.innerText = formatPriceToComma(totalPrice.toFixed(2));
};

const renderCartItemsPrice = (itemToUpdate) => {
  if (itemToUpdate) renderCartItemPrice(itemToUpdate);
  if (cartElements.length > 0) Array.from(cartElements).forEach(renderCartItemPrice);
};

const animateCartItem = (element) => {
  element.classList.remove('fadeIn');
  element.classList.add('slideToRight');
};

const animateCartItems = () => {
  cartItemsContainer.childNodes.forEach((ele) => {
    animateCartItem(ele);
  });
};

const handleActions = (saveOrLoad = 'save', itemToUpdate) => {
  if (saveOrLoad === 'save') saveCartItems(cartItemsContainer.innerHTML);
  if (saveOrLoad === 'load') loadCartItemsFromStorage();
  renderCartTotalPrice();
  renderCartItemsPrice(itemToUpdate);
  renderCartItemsCount();
};

const cartItemClickListener = ({ currentTarget }) => {
  animateCartItem(currentTarget.parentElement);

  setTimeout(() => {
    currentTarget.parentElement.remove();
    handleActions();
  }, cartItemAnimationDelay);
};

const changeQuantity = ({ currentTarget: { classList, parentElement } }) => {
  const countQuantityElement = getCartItemQuantityElement(parentElement);
  const quantity = Number(countQuantityElement.innerText);

  if (classList.contains('addQuantity')) countQuantityElement.innerText = quantity + 1;
  if (classList.contains('subQuantity')) {
    if ((quantity - 1) < 1) cartItemClickListener({ currentTarget: parentElement });

    countQuantityElement.innerText = quantity - 1;
  }
  handleActions(null, parentElement.parentElement);
};

const createCartItemPriceContainer = (price) => {
  const itemPriceContainer = createCustomElement('div', 'itemPrice');
  const itemTotalPriceContainer = createCustomElement('div', 'totalPrice');
  const itemUnitPriceContainer = createCustomElement('div', 'unitPrice');

  itemTotalPriceContainer.appendChild(createCustomElement('span', 'priceText', 'Total'));
  itemTotalPriceContainer.appendChild(createCustomElement('span', 'priceSufix', 'R$'));
  itemTotalPriceContainer.appendChild(createCustomElement('span', 'priceNum', price));

  itemUnitPriceContainer.appendChild(createCustomElement('span', 'priceText', 'Unidade'));
  itemUnitPriceContainer.appendChild(createCustomElement('span', 'priceSufix', 'R$'));
  itemUnitPriceContainer.appendChild(createCustomElement('span', 'priceNum', price));

  itemPriceContainer.appendChild(itemTotalPriceContainer);
  itemPriceContainer.appendChild(itemUnitPriceContainer);

  return itemPriceContainer;
};

const createCartItemInfoContainer = ({ sku, name, price }) => {
  const itemInfoContainer = createCustomElement('div', 'itemTextInfo');
  const itemPriceContainer = createCartItemPriceContainer(price);

  itemInfoContainer.appendChild(createCustomElement('h5', 'itemTitle', name));
  itemInfoContainer.appendChild(createCustomElement('span', 'itemSku', sku));
  itemInfoContainer.appendChild(itemPriceContainer);

  return itemInfoContainer;
};

const createCartItemInfoSection = ({ sku, name, price, image }) => {
  const itemInfoSection = createCustomElement('section', 'itemInfoContainer');
  const itemImageContainer = createProductImageElement(image);
  const itemInfoContainer = createCartItemInfoContainer({ sku, name, price });

  itemInfoSection.appendChild(itemImageContainer);
  itemInfoSection.appendChild(itemInfoContainer);
  itemInfoSection.appendChild(createCustomElement('i', 'material-icons itemRemovalIcon', 'close'));
  itemInfoSection.addEventListener('click', cartItemClickListener);

  return itemInfoSection;
};

const createCartItemQuantitySection = () => {
  const itemQuantitySection = createCustomElement('section', 'itemQuantity');
  const addQuantity = createCustomElement('i', 'material-icons addQuantity', 'add_circle');
  const subQuantity = createCustomElement('i', 'material-icons subQuantity', 'do_not_disturb_on');

  addQuantity.addEventListener('click', changeQuantity);
  subQuantity.addEventListener('click', changeQuantity);

  itemQuantitySection.appendChild(addQuantity);
  itemQuantitySection.appendChild(createCustomElement('span', 'quantityNum', 1));
  itemQuantitySection.appendChild(subQuantity);

  return itemQuantitySection;
};

const createCartItemElement = ({ sku, title: name, salePrice: price, thumbnail: image }) => {
  const itemLi = createCustomElement('li', 'cartItem fadeIn');
  const itemInfoSection = createCartItemInfoSection({ sku, name, price, image });
  const itemQuantitySection = createCartItemQuantitySection();

  itemLi.appendChild(itemInfoSection);
  itemLi.appendChild(itemQuantitySection);

  return itemLi;
};

const loaderFetch = async (eleContainer, fetchFunc, fetchParam) => {
  const loaderElement = createCustomElement('div', 'preLoader');
  loaderElement.appendChild(createCustomElement('div', 'preLoaderBar'));

  eleContainer.appendChild(loaderElement);
  eleContainer.classList.add('preLoaderCursor');

  return fetchFunc(fetchParam)
    .then((data) => {
      loaderElement.remove();
      eleContainer.classList.remove('preLoaderCursor');
      return data;
    });
};

const cartElementExists = (sku) => {
  const element = Array.from(cartItemsContainer.children)
    .find((ele) => getSkuFromProductItem(ele) === sku);
  
  if (!element) return false;

  const countQuantityElement = getCartItemQuantityElement(element);
  const quantity = Number(countQuantityElement.innerText);
  
  countQuantityElement.innerText = quantity + 1;
  
  return true;
};

const addItemToCart = async ({ currentTarget }) => {
  const sku = getSkuFromProductItem(currentTarget);

  if (!cartElementExists(sku)) {
    const { title, price, thumbnail } = await loaderFetch(cartItemsContainer, fetchItem, sku);
    const salePrice = formatPriceToComma(price.toFixed(2));
    cartItemsContainer.appendChild(createCartItemElement({ sku, title, salePrice, thumbnail }));
  }

  handleActions();
};

const createProductItemElement = ({ sku, name, image, formattedPrice }) => {
  const section = document.createElement('section');
  const itemPriceContainer = createCustomElement('div', 'itemPrice');

  itemPriceContainer.appendChild(createCustomElement('span', 'priceSufix', 'R$'));
  itemPriceContainer.appendChild(createCustomElement('span', 'priceNum', formattedPrice));

  section.classList.add('productItem');
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'itemSku', sku));
  section.appendChild(itemPriceContainer);
  section.appendChild(createCustomElement('h5', 'itemTitle', name));
  section.appendChild(createCustomElement('button', 'itemAddToCart', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addItemToCart);

  return section;
};

const appendProductItems = async (searchQuery) => {
  const { results } = await loaderFetch(productsContainer, fetchProducts, searchQuery);

  results.forEach(({ id: sku, title: name, thumbnail: image, price }) => {
    const formattedPrice = formatPriceToComma(price.toFixed(2));
    const productElement = createProductItemElement({ sku, name, image, formattedPrice });

    productsContainer.appendChild(productElement);
  });
};

// sortElements in page with selectionSort algorithm

const updateMinElement = (sortOrder, min, arr, indB) => {
  const minElementPrice = getBasePriceFromItem(arr[min]);
  const nextElementPrice = getBasePriceFromItem(arr[indB]);

  if (sortOrder === 'ascend' && Number(nextElementPrice) < Number(minElementPrice)) {
    return indB;
  }

  if (sortOrder === 'descend' && Number(nextElementPrice) > Number(minElementPrice)) {
    return indB;
  }

  return min;
};

const sortProduct = (arr, ind, min) => {
  if (arr[ind] !== arr[min]) {
    const aux = arr[ind];

    arr[ind].after(arr[min]);
    arr[min].after(aux);
  }
};

const sortProductsByOrder = (sortOrder) => {
  const productItems = document.getElementsByClassName('productItem');
  
  for (let indexA = 0; indexA < productItems.length - 1; indexA += 1) {
    let minElement = indexA;

    for (let indexB = indexA + 1; indexB < productItems.length; indexB += 1) {
      minElement = updateMinElement(sortOrder, minElement, productItems, indexB);
    }

    sortProduct(productItems, indexA, minElement);
  }
};

const sortOrderEvent = async ({ currentTarget }) => {
  getActiveSortOrderElement().classList.toggle('activeOption');
  currentTarget.classList.toggle('activeOption');
  
  sortProductsByOrder(currentTarget.classList.item(0));
};

// end selectionSort algorithm

const toggleDisableCartItems = (attribute, attributeAction) => {
  Array.from(addToCartBtnElements).forEach((ele) => {
    if (attributeAction === 'set') ele.setAttribute(attribute, null);
    if (attributeAction === 'remove') ele.removeAttribute(attribute);
  });
};

const clearCart = () => {
  animateCartItems();
  toggleDisableCartItems('disabled', 'set');

  setTimeout(() => {
    emptyContainer(cartItemsContainer);
    handleActions();
    toggleDisableCartItems('disabled', 'remove');
  }, cartItemAnimationDelay);
};

const animateClearCart = () => {
  Array.from(cartElements).forEach((ele) => {
    const cartItem = ele.querySelector('.itemInfoContainer');
    cartItem.classList.toggle('animateCartItem');
    cartItem.querySelector('.itemRemovalIcon').classList.toggle('animateRemovalIcon');
  });
};

const loadAndSortProducts = async (productQuery = 'computador') => {
  await appendProductItems(productQuery);
  sortProductsByOrder(getActiveSortOrderElement().classList.item(0));
};

const sideBarToggle = () => {
  const sideBarElements = document.getElementsByClassName('sideBar');

  Array.from(sideBarElements).forEach((ele) => {
    ele.classList.toggle('showSideBar');
  });
};

const addEventListenerToMultipleElements = (eleContainer, eleClass, eventType, eventCallback) => {
  const elements = eleContainer.querySelectorAll(eleClass);

  elements.forEach((ele) => {
    ele.addEventListener(eventType, eventCallback);
  });
};

const addSearchEventListeners = () => {
  searchBtnElement.addEventListener('click', () => {
    emptyContainer(productsContainer);
    loadAndSortProducts(searchQueryElement.value);
  });

  searchQueryElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchBtnElement.click();
    }
  });
};

const addCartEventListeners = () => {
  emptyCartBtnElement.addEventListener('click', clearCart);
  emptyCartBtnElement.addEventListener('mouseenter', animateClearCart);
  emptyCartBtnElement.addEventListener('mouseleave', animateClearCart);
};

const addEventListeners = () => {
  addEventListenerToMultipleElements(document, '.itemInfoContainer', 'click', cartItemClickListener);
  addEventListenerToMultipleElements(document, '.sortOrder', 'click', sortOrderEvent);
  addEventListenerToMultipleElements(headerElement, '.sideBar', 'click', sideBarToggle);
  addEventListenerToMultipleElements(document, '.addQuantity', 'click', changeQuantity);
  addEventListenerToMultipleElements(document, '.subQuantity', 'click', changeQuantity);
  addSearchEventListeners();
  addCartEventListeners();
};

window.onload = async () => {
  loadAndSortProducts();
  handleActions('load');
  addEventListeners();
};
