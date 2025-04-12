$(document).ready(function () {
    var counter = 1;
    var numberOfImages = $(".imgCheck").length;
    var interval;
    var isPaused = false; // Track if the slider is paused
    var startX, swipeThreshold = 50; // Variables for swipe detection

    // **Function to start auto-slide**
    function startSlider() {
        interval = setInterval(function () {
            $("#s" + counter).prop("checked", true);
            counter++;
            if (counter > numberOfImages) {
                counter = 1;
            }
            announceSlideChange(counter);
            updateCaption(); // Update caption when slide changes
        }, 5000); // 5 seconds interval
    }

    // **Function to stop auto-slide**
    function stopSlider() {
        clearInterval(interval);
    }

    // **Function to announce slide change for screen readers**
    function announceSlideChange(counter) {
        $("#slider").attr("aria-live", "polite");
        $("#slider").attr("aria-atomic", "true");
        $("#slider").attr("aria-relevant", "additions text");
        $("#slider").find(".sr-only").text("Slide " + counter + " of " + numberOfImages);
    }

    // **Function to update caption visibility**
    function updateCaption() {
        $(".caption").removeClass("visible fadeOut"); // Reset all captions

        // Get the currently checked image
        var $activeSlide = $(".imgCheck:checked").closest(".slider");

        if ($activeSlide.length) {
            var $caption = $activeSlide.find(".caption");

            // Show caption on hover and fade out after 10s
            $activeSlide.on("mouseenter", function () {
                $caption.removeClass("fadeOut").addClass("visible"); // Show caption
                setTimeout(function () {
                    $caption.addClass("fadeOut"); // Fade out the caption after 10s
                }, 10000); // 10 seconds
            });

            // Ensure caption hides when mouse leaves
            $activeSlide.on("mouseleave", function () {
                $caption.addClass("fadeOut"); // Fade out immediately on mouse leave
            });
        }
    }

    // **Event Listeners for Buttons**
    $("#next-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter++;
        if (counter > numberOfImages) {
            counter = 1;
        }
        $("#s" + counter).prop("checked", true);
        announceSlideChange(counter);
        updateCaption();
        if (!isPaused) startSlider();
    });

    $("#previous-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter--;
        if (counter < 1) {
            counter = numberOfImages;
        }
        $("#s" + counter).prop("checked", true);
        announceSlideChange(counter);
        updateCaption();
        if (!isPaused) startSlider();
    });

    // ✅ **Play / Pause Functionality**
    $('#pause').on('click', function () {
        stopSlider();
        isPaused = true;
        $(this).hide();
        $('#play').show();
    });

    $('#play').on('click', function () {
        isPaused = false;
        startSlider();
        $(this).hide();
        $('#pause').show();
    });

    $(document).on("keyup", function (e) {
        if (e.key === "" || e.key === "Spacebar") {
            e.preventDefault();
            isPaused = !isPaused;
            if (isPaused) {
                stopSlider();
                $('#play').$show();
                $('#pause').$hide();
            } else {
                startSlider();
                $('#play').hide();
                $('#pause').show();
            }
        }
    });


    //**Pause Auto-Sliding on Hover**
    $("#slider").on("mouseover", function () {
        stopSlider();
    })
        .on("mouseleave", function (e) {
            e.preventDefault();
            if (!isPaused) { startSlider() };
        });
        
        //Initial State of Play/Pause Button
        $('#play').hide();
        $('#pause').show();

    //Enable Swipe for Mobile
    function enableSwipe() {
        if ($(window).width() <= 768) { // Mobile-only swipe
            $(document).on("touchstart", function (e) {
                startX = e.changedTouches[0].pageX;
            });

            $(document).on("touchend", function (e) {
                let endX = e.changedTouches[0].pageX;
                let swipeDistance = startX - endX;

                if (Math.abs(swipeDistance) > swipeThreshold) {
                    stopSlider();
                    isPaused = true;

                    if (swipeDistance > 0) {
                        $("#next-button").click(); // Swipe left → next
                    } else {
                        $("#previous-button").click(); // Swipe right → previous
                    }

                    // Restart auto-slide after inactivity
                    setTimeout(() => {
                        isPaused = false;
                        startSlider();
                    }, autoSlideTime);
                }
            });
        } else {
            $(document).off("touchstart touchend"); // Remove swipe on desktop
        }
    }

    // **Enable Swipe Detection**
    function swipedetect(el, callback) {
        var swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 75,
            restraint = 100,
            allowedTime = 300,
            elapsedTime,
            startTime,
            handleswipe = callback || function (swipedir) { };

        el.on("touchstart", function (e) {
            var touchobj = e.originalEvent.changedTouches[0];
            swipedir = "none";
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
        });

        el.on("touchmove", function (e) {
            e.preventDefault();
        });

        el.on("touchend", function (e) {
            var touchobj = e.originalEvent.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;

            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    swipedir = (distX < 0) ? "left" : "right";
                }
            }

            handleswipe(swipedir);
        });
    }

    // **Enable swipe detection only on mobile view (max-width: 768px)**
    if ($(window).width() <= 768) {
        swipedetect($("#slider"), function (swipedir) {
            if (swipedir === "left") {
                $("#next-button").click();
            } else if (swipedir === "right") {
                $("#previous-button").click();
            }
        });
    }

    // **Initializations**
    startSlider();
    enableSwipe();
    updateCaption();
    $(window).resize(enableSwipe);
});
