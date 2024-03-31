import ShopaholicCartPosition from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-position";
import ShopaholicCart from "@oc-shopaholic/shopaholic-cart/shopaholic-cart";
import ShopaholicCartShippingType from "@oc-shopaholic/shopaholic-cart/shopaholic-cart-shipping-type";

/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default class ShopaholicCartAdd {
  constructor() {
    this.defaultButtonClass = '_shopaholic-cart-add';
    this.addComponentMethod = 'Cart::onAdd';
    this.updateComponentMethod = 'Cart::onUpdate';

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
   * Add offer to cart
   * @param {Element} buttonNode
   */

  sendAjaxRequest(buttonNode) {
    if (!buttonNode) {
      throw new Error('Button node is empty.');
    }

    buttonNode.setAttribute('disabled', 'disabled');

    let addType = buttonNode.dataset.addType ? buttonNode.dataset.addType : 'default';
    const obCartPosition = new ShopaholicCartPosition(buttonNode);
    let obPositionData = obCartPosition.getData();
    const iOfferID = obPositionData.offer_id;
    const obShippingType = new ShopaholicCartShippingType();
    const obOfferProperty = obPositionData.property;
    const iCartQuantity = ShopaholicCart.instance().getOfferQuantity(iOfferID, obOfferProperty);

    if (addType === 'default') {
      obPositionData.quantity += iCartQuantity;
    }

    let obRequestData = {
      data: {
        cart: [obPositionData],
        'shipping_type_id': obShippingType.getShippingTypeID()
      },
      complete: ({responseJSON}) => {
        this.completeCallback(responseJSON, buttonNode);
      },
    };

    if (this.obAjaxRequestCallback !== null) {
      obRequestData = this.obAjaxRequestCallback(obRequestData, buttonNode);
    }

    const ajaxHandler = addType === 'default' ? this.updateComponentMethod : this.addComponentMethod;

    oc.ajax(ajaxHandler, obRequestData);
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
   * @returns {ShopaholicCartAdd}
   */
  setAjaxRequestCallback(obCallback) {
    this.obAjaxRequestCallback = obCallback;

    return this;
  }
}
