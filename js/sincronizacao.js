(function(controlador){
	"use strict";

	
	var usuario = "pabloguardiao@gmail.com";

	$(document).on("precisaSincronizar", function() {
		$("#sync").removeClass("botaoSync--sincronizado");
		$("#sync").addClass("botaoSync--esperando")
	});

	$(document).on("precisaSincronizar", function() {

		$("#sync").removeClass("botaoSync--sincronizado");
		$("#sync").addClass("botaoSync--esperando");

		var cartoes = [];
		$(".cartao").each(function(){
			var cartao = {};
			cartao.conteudo = $(this).find(".cartao-conteudo").html();
			cartao.cor = $(this).css("background-color");
			cartoes.push(cartao);

		});

		var mural = {
			usuario: usuario,
			cartoes: cartoes
		};

		$.ajax({
			url:"https://ceep.herokuapp.com/cartoes/salvar",
			method: "POST",
			data: mural,
			success: function(res) {
				$("#sync").addClass("botaoSync--sincronizado");
				console.log(res.quantidade + " cartoes salvos em " + res.usuario);
				var quantidadeRemovidos = controladorDeCartoes.idUltimoCartao() - res.quantidade;
				console.log(quantidadeRemovidos + " cartoes removidos");
			},
			error: function() {
				$("#sync").addClass("botaoSync--deuRuin");
				console.log("Nao foi possivel salvar o mural");
			},
			complete: function() {
				$("#sync").removeClass("botaoSync--esperando");
			}
		});
	});
	
	$("#sync").click(function(){
		$(document).trigger("precisaSincronizar");
	})

	$.getJSON(
		"https://ceep.herokuapp.com/cartoes/carregar?callback=?",
		{usuario : usuario},
		function(res) {
			var cartoes = res.cartoes;
			console.log(cartoes.length + " cartoes carregados em " + res.usuario);
			cartoes.forEach(function(cartao){
				controlador.adicionaCartao(cartao.conteudo, cartao.cor);
			});
		}
	);

})(controladorDeCartoes);