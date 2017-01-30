/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from '../page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/form-utils';

$(function(){

    function slickGallery(){
        var numImgs = $('.custom-image-gallery > div').length;
        console.log("numImgs = " + numImgs);
        if(numImgs > 1){
            $('.custom-image-gallery').slick({
                lazyLoad : 'ondemand',
                dots : true,
                customPaging : function(slider, i){
                    var thumb = $(slider.$slides[i]).data('thumbnail');
                    return '<a><img src="'+thumb+'"></a>'
                }
            });
        } else {
            $('.custom-image-gallery').slick({
                lazyLoad : 'ondemand',
                dots : true,
                customPaging : function(slider, i){
                    var thumb = $(slider.$slides[i]).data('thumbnail');
                    return '<a><img src="'+thumb+'"></a>'
                }
            });
        }
    }
    slickGallery();
    flashMessagePdp();

    function flashMessagePdp(){
        console.log("flashMessagePdp()");
        if($(window).width() < 768){
            $(".custom-image-gallery.slick-initialized.slick-slider").append("<span class='zoom-flash'>Tap To Zoom</span>");
        } else {
            $(".custom-image-gallery.slick-initialized.slick-slider").append("<span class='zoom-flash'>Click To Zoom</span>");
        }
        fadeInOutFlashMessagePdp();
    }

    function fadeInOutFlashMessagePdp(){
        $(".zoom-flash").delay(2000).fadeIn(350, function(){
            $(this).delay(2000).fadeOut(350);
        });
    }

});

export default class Product extends PageManager {
    constructor() {
        super();
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#writeReview') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context);

        videoGallery();

        const $reviewForm = classifyForm('.writeReview-form');
        const review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation();
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        next();
    }

    after(next) {
        this.productReviewHandler();

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#writeReview') !== -1) {
            this.$reviewLink.click();
        }
    }
}
