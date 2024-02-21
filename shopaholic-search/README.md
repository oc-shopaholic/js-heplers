# Search for [Shopaholic](https://octobercms.com/plugin/lovata-shopaholic) package

Package adds helper methods for integration with [Search for Shopaholic](https://octobercms.com/plugin/lovata-searchshopaholic)
and [Shopaholic](https://octobercms.com/plugin/lovata-shopaholic) plugins.

Package will allow you to quickly add search bar in your project.

## installation

```bash
npm install @oc-shopaholic/shopaholic-search
```

## Basic usage

```html
<input type="text" class="_shopaholic-search-input" name="search-input" value="">
```

Simple example:
```javascript
import ShopaholicSearch from "@oc-shopaholic/shopaholic-search";

const obHelper = new ShopaholicSearch();
obHelper.setAjaxRequestCallback(function(obRequestData) {
  obRequestData.loading = '.preloader';
  obRequestData.update = {'search/search-result': '.search-result-wrapper'};

  return obRequestData;
}).init();
```

Advanced example:
```javascript
import ShopaholicSearch from "@oc-shopaholic/shopaholic-search";

const obHelper = new ShopaholicSearch();
obHelper
  .setSearchLimit(5)
  .setSearchDelay(600)
  .setAjaxRequestCallback(function(obRequestData) {
    obRequestData.loading = '.preloader';
    obRequestData.update = {'search/search-result': '.search-result-wrapper'};

    return obRequestData;
  }).init();
```

## Methods

### init()

Method adds **'change'** event listener on search input.

### setAjaxRequestCallback()

You can set callback function. This callback function will be called before sending ajax request.

You can change request object inside callback function. For example: add called partial and selector, add preloader class, etc.

```javascript
import ShopaholicSearch from "@oc-shopaholic/shopaholic-search";

const obHelper = new ShopaholicSearch();
obHelper.setAjaxRequestCallback(function(obRequestData) {
  obRequestData.loading = '.preloader';
  obRequestData.update = {'search/search-result': '.search-result-wrapper'};

  return obRequestData;
}).init();
```

### setSearchLimit()

You can to redeclare default search limit value.
Default value is **3 symbols**.
Ajax request will be sent only when user enters the number of characters greater than or equal to specified value.

```javascript
import ShopaholicSearch from "@oc-shopaholic/shopaholic-search";

const obHelper = new ShopaholicSearch();
obHelper.setSearchLimit(5).init();
```

### setSearchDelay()

You can to redeclare default search delay value.
Default value is **400 ms**.
Ajax request will be sent only when user does not press keys during the delay time.

```javascript
import ShopaholicSearch from "@oc-shopaholic/shopaholic-search";

const obHelper = new ShopaholicSearch();
obHelper.setSearchDelay(600).init();
```

## License

© 2024, [oc-shopaholic](https://github.com/oc-shopaholic) under [GNU GPL v3](https://opensource.org/licenses/GPL-3.0).

Developed by [Andrei Kharanenka](https://github.com/kharanenka).
