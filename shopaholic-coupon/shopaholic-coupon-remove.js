import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Uladzimir Ambrazhey, <v.ambrazhey@oc-shopaholic.com>, LOVATA Group
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCouponRemove {
  constructor() {
    this.buttonClass = '_shopaholic-coupon-remove';
    this.componentMethod = 'Cart::onRemoveCoupon';

    this.obAjaxRequestCallback = null;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.buttonClass}`);
      const inputNode = document.querySelector('[data-coupon]');
      if (!buttonNode || !buttonNode.hasAttributes('disabled') || !inputNode) {
        return;
      }

      const inputValue = inputNode.tagName.toLocaleLowerCase() === 'input' ? inputNode.value : inputNode.getAttribute('data-coupon-value');
      if (!inputValue) {
        return;
      }

      inputNode.setAttribute('disabled', 'disabled');
      buttonNode.setAttribute('disabled', 'disabled');

      this.sendAjaxRequest(inputValue, inputNode, buttonNode);
    });
  }

  /**
   * Send ajax request and remove coupon
   * @param {string} inputValue
   * @param {object} inputNode
   * @param {object} buttonNode
   */
  sendAjaxRequest(inputValue, inputNode, buttonNode) {
    const obShippingType = new ShopaholicCartShippingType();

    let obRequestData = {
      data: {
        coupon: inputValue,
        shipping_type_id: obShippingType.getShippingTypeID(),
      },
      complete: ({ responseJSON }) => {
        this.completeCallback(responseJSON, inputNode, buttonNode);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, inputNode, buttonNode);
    }

    oc.ajax(this.componentMethod, obRequestData);
  }

  /**
   * Remove disabled attribute from button
   * Update cart data in ShopaholicCart object
   * @param {object} obResponse
   * @param {object} inputNode
   * @param {object} buttonNode
   */
  completeCallback(obResponse, inputNode, buttonNode) {
    const {data: obCartData} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (buttonNode) {
      buttonNode.removeAttribute('disabled');
    }

    if (inputNode) {
      inputNode.removeAttribute('disabled');
    }
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicCouponRemove}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
