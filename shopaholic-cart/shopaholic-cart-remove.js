import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartRemove {
  constructor() {
    this.defaultButtonClass = '_shopaholic-cart-remove';
    this.removeComponentMethod = 'Cart::onRemove';
    this.obAjaxRequestCallback = null;

    ShopaholicCart.instance();
  }

  /**
  * Init event handlers
  */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.target;
      const buttonNode = eventNode.closest(`.${obThis.defaultButtonClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      obThis.sendAjaxRequest(buttonNode);
    });
  }

  /**
   * Remove cart position
   * @param {Element} buttonNode
   */
  sendAjaxRequest(buttonNode) {
    if (!buttonNode) {
      throw new Error('Button node is empty.');
    }

    buttonNode.setAttribute('disabled', 'disabled');
    const obCartPosition = new ShopaholicCartPosition(buttonNode);
    const iPositionID = obCartPosition.getPositionID();
    const obShippingType = new ShopaholicCartShippingType();

    let obRequestData = {
      data: {
        cart: [iPositionID],
        type: 'position',
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: ({responseJSON}) => {
        this.completeCallback(responseJSON, buttonNode);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, buttonNode);
    }

    oc.ajax(this.removeComponentMethod, obRequestData);
  }

  /**
   * Remove disabled attribute from button
   * Update cart data in ShopaholicCart object
   */
  completeCallback(obResponse, buttonNode) {
    const {data: obCartData} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (buttonNode) {
      buttonNode.removeAttribute('disabled');
    }
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicCartRemove}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
