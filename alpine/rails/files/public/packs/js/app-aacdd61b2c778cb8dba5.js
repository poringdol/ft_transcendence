/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/app.js":
/*!*************************************!*\
  !*** ./app/javascript/packs/app.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /pingpong/app/javascript/packs/app.js: Unexpected token (49:3)\n\n  47 | \t\t\t// \t}\n  48 | \t\t\t// })\n> 49 | \t\t},\n     | \t\t ^\n  50 | \t\trender_page: function () {\n  51 | \t\t\t$('#pageContent').html(this.el);\n  52 | \t\t\tnew AppUser.Views.UserPage();\n    at Parser._raise (/pingpong/node_modules/@babel/parser/lib/index.js:748:17)\n    at Parser.raiseWithData (/pingpong/node_modules/@babel/parser/lib/index.js:741:17)\n    at Parser.raise (/pingpong/node_modules/@babel/parser/lib/index.js:735:17)\n    at Parser.unexpected (/pingpong/node_modules/@babel/parser/lib/index.js:9097:16)\n    at Parser.parseExprAtom (/pingpong/node_modules/@babel/parser/lib/index.js:10548:20)\n    at Parser.parseExprSubscripts (/pingpong/node_modules/@babel/parser/lib/index.js:10122:23)\n    at Parser.parseUpdate (/pingpong/node_modules/@babel/parser/lib/index.js:10102:21)\n    at Parser.parseMaybeUnary (/pingpong/node_modules/@babel/parser/lib/index.js:10091:17)\n    at Parser.parseExprOps (/pingpong/node_modules/@babel/parser/lib/index.js:9961:23)\n    at Parser.parseMaybeConditional (/pingpong/node_modules/@babel/parser/lib/index.js:9935:23)\n    at Parser.parseMaybeAssign (/pingpong/node_modules/@babel/parser/lib/index.js:9898:21)\n    at Parser.parseExpressionBase (/pingpong/node_modules/@babel/parser/lib/index.js:9843:23)\n    at /pingpong/node_modules/@babel/parser/lib/index.js:9837:39\n    at Parser.allowInAnd (/pingpong/node_modules/@babel/parser/lib/index.js:11521:12)\n    at Parser.parseExpression (/pingpong/node_modules/@babel/parser/lib/index.js:9837:17)\n    at Parser.parseStatementContent (/pingpong/node_modules/@babel/parser/lib/index.js:11781:23)\n    at Parser.parseStatement (/pingpong/node_modules/@babel/parser/lib/index.js:11650:17)\n    at Parser.parseBlockOrModuleBlockBody (/pingpong/node_modules/@babel/parser/lib/index.js:12232:25)\n    at Parser.parseBlockBody (/pingpong/node_modules/@babel/parser/lib/index.js:12218:10)\n    at Parser.parseBlock (/pingpong/node_modules/@babel/parser/lib/index.js:12202:10)\n    at Parser.parseFunctionBody (/pingpong/node_modules/@babel/parser/lib/index.js:11194:24)\n    at Parser.parseArrowExpression (/pingpong/node_modules/@babel/parser/lib/index.js:11166:10)\n    at Parser.parseExprAtom (/pingpong/node_modules/@babel/parser/lib/index.js:10401:25)\n    at Parser.parseExprSubscripts (/pingpong/node_modules/@babel/parser/lib/index.js:10122:23)\n    at Parser.parseUpdate (/pingpong/node_modules/@babel/parser/lib/index.js:10102:21)\n    at Parser.parseMaybeUnary (/pingpong/node_modules/@babel/parser/lib/index.js:10091:17)\n    at Parser.parseExprOps (/pingpong/node_modules/@babel/parser/lib/index.js:9961:23)\n    at Parser.parseMaybeConditional (/pingpong/node_modules/@babel/parser/lib/index.js:9935:23)\n    at Parser.parseMaybeAssign (/pingpong/node_modules/@babel/parser/lib/index.js:9898:21)\n    at /pingpong/node_modules/@babel/parser/lib/index.js:9865:39");

/***/ })

/******/ });
//# sourceMappingURL=app-aacdd61b2c778cb8dba5.js.map