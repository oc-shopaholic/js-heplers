/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicAddWishList {
  constructor() {
    this.defaultButtonClass = '_shopaholic-add-wish-list-button';
    this.buttonSelector = `.${this.defaultButtonClass}`;

    this.defaultWrapperClass = '_shopaholic-product-wrapper';
    this.wrapperSelector = `.${this.defaultWrapperClass}`;
    this.attributeName = 'data-product-id';

    this.componentMethod = 'ProductList::onAddToWishList';
    this.obAjaxRequestCallback = null;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(obThis.buttonSelector);
      const productWrapperNode = eventNode.closest(obThis.wrapperSelector);
      if (!buttonNode || !productWrapperNode) {
        return;
      }

      const iProductID = productWrapperNode.getAttribute(obThis.attributeName);
      if (!iProductID) {
        return;
      }

      obThis.sendAjaxRequest(iProductID, buttonNode);
    });
  }

  /**
   * Add product to wish list
   * @param {int} iProductID
   * @param obButton
   */
  sendAjaxRequest(iProductID, obButton) {
    let obRequestData = {
      'data': {'product_id': iProductID}
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obButton);
    }

    oc.ajax(this.componentMethod, obRequestData);
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicAddWishList}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }

  /**
   * Redeclare default selector of "Add to wish list" button
   * Default value is ._shopaholic-add-wish-list-button
   *
   * @param {string} selector
   * @returns {ShopaholicAddWishList}
   */
  setButtonSelector(selector) {
    this.buttonSelector = selector;

    return this;
  }
}
