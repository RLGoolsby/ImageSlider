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

    // buttons
    var $sliderControl = $(".slider-control");

    // slides informations
    var $slides = $(".slider"),
        slidesLength = $slides.length;

    // slides array (in reversed order)
    var slidesArr = $slides.toArray().reverse();

    // slide current
    var slideCurrent = 0;

    // Function to announce the slide change to screen reader users
    function announceSlideChange(counter) {
        $("#slider").attr("aria-live", "polite");
        $("#slider").attr("aria-atomic", "true");
        $("#slider").attr("aria-relevant", "additions text");
        $("#slider").find(".sr-only").text("Slide " + counter + " of " + slidesLength);
    }

    $sliderControl.on("click", function(e) {
        var $target = $(e.target);

        // get next button
        if ($target.hasClass("next")) {
            var $next = $target,
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

        // get prev button
        if ($target.hasClass("prev")) {
            slideCurrent--;

            var $prev = $target,
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
    });

   // Add hover effect to fade out text after a few seconds for active slide
    $(".slide.active").hover(
        function() {
            $(this).find(".caption").css("opacity", "1"); // Show caption on hover
        },
        function() {
            var $this = $(this);
            setTimeout(function() {
                $this.find(".caption").addClass("fadeOut"); // Fade out caption after hover ends
            }, 3000);
        }
    );

    // Add hover effect to show caption only on the active image
    $(".slide").hover(
        function() {
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.find(".caption").css("opacity", "1"); // Show caption when active slide is hovered
            }
        },
        function() {
            var $this = $(this);
            if ($this.hasClass('active')) {
                setTimeout(function() {
                    $this.find(".caption").addClass("fadeOut"); // Fade out after a delay
                }, 3000);
            }
        }
    );


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

        touchsurface.addEventListener("touchstart", function(e) {
            var touchobj = e.changedTouches[0];
            swipedir = "none";
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
        }, false);

        touchsurface.addEventListener("touchmove", function(e) {
            e.preventDefault();
        }, false);

        touchsurface.addEventListener("touchend", function(e) {
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




// $(document).ready(function() {
//     var counter = 1;
//     var numberOfImages = $(".imgCheck").length;
//     var interval;
//     var isPaused = false; // To track whether the slider is paused

    // Function to start the interval for auto-sliding
    // function startSlider() {
    //     interval = setInterval(function() {
    //         $("#s" + counter).prop("checked", true);
    //         counter++;
    //         if (counter > numberOfImages) {
    //             counter = 1;
    //         }
    //         announceSlideChange(counter);
    //     }, 5000);
    // }

    // function stopSlider() {
    //     clearInterval(interval);
    // }

    // Function to announce the slide change to screen reader users
    // function announceSlideChange(counter) {
    //     $("#slider").attr("aria-live", "polite");
    //     $("#slider").attr("aria-atomic", "true");
    //     $("#slider").attr("aria-relevant", "additions text");
    //     $("#slider").find(".sr-only").text("Slide " + counter + " of " + numberOfImages);
    // }

    // Start the slider initially
    // startSlider(0);
    // announceSlideChange(counter);

    // Start the slider initially
    // startSlider();
    // announceSlideChange(counter);

    // Next button functionality
    // $("#next-button").on("click", function(e) {
    //     e.preventDefault();
    //     stopSlider();
    //     counter++;
    //     if (counter > numberOfImages) {
    //         counter = 1;
    //     }
    //     $("#s" + counter).prop("checked", true);
    //     announceSlideChange(counter);
    //     if (!isPaused) {
    //         startSlider();
    //     }
    // });

    // Previous button functionality
    // $("#previous-button").on("click", function(e) {
    //     e.preventDefault();
    //     stopSlider();
    //     counter--;
    //     if (counter < 1) {
    //         counter = numberOfImages;
    //     }
    //     $("#s" + counter).prop("checked", true);
    //     announceSlideChange(counter);
    //     if (!isPaused) {
    //         startSlider();
    //     }
    // });

    // Pause button functionality
    // $('#pause').on('click', function() {
    //     stopSlider();
    //     isPaused = true; // Update pause state
    //     $(this).hide();
    //     $('#play').show();
    // });

    // Play button functionality
    // $('#play').on('click', function() {
    //     isPaused = false; // Update pause state
    //     startSlider();
    //     $(this).hide();
    //     $('#pause').show();
    // });

    // Pause/play slider on keyup (spacebar)
    // $(document).on("keyup", function(e) {
    //     if (e.key === " " || e.key === "Spacebar") {
    //         e.preventDefault();
    //         isPaused = !isPaused;
    //         if (isPaused) {
    //             stopSlider();
    //             $('#pause').hide();
    //             $('#play').show();
    //         } else {
    //             startSlider();
    //             $('#play').hide();
    //             $('#pause').show();
    //         }
    //     }
    // });

    // Pause slider on mouseover and resume on mouseleave
    // $("#slider").on("mouseover", function() {
    //     stopSlider();
    // }).on("mouseleave", function(e) {
    //     e.preventDefault();
    //     if (!isPaused) {
    //         startSlider();
    //     }
    // });

    // Initial state of play/pause buttons
    // $('#play').hide();
    // $('#pause').show();

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
//     if ($(window).width() <= 768) {
//         swipedetect($("#slider"), function(swipedir) {
//             if (swipedir === "left") {
//                 $("#next-button").click();
//             } else if (swipedir === "right") {
//                 $("#previous-button").click();
//             }
//         });
//     }

// });