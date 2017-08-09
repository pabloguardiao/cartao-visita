var controladorDeCartoes = (function() {
	"use strict";
	
	var contador = 0;
	var botoes =  document.querySelectorAll(".opcoesDoCartao-remove");

	for (var i = botoes.length - 1; i >= 0; i--) {
		botoes[i].addEventListener("click", removeCartao);
	}

	var	intervaloSyncEdicao;
	
	function editaCartaoHandler(event) {
		clearTimeout(intervaloSyncEdicao);
		intervaloSyncEdicao = setTimeout(function(){
			$(document).trigger("precisaSincronizar");
		},	1000);
	}

	function decideTipoCartao(conteudo) {
		var quebras = conteudo.split("<br>").length;
		var totalDeLetras = conteudo.replace(/<br>/g, " ").length;
		var ultimoMaior = "";
		conteudo.replace(/<br>/g, " ").split(" ").forEach(function(palavra) {
			if (palavra.length > ultimoMaior.length) {
				ultimoMaior = palavra;
			}
		})
		var tamMaior = ultimoMaior.length;

		var tipoCartao = "cartao--textoPequeno";
		if (tamMaior < 9 && quebras < 5 && totalDeLetras < 55) {
			tipoCartao = "cartao--textoGrande";
		} else if (tamMaior < 12 && quebras < 6 && totalDeLetras < 75) {
			tipoCartao = "cartao--textoMedio";
		}

		return tipoCartao;
	}

	function adicionaCartao (conteudo, cor) {
		// pega o que o usuario digiou
		conteudo = conteudo.replace(/\n/g,"<br>")
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>");

		// Cria os elementos do cartao e adiciona no DOM
		if (conteudo) {
			// Incrementa o contador
			contador++;

			var opcoes = criaOpcoesDoCartao(contador);
			
			// Cria a tag paragrafo
			var conteudoTag = $("<p>").addClass("cartao-conteudo")
				.append(conteudo).on("input", editaCartaoHandler);

			// Decide o teipo de cartao
			var tipoCartao = decideTipoCartao(conteudo);
			// Cria a div e adiciona no mural
			$("<div>")
				.attr("id", "cartao_" + contador)
				.addClass("cartao")
				.attr("tabindex", 0)
				.addClass(tipoCartao)
				.append(opcoes)
				.append(conteudoTag)
				.css("background-color", cor)
				.prependTo(".mural");
		}
	}

	return {
		adicionaCartao: adicionaCartao,
		idUltimoCartao: function() {
			return contador;
		}
	}


})();