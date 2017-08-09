(function(controlador){	
	"use strict";

	$(".novoCartao").submit(function(event){
		// Previne que a pagina recarregue
		event.preventDefault();

		var campoConteudo = $(".novoCartao-conteudo");
		var conteudo = campoConteudo.val().trim();
		var cor = $("#corDoCartao").val();
		if (conteudo) {
			controlador.adicionaCartao(conteudo, cor);
			$(document).trigger("precisaSincronizar");
		}
		// apaga o conteudo do textarea
		campoConteudo.val("");
	});
})(controladorDeCartoes);