import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartRestore {
  constructor() {
    this.defaultButtonClass = '_shopaholic-cart-restore';
    this.restoreComponentMethod = 'Cart::onRestore';
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
   * Restore cart position
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

    const obThis = this;
    let obRequestData = {
      data: {
        cart: [iPositionID],
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: (response) => {
        obThis.completeCallback(response, buttonNode);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, buttonNode);
    }

    oc.ajax(this.restoreComponentMethod, obRequestData);
  }

  /**
   * Restore disabled attribute from button
   * Update cart data in ShopaholicCart object
   */
  completeCallback(obResponse, buttonNode) {
    const {data: obCartData} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (buttonNode) {
      buttonNode.restoreAttribute('disabled');
    }
  }

  /**
   * Set ajax request callback
   *
   * @param {function} obCallback
   * @returns {ShopaholicCartRestore}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
