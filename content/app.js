$(function() {	
	var res = true;
	resize();
	// =================================================================
    // Resize browser
    // =================================================================
	function resize() {
		var max_width = 1400;
		var width = $(".content").width();
		$lis = $("#skills #slider ul li");
		$lis.each(function() {
			$(this).css({'height': width*0.46,'width': width});
		});
		var i;
		var $imgs;
		/**if (width>=max_width&&res) {
			if ($lis.length>1) {
				for (i=1; i<$lis.length; i++) {
					$imgs = $lis.eq(i).find("img:lt("+i+")");				
					$imgs.remove();	
					$imgs.appendTo("#skills #slider ul li:eq("+ (i-1) +") div");							
				}
			}
			res = false;
		}
		if (width<max_width&&(!res)) {
			if ($lis.length>1) {
				for (i=0; i<$lis.length-1; i++) {
					$imgs = $lis.eq(i).find("img:gt("+(-2-i)+")");				
					$imgs.remove();
					$imgs.prependTo("#skills #slider ul li:eq("+ (i+1) +") div");					
				}
			}
			res = true;
		}
		*/
	}
	$(window).resize(function() {
		resize();
		sliderJS(number, $("#slider"),0);
	});		
	// =================================================================
    // Scroll page
    // =================================================================
	fixedNav();
    $(window).scroll(function() {
		fixedNav();
        if (stopnavani)
            return;
		if (($(window).scrollTop() - 1) == ($(document).height() - $(window).height())) {
			$("[data-link-name]").removeClass("current");
			$("[data-link-name]").last().addClass("current");
		} else {
			$("[data-link-name]").each(function() {
				if ($(window).scrollTop() >= $(this).offset().top - $(".nav").outerHeight()) {
					$("[data-link-name]").removeClass("current");
					$(this).addClass("current");
				}
			});
		}
	
        $("[data-link]").parent().removeClass("active");
        $("[data-link='" + $("[data-link-name].current").data("link-name") + "']").parents("li").addClass("active");
        navBar();
    });
	// =================================================================
    // Navigation control widget
    // =================================================================	
	var stopnavani = false;
	navBar();
	
	function fixedNav() {
		//$("#test").text($(window).scrollTop() +" " +($("#top").outerHeight()));
		//if ($(window).scrollTop()>=$("#top").outerHeight()) {
		//	$("#nav").css({"position":"fixed","top":"0px"});
		//} else {
		//	$("#nav").css({"position":"","top":""});
		//}
		var diff = $("#top").outerHeight()-$(window).scrollTop();
		if (diff>0) {
			$("#nav").css({"visibility": ""});
			$("#scroll_nav").css({"display": "none"});
		} else {
			$("#scroll_nav").css({"display": "block"});
			$("#nav").css({"visibility": "hidden"});
		}
	}

    $("[data-link]").click(function() {
        $("[data-link]").parent().removeClass("active");
        $(this).parent().addClass("active");
        stopnavani = true;
        navBar();
		var top = $("[data-link-name='" + $(this).data("link") + "']").offset().top-$(".nav").outerHeight()+1;
        $("html, body").animate({scrollTop: top}, 
			500, "swing", function() {
				stopnavani = false;
				$(window).scroll();
        });
        return false;
    });

    function navBar() {
        $(".nav .bar").width($(".nav li.active").width()).css("left", $(".nav li.active").offset().left - $(".nav .main").offset().left).removeClass("hover");
    };
	
    $(".b-top .b-caption .order .button-info").click(function() {
        $("[data-link='for']").click();
    });
		
	$("a[rel=photos]").fancybox({
		'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'speedIn': 600,
        'speedOut': 200,
        'overlayShow': false,
        'titlePosition': 'outside',
        'padding': [0, 35, 0, 0],
	});
	$("a[rel=skills]").fancybox({
		'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'speedIn': 600,
        'speedOut': 200,
        'overlayShow': false,
        'titlePosition': 'outside',
        'padding': [0, 35, 0, 0],
	});
	
	// =================================================================
    // Popup control widget
    // =================================================================
    hash = location.hash.substring(1);
    if (hash) {
        console.log($('a[href="#'+hash+'"]').html());
        var popup = $("[data-popup='" + hash + "']");
        $("[data-overlay]").fadeIn();
        $(popup).fadeIn().find(".animating").addClass("animated");
        resizePopup(popup);
    }
    else {
        console.log('2');
    }
    $("[data-popup-link]").on("click", function() {
        var popup = $("[data-popup='" + $(this).attr("data-popup-link") + "']");
		$("[data-overlay]").fadeIn();
        $(popup).fadeIn().find(".animating").addClass("animated");
        resizePopup(popup);
    });
	
	function resizePopup(popup) {
        console.log($(popup).html());
        $(popup).css({"margin-left": -$(popup).outerWidth() / 2, "margin-top": $(window).height() / 2 - $(popup).outerHeight() / 2});
        if ($(popup).offset().top < 20) {
            $(popup).css({"margin-top": $(window).scrollTop()}).removeClass("fixed");
        }
        else {
            $(popup).addClass("fixed");
		}
		
    }
	
	 $(window).resize(function() {
        $("[data-popup]").each(function() {
            if ($(this).css("display") == "block")
                resizePopup(this);
        })
    });


    $("[data-overlay], [data-popup-close]").on("click", function() {
        history.pushState('', document.title, window.location.pathname);
        $("[data-overlay]").fadeOut();
        $("[data-popup]").fadeOut(200, function() {
            $("[data-popup] .animating").removeClass("animated");
            setTimeout(function() {
            }, 200)
        });
    });
	
	// =================================================================
    // Slider control widget
    // =================================================================
	
	var number=0;
	var obj = $("div#slider");
	$(obj).append("<div class='nav_sl'></div>");
	$(obj).find("li").each(function () {
		$(obj).find(".nav_sl").append("<span rel='"+$(this).index()+"'></span>"); // добавляем блок навигации
		$(this).addClass("slider"+$(this).index());
	});
	$(obj).find("span").first().addClass("on"); // делаем активным первый элемент меню
	
	function sliderJS (obj, sl, speed) { // slider function
		 var ul = $(sl).find("ul"); // находим блок
		 var bl = $(sl).find("li.slider"+obj); // находим любой из элементов блока
		 var step = $(bl).width(); // ширина объекта
		 $(ul).animate({marginLeft: "-"+step*obj}, speed); // speed это скорость перемотки
	}
	
	$(document).on("click", "#slider .nav_sl span", function() { // slider click navigate
		 var sl = $(this).closest("#slider"); // находим, в каком блоке был клик
		 $(sl).find("span").removeClass("on"); // убираем активный элемент
		 $(this).addClass("on"); // делаем активным текущий
		 number = $(this).attr("rel"); // узнаем его номер
		 sliderJS(number, sl, 500); // слайдим
		 return false;
	});
	
	
	
})