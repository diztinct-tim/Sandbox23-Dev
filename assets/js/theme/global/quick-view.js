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
        $('.custom-image-gallery.modal-view div.slick-slide').each(function(){
            var thisURL = $(this).data('zoom');
            console.log(thisURL);
            $(this).zoom({url: thisURL });
        });
    }

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
            console.log(response);
            modal.updateContent(response);

            modal.$content.parents('#modal').addClass('custom-gallery-modal');

            $('.custom-image-gallery.modal-view').slick({
                lazyLoad : 'ondemand',
                dots : true,
                customPaging : function(slider, i){
                    var thumb = $(slider.$slides[i]).data('thumbnail');
                    return '<a><img src="' + thumb + '"></a>'
                }
            });

            if($(window).width() > 767){
                makeZoomable();
            }

        });

    });
}
