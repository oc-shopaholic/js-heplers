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
    this.sEventType = 'click';
    this.sFiledName = 'page';
    this.sAttributeName = 'data-page';

    this.sDefaultButtonClass = '_shopaholic-pagination';
    this.sButtonSelector = `.${this.sDefaultButtonClass}`;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.sEventType, (event) => {
      const eventNode = event.currentTarget;
      const buttonNode = eventNode.closest(obThis.sButtonSelector);
      if (!buttonNode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const iPage = buttonNode.getAttribute(obThis.sAttributeName);
      UrlGeneration.init();

      if (iPage === 1) {
        UrlGeneration.remove(obThis.sFiledName);
      } else {
        UrlGeneration.set(obThis.sFiledName, iPage);
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
   * @param {string} sButtonSelector
   * @returns {ShopaholicPagination}
   */
  setButtonSelector(sButtonSelector) {
    this.sButtonSelector = sButtonSelector;

    return this;
  }
}
