(function(){
	"use strict";
	
	$("#busca").on("input", function() {
		var busca = $(this).val().trim();

		if(busca.length) {
			$(".cartao").hide().filter(function() {
				var pattern = new RegExp(busca, "i");
				var cartaoConteudo = $(this).find(".cartao-conteudo");
				var texto = cartaoConteudo.text();
				var encontrado = texto.match(pattern);
				cartaoConteudo.html(texto.replace(pattern, "<span class='marcado'>$1</span>"));
				return encontrado;
			}).show();

	    if(busca.length >= 0){
	        $(".cartao").hide().filter(function(){
	            var cartaoConteudo = $(this).find(".cartao-conteudo");
	            var regExp = new RegExp("(" +busca+ ")", "gi");                     
		        var texto = cartaoConteudo.text();       
	            if (cartaoConteudo.text().match(regExp)){                
	                var textoComHighlight = texto.replace(regExp,"<span class='marcado'>$1</span>")                
	                cartaoConteudo.html(textoComHighlight);
	                return true;                
	            }else{
	                cartaoConteudo.html(texto);
	            }                                                              
	        }).show();
	    }

		} else {
			$("cartao").show();
		}
	});
})();