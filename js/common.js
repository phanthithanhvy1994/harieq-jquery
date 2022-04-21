"use strict";

/* *
 * global
 * */
if (typeof (site_url) === 'undefined') {
	var site_url = '';
	var theme_url = ''
	var path_media = 'images/';
} else var path_media = '/wp-content/uploads/';
var media_upload = site_url + path_media;

var viewportW = jQuery(window).width();
var viewportH = jQuery(window).height();
var documentH = 0;
var viewportSMP = 800;
var navbox = jQuery('.navbox');

jQuery(document).ready(function () {
	load_function();
	jQuery(window).smartresize(function () {
		viewportW = jQuery(window).width();
		viewportH = jQuery(window).height();
		navbox_layout();
	});
});

/* *
 * load-function
 * */

function load_function() {
	/* common */
	reload_page_pcsmp();
	scroll_anchor();
	tel_link();
	detectSMP();
	objfit_cover();
	/* pages */
	template();
	toppage();
	menu();
	reason();
	column();
}


/* *
 * common-function
 * */

/* scroll to with animation */
function scroll_anchor() {
	if (jQuery('.scrollTo').length > 0) {
		jQuery('.scrollTo').each(function () {
			jQuery(this).on('click', function (event) {
				event.preventDefault();
				var headerH = jQuery('#header').length > 0 ? jQuery('#header').height() : 0;
				var target = jQuery(this).attr('href');
				if (jQuery(target).length > 0)
					jQuery('html, body').animate({
						scrollTop: jQuery(target).offset().top - headerH
					}, 500);
			});
		});
	}
}

/* reload page when change viewport between pc <=> smp */
function reload_page_pcsmp() {
	var is_device, get_device;
	is_device = viewportW > viewportSMP ? 'is_pc' : 'is_smp';
	jQuery(window).smartresize(function () {
		viewportW = jQuery(window).width();
		get_device = viewportW > viewportSMP ? 'is_pc' : 'is_smp';
		if (is_device != get_device)
			window.location.href = window.location.href;
	});
}

/* set tel link for text-tel when mobile */
function tel_link() {
	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') > 0 && ua.indexOf('iPod') == -1 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0 && ua.indexOf('SC-01C') == -1 && ua.indexOf('A1_07') == -1) {
		jQuery('.tel-link img').each(function () {
			var alt = jQuery(this).attr('alt');
			jQuery(this).wrap(jQuery('<a>').attr('href', 'tel:' + alt.replace(/-/g, '')));
		});
		jQuery('.tel-text').each(function () {
			var txt = jQuery(this).html();
			jQuery(this).wrap(jQuery('<a>').attr('href', 'tel:' + txt.replace(/-/g, '')));
		});
		jQuery('.fax-text').each(function () {
			if (jQuery(this).parent().is('a'))
				jQuery(this).unwrap();
		});
	}
};

/* detect device and add className to support layout (require detectmobile.js) */
function detectSMP() {
	if (DetectIos() != false) jQuery('html').addClass('ios');
	if (DetectAndroid() != false) jQuery('html').addClass('android');
	if (DetectSmartphone() != false) jQuery('html').addClass('smartphone');
	if (DetectIphone() != false) return jQuery('html').addClass('iphone');
	else if (DetectIpad() != false) return jQuery('html').addClass('tabletdevice ipad');
	else if (DetectAndroidPhone() != false) return jQuery('html').addClass('androidphone');
	else if (DetectAndroidTablet() != false) return jQuery('html').addClass('tabletdevice androidtablet');
	return jQuery('html').addClass('pczoomin');
}

/* object fit cover img */
function objfit_cover() {
	if (jQuery('.menu-a_slider').length == 0) {
		if (!Modernizr.objectfit) {
			jQuery('img').each(function () {
				var style_objectfit = 'background-image:url(' + jQuery(this).prop('src') + ');background-repeat:no-repeat;background-position:center center;background-size:cover;';
				jQuery(this).css('opacity', 0).wrap('<div class="objfit_cover" style="' + style_objectfit + '"></div>');
			});
		}
	}
}

