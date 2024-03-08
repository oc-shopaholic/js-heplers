/**
 * @author  Andrei Kharanenka, a.kharanenka@lovata.com, LOVATA Group
 */
export default new class UrlGeneration {
  constructor() {
    this.baseURL = `${location.origin}${location.pathname}`;
    this.init();
  }

  init() {
    const searchString = window.location.search.substring(1);
    this.obSearchParams = new URLSearchParams(searchString);
  }

  clear() {
    this.obSearchParams = new URLSearchParams();

    history.pushState(null, null, `${this.baseURL}`);
  }

  update() {
    if (this.obSearchParams.size > 0) {
      this.obSearchParams.sort();
      const searchParams = [];
      for (const [key, value] of this.obSearchParams.entries()) {
        searchParams.push(`${key}=${value}`);
      }
      const searchString = searchParams.join('&');

      history.pushState(null, null, `${this.baseURL}?${searchString}`);
    } else {
      history.pushState(null, null, `${this.baseURL}`);
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
