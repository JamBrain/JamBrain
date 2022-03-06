/* Copyright (c) 2016 Tobias Buschor https://goo.gl/gl0mbf | MIT License https://goo.gl/HgajeK */
/* focusin/out event polyfill (firefox) */
!function(){
    var w = window, 
        d = w.document;

    if (w.onfocusin === undefined) {
        d.addEventListener('focus'    ,addPolyfill    ,true);
        d.addEventListener('blur'     ,addPolyfill    ,true);
        d.addEventListener('focusin'  ,removePolyfill ,true);
        d.addEventListener('focusout' ,removePolyfill ,true);
    }  
    function addPolyfill(e){
        var type = e.type === 'focus' ? 'focusin' : 'focusout';
        var event = new CustomEvent(type, {bubbles:true, cancelable:false});
        event.c1Generated = true;
        e.target.dispatchEvent(event);
    }
    function removePolyfill(e){
        if (!e.c1Generated) { // focus after focusin, so chrome will the first time trigger tow times focusin
            d.removeEventListener('focus'    ,addPolyfill    ,true);
            d.removeEventListener('blur'     ,addPolyfill    ,true);
            d.removeEventListener('focusin'  ,removePolyfill ,true);
            d.removeEventListener('focusout' ,removePolyfill ,true);
        }
        setTimeout(function(){
            d.removeEventListener('focusin'  ,removePolyfill ,true);
            d.removeEventListener('focusout' ,removePolyfill ,true);
        });
    }

}();

