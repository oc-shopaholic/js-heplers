/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default new class UrlGeneration {
  constructor() {
    this.sBaseURL = `${location.origin}${location.pathname}`;
    this.init();
  }

  init() {
    this.sSearchString = window.location.search.substring(1);
    this.obSearchParams = new URLSearchParams(this.sSearchString);
  }

  clear() {
    this.obSearchParams = new URLSearchParams();

    history.pushState(null, null, `${this.sBaseURL}`);
  }

  update() {
    const searchString = this.obSearchParams.toString();
    if (searchString && searchString.length > 0) {
      history.pushState(null, null, `${this.sBaseURL}?${this.sSearchString}`);
    } else {
      history.pushState(null, null, `${this.sBaseURL}`);
    }
  }

  /**
   * Set field value in URL
   * @param sFiled
   * @param obValue
   */
  set(sFiled, obValue) {
    if (!sFiled || !obValue) {
      return;
    }

    if (typeof obValue == 'string') {
      this.obSearchParams.set(sFiled, obValue);
    } else {
      this.obSearchParams.set(sFiled, obValue.join('|'));
    }
  }

  /**
   * Remove field value from URL
   * @param {string} sFiled
   */
  remove(sFiled) {
    this.obSearchParams.delete(sFiled);
  }
}
