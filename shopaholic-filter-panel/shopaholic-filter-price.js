import UrlGeneration from "@oc-shopaholic/url-generation";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicFilterPrice {
  /**
   * @param {ShopaholicProductList} obProductListHelper
   */
  constructor(obProductListHelper = null) {
    this.obProductListHelper = obProductListHelper;
    this.eventType = 'input';
    this.filedName = 'price';

    this.inputMinPriceName = 'filter-min-price';
    this.inputMaxPriceName = 'filter-max-price';

    this.defaultInputClass = '_shopaholic-price-filter';
    this.inputSelector = `.${this.defaultInputClass}`;

    this.callBackDelay = 400;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.eventType, (event) => {
      const eventNode = event.target;
      const inputNode = eventNode.closest(obThis.inputSelector);
      if (!inputNode) {
        return;
      }

      if (obThis.eventType === 'input') {
        clearTimeout(obThis.timer);

        obThis.timer = setTimeout(() => {
          obThis.priceChangeCallBack();
        }, obThis.callBackDelay);
      } else {
        obThis.priceChangeCallBack();
      }
    });

    document.addEventListener('input', (event) => {
      const eventNode = event.target;
      const inputNode = eventNode.closest(obThis.inputSelector);
      if (!inputNode) {
        return;
      }

      inputNode.value = inputNode.value.replace(/[^\d.]/g, '');
    });
  }

  priceChangeCallBack() {
    UrlGeneration.init();
    this.prepareRequestData();

    UrlGeneration.remove('page');
    UrlGeneration.update();
    if (!this.obProductListHelper) {
      return;
    }

    this.obProductListHelper.send();
  }

  prepareRequestData() {
    // Get min price from filter input
    const inputNodeList = document.querySelectorAll(this.inputSelector);
    if (inputNodeList === 0) {
      return;
    }

    let fMinLimit = 0;
    let fMaxLimit = 0;
    let fMinPrice = null;
    let fMaxPrice = null;
    let minInputNode = null;
    let maxInputNode = null;
    const obThis = this;
    inputNodeList.forEach((inputNode) => {
      if (inputNode.getAttribute('name') === obThis.inputMinPriceName) {
        fMinLimit = parseFloat(inputNode.getAttribute('min'));
        fMinPrice = inputNode.value ? parseFloat(inputNode.value) : null;
        minInputNode = inputNode;
      } else if (inputNode.getAttribute('name') === obThis.inputMaxPriceName) {
        fMaxLimit = parseFloat(inputNode.getAttribute('max'));
        fMaxPrice = inputNode.value ? parseFloat(inputNode.value) : null;
        maxInputNode = inputNode;
      }
    });
    if (!minInputNode || !maxInputNode) {
      return;
    }

    if (fMinPrice > 0 && fMinPrice < fMinLimit) {
      fMinPrice = fMinLimit;
      minInputNode.value = fMinLimit;
    }

    if (fMaxPrice > 0 && fMaxPrice > fMaxLimit) {
      fMaxPrice = fMaxLimit;
      maxInputNode.value = fMaxLimit;
    }

    if (fMinPrice === 0 && fMaxPrice === 0) {
      UrlGeneration.remove(this.filedName);
    } else {
      UrlGeneration.set(this.filedName, [fMinPrice, fMaxPrice]);
    }
  }

  /**
   * Redeclare default selector of filter input
   * Default value is "_shopaholic-price-filter"
   *
   * @param {string} inputSelector
   * @returns {ShopaholicFilterPrice}
   */
  setInputSelector(inputSelector) {
    this.inputSelector = inputSelector;

    return this;
  }

  /**
   * Redeclare default event type
   * Default value is "change"
   *
   * @param {string} eventType
   * @returns {ShopaholicFilterPrice}
   */
  setEventType(eventType) {
    this.eventType = eventType;

    return this;
  }

  /**
   * Redeclare default input name with min price
   * Default value is "filter-min-price"
   *
   * @param {string} inputName
   * @returns {ShopaholicFilterPrice}
   */
  setInputMinPriceName(inputName) {
    this.inputMinPriceName = inputName;

    return this;
  }

  /**
   * Redeclare default input name with max price
   * Default value is "filter-max-price"
   *
   * @param {string} inputName
   * @returns {ShopaholicFilterPrice}
   */
  setInputMaxPriceName(inputName) {
    this.inputMaxPriceName = inputName;

    return this;
  }

  /**
   * Redeclare default URL filed name
   * Default value is "price"
   *
   * @param {string} fieldName
   * @returns {ShopaholicFilterPrice}
   */
  setFieldName(fieldName) {
    this.filedName = fieldName;

    return this;
  }
}