/* heightline advance */
function _heightline(settings) {
	// generate random ID string
	var id_hl = 'HL' + Math.uuid(6, 16);
	// default settings
	var defaultSettings = {
		itemClsName: '.hl',
		itemPerRow: 0,
		supportTableCell: false,
		device: 'both',
		delayFunc: 500
	};
	// get settings
	var _settings = defaultSettings;
	for (var key in settings) {
		if (settings.hasOwnProperty(key))
			if (settings[key] !== undefined)
				_settings[key] = settings[key];
	}
	var _item = _settings.itemClsName,
		_number = _settings.itemPerRow,
		_supportTableCell = _settings.supportTableCell,
		_device = _settings.device,
		_delay = _settings.delayFunc;
	// process heightline if element exist
	if (jQuery(_item).length > 0) {
		setTimeout(function () {

			// heighline all item if itemPerRow = 0
			if (_number == 0) {
				if (_device == 'both' ||
					_device == 'pc' && viewportW > viewportSMP ||
					_device == 'smp' && viewportW <= viewportSMP) {
					// set height
					jQuery(_item).heightLine();
					// set width to support vertical-align width display:tale-cell
					if (_supportTableCell)
						jQuery(_item).css('width', jQuery(_item).width()).css('display', 'table-cell');
				}

			} else {
				// add class heightline
				var count = 0,
					row = 1;
				jQuery(_item).each(function () {
					count++;
					jQuery(this).addClass(id_hl + '-' + row);
					if (count >= _number) {
						row++;
						count = 0;
					}
				});
				// calc rows number max
				var totalItem = jQuery(_item).length;
				var maxRow = Math.floor(totalItem % _number > 0 ? (totalItem / _number) + 1 : totalItem / _number);
				// process heightline
				for (var i = 1; i <= maxRow; i++) {
					if (_device == 'both' ||
						_device == 'pc' && viewportW > viewportSMP ||
						_device == 'smp' && viewportW <= viewportSMP) {
						jQuery('.' + id_hl + '-' + i).heightLine();
						// set width to support vertical-align width display:tale-cell
						if (_supportTableCell)
							jQuery('.' + id_hl + '-' + i).css('width', jQuery(_item).width()).css('display', 'table-cell');
					}

				}
			}
		}, _delay);
	}
}



/* *
 * pages-function
 * */

/* template */
function template() {
	var header = jQuery('#header');
	var ind_header = jQuery('.ind_jarallax');
	var _space = viewportW > viewportSMP ? 0 : 15;

	jQuery(window).on('scroll', function (e) {
		/* header template */
		var header_h = jQuery('.frontpage').length > 0 ? ind_header.height() : header.height();
		if (jQuery(window).scrollTop() > header_h - _space) {
			header.addClass('scrolled');
			if (jQuery('.frontpage').length > 0 && viewportW > viewportSMP)
				header.addClass('animated fadeIndown');
		} else {
			header.removeClass('scrolled');
			if (jQuery('.frontpage').length > 0 && viewportW > viewportSMP)
				header.removeClass('animated fadeIndown');
		}
	});

	if (viewportW > viewportSMP) {
		/* footer pc */
		jQuery('.foot_button').click(function () {
			jQuery('.foot_content_pc').slideToggle("slow");
			jQuery('.foot_pc').prev().toggleClass('fix').css({
				'padding-bottom': '105px',
				'bottom': '0'
			});
		});
	} else {
		/* head menu smp */
		var nav_main = jQuery('.nav_main');
		var hover_content = '.hover_content';
		jQuery('.head_menu, .menu').click(function (e) {
			e.preventDefault();
			jQuery(this).toggleClass('open');
			if (navbox.hasClass('expanded')) {
				navbox.find('.link_1').removeClass('active');
				navbox.find('.link_1').next(hover_content).hide();
			}
			navbox.slideToggle(300).toggleClass('expanded');
			navbox_layout();
		});
		nav_main.find('.link_1').each(function () {
			if (jQuery(this).next(hover_content).length > 0) {
				jQuery(this).click(function (e) {
					e.preventDefault();
					jQuery(this).toggleClass('active').next(hover_content).slideToggle(300);
					navbox_layout();
				});
			}
		});
		/* footer smp */
		jQuery('.foot_button').click(function () {
			var foot_content_smp = jQuery('.foot_content_smp')
			foot_content_smp.height('auto');
			foot_content_smp.slideToggle("slow", function () {
				if (foot_content_smp.height() > viewportH)
					foot_content_smp.height(viewportH - 180);
				else foot_content_smp.css('height', 'auto');
			});
			jQuery('.foot_button_smp').toggleClass('fix');
		});
	}
}

function navbox_layout() {
	if (viewportW <= viewportSMP) {
		var clsHead = jQuery('.frontpage').length > 0 ? '.header_container' : '.head_group';
		var panel_height = viewportH - jQuery(clsHead).height() - 19;
		navbox.find('.nav_container').css('height', panel_height);
	}
}

