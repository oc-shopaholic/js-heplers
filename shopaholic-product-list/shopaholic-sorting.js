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
    this.sEventType = 'change';
    this.sFiledName = 'sort';

    this.sDefaultSelectClass = '_shopaholic-sorting';
    this.sSelectSelector = `.${this.sDefaultSelectClass}`;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.sEventType, (event) => {
      const eventNode = event.target;
      const selectNode = eventNode.closest(obThis.sSelectSelector);
      if (!selectNode) {
        return;
      }

      UrlGeneration.init();
      UrlGeneration.set(obThis.sFiledName, selectNode.value);
      UrlGeneration.update();
      if (!obThis.obProductListHelper) {
        return;
      }

      obThis.obProductListHelper.send();
    });
  }
}
