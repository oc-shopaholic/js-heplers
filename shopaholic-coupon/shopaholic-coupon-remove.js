import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Uladzimir Ambrazhey, <v.ambrazhey@oc-shopaholic.com>, LOVATA Group
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCouponRemove {
  constructor() {
    this.sButtonClass = '_shopaholic-coupon-remove';

    this.sComponentMethod = 'Cart::onRemoveCoupon';

    this.obAjaxRequestCallback = null;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.sButtonClass}`);
      const obInput = document.querySelector('[data-coupon]');
      if (!buttonNode || !buttonNode.hasAttributes('disabled') || !obInput) {
        return;
      }

      const sValue = obInput.tagName.toLocaleLowerCase() === 'input' ? obInput.value : obInput.getAttribute('data-coupon-value');
      if (!sValue) {
        return;
      }

      obInput.setAttribute('disabled', 'disabled');
      buttonNode.setAttribute('disabled', 'disabled');

      this.sendAjaxRequest(sValue, obInput, buttonNode);
    });
  }

  /**
   * Send ajax request and remove coupon
   * @param {string} sValue
   * @param {object} obInput
   * @param {object} obButton
   */
  sendAjaxRequest(sValue, obInput, obButton) {
    const obShippingType = new ShopaholicCartShippingType();

    let obRequestData = {
      data: {
        coupon: sValue,
        shipping_type_id: obShippingType.getShippingTypeID(),
      },
      complete: ({ responseJSON }) => {
        this.completeCallback(responseJSON, obInput, obButton);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obInput, obButton);
    }

    oc.ajax(this.sComponentMethod, obRequestData);
  }

  /**
   * Remove disabled attribute from button
   * Update cart data in ShopaholicCart object
   * @param {object} obResponse
   * @param {object} obInput
   * @param {object} obButton
   */
  completeCallback(obResponse, obInput, obButton) {
    const {data: obCartData} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (obButton) {
      obButton.removeAttribute('disabled');
    }

    if (obInput) {
      obInput.removeAttribute('disabled');
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
