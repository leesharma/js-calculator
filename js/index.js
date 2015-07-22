/**
 * Javascript Calculator Scripts
 * =============================
 * author: Lee Sharma
 * licence: MIT
 *
 *   TODO: add button click colors
 *   TODO: add negative to empty number (properly)
 *   TODO: handle too-big solutions
 *   TODO: add commas to displayed number
 */
(function ($) {
  $(document).ready(function () {
    // initialize
    $('.container').hide(100).delay(500).fadeIn(500);

    // works by clicking the on-screen buttons
    $('.funct-key').click   (function () { operation($(this).text()); });
    $('.num-key').click     (function () { pressNum($(this).text());  });
    $('#clear').click       (function () { clearScreen(); });
    $('#change-sign').click (function () { changeSign();  });
    $('#percent').click     (function () { percent();     });

    // works through the keyboard
    $(window).keypress(function (e) {
      var key = e.which;
      e.preventDefault();

      switch (true) {
        case (isFunctionKey(key)):  operation(keyValue(key)); break;
        case (isNumberKey(key)  ):  pressNum(keyValue(key));  break;
        case (isClearKey(key)   ):  clearScreen(); break;
        case (isPercentKey(key) ):  percent();     break;
        case (isEvalKey(key)    ):  evaluate();    break;          
        // otherwise, flash screen and do nothing
        default:
          $('.screen')
            .addClass('invalid', 50)
            .delay(50)
            .removeClass('invalid', 100);
          break;
      }
    });
  });



  var $screenNum      = $('.screen .numbers'),
      $opIndicator    = $('#op-indicator'),
      $ansIndicator   = $('#ans'),
      storedOperation = null,
      isAns           = false;
  
  /** Returns the number currently displayed on the screen */
  function getScreenNumber() { return $screenNum.text(); }
  
  /** Returns the correct string value given a char code */
  function keyValue(keycode) {
    var value = String.fromCharCode(keycode),
        ops   = { '/':'÷', '*':'×', '+':'+', '-':'−' };
    
    if (Object.keys(ops).indexOf(value) !== -1) { return ops[value]; };
    return value;
  }

  /** Returns true if pressed key is 0-9 or . */
  function isNumberKey(key)   { return key === 46 || (key >= 48 && key <= 57); }
  /** Returns true if pressed key is in [cC] */
  function isClearKey(key)    { return key === 99 || key === 67; };
  /** Returns true if key is in [/*+-] */
  function isFunctionKey(key) { return key === 42 || key === 43 || key === 45 || key === 47; };
  /** Returns true if key is in [=<Enter>] */
  function isEvalKey(key)     { return key === 13 || key === 61; }
  /** Returns true if the pressed key is % */
  function isPercentKey(key)  { return key === 37; }
  
  /**
   * Stores a function given the operation type and current screen value.
   *   Clears the screen and sets an operation indicator with the op type.
   *
   * @param {String} type - The type of operation (one of +, −, ×, or ÷)
   */
  function operation(type) {
    // evaluate stored operations
    if (storedOperation) { evaluate(); }
    if (type === '=')    { return;     }
    
    var f, number = getScreenNumber();

    switch (type) {
      case ('+'): f = function (x) { return +number + x; }; break;
      case ('−'): f = function (x) { return +number - x; }; break;
      case ('×'): f = function (x) { return +number * x; }; break;
      case ('÷'): f = function (x) { return +number / x; }; break;
    }
    storedOperation = f;
    $screenNum.text('0');
    $opIndicator.text(type);
    clearAns();
  }

  /**
   * Evaluates the stored function (from #operation) given the current
   *    screen value. Clears the current operation and the ans indicator
   */
  function evaluate() {
    var solution,
        number = getScreenNumber();
    
    // guard clause
    if (!storedOperation) { return; }

    solution = storedOperation(+number);
    $screenNum.text(solution);
    clearOp();
    setAns();
  }

  /** Divides the current screen value by 100 */
  function percent() {
    var number = +getScreenNumber();
    if (number === 0) { return; }

    $screenNum.text( +(number/100.0) );
  }

  /** Sets a positive screen value to negative and vice-versa */
  function changeSign() {
    var number = getScreenNumber(),
        minusSign = '-';
    if (number === '0') { operation('−'); return; }

    if (number[0] === minusSign) {
      $screenNum.text(number.substring(1));
    } else {
      $screenNum.prepend(minusSign);
    }
  }

  /** Appends the pressed number to the screen value */
  function pressNum(key) {
    var $calc = $('.screen'),
        number = getScreenNumber(),
        maxChars = 10;

    // guard clauses - special cases
    if (number === '0' || isAns)            { $screenNum.text(''); }  // clear the 0
    if (number.length >= maxChars)          { return;   }  // number too long
    if (key === '.' && /\./.test(number))   { return;   }  // only one . allowed
    if (key === '.' && number.length === 0) { key = '0.'}  // prefix leading . with 0

    $screenNum.append(key);
    clearAns();
  }
  
  /** Clears the screen and all indicators */
  function clearScreen() {
    $screenNum.text('0');
    clearOp();
    clearAns();
  }
  
  /** Clears the op indicator */
  function clearOp() {
    $opIndicator.text('');
    storedOperation = null;
  }

  /** Clears the ans indicator */
  function clearAns() {
    isAns = false;
    $ansIndicator.text('');
  };

  /** Sets the ans indicator */
  function setAns() {
    isAns = true;
    $ansIndicator.text('•');
  }
}(jQuery));