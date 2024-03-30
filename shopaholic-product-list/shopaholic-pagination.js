import UrlGeneration from "@oc-shopaholic/url-generation";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicPagination {
  /**
   * @param {ShopaholicProductList} obProductListHelper
   */
  constructor(obProductListHelper = null) {
    this.obProductListHelper = obProductListHelper;
    this.eventType = 'click';
    this.filedName = 'page';
    this.attributeName = 'data-page';

    this.defaultButtonClass = '_shopaholic-pagination';
    this.buttonSelector = `.${this.defaultButtonClass}`;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.eventType, (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(obThis.buttonSelector);
      if (!buttonNode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const iPage = buttonNode.getAttribute(obThis.attributeName);
      UrlGeneration.init();

      if (iPage === 1) {
        UrlGeneration.remove(obThis.filedName);
      } else {
        UrlGeneration.set(obThis.filedName, iPage);
      }

      UrlGeneration.update();
      if (!obThis.obProductListHelper) {
        return;
      }

      obThis.obProductListHelper.send();
    });
  }

  /**
   * Redeclare default selector of pagination button
   * Default value is "_shopaholic-pagination"
   *
   * @param {string} buttonSelector
   * @returns {ShopaholicPagination}
   */
  setButtonSelector(buttonSelector) {
    this.buttonSelector = buttonSelector;

    return this;
  }
}
