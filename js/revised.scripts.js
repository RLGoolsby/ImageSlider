$(document).ready(function () {

    /* ============================================
       APP CACHE — measured/queried once, reused everywhere
       ============================================ */
    const app = {
        $slider: $("#slider"),
        $radios: $(".imgCheck"),
        $slides: $(".slider"),
        $captions: $(".caption"),
        $srOnly: $("#slider").find(".sr-only"),
        $play: $("#play"),
        $pause: $("#pause"),
        numberOfImages: $(".imgCheck").length,
        isMobile: window.innerWidth <= 768,
        sliderWidth: 0,
        sliderHeight: 0
    };

    function cacheMeasurements() {
        // Single read pass — no writes happen in here, so no layout thrashing.
        const rect = app.$slider[0].getBoundingClientRect();
        app.sliderWidth = rect.width;
        app.sliderHeight = rect.height;
        app.isMobile = window.innerWidth <= 768;
    }
    cacheMeasurements();

    let counter = 1;
    let interval = null;
    let isPaused = false;
    let begX, swipeThreshold = 50;
    const autoSlideTime = 5000;      // was referenced but never defined before
    const captionFadeDelay = 10000;

    // rAF batching state — reads get queued, then flushed in one frame
    let pendingFrame = null;
    let pendingUpdate = null;

    /* ============================================
       LAYOUT PASS — the ONLY place style/attr writes happen
       ============================================ */
    function flushLayout() {
        pendingFrame = null;
        if (!pendingUpdate) return;

        const { index } = pendingUpdate;
        pendingUpdate = null;

        // Writes only — transform/opacity already driven by CSS via
        // the :checked selectors, so all we do here is flip state,
        // which stays cheap and compositor-friendly.
        app.$radios.eq(index - 1).prop("checked", true);

        app.$slider
            .attr("aria-live", "polite")
            .attr("aria-atomic", "true")
            .attr("aria-relevant", "additions text");
        app.$srOnly.text("Slide " + index + " of " + app.numberOfImages);

        refreshCaptionBinding();
    }

    // Queue a slide change; only ever one rAF in flight at a time
    function scheduleSlideUpdate(index) {
        pendingUpdate = { index };
        if (pendingFrame === null) {
            pendingFrame = requestAnimationFrame(flushLayout);
        }
    }

    /* ============================================
       AUTO-SLIDE
       ============================================ */
    function startSlider() {
        interval = setInterval(function () {
            counter++;
            if (counter > app.numberOfImages) counter = 1;
            scheduleSlideUpdate(counter);
        }, autoSlideTime);
    }

    function stopSlider() {
        clearInterval(interval);
    }

    /* ============================================
       CAPTION VISIBILITY (hover-driven, event-only — no per-frame work)
       ============================================ */
    function refreshCaptionBinding() {
        app.$captions.removeClass("visible fadeOut");

        const $activeSlide = app.$radios.filter(":checked").closest(".slider");
        if (!$activeSlide.length) return;

        const $caption = $activeSlide.find(".caption");

        $activeSlide.off("mouseenter.caption mouseleave.caption");

        $activeSlide.on("mouseenter.caption", function () {
            $caption.removeClass("fadeOut").addClass("visible");
            setTimeout(function () {
                $caption.addClass("fadeOut");
            }, captionFadeDelay);
        });

        $activeSlide.on("mouseleave.caption", function () {
            $caption.addClass("fadeOut");
        });
    }

    /* ============================================
       BUTTON CONTROLS
       ============================================ */
    $("#next-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter++;
        if (counter > app.numberOfImages) counter = 1;
        scheduleSlideUpdate(counter);
        if (!isPaused) startSlider();
    });

    $("#previous-button").on("click", function (e) {
        e.preventDefault();
        stopSlider();
        counter--;
        if (counter < 1) counter = app.numberOfImages;
        scheduleSlideUpdate(counter);
        if (!isPaused) startSlider();
    });

    app.$pause.on("click", function () {
        stopSlider();
        isPaused = true;
        app.$pause.hide();
        app.$play.show();
    });

    app.$play.on("click", function () {
        isPaused = false;
        startSlider();
        app.$play.hide();
        app.$pause.show();
    });

    $(document).on("keyup", function (e) {
        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            isPaused = !isPaused;
            if (isPaused) {
                stopSlider();
                app.$play.show();
                app.$pause.hide();
            } else {
                startSlider();
                app.$play.hide();
                app.$pause.show();
            }
        }
    });

    // Pause on hover, resume on leave (unless user paused manually)
    app.$slider
        .on("mouseover", function () {
            stopSlider();
        })
        .on("mouseleave", function (e) {
            e.preventDefault();
            if (!isPaused) startSlider();
        });

    app.$play.hide();
    app.$pause.show();

    /* ============================================
       SWIPE (mobile only)
       ============================================ */
    function enableSwipe() {
        app.$slider.off("touchstart.swipe touchend.swipe");
        if (!app.isMobile) return;

        app.$slider.on("touchstart.swipe", function (e) {
            begX = e.originalEvent.changedTouches[0].pageX;
        });

        app.$slider.on("touchend.swipe", function (e) {
            const endX = e.originalEvent.changedTouches[0].pageX;
            const swipeDistance = begX - endX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                stopSlider();
                isPaused = true;

                if (swipeDistance > 0) {
                    $("#next-button").trigger("click");
                } else {
                    $("#previous-button").trigger("click");
                }

                setTimeout(function () {
                    isPaused = false;
                    startSlider();
                }, autoSlideTime);
            }
        });
    }

    /* ============================================
       RESIZE — reads batched, writes (rebinding swipe) done once
       ============================================ */
    let resizeFrame = null;
    $(window).on("resize", function () {
        if (resizeFrame !== null) return; // coalesce bursts into one frame
        resizeFrame = requestAnimationFrame(function () {
            resizeFrame = null;
            cacheMeasurements();   // read
            enableSwipe();         // write
        });
    });

    /* ============================================
       INIT
       ============================================ */
    startSlider();
    enableSwipe();
    refreshCaptionBinding();
});