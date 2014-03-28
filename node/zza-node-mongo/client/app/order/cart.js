﻿/*
 * Cart viewmodel associated with cart.html view
 */
(function(angular) {
    'use strict';

    angular.module("app").controller( 'cart',
        ['dataservice', 'pricing', cart] );

    function cart( dataservice, pricing) {
        var vm   = this;
        dataservice.ready( onReady );

        function onReady(){
            vm.hasExtraCost  = false;
            vm.cartItemState = cartItemState;
            vm.cartOrder     = dataservice.cartOrder;
            vm.draftOrder    = dataservice.draftOrder;
            vm.updateCosts   = calculateCosts;
            vm.removeItem    = removeItem;

            calculateCosts()
        }

        /* implementation */

        function calculateCosts() {
            var cart = vm.cartOrder;
            vm.hasExtraCost = false;
            vm.haveItems = (cart.orderItems.length > 0);
            if ( vm.haveItems ) {
                var total = pricing.calcOrderItemsTotal( cart );
                vm.hasExtraCost = pricing.orderHasExtraCostOptions( cart );
            }
        }

        function cartItemState(item){
            var params = {orderId: 'cart', productType: item.product.type, orderItemId: item.id };
            return 'app.order.item('+JSON.stringify(params)+')';
            //return '#/order/cart/'+item.product.type+'/'+item.id;
        }

        function removeItem( item ) {
            //don't need to remove if item is an entity (e.g, SQL version)
            vm.cartOrder.removeItem(item);
            vm.draftOrder.addItem(item);
            calculateCosts();
        }
    }

})(this.angular);
