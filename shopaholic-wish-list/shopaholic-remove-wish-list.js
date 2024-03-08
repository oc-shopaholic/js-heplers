/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicRemoveWishList {
  constructor() {
    this.defaultButtonClass = '_shopaholic-remove-wish-list-button';
    this.buttonSelector = `.${this.defaultButtonClass}`;

    this.defaultWrapperClass = '_shopaholic-product-wrapper';
    this.wrapperSelector = `.${this.defaultWrapperClass}`;
    this.attributeName = 'data-product-id';

    this.componentMethod = 'ProductList::onRemoveFromWishList';
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
   * Remove product from wish list
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
   * @returns {ShopaholicRemoveWishList}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }

  /**
   * Redeclare default selector of "Remove from wish list" button
   * Default value is ._shopaholic-remove-wish-list-button
   *
   * @param {string} selector
   * @returns {ShopaholicRemoveWishList}
   */
  setButtonSelector(selector) {
    this.buttonSelector = selector;

    return this;
  }
}
