$(document).ready(function () {
    var counter = 1;
    var numberOfImages = $(".imgCheck").length;
    var interval;
    var isPaused = false; // To track whether the slider is paused

    function startSlider() {
        interval = setInterval(function () {
            $("#s" + counter).prop("checked", true).trigger("change");
            counter++;
            if (counter > numberOfImages) {
                counter = 1;
            }
            announceSlideChange(counter);
        }, 5000);
    }

    function stopSlider() {
        clearInterval(interval);
    }

    // Function to announce slide change to screen readers
    function announceSlideChange(counter) {
        $("#slider").attr("aria-live", "polite");
        $("#slider").find(".sr-only").text("Slide " + counter + " of " + numberOfImages);
    }

    // Function to update captions based on checked slide
    function updateCaptions() {
        $(".slide .caption").css("opacity", "0").removeClass("fadeOut"); // Hide all captions

        // Find the checked slide and show its caption
        $(".imgCheck:checked").each(function () {
            var $checkedSlide = $(this).closest(".slide");
            var $caption = $checkedSlide.find(".caption");

            $caption.css("opacity", "1"); // Show caption

            // Automatically fade out caption after 3 seconds
            setTimeout(function () {
                $caption.addClass("fadeOut");
            }, 3000);
        });
    }

    // Listen for changes in the checked radio buttons
    $(".imgCheck").on("change", function () {
        updateCaptions();
    });

    // Start the slider
    startSlider();
    updateCaptions();

    // Button Click Events
    $("#next-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter++;
        if (counter > numberOfImages) counter = 1;
        $("#s" + counter).prop("checked", true).trigger("change");
        announceSlideChange(counter);
        if (!isPaused) startSlider();
    });

    $("#previous-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter--;
        if (counter < 1) counter = numberOfImages;
        $("#s" + counter).prop("checked", true).trigger("change");
        announceSlideChange(counter);
        if (!isPaused) startSlider();
    });

    // Pause & Play Button Events
    $("#pause").on("click", function () {
        stopSlider();
        isPaused = true;
        $(this).hide();
        $("#play").show();
    });

    $("#play").on("click", function () {
        isPaused = false;
        startSlider();
        $(this).hide();
        $("#pause").show();
    });

    // Pause slider on hover
    $("#slider").on("mouseover", function () {
        stopSlider();
    }).on("mouseleave", function () {
        if (!isPaused) startSlider();
    });

    // Initialize play/pause buttons
    $("#play").hide();
    $("#pause").show();



    // Swipe detection function
    // function swipedetect(el, callback) {
    //     var touchsurface = el[0],
    //         swipedir,
    //         startX,
    //         startY,
    //         distX,
    //         distY,
    //         threshold = 75,
    //         restraint = 100,
    //         allowedTime = 300,
    //         elapsedTime,
    //         startTime,
    //         handleswipe = callback || function(swipedir) {};

    //     touchsurface.addEventListener("touchstart", function(e) {
    //         var touchobj = e.changedTouches[0];
    //         swipedir = "none";
    //         startX = touchobj.pageX;
    //         startY = touchobj.pageY;
    //         startTime = new Date().getTime();
    //     }, false);

    //     touchsurface.addEventListener("touchmove", function(e) {
    //         e.preventDefault();
    //     }, false);

    //     touchsurface.addEventListener("touchend", function(e) {
    //         var touchobj = e.changedTouches[0];
    //         distX = touchobj.pageX - startX;
    //         distY = touchobj.pageY - startY;
    //         elapsedTime = new Date().getTime() - startTime;

    //         if (elapsedTime <= allowedTime) {
    //             if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
    //                 swipedir = (distX < 0) ? "left" : "right";
    //             } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
    //                 swipedir = (distY < 0) ? "up" : "down";
    //             }
    //         }

    //         handleswipe(swipedir);
    //     }, false);
    // }

    // Enable swipe detection only on mobile view (max-width: 768px)
    // if ($(window).width() <= 768) {
    //     swipedetect($("#slider"), function(swipedir) {
    //         if (swipedir === "left") {
    //             $("#next-button").click();
    //         } else if (swipedir === "right") {
    //             $("#previous-button").click();
    //         }
    //     });
    // }

});