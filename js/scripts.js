$(document).ready(function() {
    var imageContainer = $('#slider');
    var images = imageContainer.find('img');
    var startX;
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
    // Swipe functionality for touch devices
    imageContainer.on('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    imageContainer.on('touchmove', (e) => {
        if (!startX) return;
        var currentX = e.touches[0].clientX;
        var diffX = currentX - startX;
        // Apply a visual effect during the swipe (optional)
        imageContainer.style.transform = `translateX(${diffX}px)`;
    });
    imageContainer.on('touchend', (e) => {
        if (!startX) return;

        var endX = e.changedTouches[0].clientX;
        var diffX = endX - startX;

        // Reset the visual effect
        imageContainer.style.transform = 'translateX(0)';
        startX = null;

        var threshold = 50; // Adjust as needed
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                counter = Math.max(0, counter - 1); // Swipe right
            } else {
                counter = Math.min(images.length - 1, counter + 1); // Swipe left
            }
            updateImage();
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
});