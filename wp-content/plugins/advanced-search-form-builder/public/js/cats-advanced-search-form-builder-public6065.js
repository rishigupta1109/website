'use strict';

var $ = jQuery;
var timeDelaySearch;
var $asfbRequest, $asfbRequestArticle;
var asfbKey = {
    KEYDOWN : 40,
    KEYUP : 38,
	SPACE: 32,
    RIGHT: 39,
    TAB: 9

};

$(document).on('click', function (event) {
	if ( !$(event.target).is('input') ) {
        $('.asfbSearchResult').fadeOut('fast');
	}

}).on('keydown', '.inputAutoComplete', function (event) {
	var keyCode = event.keyCode

	if (keyCode == asfbKey.KEYDOWN) {
        asfbCompleteInput($(event.target), 'DOWN');
	} else if(keyCode == asfbKey.KEYUP) {
        asfbCompleteInput($(event.target), 'UP');
    } else if(keyCode == asfbKey.RIGHT || keyCode == asfbKey.TAB) {
        var newValue = $(event.target).closest('.asfbInputSearch').find('input.asfbAt').val();
        $(event.target).val(newValue).trigger('input').focus();
        return false;
	}
}).ready(function(){
    var w = $('.asfbFormWrapper').width();
    var _class = '';
    if (w <= 480 ) {
        _class = '_xsSize';
    } else if (w <= 959) {
        _class = '_smSize';
    } else {
        _class = '_mdSize';
    }

    $('.asfbFormWrapper').addClass(_class);
})
;

function asfbCompleteInput($input, dir) {
    var $firstElemt;
    if ($input.closest('form').find('li.asfbTitleSuggestion.binded').length == 0) {
        if (dir == 'UP') {
            $firstElemt = $input.closest('form').find('.asfbSuggestion').find('li.asfbTitleSuggestion').last();
        } else {
            $firstElemt = $input.closest('form').find('.asfbSuggestion').find('li.asfbTitleSuggestion').first();
		}
        $firstElemt.addClass('binded');
    } else {
        $firstElemt = $input.closest('form').find('li.asfbTitleSuggestion.binded');
        $firstElemt.removeClass('binded');
        if (dir == 'UP') {
            $firstElemt = $firstElemt.prev('.asfbTitleSuggestion');
		} else {
            $firstElemt = $firstElemt.next('.asfbTitleSuggestion');
		}

		if (!$firstElemt.is('.asfbTitleSuggestion')) {
            if (dir == 'UP') {
                $firstElemt = $input.closest('form').find('.asfbSuggestion').find('li.asfbTitleSuggestion').last();
            } else {
                $firstElemt = $input.closest('form').find('.asfbSuggestion').find('li.asfbTitleSuggestion').first();
            }
		}
        $firstElemt.addClass('binded');
    }

    var newValue = $firstElemt.text();
    $input.val(newValue).trigger('input');
}

function asfbAutoSearch(event) {
	var $input = $(event.target);
	var inputData = $input.data();

	clearTimeout(timeDelaySearch);
    
    $(event.target).closest('.asfbInputSearch').find('input.asfbAt').val('');

	if (  $input.val() != '' && $input.val().length >= inputData.auto_search_character ) {
		timeDelaySearch = setTimeout(function () {

            if ($asfbRequest != null){
                $asfbRequest.abort();
                $asfbRequest = null;
                $input.addClass('searching');
            }
            if ($asfbRequestArticle != null){
                $asfbRequestArticle.abort();
                $asfbRequestArticle = null;
            }

            $input.closest('.asfbInputSearch').find('.inputAutocomplete').val('');
            __asfbSearch($input)
		}, inputData.auto_search_time_delay)
	}

    if ($input.val() == '') {
        $input.closest('div').find('.asfbSearchResult').fadeOut('fast').find('.asfbList').html('');

        if ($asfbRequest != null){
            $asfbRequest.abort();
            $asfbRequest = null;
            $input.addClass('searching');
        }
        if ($asfbRequestArticle != null){
            $asfbRequestArticle.abort();
            $asfbRequestArticle = null;
        }

        $input.removeClass('searching');
    }
}

