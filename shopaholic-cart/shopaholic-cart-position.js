/**
 * @author  Andrei Kharanenka, <a.kharanenka@lovata.com>, LOVATA Group
 */
export default class ShopaholicCartPosition {
  constructor(positionNode) {
    this.defaultWrapperClass = '_shopaholic-product-wrapper';
    this.wrapperSelector = `.${this.defaultWrapperClass}`;

    this.wrapperNode = positionNode.closest(`${this.wrapperSelector}`);

    this.positionID = null;
    this.offerID = null;
    this.quantity = 1;
    this.propertyList = {};
    this.iRadix = 10;

    this.eventName = 'shopaholic.cart.position.extend';
    if (!this.wrapperNode) {
      throw new Error('Product wrapper is empty. It mast contain product card node');
    }

    this.initOfferID();
    this.initQuantity();
    this.initCartPositionID();
  }

  /**
   * Get cart position node
   * @returns {*}
   */
  getWrapperNode() {
    return this.wrapperNode;
  }

  /**
   * Get cart position data
   * @returns {{quantity: number, id: null, offer_id: null}}
   */
  getData() {
    let obData = {
      id: this.positionID,
      offer_id: this.offerID,
      quantity: this.quantity,
      property: this.propertyList
    };
    document.dispatchEvent(new CustomEvent(this.eventName, {
      bubbles: true,
      cancelable: true,
      detail: {
        data: obData,
        position: this,
      },
    }));

    return obData;
  }

  /**
   * Get position ID
   * @returns {int}
   */
  getPositionID() {
    return this.positionID;
  }

  /**
   * Get quantity
   * @returns {int}
   */
  getQuantity() {
    return this.quantity;
  }

  /**
   * Get quantity input node
   * @returns {Element}
   */
  getQuantityInput() {
    return this.wrapperNode.querySelector(`[name="quantity"]`);
  }

  /**
   * Get offer ID from input
   */
  initOfferID() {
    let offerInputNode = this.wrapperNode.querySelector('[name="offer_id"]');
    if (this.isRadioInput(offerInputNode)) {
      offerInputNode = this.wrapperNode.querySelector('[name="offer_id"]:checked');
    }

    if (!offerInputNode) {
      return;
    }

    this.offerID = parseInt(offerInputNode.value, this.iRadix);
  }

  /**
   * Returns true, if input type is "radio"
   */
  isRadioInput(inputNode) {
    return inputNode && inputNode.type === 'radio';
  }

  /**
   * Get offer quantity from cart object
   */
  initQuantity() {
    const quantityInputNode = this.getQuantityInput();
    this.quantity = quantityInputNode ? parseInt(quantityInputNode.value, this.iRadix) : 0;
  }

  /**
   * Get offer quantity from cart object
   */
  initCartPositionID() {
    const positionID = this.wrapperNode.dataset.positionId;
    this.positionID = positionID ? parseInt(positionID, this.iRadix) : null;
  }
}
