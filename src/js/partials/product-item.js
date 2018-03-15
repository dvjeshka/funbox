$('.js-product-item:not(.product-item_disabled) .product-item__main,.js-product-item:not(.product-item_disabled) .product-item__link').on('click',function () {
    var self = $(this).closest('.js-product-item').toggleClass('product-item_selected'),
        selfMain = $(self).find('.product-item__main');
    if($(self).is('.product-item_selected')) {
        selfMain.on('mouseleave.product-item',(function () {$(self).closest('.js-product-item').addClass('product-item_selected_hover')}));
        selfMain.on('mouseenter.product-item',(function () {$(self).closest('.js-product-item').removeClass('product-item_selected_hover');}));
    } else {
        selfMain.off('mouseleave.product-item');
    }
});