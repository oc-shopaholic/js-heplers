/**
 * @author  Andrei Kharanenka, <a.kharanenka@lovata.com>, LOVATA Group
 */
import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";

export default class ShopaholicCart {
  constructor() {
    /* Selectors */
    this.offerItemType = 'Lovata\\Shopaholic\\Models\\Offer';

    /* Params */
    this.componentHandler = 'Cart::onGetData';
    this.iRadix = 10;

    this.wrapperNodeClass = '_shopaholic-cart';
    this.oldPriceNodeClass = '_shopaholic-old-price';
    this.hideOldPriceClass = '_shopaholic-hide-old-price';
    this.groupAttributeName = 'data-group';
    this.fieldAttributeName = 'data-field';

    this.obCartData = null;
  }

  /**
   * Init singleton object of ShopaholicCart
   * @returns {ShopaholicCart}
   */
  static instance() {
    if (window.ShopaholicCart === undefined) {
      window.ShopaholicCart = new ShopaholicCart();
      window.ShopaholicCart.init();
    }

    return window.ShopaholicCart;
  }

  /**
   * Init cart data object if it is empty
   */
  init() {
    if (this.obCartData !== null) {
      return;
    }

    const obThis = this;
    oc.ajax(this.componentHandler, {
      complete: ({responseJSON}) => {
        obThis.obCartData = responseJSON;
        obThis.dispatchUpdateEvent();
      },
    });
  }

  dispatchUpdateEvent() {
    document.dispatchEvent(new CustomEvent('shopaholic-cart:update', {
      detail: {
        cart: this.obCartData,
      }
    }));
  }

  /**
   * Update cart data object
   * @param {object} obCartData
   */
  updateCartData(obCartData) {
    this.obCartData = obCartData;
    this.dispatchUpdateEvent();
  }

  /**
   * Get offer quantity from cart object
   * @param {int} iOfferID
   * @param {object} obOfferProperty
   */
  getOfferQuantity(iOfferID, obOfferProperty) {
    const obCartPosition = this.findCartPositionByOfferID(iOfferID, this.offerItemType, obOfferProperty);
    const iQuantity = obCartPosition ? obCartPosition.quantity : 0;

    return parseInt(iQuantity, this.iRadix);
  }

  /**
   * Get field value from cart position object
   * @param {int} iPositionID
   * @param {string} sField
   */
  getOfferPositionField(iPositionID, sField) {
    const obCartPosition = this.findCartPositionByID(iPositionID);

    return obCartPosition && obCartPosition[sField] ? obCartPosition[sField] : null;
  }

  /**
   * Get field value from object
   * @param {string} sGroup
   * @param {string} sField
   */
  getField(sGroup, sField) {
    if (!!this.obCartData && !!this.obCartData[sGroup] && !!this.obCartData[sGroup][sField]) {
      return this.obCartData[sGroup][sField];
    }

    return null;
  }

  /**
   * Find cart position by item ID and type
   * @param {int} iItemID
   * @param {string} sItemType
   * @param {object} obOfferProperty
   */
  findCartPositionByOfferID(iItemID, sItemType, obOfferProperty) {
    iItemID = parseInt(iItemID, 10);
    if (!this.obCartData || !this.obCartData.position || !iItemID) {
      return null;
    }

    const obPositionList = this.obCartData.position;
    const arCartPositionIDList = Object.keys(obPositionList);
    for (let iKey of arCartPositionIDList) {
      let obPositionItem = obPositionList[iKey];
      if (obPositionItem.item_id !== iItemID || obPositionItem.item_type !== sItemType
        || JSON.stringify(obPositionItem.property) !== JSON.stringify(obOfferProperty)) {
        continue;
      }

      return obPositionItem;
    }

    return null;
  }