/* top page */
function toppage() {
	/* parallax */
	var jarallax_content = {
		videoSrc: 'mp4:' + media_upload + 'ind-parallax-video.mp4'
	}
	var jarallax_video_h = viewportW > viewportSMP ? viewportW * 0.435 : viewportW * 0.7;
	jQuery('.ind_jarallax, .jarallax_top').css('height', jarallax_video_h);
	jQuery('.ind_jarallax-logo').css({
		'width': viewportW,
		'height': jarallax_video_h
	});
	jQuery('.jarallax_top').jarallax(jarallax_content);

	/* 麻布ハリークの美容鍼 */
	_heightline({
		itemClsName: '.ind_reasons-block h3',
		itemPerRow: 3,
		device: 'pc'
	});

	/* Column / 美容鍼コラム */
	if (jQuery('.column_autoheight').length > 0) {
		_heightline({
			itemClsName: '[class*="ind_location-"] .tit'
		});
		_heightline({
			itemClsName: '[class*="ind_location-"] .text'
		});
		_heightline({
			itemClsName: '[class*="ind_location-"] .link a'
		});
	}

	/* Luxury Space / ラグジュアリーな空間 */
	if (jQuery('#scroller').length > 0) {
		if (viewportW <= viewportSMP) {
			setTimeout(function () {
				var imgH = jQuery("#scroller").find('img').height();
				jQuery(".simply-scroll .simply-scroll-list li").css("height", imgH);
				jQuery(".simply-scroll-list").css("height", imgH);
			}, 1500);
		}
		jQuery("#scroller").simplyScroll({
			pauseOnTouch: false
		});
	}

	/*  Professional / プロフェッショナル  */
	if (jQuery('.ind_profes-slider').length > 0) {
		if (viewportW < 800) {
			jQuery('.ind_profes-slider').slick({
				slidesToShow: 3,
				slidesToScroll: 1,
				autoplay: true,
				dots: false,
				arrows: false,
				autoplaySpeed: 5000,
				responsive: [{
						breakpoint: 600,
						settings: {
							slidesToShow: 2
						}
					},
					{
						breakpoint: 360,
						settings: {
							slidesToShow: 1,
							variableWidth: true
						}
					}
				]
			});
		}
	}

	/*  Media / メディア掲載  */
	if (jQuery('.slider-media').length > 0) {
		jQuery('.slider-media').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			// autoplay: true,
			dots: false,
			arrows: false,
			centerPadding: '0',
			centerMode: true
		});
	}

	_heightline({
		itemClsName: '.hl1',
		device: 'pc'
	});
}

function menu() {
	_heightline({
		itemClsName: '.menu_block02 .tit',
		supportTableCell: true,
		device: 'pc'
	});

	var menu_block = jQuery('.menu_block03_group'),
		block_per_row = viewportW > viewportSMP ? 3 : 2;
	if (menu_block.length > 0) {
		menu_block.each(function () {
			var total = jQuery(this).find('.block').length;
			var block_remain = total % block_per_row;
			jQuery(this).addClass('block-last-' + block_remain);
		});
	}

	jQuery('.menu-a_slider').slick({
		dots: true,
		infinite: true,
		speed: 300,
		slidesToShow: 1
	});
	if (jQuery('.menu-a_tab_nav').length > 0) {
		jQuery('.menu-a_tab_nav li a').on('click', function (e) {
			var currentAttrValue = jQuery(this).attr('href');
			// Show/Hide Tabs
			jQuery('.menu-a_content ' + currentAttrValue).fadeIn(400).siblings().hide();
			// Change/remove current tab to active
			jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
			e.preventDefault();
			jQuery('.menu-a_slider').slick({
				dots: true,
				infinite: true,
				speed: 300,
				slidesToShow: 1
			});
		});
	}
}

/* reason */
function reason() {
	_heightline({
		itemClsName: '.res_btn-block .res-btn a',
		itemPerRow: 2,
		device: 'smp'
	});

	_heightline({
		itemClsName: '.res_meth-cnt',
		itemPerRow: 2,
		device: 'smp'
	});

	if (jQuery('#res_beforeafter').length) {
		setTimeout(function () {
			jQuery("#res_beforeafter").twentytwenty({
				click_to_move: true,
				before_label: '',
				after_label: ''
			});
		}, 500);
	}
}

/* column */
function column() {
    if(jQuery('#col_block').length > 0) {
        if(jQuery('.elementor').length > 0)
            jQuery('#col_block').addClass('col_block_elementor');
        else jQuery('#col_block').addClass('col_block');
    }
	_heightline({
		itemClsName: '.column-item .item a',
		itemPerRow: 5,
		device: 'pc'
	});

	_heightline({
		itemClsName: '.column-item .item a',
		itemPerRow: 2,
		device: 'smp'
	});
}