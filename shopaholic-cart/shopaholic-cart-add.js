import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartAdd {
  constructor() {
    this.sDefaultButtonClass = '_shopaholic-cart-add';

    this.obAjaxRequestCallback = null;

    this.sAddComponentMethod = 'Cart::onAdd';
    this.sUpdateComponentMethod = 'Cart::onUpdate';

    ShopaholicCart.instance();
  }

  /**
  * Init event handlers
  */
  init() {
    const obThis = this;
    document.addEventListener('click', (event) => {
      const eventNode = event.currentTarget;
      const buttonNode = eventNode.closest(`.${obThis.sDefaultButtonClass}`);
      if (!buttonNode || buttonNode.hasAttribute('disabled')) {
        return;
      }

      obThis.sendAjaxRequest(buttonNode);
    });
  }

  /**
   * Add offer to cart
   * @param {node} obButton
   * @param {boolean} bForceAddMethod Sets enforced method `this.sAddComponentMethod`
   */

  sendAjaxRequest(obButton, bForceAddMethod = false) {
    if (!obButton) {
      throw new Error('Button node is empty.');
    }

    obButton.setAttribute('disabled', 'disabled');
    const obCartPosition = new ShopaholicCartPosition(obButton);
    let obPositionData = obCartPosition.getData();
    const iOfferID = obPositionData.offer_id;
    const obShippingType = new ShopaholicCartShippingType();
    const obOfferProperty = obPositionData.property;
    const iCartQuantity = ShopaholicCart.instance().getOfferQuantity(iOfferID, obOfferProperty);

    obPositionData.quantity += iCartQuantity;

    let obRequestData = {
      data: {
        cart: [obPositionData],
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: ({responseJSON}) => {
        this.completeCallback(responseJSON, obButton);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, obButton);
    }

    const ajaxHandler = iCartQuantity >= 1 && !bForceAddMethod ? this.sUpdateComponentMethod : this.sAddComponentMethod;

    oc.ajax(ajaxHandler, obRequestData);
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
   * @returns {ShopaholicCartAdd}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
