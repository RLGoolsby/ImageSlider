$(document).ready(function() {
    var counter = 1;
    var numberOfImages = $(".imgCheck").length;
    var interval;
    var isPaused = false; // To track whether the slider is paused

    // Function to start the interval for auto-sliding
    function startSlider() {
        interval = setInterval(function() {
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
        $("#slider").find(".sr-only").text("Slide " + counter + " of " + numberOfImages);
    }

    // Start the slider initially
    startSlider(0);
    announceSlideChange(counter);

    // Next button functionality
    $("#next-button").on("click", function(e) {
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

    // Previous button functionality
    $("#previous-button").on("click", function(e) {
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

    // Pause button functionality
    $('#pause').on('click', function() {
        stopSlider();
        isPaused = true; // Update pause state
        $(this).hide();
        $('#play').show();
    });

    // Play button functionality
    $('#play').on('click', function() {
        isPaused = false; // Update pause state
        startSlider();
        $(this).hide();
        $('#pause').show();
    });

    // Pause/play slider on keyup (spacebar)
    $(document).on("keyup", function(e) {
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
    $("#slider").on("mouseover", function() {
        stopSlider();
    }).on("mouseleave", function(e) {
        e.preventDefault();
        if (!isPaused) {
            startSlider();
        }
    });

    // Initial state of play/pause buttons
    $('#play').hide();
    $('#pause').show();

    // Swipe detection function
    function swipedetect(el, callback) {
        var touchsurface = el[0],
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 75,
            restraint = 100,
            allowedTime = 300,
            elapsedTime,
            startTime,
            handleswipe = callback || function(swipedir) {};

        touchsurface.on("touchstart", function(e) {
            var touchobj = e.changedTouches[0];
            swipedir = "none";
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
        }, false);

        touchsurface.on("touchmove", function(e) {
            e.preventDefault();
        }, false);

        touchsurface.on("touchend", function(e) {
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;

            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    swipedir = (distX < 0) ? "left" : "right";
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
                    swipedir = (distY < 0) ? "up" : "down";
                }
            }

            handleswipe(swipedir);
        }, false);
    }

    // Enable swipe detection only on mobile view (max-width: 768px)
    if ($(window).width() <= 768) {
        swipedetect($("#slider"), function(swipedir) {
            if (swipedir === "left") {
                $("#next-button").click();
            } else if (swipedir === "right") {
                $("#previous-button").click();
            }
        });
    }
});