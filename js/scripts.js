$(document).ready(function () {
    // Variables
    var counter = 1;
    var numberOfImages = $(".imgCheck").length;
    var interval;
    var isPaused = false; // To track whether the slider is paused

    // Slider Controls
    var $sliderControl = $(".slider-control");
    var $slides = $(".slider");
    var slidesLength = $slides.length;
    var slidesArr = $slides.toArray().reverse(); // Reversed slides array
    var slideCurrent = 0;

    // Function to start the interval for auto-sliding
    function startSlider() {
        interval = setInterval(function () {
            $("#s" + counter).prop("checked", true);
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

    // Function to announce the slide change to screen reader users
    function announceSlideChange(counter) {
        $("#slider").attr("aria-live", "polite");
        $("#slider").attr("aria-atomic", "true");
        $("#slider").attr("aria-relevant", "additions text");
        $("#slider").find(".sr-only").text("Slide " + counter + " of " + slidesLength);
    }

    // Next button functionality
    function nextSlide() {
        var $next = $(".next"),
            $prev = $next.prev(),
            $nextSlide = $(slidesArr[slideCurrent + 1]),
            $slide = $(slidesArr[slideCurrent]);

        $slide.addClass("fadeOut").removeClass("caption");
        $nextSlide.addClass("caption");
        announceSlideChange(slideCurrent + 1);

        slideCurrent++;
        if (slideCurrent > 0) {
            $prev.removeClass("disabled");
        }
        if (slideCurrent === slidesLength - 1) {
            $next.addClass("disabled");
        }
    }

    // Previous button functionality
    function prevSlide() {
        slideCurrent--;

        var $prev = $(".prev"),
            $next = $prev.next(),
            $prevSlide = $(slidesArr[slideCurrent + 1]),
            $slide = $(slidesArr[slideCurrent]);

        $prevSlide.removeClass("caption");
        $slide.removeClass("fadeOut").addClass("caption");
        announceSlideChange(slideCurrent + 1);

        if (slideCurrent === slidesLength - 2) {
            $next.removeClass("disabled");
        }
        if (slideCurrent === 0) {
            $prev.addClass("disabled");
        }
    }

    // Slider Controls Events
    $sliderControl.on("click", function (e) {
        var $target = $(e.target);
        if ($target.hasClass("next")) {
            nextSlide();
        } else if ($target.hasClass("prev")) {
            prevSlide();
        }
    });

// Hover effect for captions based on checked radio button
function hoverEffect() {
    $(".slide").hover(
        function () {
            var $this = $(this);
            // Check if the slide is the active one based on :checked radio button
            if ($("#" + $this.attr('id') + " input[type='radio']:checked").length) {
                $this.find(".caption").css("opacity", "1"); // Show caption on hover
            }
        },
        function () {
            var $this = $(this);
            // Check if the slide is the active one based on :checked radio button
            if ($("#" + $this.attr('id') + " input[type='radio']:checked").length) {
                setTimeout(function () {
                    $this.find(".caption").addClass("fadeOut"); // Fade out after a delay
                }, 3000);
            }
        }
    );
}

    // Next/Previous buttons functionality
    $("#next-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter++;
        if (counter > numberOfImages) {
            counter = 1;
        }
        $("#s" + counter).prop("checked", true);
        announceSlideChange(counter);
        if (!isPaused) {
            startSlider();
        }
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
        if (!isPaused) {
            startSlider();
        }
    });

    // Pause/Play slider
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

    // Pause/play slider on spacebar
    $(document).on("keyup", function (e) {
        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            isPaused = !isPaused;
            if (isPaused) {
                stopSlider();
                $('#pause').hide();
                $('#play').show();
            } else {
                startSlider();
                $('#play').hide();
                $('#pause').show();
            }
        }
    });

    // Pause slider on mouseover and resume on mouseleave
    $("#slider").on("mouseover", function () {
        stopSlider();
    }).on("mouseleave", function (e) {
        e.preventDefault();
        if (!isPaused) {
            startSlider();
        }
    });

    // Initial state of play/pause buttons
    $('#play').hide();
    $('#pause').show();

    // Swipe detection for mobile
    function swipedetect(el, callback) {
        var touchsurface = el[0],
            swipedir, startX, startY, distX, distY, threshold = 75,
            restraint = 100, allowedTime = 300, elapsedTime, startTime;

        touchsurface.addEventListener("touchstart", function (e) {
            var touchobj = e.changedTouches[0];
            swipedir = "none";
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
        }, false);

        touchsurface.addEventListener("touchmove", function (e) {
            e.preventDefault();
        }, false);

        touchsurface.addEventListener("touchend", function (e) {
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;

            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    swipedir = (distX < 0) ? "left" : "right";
                }
            }
            callback(swipedir);
        }, false);
    }

    if ($(window).width() <= 768) {
        swipedetect($("#slider"), function (swipedir) {
            if (swipedir === "left") {
                $("#next-button").click();
            } else if (swipedir === "right") {
                $("#previous-button").click();
            }
        });
    }

    // Initialize hover effects
    hoverEffect();

    // Start slider initially
    startSlider();
    announceSlideChange(counter);
});