  /**
   * Find cart position by position ID
   * @param {int} iPositionID
   */
  findCartPositionByID(iPositionID) {
    iPositionID = parseInt(iPositionID, 10);
    if (!this.obCartData || !this.obCartData.position || !iPositionID) {
      return null;
    }

    const obPositionList = this.obCartData.position;

    return obPositionList && obPositionList[iPositionID] ? obPositionList[iPositionID] : null;
  }

  /**
   * Find price fields and update price values
   */
  renderPriceFields() {
    const obNodeList = document.querySelectorAll(`.${this.wrapperNodeClass}`);
    if (!obNodeList || obNodeList.length === 0) {
      return;
    }

    obNodeList.forEach((obPriceNode) => {
      const sGroupOriginal = obPriceNode.getAttribute(this.groupAttributeName);
      const sGroup = !!sGroupOriginal ? sGroupOriginal.replace(/-/g, '_').toLowerCase() : sGroupOriginal;
      const sFieldOriginal = obPriceNode.getAttribute(this.fieldAttributeName);
      const sField = !!sFieldOriginal? sFieldOriginal.replace(/-/g, '_').toLowerCase() : sFieldOriginal;
      let sNewValue = '';

      if (sGroup === 'position') {
        const obCartPosition = new ShopaholicCartPosition(obPriceNode);
        const iPositionID = obCartPosition.getPositionID();
        sNewValue = this.getOfferPositionField(iPositionID, sField);

        obPriceNode.textContent = sNewValue;
        this.processPositionOldPriceField(obCartPosition, sField, sFieldOriginal, sGroupOriginal);
      } else {
        sNewValue = this.getField(sGroup, sField);

        obPriceNode.textContent = sNewValue;
        this.processOldPriceField(sField, sFieldOriginal, sGroup, sGroupOriginal);
      }

    });
  }

  /**
   * Process old price field of position
   * @param {ShopaholicCartPosition} obCartPosition
   * @param {string} sField
   * @param {string} sFieldOriginal
   * @param {string} sGroupOriginal
   */
  processPositionOldPriceField(obCartPosition, sField, sFieldOriginal, sGroupOriginal) {
    if (sField.indexOf('old_price') < 0) {
      return;
    }

    const iPositionID = obCartPosition.getPositionID();
    const obCartNode = obCartPosition.getWrapperNode();
    const obOldPriceNodeList = obCartNode.querySelectorAll(`.${this.oldPriceNodeClass}[data-group="${sGroupOriginal}"][data-field="${sFieldOriginal}"]`);
    if (!obOldPriceNodeList || obOldPriceNodeList.length === 0) {
      return;
    }

    const fDiscountPrice = this.getOfferPositionField(iPositionID, sField.replace(/old_price/g, 'discount_price') + '_value');

    obOldPriceNodeList.forEach((obOldPriceNode) => {
      if (fDiscountPrice > 0) {
        obOldPriceNode.classList.remove(this.hideOldPriceClass);
      } else {
        obOldPriceNode.classList.add(this.hideOldPriceClass);
      }
    });
  }

  /**
   * Process old price field
   * @param {string} sField
   * @param {string} sFieldOriginal
   * @param {string} sGroup
   * @param {string} sGroupOriginal
   */
  processOldPriceField(sField, sFieldOriginal, sGroup, sGroupOriginal) {
    if (sField.indexOf('old_price') < 0) {
      return;
    }

    const obOldPriceNodeList = document.querySelectorAll(`.${this.oldPriceNodeClass}[data-group="${sGroupOriginal}"][data-field="${sFieldOriginal}"]`);
    if (!obOldPriceNodeList || obOldPriceNodeList.length === 0) {
      return;
    }

    const fDiscountPrice = this.getField(sGroup, sField.replace(/old_price/g, 'discount_price') + '_value');

    obOldPriceNodeList.forEach((obOldPriceNode) => {
      if (fDiscountPrice > 0) {
        obOldPriceNode.classList.remove(this.hideOldPriceClass);
      } else {
        obOldPriceNode.classList.add(this.hideOldPriceClass);
      }
    });
  }
}
