import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";

/**
 * @author  Andrei Kharanenka, <a.kharanenka@lovata.com>, LOVATA Group
 */
export default class ShopaholicCart {
  constructor() {
    /* Selectors */
    this.offerItemType = 'Lovata\\Shopaholic\\Models\\Offer';

    /* Params */
    this.componentHandler = 'Cart::onGetData';
    this.iRadix = 10;

    this.oldPriceNodeClass = '_shopaholic-old-price';
    this.hideOldPriceClass = 'hidden';

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
      complete: (response) => {
        obThis.obCartData = response;
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
    this.updateCartFields();
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

  updateCartFields() {
    const cartNodeList = document.querySelectorAll(`._shopaholic-cart`);
    if (!cartNodeList || cartNodeList.length === 0 || !this.obCartData) {
      return;
    }

    cartNodeList.forEach((cartNode) => {
      this.updateCartNode(cartNode);
    })
  }

  updateCartNode(cartNode) {
    const fieldPath = cartNode.dataset.field;
    if (!fieldPath) {
      return;
    }

    const fieldContent = this.getFieldContent(this.obCartData, fieldPath);
    cartNode.innerHTML = fieldContent;

    const oldPriceNode = cartNode.closest(`.${this.oldPriceNodeClass}`);
    if (!oldPriceNode) {
      return;
    }

    let discountField = fieldPath.replace(/old_price/g, 'discount_price');
    discountField = `${discountField}_value`;
    const discountValue = this.getFieldContent(this.obCartData, discountField);
    if (discountValue > 0) {
      oldPriceNode.classList.remove(this.hideOldPriceClass);
    } else {
      oldPriceNode.classList.add(this.hideOldPriceClass);
    }
  }

  getFieldContent (target, field, defaultValue = null) {
    let value = defaultValue;
    if (!target || !field) {
      return value;
    }

    // Try to get value from inner object via dot delimiter
    const delimiterPosition = field.indexOf('.');
    if (delimiterPosition !== -1) {
      // Try to get target field
      let targetField = field.substring(0, delimiterPosition);

      // Check: targetField contains condition or not
      let conditionValue = null;
      const newFieldName = field.substring(delimiterPosition + 1);
      const conditionPosition = targetField.indexOf('=');
      if (conditionPosition !== -1) {
        conditionValue = targetField.substring(conditionPosition + 1);
        targetField = targetField.substring(0, conditionPosition);
      }

      let newTarget = target[targetField];
      if (!newTarget && conditionValue !== null) {
        target = !Array.isArray(target) ? Object.values(target) : target;
        newTarget = target.find((rowData) => {
          return rowData[targetField] == conditionValue;
        })
      }

      return this.getFieldContent(newTarget, newFieldName, value);
    } else if (target.hasOwnProperty(field)) {
      value = target[field];
    }

    return value;
  }
}
