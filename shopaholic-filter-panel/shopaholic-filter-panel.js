import UrlGeneration from "@oc-shopaholic/url-generation";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicFilterPanel {
  /**
   * @param {ShopaholicProductList} obProductListHelper
   */
  constructor(obProductListHelper = null) {
    this.obProductListHelper = obProductListHelper;
    this.sEventType = 'change';
    this.sFiledName = 'property';
    this.sFilterType = 'data-filter-type';
    this.sPropertyIDAttribute = 'data-property-id';

    this.sDefaultWrapperClass = '_shopaholic-filter-wrapper';
    this.sWrapperSelector = `.${this.sDefaultWrapperClass}`;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.sEventType, (event) => {
      const eventNode = event.currentTarget;
      const inputNode = eventNode.closest(obThis.sWrapperSelector);
      if (!inputNode) {
        return;
      }

      UrlGeneration.init();
      obThis.prepareRequestData();

      UrlGeneration.remove('page');
      UrlGeneration.update();
      if (!obThis.obProductListHelper) {
        return;
      }

      obThis.obProductListHelper.send();
    });
  }

  prepareRequestData() {
    const obFilterNodeList = document.querySelectorAll(this.sWrapperSelector);
    if (obFilterNodeList.length === 0) {
      return;
    }

    const obThis = this;
    obFilterNodeList.forEach((obFilterNode) => {
      //Get filter type
      const sFilterType = obFilterNode.getAttribute(obThis.sFilterType);
      const iPropertyID = obFilterNode.getAttribute(obThis.sPropertyIDAttribute);

      let sFieldName = `${this.sFiledName}`;
      if (!sFilterType) {
        return;
      }

      if (iPropertyID) {
        sFieldName += `[${iPropertyID}]`;
      }

      let obInputNodeList = null;
      let arValueList = [];

      if (sFilterType === 'between') {
        obInputNodeList = obFilterNode.querySelectorAll('input');
      } else if (sFilterType === 'checkbox' || sFilterType === 'switch') {
        obInputNodeList = obFilterNode.querySelectorAll('input[type="checkbox"]:checked');
      } else if (sFilterType === 'select' || sFilterType === 'select_between') {
        obInputNodeList = obFilterNode.querySelectorAll('select');
      } else if (sFilterType === 'radio') {
        obInputNodeList = obFilterNode.querySelectorAll('input[type="radio"]:checked');
      }

      if (!obInputNodeList || obInputNodeList.length === 0) {
        UrlGeneration.remove(sFieldName);

        return;
      }

      obInputNodeList.forEach((obInputNode) => {
        const sValue = obInputNode.value;
        if (!sValue) {
          return;
        }

        arValueList.push(sValue);
      });

      if (!arValueList || arValueList.length === 0) {
        UrlGeneration.remove(sFieldName);
      } else {
        UrlGeneration.set(sFieldName, arValueList);
      }
    });
  }

  /**
   * Redeclare default selector of filter input
   * Default value is "_shopaholic-filter-wrapper"
   *
   * @param {string} sWrapperSelector
   * @returns {ShopaholicFilterPanel}
   */
  setWrapperSelector(sWrapperSelector) {
    this.sWrapperSelector = sWrapperSelector;

    return this;
  }

  /**
   * Redeclare default event type
   * Default value is "change"
   *
   * @param {string} sEventType
   * @returns {ShopaholicFilterPanel}
   */
  setEventType(sEventType) {
    this.sEventType = sEventType;

    return this;
  }

  /**
   * Redeclare default URL filed name
   * Default value is "property"
   *
   * @param {string} sFieldName
   * @returns {ShopaholicFilterPanel}
   */
  setFieldName(sFieldName) {
    this.sFiledName = sFieldName;

    return this;
  }
}
