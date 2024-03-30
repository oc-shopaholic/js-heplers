import UrlGeneration from "@oc-shopaholic/url-generation";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicSorting {
  /**
   * @param {ShopaholicProductList} obProductListHelper
   */
  constructor(obProductListHelper = null) {
    this.obProductListHelper = obProductListHelper;
    this.eventType = 'change';
    this.filedName = 'sort';

    this.defaultSelectClass = '_shopaholic-sorting';
    this.selectSelector = `.${this.defaultSelectClass}`;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.eventType, (event) => {
      const eventNode = event.target;
      const selectNode = eventNode.closest(obThis.selectSelector);
      if (!selectNode) {
        return;
      }

      UrlGeneration.init();
      UrlGeneration.set(obThis.filedName, selectNode.value);
      UrlGeneration.update();
      if (!obThis.obProductListHelper) {
        return;
      }

      obThis.obProductListHelper.send();
    });
  }
}
