!function(r){r(document).ready(function(){var i=r(".srr-main");i.find(".srr-wrap").hide(),i.find(".srr-wrap:first").show(),i.find(".srr-tab-wrap li:first").addClass("srr-active-tab"),r(".srr-tab-wrap li").click(function(){var i=r(this).attr("data-tab"),t=r(this).parent().parent();if(r(this).parent().children("li").removeClass("srr-active-tab"),r(this).addClass("srr-active-tab"),t.find(".srr-wrap").hide(),$srrTicker=t.find(".srr-wrap[data-id="+i+"]"),$srrTicker.show(),0==$srrTicker.height()){var a=$srrTicker.data("visible"),s=$srrTicker.find(".srr-item:first-child").outerHeight()*a;$srrTicker.height(s)}}),r(".srr-vticker").each(function(){var i=r(this).attr("data-visible"),t=r(this).attr("data-speed"),a=parseInt(i)<=20?"auto":i;r(this).easyTicker({visible:i,height:a,interval:t})})})}(jQuery);