function __asfbSearch($input) {
	var dataJsonForm = $input.closest('form').find('.jsonData');
    var formId = $input.closest('form').find('[name="form_id"]').val();

	var dataForm = JSON.parse(dataJsonForm.text());

    var _dataForm = {
        post_type: dataForm.filter_post_type_source,
        taxonomies: dataForm.autocom_tax_title,
		q : $input.val(),
		form_id: formId
	};
    _dataForm = $.param(_dataForm);

    $input.addClass('searching');

    // include_live_result
    if( $input.width() > 300 && dataForm.include_live_result) {
        $input.closest('form').find('.asfbWrapResultAjax').addClass('loading').html('');
        $asfbRequestArticle = $.get(asfbGlobal.endpoint.search + _dataForm, function (res) {
            var html = '';

            if (typeof  res.number_post !== 'undefined' && res.number_post > 0) {
                html += '' + res.before;
                $.each(res.result, function (index, value) {
                    html += value.html;
                });
                html += res.after;

                $input.closest('form').find('.asfbWrapResultAjax').html(html);
                $input.closest('div').find('.asfbSearchResult').fadeIn('fast');
            }
        }).done(function() {
            $input.removeClass('searching');
            $input.closest('form').find('.asfbWrapResultAjax').removeClass('loading');
        });
    }


    // suggestion
    if (dataForm.en_autocomplete) {
        $asfbRequest = $.get(asfbGlobal.endpoint.suggestion + _dataForm, function (res) {
            var urlForm = $input.closest('form').attr('action');
            urlForm += '?';

            var hasResult = false;

            var html = '';
            if (typeof res.suggestion.post !== 'undefined' && res.suggestion.post.length > 0) {

                var titleSuggestion = res.suggestion.post[0].post_title;
                titleSuggestion = titleSuggestion.replace($input.val(), $input.val());
                $input.closest('.asfbInputSearch').find('input.asfbAt').val(titleSuggestion);

                $.each(res.suggestion.post, function (index, item) {
                    var title = item.post_title;
                    if (typeof item.link == 'string') {
                        var _urlForm = item.link;
                    } else {
                        var _urlForm = urlForm + '&q=' + encodeURIComponent(title) +'&form_id='+ formId;
                    }

                    html += '<li class="asfbTitleSuggestion"><a href="'+ _urlForm +'">'+ title +'</a></li>';
                });
                hasResult = true;
            }

            if (typeof res.suggestion.terms !== 'undefined' && res.suggestion.terms.length > 0) {
                $.each(res.suggestion.terms, function (index, title) {
                    var _query = '&q='+encodeURIComponent($input.val())+'&form_id='+formId +
                        '&taxonomy['+ title.taxonomy +']=' + title.term_id;

                    html += '<li><a href="'+ urlForm + _query +'">'+ $input.val() + ' in <b style="color: #0A246A">' + title.name +'</b></a></li>';
                });

                hasResult = true;
            }
            html += '</ul></div>';

            if ( !hasResult ) {
                html = '<li><a href="'+ urlForm + '&q=' + encodeURIComponent($input.val()) +'&form_id='+ formId +'">'+ $input.val() +'</a></li>';
            }

            $input.closest('div').find('.asfbSearchResult').fadeIn('fast').find('.asfbList').html(html);
        }).done(function(){
            $input.removeClass('searching');
        });
    }



}



function updateOrder(event) {
    $(event.target).closest('.asfb_wrap_body').find('form').find('[name="order"]').val($(event.target).val());
    $(event.target).closest('.asfb_wrap_body').find('form').submit();
}

function updateTemplate(event, template) {
    $(event.target).closest('.asfb_wrap_body').find('form').find('[name="template"]').val(template);
    $(event.target).closest('.asfb_wrap_body').find('form').submit();
}