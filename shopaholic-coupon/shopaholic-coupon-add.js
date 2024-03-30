import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Uladzimir Ambrazhey, <v.ambrazhey@oc-shopaholic.com>, LOVATA Group
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCouponAdd {
  constructor() {
    this.buttonClass = '_shopaholic-coupon-add';
    this.componentMethod = 'Cart::onAddCoupon';

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
      if (!buttonNode || !buttonNode.hasAttributes('disabled') || !inputNode || !inputNode.value) {
        return;
      }

      inputNode.setAttribute('disabled', 'disabled');
      buttonNode.setAttribute('disabled', 'disabled');

      obThis.sendAjaxRequest(inputNode.value, inputNode, buttonNode);
    });
  }

  /**
   * Send ajax request and add coupon
   * @param {string} sValue
   * @param {object} inputNode
   * @param {object} buttonNode
   */
  sendAjaxRequest(sValue, inputNode, buttonNode) {
    const obShippingType = new ShopaholicCartShippingType();

    let obRequestData = {
      data: {
        coupon: sValue,
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
   * Remove disabled attribute from button and input
   * Update cart data in ShopaholicCart object
   * @param {object} obResponse
   * @param {object} inputNode
   * @param {object} buttonNode
   */
  completeCallback(obResponse, inputNode, buttonNode) {
    const {data: obCartData, status: bStatus} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (buttonNode) {
      buttonNode.removeAttribute('disabled');
    }

    if (!bStatus && inputNode) {
      inputNode.removeAttribute('disabled');
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
