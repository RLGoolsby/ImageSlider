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

    function announceSlideChange(slideNumber) {
        $("#slider").attr("aria-live", "polite");
        $("#slider").attr("aria-atomic", "true");
        $("#slider").attr("aria-relevant", "additions text");
        $("#slider").find(".sr-only").text("Slide " + slideNumber + " of " + numberOfImages);
    }

    // Start the slider initially
    startSlider();

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
    $("#slider").on("mouseover", function(e) {
        e.preventDefault();
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
});