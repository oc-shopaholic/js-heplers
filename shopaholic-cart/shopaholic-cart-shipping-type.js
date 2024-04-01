import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartShippingType {
  constructor() {
    this.obAjaxRequestCallback = null;
    this.iRadix = 10;

    this.componentMethod = 'Cart::onSetShippingType';

    ShopaholicCart.instance();
  }

  /**
  * Init event handlers
  */
  init() {
    const obThis = this;
    document.addEventListener('change', (event) => {
      const eventNode = event.target;
      const inputNode = eventNode.closest('[name="shipping_type_id"]');
      if (!inputNode) {
        return;
      }

      obThis.sendAjaxRequest(inputNode);
    });
  }

  /**
   * Send ajax request and update prices with new shipping-type-id
   */
  sendAjaxRequest(obInput) {
    const obThis = this;
    let obRequestData = {
      data: {
        'shipping_type_id': this.getShippingTypeID(),
      },
      complete: (response) => {
        obThis.completeCallback(response);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obInput);
    }

    oc.ajax(this.componentMethod, obRequestData);
  }

  /**
   * Get active shipping type
   * @returns {null|number}
   */
  getShippingTypeID() {
    let inputNode = document.querySelector('[name="shipping_type_id"]');
    if (this.isRadioInput(inputNode)) {
      inputNode = document.querySelector('[name="shipping_type_id"]:checked');
    }

    if (!inputNode) {
      return null;
    }

    return parseInt(inputNode.value, this.iRadix);
  }

  /**
   * Returns true, if input type is "radio"
   */
  isRadioInput(inputNode) {
    return inputNode && inputNode.type === 'radio';
  }

  /**
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
   * @returns {ShopaholicCartShippingType}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
