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
    this.sEventType = 'change';
    this.sFiledName = 'price';

    this.sInputMinPriceName = 'filter-min-price';
    this.sInputMaxPriceName = 'filter-max-price';

    this.sDefaultInputClass = '_shopaholic-price-filter';
    this.sInputSelector = `.${this.sDefaultInputClass}`;

    this.iCallBackDelay = 400;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener(this.sEventType, (event) => {
      const eventNode = event.currentTarget;
      const inputNode = eventNode.closest(obThis.sInputSelector);
      if (!inputNode) {
        return;
      }

      if (obThis.sEventType === 'input') {
        clearTimeout(obThis.timer);

        obThis.timer = setTimeout(() => {
          obThis.priceChangeCallBack();
        }, obThis.iCallBackDelay);
      } else {
        obThis.priceChangeCallBack();
      }
    });

    document.addEventListener('input', (event) => {
      const eventNode = event.currentTarget;
      const inputNode = eventNode.closest(obThis.sInputSelector);
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
    const obInputNodeList = document.querySelectorAll(this.sInputSelector);
    if (obInputNodeList === 0) {
      return;
    }

    let fMinLimit = 0;
    let fMaxLimit = 0;
    let fMinPrice = 0;
    let fMaxPrice = 0;
    let obMinInput = null;
    let obMaxInput = null;
    const obThis = this;
    obInputNodeList.forEach((obInputNode) => {
      if (obInputNode.getAttribute('name') === obThis.sInputMinPriceName) {
        fMinLimit = parseFloat(obInputNode.getAttribute('min'));
        fMinPrice = obInputNode.value;
        obMinInput = obInputNode;
      } else if (obInputNode.getAttribute('name') === obThis.sInputMaxPriceName) {
        fMaxLimit = parseFloat(obInputNode.getAttribute('max'));
        fMaxPrice = obInputNode.value;
        obMaxInput = obInputNode;
      }
    });
    if (!obMinInput || !obMaxInput) {
      return;
    }

    if (fMinPrice > 0 && fMinPrice < fMinLimit) {
      fMinPrice = fMinLimit;
      obMinInput.value = fMinLimit;
    }

    if (fMaxPrice > 0 && fMaxPrice > fMaxLimit) {
      fMaxPrice = fMaxLimit;
      obMaxInput.value = fMaxLimit;
    }

    if (fMinPrice === 0 && fMaxPrice === 0) {
      UrlGeneration.remove(this.sFiledName);
    } else {
      UrlGeneration.set(this.sFiledName, [fMinPrice, fMaxPrice]);
    }
  }

  /**
   * Redeclare default selector of filter input
   * Default value is "_shopaholic-price-filter"
   *
   * @param {string} sInputSelector
   * @returns {ShopaholicFilterPrice}
   */
  setInputSelector(sInputSelector) {
    this.sInputSelector = sInputSelector;

    return this;
  }

  /**
   * Redeclare default event type
   * Default value is "change"
   *
   * @param {string} sEventType
   * @returns {ShopaholicFilterPrice}
   */
  setEventType(sEventType) {
    this.sEventType = sEventType;

    return this;
  }

  /**
   * Redeclare default input name with min price
   * Default value is "filter-min-price"
   *
   * @param {string} sInputName
   * @returns {ShopaholicFilterPrice}
   */
  setInputMinPriceName(sInputName) {
    this.sInputMinPriceName = sInputName;

    return this;
  }

  /**
   * Redeclare default input name with max price
   * Default value is "filter-max-price"
   *
   * @param {string} sInputName
   * @returns {ShopaholicFilterPrice}
   */
  setInputMaxPriceName(sInputName) {
    this.sInputMaxPriceName = sInputName;

    return this;
  }

  /**
   * Redeclare default URL filed name
   * Default value is "price"
   *
   * @param {string} sFieldName
   * @returns {ShopaholicFilterPrice}
   */
  setFieldName(sFieldName) {
    this.sFiledName = sFieldName;

    return this;
  }
}
