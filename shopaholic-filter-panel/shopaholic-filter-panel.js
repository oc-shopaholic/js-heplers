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
    this.eventType = 'change';
    this.fieldName = 'property';
    this.filterType = 'data-filter-type';
    this.propertyIDAttribute = 'data-property-id';

    this.defaultWrapperClass = '_shopaholic-filter-wrapper';
    this.wrapperSelector = `.${this.defaultWrapperClass}`;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.eventType, (event) => {
      const eventNode = event.target;
      const inputNode = eventNode.closest(obThis.wrapperSelector);
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
    const filterNodeList = document.querySelectorAll(this.wrapperSelector);
    if (filterNodeList.length === 0) {
      return;
    }

    const obThis = this;
    filterNodeList.forEach((filterNode) => {
      //Get filter type
      const filterType = filterNode.getAttribute(obThis.filterType);
      const propertyID = filterNode.getAttribute(obThis.propertyIDAttribute);

      let fieldName = `${this.fieldName}`;
      if (!filterType) {
        return;
      }

      if (propertyID) {
        fieldName += `[${propertyID}]`;
      }

      let inputNodeList = null;
      let valueList = [];

      if (filterType === 'between') {
        inputNodeList = filterNode.querySelectorAll('input');
      } else if (filterType === 'checkbox' || filterType === 'switch') {
        inputNodeList = filterNode.querySelectorAll('input[type="checkbox"]:checked');
      } else if (filterType === 'select' || filterType === 'select_between') {
        inputNodeList = filterNode.querySelectorAll('select');
      } else if (filterType === 'radio') {
        inputNodeList = filterNode.querySelectorAll('input[type="radio"]:checked');
      }

      if (!inputNodeList || inputNodeList.length === 0) {
        UrlGeneration.remove(fieldName);

        return;
      }

      inputNodeList.forEach((inputNode) => {
        const inputValue = inputNode.value;
        if (!inputValue && filterType !== 'between') {
          return;
        }

        valueList.push(inputValue);
      });

      if (!valueList || valueList.length === 0) {
        UrlGeneration.remove(fieldName);
      } else {
        UrlGeneration.set(fieldName, valueList);
      }
    });
  }

  /**
   * Redeclare default selector of filter input
   * Default value is "_shopaholic-filter-wrapper"
   *
   * @param {string} wrapperSelector
   * @returns {ShopaholicFilterPanel}
   */
  setWrapperSelector(wrapperSelector) {
    this.wrapperSelector = wrapperSelector;

    return this;
  }

  /**
   * Redeclare default event type
   * Default value is "change"
   *
   * @param {string} eventType
   * @returns {ShopaholicFilterPanel}
   */
  setEventType(eventType) {
    this.eventType = eventType;

    return this;
  }

  /**
   * Redeclare default URL filed name
   * Default value is "property"
   *
   * @param {string} fieldName
   * @returns {ShopaholicFilterPanel}
   */
  setFieldName(fieldName) {
    this.fieldName = fieldName;

    return this;
  }
}
