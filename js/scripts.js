function updateCaption() {
    $(".caption").removeClass("visible fadeOut"); // Reset all captions

    // Get the currently checked image
    var $activeSlide = $(".imgCheck:checked").closest(".slider");

    if ($activeSlide.length) {
        var $caption = $activeSlide.find(".caption");

        // Show caption on hover and fade out after 10s
        $activeSlide.on("mouseenter", function () {
            $caption.addClass("visible").removeClass("fadeOut");

            // Set timeout to fade out the caption after 10s
            setTimeout(function () {
                $caption.addClass("fadeOut");
            }, 10000);
        });

        // Ensure caption hides when mouse leaves
        $activeSlide.on("mouseleave", function () {
            $caption.addClass("fadeOut");
        });
    }
}

// Update captions when a new slide is checked
$(".imgCheck").on("change", function () {
    updateCaption();
});

// Run on page load
$(document).ready(function () {
    updateCaption();
});
