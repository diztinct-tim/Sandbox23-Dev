import $ from 'jquery';
import 'jquery-zoom';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';
import { defaultModal } from './modal';

export default function (context) {
    const modal = defaultModal();

    function makeZoomable(){
        console.log("its zoomable");

        // $('.custom-image-gallery.modal-view div.slick-slide').each(function(){
        //     var thisURL = $(this).data('zoom');
        //     console.log(thisURL);
        //     $(this).zoom({
        //         url: thisURL,
        //         on: 'dblclick'
        //     });
        // });

        flashMessageModal();
    }

    // $('body').on("dblclick", ".modal-body div.slick-slide", function(){
    //     console.log("DOUBLE CLICKED ON A DESKTOP");
    //     var thisURL = $(this).data('zoom');
    //     var img = "<img src='" + thisURL + "'>";
        // $(this).zoom({
        //     url: thisURL,
        //     on: 'dblclick'
        // });

        // $(img)
        //     .addClass('zoomImg')
        //     .css({
        //         position: 'absolute',
        //         top: 0,
        //         left: 0,
        //         opacity: 0,
        //         width: thisURL.width,
        //         height: thisURL.height,
        //         border: 'none',
        //         maxWidth: 'none',
        //         maxHeight: 'none'
        //     })
        //     .appendTo($(this));
    // });

    var tapped=false;
    $("body").on("touchstart", ".modal-body div.slick-slide", function(e){
        if(!tapped){ //if tap is not set, set up single tap
            tapped=setTimeout(function(){
                tapped=null
                //insert things you want to do when single tapped
            },300);   //wait 300ms then run single click code
        } else {    //tapped within 300ms of last tap. double tap
            clearTimeout(tapped); //stop single tap callback
            tapped=null
            //insert things you want to do when double tapped
            console.log("DOUBLE TAPPED ON A TOUCH DEVICE");
            var thisURL = $(this).data('zoom');

            $(this).zoom({
                url: thisURL,
                on: 'dblclick',
                callback: console.log(this)
            });

        }
        e.preventDefault()
    });

    function flashMessageModal(){
        console.log("flashMessageModal()");
        if($(window).width() < 768){
            $(".custom-image-gallery.modal-view.slick-initialized.slick-slider").append("<span class='zoom-flash-modal'>Double Click To Zoom</span>");
        } else {
            $(".custom-image-gallery.modal-view.slick-initialized.slick-slider").append("<span class='zoom-flash-modal'>Hover To Zoom</span>");
        }
        fadeInOutFlashMessageModal();
    }

    function fadeInOutFlashMessageModal(){
        $(".zoom-flash-modal").delay(2000).fadeIn(350, function(){
            $(this).delay(2000).fadeOut(350);
        });
    }

    // onZoomIn: $(".custom-image-gallery > .slick-list").removeClass("draggable"),
    // onZoomOut: $(".custom-image-gallery > .slick-list").addClass("draggable")

    // $('body').on('click', '.productView > .custom-image-gallery .non-zoom-img', (event) => {    
    //     console.log("clicked!!!!");
    //     $(".custom-image-gallery > .slick-list").toggleClass("draggable");
    // });



    $('body').on('click', '.quickview', (event) => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('product-id');

        modal.open({ size: 'large' });

        utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
            modal.updateContent(response);

            modal.$content.find('.productView').addClass('productView--quickView');

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
    });



    $('body').on('click', '.productView > .custom-image-gallery div.slick-slide', (event) => {
        event.preventDefault();

        const productId = $(event.currentTarget).parents(".custom-image-gallery").data('product-id');

        modal.open({ size : 'large' });

        utils.api.product.getById(productId, { template: 'products/custom-modal-gallery' }, (err, response) => {

            modal.updateContent(response);

            modal.$content.parents('#modal').addClass('custom-gallery-modal');

            $('.custom-image-gallery.modal-view').slick({
                lazyLoad : 'ondemand',
                dots : true,
                swipe : true,
                touchMove : false,

                customPaging : function(slider, i){
                    var thumb = $(slider.$slides[i]).data('thumbnail');
                    return '<a><img src="' + thumb + '"></a>'
                }
            });

            // if($(window).width() > 767){
                makeZoomable();
            // }

        });

    });
}
