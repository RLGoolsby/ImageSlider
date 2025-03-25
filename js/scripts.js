$(document).ready(function () {
    var counter = 1;
    var numberOfImages = $(".imgCheck").length;
    var interval;
    var isPaused = false; // Track if the slider is paused
    var autoSlideTime = 5000; // Auto-slide every 5s
    var startX, swipeThreshold = 50; // Variables for swipe detection

    // ✅ **Function to Start Auto-Slide**
    function startSlider() {
        if (!isPaused) {
            interval = setInterval(function () {
                counter++;
                if (counter > numberOfImages) {
                    counter = 1;
                }
                $("#s" + counter).prop("checked", true);
                updateCaption(); // Update caption
                announceSlideChange(counter);
            }, autoSlideTime);
        }
    }

    // ✅ **Function to Stop Auto-Slide**
    function stopSlider() {
        clearInterval(interval);
    }

    // ✅ **Function to Announce Slide Change for Screen Readers**
    function announceSlideChange(counter) {
        $("#slider").attr("aria-live", "polite");
        $("#slider").attr("aria-atomic", "true");
        $("#slider").attr("aria-relevant", "additions text");
        $("#slider").find(".sr-only").text("Slide " + counter + " of " + numberOfImages);
    }

// ✅ **Function to Show Caption for Checked Image**
function updateCaption() {
    $(".caption").removeClass("visible fadeOut"); // Hide all captions
    $(".imgCheck:checked").each(function () {
        var slide = $(this).closest(".slider");
        slide.find(".caption").addClass("visible"); // Show caption for checked slide
        setTimeout(function () {
            slide.find(".caption").addClass("fadeOut"); // Fade out after 3s
        }, 3000); // 3 seconds
    });
}

    // ✅ **Swipe Detection Function**
    function enableSwipe() {
        if ($(window).width() <= 768) { // Mobile-only swipe
            $(document).on("touchstart", function (e) {
                startX = e.changedTouches[0].pageX;
            });

            $(document).on("touchend", function (e) {
                let endX = e.changedTouches[0].pageX;
                let swipeDistance = startX - endX;

                if (Math.abs(swipeDistance) > swipeThreshold) {
                    stopSlider(); // Pause auto-slide
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

    // ✅ **Event Listeners for Buttons**
    $("#next-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter++;
        if (counter > numberOfImages) {
            counter = 1;
        }
        $("#s" + counter).prop("checked", true);
        updateCaption(); // Update caption
        announceSlideChange(counter);
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
        updateCaption(); // Update caption
        announceSlideChange(counter);
        if (!isPaused) startSlider();
    });

    // ✅ **Update Caption When Slide Changes**
    $(".imgCheck").on("change", function () {
        updateCaption();
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

    // ✅ **Pause Auto-Sliding on Hover**
    $("#slider").on("mouseover", stopSlider).on("mouseleave", function () {
        if (!isPaused) startSlider();
    });

    // ✅ **Start Everything**
    startSlider();
    enableSwipe();
    $(window).resize(enableSwipe);
    updateCaption(); // Ensure correct caption is shown on page load
});
