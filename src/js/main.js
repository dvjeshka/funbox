
$(function(){
    app.init();
    $(window).on('load',function(){app.load();});
    $(window).on('resize',function(){app.resize();});
});

var app = {
    'init': function(){
        func.main();
        func.popup();
    },
    'load': function(){

    },
    'resize': function(){

    }
};

var func = {
    'main':function () {
        //= partials/product-item.js
    },
    'popup':function () {
        //= partials/popup.js
    }
};
