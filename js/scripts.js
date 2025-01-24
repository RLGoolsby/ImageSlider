/* THIS IS WHERE YOU PUT YOUR CUSTOM JAVASCRIPT/JQUERY CODE*/
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
        }, 4000);
    }

    function stopSlider() {
        clearInterval(interval);
    }
    // Start the slider initially
    startSlider(0);

    // Next button functionality
    $("#next-button").on("click", function(e) {
        e.preventDefault();
        stopSlider();
        counter++;
        if (counter > numberOfImages) {
            counter = 1;
        }
        $("#s" + counter).prop("checked", true);
        startSlider(); // Restart the slider only if not paused
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
        startSlider(); // Restart the slider only if not paused
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
            } else {
                startSlider();
            }
        }
    });

    // Pause slider on mouseover and resume on mouseleave
    $("#slider").on("mouseover", function() {
        stopSlider();
    }).on("mouseleave", function() {
        if (!isPaused) {
            startSlider();
        }
    });
});