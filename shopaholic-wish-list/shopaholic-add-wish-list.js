/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicAddWishList {
  constructor() {
    this.sDefaultButtonClass = '_shopaholic-add-wish-list-button';
    this.sButtonSelector = `.${this.sDefaultButtonClass}`;

    this.sDefaultWrapperClass = '_shopaholic-product-wrapper';
    this.sWrapperSelector = `.${this.sDefaultWrapperClass}`;
    this.sAttributeName = 'data-product-id';

    this.sComponentMethod = 'ProductList::onAddToWishList';
    this.obAjaxRequestCallback = null;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.currentTarget;
      const buttonNode = eventNode.closest(obThis.sButtonSelector);
      const productWrapperNode = eventNode.closest(obThis.sWrapperSelector);
      if (!buttonNode || !productWrapperNode) {
        return;
      }

      const iProductID = productWrapperNode.getAttribute(obThis.sAttributeName);
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

    oc.ajax(this.sComponentMethod, obRequestData);
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
   * @param {string} sSelector
   * @returns {ShopaholicAddWishList}
   */
  setButtonSelector(sSelector) {
    this.sButtonSelector = sSelector;

    return this;
  }
}
