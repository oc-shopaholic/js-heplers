import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartUpdate {
  constructor() {
    this.defaultInputClass = '_shopaholic-cart-quantity';
    this.increaseInputClass = '_shopaholic-cart-increase-quantity';
    this.decreaseInputClass = '_shopaholic-cart-decrease-quantity';
    this.updateComponentMethod = 'Cart::onUpdate';
    this.obAjaxRequestCallback = null;

    this.delayBeforeRequest = 400;
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
      const inputNode = eventNode.closest(`.${obThis.defaultInputClass}`);
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

        if (!inputNode.dataset.blockRequest !== 'enable') {
          obThis.sendAjaxRequest(inputNode);
        }
      }, obThis.delayBeforeRequest);
    });
  }

  /**
   * Init increase event
   */
  initIncreaseEvent() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.increaseInputClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      if (obThis.obTimer !== null) {
        clearTimeout(obThis.obTimer);
      }

      const obCartPosition = new ShopaholicCartPosition(buttonNode);
      const inputNode = obCartPosition.getQuantityInput();
      const iMaxQuantity = obThis.getMaxQuantity(inputNode);
      let iQuantity = obThis.getQuantity(inputNode) + 1;
      if (iQuantity > iMaxQuantity) {
        return;
      }

      inputNode.value = iQuantity;
      if (iQuantity === iMaxQuantity) {
        buttonNode.setAttribute('disabled', 'disabled');
      } else {
        buttonNode.removeAttribute('disabled');
      }

      if (iQuantity > 1) {
        const obCartNode = obCartPosition.getWrapperNode();
        const decreaseButtonNode = obCartNode.querySelector(`.${obThis.decreaseInputClass}`);
        if (decreaseButtonNode) {
          decreaseButtonNode.removeAttribute('disabled');
        }
      }

      obThis.obTimer = setTimeout(() => {
        if (buttonNode.dataset.blockRequest !== 'enable') {
          obThis.sendAjaxRequest(inputNode);
        }
      }, obThis.delayBeforeRequest);
    });
  }

  /**
   * Init decrease event
   */
  initDecreaseEvent() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.decreaseInputClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      if (obThis.obTimer !== null) {
        clearTimeout(obThis.obTimer);
      }

      const obCartPosition = new ShopaholicCartPosition(buttonNode);
      const inputNode = obCartPosition.getQuantityInput();
      const iMaxQuantity = obThis.getMaxQuantity(inputNode);
      let iQuantity = obThis.getQuantity(inputNode) - 1;
      if (iQuantity < 1) {
        return;
      }

      inputNode.value = iQuantity;
      if (iQuantity === 1) {
        buttonNode.setAttribute('disabled', 'disabled');
      } else {
        buttonNode.removeAttribute('disabled');
      }

      if (iQuantity < iMaxQuantity) {
        const obCartNode = obCartPosition.getWrapperNode();
        const increaseButtonNode = obCartNode.querySelector(`.${obThis.increaseInputClass}`);
        if (increaseButtonNode) {
          increaseButtonNode.removeAttribute('disabled');
        }
      }

      obThis.obTimer = setTimeout(() => {
        if (buttonNode.dataset.blockRequest !== 'enable') {
          obThis.sendAjaxRequest(inputNode);
        }
      }, obThis.delayBeforeRequest);
    });
  }

  /**
   * Update position data
   * @param {node} inputNode
   */
  sendAjaxRequest(inputNode) {
    if (!inputNode) {
      throw new Error('Input node is empty.');
    }

    const obCartPosition = new ShopaholicCartPosition(inputNode);
    let obPositionData = obCartPosition.getData();
    const obShippingType = new ShopaholicCartShippingType();

    const obThis = this;
    let obRequestData = {
      data: {
        cart: [obPositionData],
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: (response) => {
        obThis.completeCallback(response);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, inputNode);
    }

    oc.ajax(this.updateComponentMethod, obRequestData);
  }

  getQuantity(inputNode) {
    return parseInt(inputNode.value, this.iRadix);
  }

  /**
   * Get offer quantity from cart object
   */
  getMaxQuantity(inputNode) {
    return parseInt(inputNode.getAttribute('max'), this.iRadix);
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
