import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Uladzimir Ambrazhey, <v.ambrazhey@oc-shopaholic.com>, LOVATA Group
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartUpdate {
  constructor() {
    this.sDefaultInputClass = '_shopaholic-cart-quantity';
    this.sIncreaseInputClass = '_shopaholic-cart-increase-quantity';
    this.sDecreaseInputClass = '_shopaholic-cart-decrease-quantity';
    this.sUpdateComponentMethod = 'Cart::onUpdate';
    this.obAjaxRequestCallback = null;

    this.iDelayBeforeRequest = 400;
    this.obTimer = null;

    ShopaholicCart.instance();
  }

  /**
  * Init event handlers
  */
  init() {
    this.initUpdateEvent();
    this.initIncreaseEvent();
    this.initDecreaseEvent();
  }

  /**
   * Init update event
   */
  initUpdateEvent() {
    const obThis = this;
    document.addEventListener('input', (event) => {
      const eventNode = event.target;
      const inputNode = eventNode.closest(`.${obThis.sDefaultInputClass}`);
      if (!inputNode) {
        return;
      }

      if (obThis.obTimer !== null) {
        clearTimeout(obThis.obTimer);
      }

      obThis.obTimer = setTimeout(() => {
        const iMaxQuantity = obThis.getMaxQuantity(inputNode);
        let iQuantity = obThis.getQuantity(inputNode);
        if (iQuantity < 1) {
          iQuantity = 1;
        }

        if (iQuantity > iMaxQuantity) {
          inputNode.value = iMaxQuantity;
          return;
        }

        obThis.sendAjaxRequest(inputNode);
      }, obThis.iDelayBeforeRequest);
    });
  }

  /**
   * Init increase event
   */
  initIncreaseEvent() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.sIncreaseInputClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      if (obThis.obTimer !== null) {
        clearTimeout(obThis.obTimer);
      }

      const obCartPosition = new ShopaholicCartPosition(buttonNode);
      const obInput = obCartPosition.getQuantityInput();
      const iMaxQuantity = obThis.getMaxQuantity(obInput);
      let iQuantity = obThis.getQuantity(obInput) + 1;
      if (iQuantity > iMaxQuantity) {
        return;
      }

      obInput.value = iQuantity;
      if (iQuantity === iMaxQuantity) {
        buttonNode.setAttribute('disabled', 'disabled');
      } else {
        buttonNode.removeAttribute('disabled');
      }

      if (iQuantity > 1) {
        const obCartNode = obCartPosition.getNode();
        const obDecreaseButton = obCartNode.querySelector(`.${obThis.sDecreaseInputClass}`);
        if (obDecreaseButton) {
          obDecreaseButton.removeAttribute('disabled');
        }
      }

      obThis.obTimer = setTimeout(() => {
        obThis.sendAjaxRequest(obInput);
      }, obThis.iDelayBeforeRequest);
    });
  }

  /**
   * Init decrease event
   */
  initDecreaseEvent() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.sDecreaseInputClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      if (obThis.obTimer !== null) {
        clearTimeout(obThis.obTimer);
      }

      const obCartPosition = new ShopaholicCartPosition(buttonNode);
      const obInput = obCartPosition.getQuantityInput();
      const iMaxQuantity = obThis.getMaxQuantity(obInput);
      let iQuantity = obThis.getQuantity(obInput) - 1;
      if (iQuantity < 1) {
        return;
      }

      obInput.value = iQuantity;
      if (iQuantity === 1) {
        buttonNode.setAttribute('disabled', 'disabled');
      } else {
        buttonNode.removeAttribute('disabled');
      }

      if (iQuantity < iMaxQuantity) {
        const obCartNode = obCartPosition.getNode();
        const obIncreaseButton = obCartNode.querySelector(`.${obThis.sIncreaseInputClass}`);
        if (obIncreaseButton) {
          obIncreaseButton.removeAttribute('disabled');
        }
      }

      obThis.obTimer = setTimeout(() => {
        obThis.sendAjaxRequest(obInput);
      }, obThis.iDelayBeforeRequest);
    });
  }

  /**
   * Update position data
   * @param {node} obInput
   */
  sendAjaxRequest(obInput) {
    if (!obInput) {
      throw new Error('Input node is empty.');
    }

    const obCartPosition = new ShopaholicCartPosition(obInput);
    let obPositionData = obCartPosition.getData();
    const obShippingType = new ShopaholicCartShippingType();

    let obRequestData = {
      data: {
        cart: [obPositionData],
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: ({responseJSON}) => {
        this.completeCallback(responseJSON);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obInput);
    }

    oc.ajax(this.sUpdateComponentMethod, obRequestData);
  }

  getQuantity(obInput) {
    return parseInt(obInput.value, this.iRadix);
  }

  /**
   * Get offer quantity from cart object
   */
  getMaxQuantity(obInput) {
    return parseInt(obInput.getAttribute('max'), this.iRadix);
  }

  /**
   * Remove disabled attribute from button
   * Update cart data in ShopaholicCart object
   */
  completeCallback(obResponse) {
    const {data: obCartData} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicCartUpdate}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
