import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Uladzimir Ambrazhey, <v.ambrazhey@oc-shopaholic.com>, LOVATA Group
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCouponAdd {
  constructor() {
    this.sButtonClass = '_shopaholic-coupon-add';

    this.sComponentMethod = 'Cart::onAddCoupon';

    this.obAjaxRequestCallback = null;
  }

  /**
   * Init event handlers
   */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.currentTarget;
      const buttonNode = eventNode.closest(`.${obThis.sButtonClass}`);
      const obInput = document.querySelector('[data-coupon]');
      if (!buttonNode || !buttonNode.hasAttributes('disabled') || !obInput || !obInput.value) {
        return;
      }

      obInput.setAttribute('disabled', 'disabled');
      buttonNode.setAttribute('disabled', 'disabled');

      this.sendAjaxRequest(obInput.value, obInput, buttonNode);
    });
  }

  /**
   * Send ajax request and add coupon
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
   * Remove disabled attribute from button and input
   * Update cart data in ShopaholicCart object
   * @param {object} obResponse
   * @param {object} obInput
   * @param {object} obButton
   */
  completeCallback(obResponse, obInput, obButton) {
    const {data: obCartData, status: bStatus} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (obButton) {
      obButton.removeAttribute('disabled');
    }

    if (!bStatus && obInput) {
      obInput.removeAttribute('disabled');
    }
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicCouponAdd}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
