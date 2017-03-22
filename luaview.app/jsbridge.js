;(function () {
    

    injectStyles("#J_Taojia {display:none}");
    injectStyles("#smartAd {display:none}");
    
    function injectStyles(rule) {
        var div = document.createElement('DIV');
        div.innerHTML = '&shy;<style>' + rule + '</style>';
        document.body.appendChild(div);

    }
	 
		  
})();