/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicClearWishList {
  constructor() {
    this.defaultButtonClass = '_shopaholic-clear-wish-list-button';
    this.buttonSelector = `.${this.defaultButtonClass}`;

    this.componentMethod = 'ProductList::onClearWishList';
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
      if (!buttonNode) {
        return;
      }

      obThis.sendAjaxRequest(buttonNode);
    });
  }

  /**
   * Clear wish list
   * @param obButton
   */
  sendAjaxRequest(obButton) {
    let obRequestData = {};

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obButton);
    }

    oc.ajax(this.componentMethod, obRequestData);
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicClearWishList}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }

  /**
   * Redeclare default selector of "Clear wish list" button
   * Default value is ._shopaholic-clear-wish-list-button
   *
   * @param {string} selector
   * @returns {ShopaholicClearWishList}
   */
  setButtonSelector(selector) {
    this.buttonSelector = selector;

    return this;
  }
}
