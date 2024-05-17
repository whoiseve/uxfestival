/*
  [JS Index]
  
  ---
  
  Template Name: Enex - Under Construction Template
  Author:  ex-nihilo
  Version: 1.0
*/

/*
  1. preloader
  2. timeout function
    2.1. show fadeIn element
    2.2. show elements, navigation, hero
	2.3. init
  3. section animation
  4. social icons share
  6. modals
    6.1. sign up modal
    6.2. contact modal
  7. slick slider
    7.1. slick fullscreen slideshow ZOOM/FADE
  8. YouTube player
  9. navigation
  10. countdown
    10.1. countdown SETUP
	10.2. countdown script
  11. borders
*/

$(function () {
  "use strict";

  $(window).on("load", function () {
    // 1. preloader
    $("#preloader").fadeOut(1400);
    $("#preloader-status").delay(300).fadeOut("slow");

    // 2. timeout function
    // 2.1. show fadeIn element
    setTimeout(function () {
      $(".fadeIn-element")
        .delay(600)
        .css({
          display: "none",
        })
        .fadeIn(2000);
    }, 0);
    // 2.2. show elements, navigation, hero
    setTimeout(function () {
      $(".navigation-top").removeClass("top-position");
    }, 600);
    setTimeout(function () {
      $(".bottom-credits, .social-icons-wrapper-share, .navigation-bottom").removeClass("bottom-position");
    }, 600);
    setTimeout(function () {
      $(".navigation-left").removeClass("left-position");
    }, 600);
    setTimeout(function () {
      $(".navigation-right").removeClass("right-position");
    }, 600);
    $(".hero-bg").addClass("hero-bg-show");
    // 2.3. init
    $(initAnimation);
    $(initElements);
  });

  $(window).on("resize", function () {
    $(resizeBorders);
  });

  // 3. section animation
  $(".navigation .move a, .sign-up-modal-launcher").on("click", function () {
    $(".bottom-credits").addClass("bottom-credits-home-call");
    $(".social-icons-wrapper-share").addClass("social-icons-wrapper-share-home-call");
    $(".section-closer").addClass("show");
    $(".navigation-top").addClass("navigation-top-position-primary");
    $(".navigation-bottom").addClass("navigation-bottom-position-primary");
    $(".navigation-left").addClass("navigation-left-position-primary");
    $(".navigation-right").addClass("navigation-right-position-primary");
    $(".introduction").removeClass("introduction-element-on").addClass("introduction-element-off");
    $(".borders-introduction")
      .removeClass("borders-introduction-element-on")
      .addClass("borders-introduction-element-off");
    $(".bottom-credits, .social-icons-wrapper-share").removeClass("element-on").addClass("element-off");
    $(".hero-bg").removeClass("hero-bg-show-primary, hero-bg-show").addClass("hero-bg-show-secondary, hero-bg-FIX");
  });
  $(".closer, .sign-up-modal-closer").on("click", function () {
    $(".bottom-credits").removeClass("bottom-credits-home-call");
    $(".social-icons-wrapper-share").removeClass("social-icons-wrapper-share-home-call");
    $(".section-closer").removeClass("show");
    $(".navigation-top").removeClass("navigation-top-position-primary");
    $(".navigation-bottom").removeClass("navigation-bottom-position-primary");
    $(".navigation-left").removeClass("navigation-left-position-primary");
    $(".navigation-right").removeClass("navigation-right-position-primary");
    $(".introduction").removeClass("introduction-element-off").addClass("introduction-element-on");
    $(".borders-introduction")
      .removeClass("borders-introduction-element-off")
      .addClass("borders-introduction-element-on");
    $(".bottom-credits, .social-icons-wrapper-share").removeClass("element-off").addClass("element-on");
    $(".hero-bg").removeClass("hero-bg-show-secondary, hero-bg-FIX").addClass("hero-bg-show-primary, hero-bg-show");
  });
  $(".contact-modal-closer").on("click", function () {
    $(".section-closer").addClass("show");
    $(".hero-bg").removeClass("hero-bg-show-primary, hero-bg-show").addClass("hero-bg-show-secondary, hero-bg-FIX");
  });
  $(".contact-modal-launcher").on("click", function () {
    $(".section-closer").removeClass("show");
    $(".hero-bg").removeClass("hero-bg-show-secondary, hero-bg-FIX").addClass("hero-bg-show-primary, hero-bg-show");
  });

  // 4. social icons share
  $(".social-toggle-wrap").hover(
    function () {
      $(this).find(".social-widgets-wrap").stop().fadeIn("slow");
    },
    function () {
      $(this).find(".social-widgets-wrap").stop().delay(50).fadeOut("slow");
    }
  );

  // 6. modals
  // 6.1. sign up modal
  $(".sign-up-modal-launcher, .sign-up-modal-closer").on("click", function () {
    if ($(".sign-up-modal").hasClass("open")) {
      $(".sign-up-modal").removeClass("open").addClass("close");
    } else {
      $(".sign-up-modal").removeClass("close").addClass("open");
    }
  });
  // 6.2. contact modal
  $(".contact-modal-launcher, .contact-modal-closer").on("click", function () {
    if ($(".contact-modal").hasClass("open")) {
      $(".contact-modal").removeClass("open").addClass("close");
    } else {
      $(".contact-modal").removeClass("close").addClass("open");
    }
  });

  // 7. slick slider
  // 7.1. slick fullscreen slideshow ZOOM/FADE
  $(".slick-fullscreen-slideshow-zoom-fade").slick({
    arrows: false,
    initialSlide: 0,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    speed: 1600,
    draggable: true,
    dots: false,
    pauseOnDotsHover: true,
    pauseOnFocus: false,
    pauseOnHover: false,
  });

  // 8. YouTube player
  $("#bgndVideo").YTPlayer();

  // 9. navigation
  setUpSections();
  $(".navigation .move a").on("click", function () {
    var target = $(this).attr("href");
    openContent(target, $(target).attr("data-direction"));
    return false;
  });
  $(".closer").on("click", function () {
    closeContent($("section.active").attr("data-direction"));
    return false;
  });

  // 10. countdown
  // 10.1. countdown SETUP
  var end = new Date("01/01/2025 12:00 AM"); // FORMAT: month/day/year time
  // 10.2. countdown script
  var _second = 1000;
  var _minute = _second * 60;
  var _hour = _minute * 60;
  var _day = _hour * 24;
  var timer;
  function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {
      clearInterval(timer);
      document.getElementById("countdown").innerHTML = "EXPIRED.";
      return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);
    document.getElementById("countdown").innerHTML = days + "d, ";
    document.getElementById("countdown").innerHTML += hours + "h, ";
    document.getElementById("countdown").innerHTML += minutes + "m &amp; ";
    document.getElementById("countdown").innerHTML += seconds + "s left";
  }
  timer = setInterval(showRemaining, 1000);

  // 11. borders
  function initAnimation() {
    $(".border-top-1, .border-top-2, .border-bottom-1, .border-bottom-2").css("width", "50%");
    $(".border-left, .border-right").css("height", "100%");
    var heightLaterals = $(".border-right").height();
    $(".border-left, .border-right").css("height", "0px");
    $(".border-left, .border-right").css("top", heightLaterals / 2 + "px");
    var widthFramework = $(".border-top-1").width();
    var widthTop = $(".center-space-top span").width();
    var widthBottom = $(".center-space-bottom span").width();
    var calculateTop = widthFramework - widthTop / 2 - 8;
    var calculateBottom = widthFramework - widthBottom / 2 - 8;
    $(".border-top-1, .border-top-2, .border-bottom-1, .border-bottom-2").css("width", "0%");
    $(".border-left, .border-right").animate(
      {
        height: heightLaterals + "px",
        top: "0px",
      },
      600,
      function () {
        $(".border-left, .border-right").css({
          height: "100%",
        });
        $(".border-top-1, .border-top-2").animate(
          {
            width: calculateTop - 25 + "px",
          },
          600
        );
        $(".border-bottom-1, .border-bottom-2").animate(
          {
            width: calculateBottom - 25 + "px",
          },
          600
        );
        $(".center-space-top, .center-space-bottom").stop(true, true).delay(600).animate(
          {
            opacity: 1,
          },
          2000
        );
      }
    );
  }
  function initElements() {
    $(".center-space-top, .center-space-bottom").css("opacity", "0");
    $(".border-top-1, .border-top-2, .border-bottom-1, .border-bottom-2").css("width", "0%");
    $(".border-left, .border-right").css("height", "0px");
  }
  function resizeBorders() {
    $(".border-top-1, .border-top-2, .border-bottom-1, .border-bottom-2").css("width", "50%");
    var widthFramework = $(".border-top-1").width();
    var widthTop = $(".center-space-top span").width();
    var widthBottom = $(".center-space-bottom span").width();
    var calculateTop = widthFramework - widthTop / 2 - 8;
    var calculateBottom = widthFramework - widthBottom / 2 - 8;
    $(".border-top-1, .border-top-2").width(calculateTop);
    $(".border-bottom-1, .border-bottom-2").width(calculateBottom);
  }
});
