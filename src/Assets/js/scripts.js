    (function($) {
    "use strict";

   

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("pos-sidenav-toggled");
    });
})(jQuery);
