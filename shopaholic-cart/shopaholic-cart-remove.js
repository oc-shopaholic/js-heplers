import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Uladzimir Ambrazhey, <v.ambrazhey@oc-shopaholic.com>, LOVATA Group
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartRemove {
  constructor() {
    this.sDefaultButtonClass = '_shopaholic-cart-remove';
    this.sRemoveComponentMethod = 'Cart::onRemove';
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
      const buttonNode = eventNode.closest(`.${obThis.sDefaultButtonClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      obThis.sendAjaxRequest(buttonNode);
    });
  }

  /**
   * Remove cart position
   * @param {node} obButton
   */
  sendAjaxRequest(obButton) {
    if (!obButton) {
      throw new Error('Button node is empty.');
    }

    obButton.setAttribute('disabled', 'disabled');
    const obCartPosition = new ShopaholicCartPosition(obButton);
    const iPositionID = obCartPosition.getPositionID();
    const obShippingType = new ShopaholicCartShippingType();

    let obRequestData = {
      data: {
        cart: [iPositionID],
        type: 'position',
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: ({responseJSON}) => {
        this.completeCallback(responseJSON, obButton);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obButton);
    }

    oc.ajax(this.sRemoveComponentMethod, obRequestData);
  }

  /**
   * Remove disabled attribute from button
   * Update cart data in ShopaholicCart object
   */
  completeCallback(obResponse, obButton) {
    const {data: obCartData} = obResponse;

    ShopaholicCart.instance().updateCartData(obCartData);

    if (obButton) {
      obButton.removeAttribute('disabled');
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
