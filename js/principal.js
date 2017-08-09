// function mudaLayout() {
// 	document.querySelector(".mural").classList.toggle("mural--linhas");
// }

document.querySelector("#mudaLayout").addEventListener( "click", 
	function() {
		var mural = document.querySelector(".mural");
		mural.classList.toggle("mural--linhas");
		if (mural.classList.contains("mural--linhas")) {
			this.textContent = "Blocos";
		} else {
			this.textContent = "Linhas";
		}
	});

function removeCartao() {
	var cartao = document.querySelector("#cartao_" + this.dataset.ref);
	cartao.classList.add("cartao--some");

	setTimeout(function() {
		cartao.remove();
	}, 400);
}

var botoes =  document.querySelectorAll(".opcoesDoCartao-remove");
for (var i = botoes.length - 1; i >= 0; i--) {
	botoes[i].addEventListener("click", removeCartao);
};

var contador = $(".cartao").length;

$(".novoCartao").submit(function(event){
	// Previne que a pagina recarregue
	event.preventDefault();

	var campoConteudo = $(".novoCartao-conteudo");
	var conteudo = campoConteudo.val().trim();
	adicionarCartao(conteudo, "#FFF");
	// apaga o conteudo do textarea
	campoConteudo.val("");
});


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

$("#ajuda").click(function(){
	$.getJSON("https://ceep.herokuapp.com/cartoes/instrucoes", 
		function(res) {
			console.log(res);

			res.instrucoes.forEach(function(instrucao){
				adicionarCartao(instrucao.conteudo, instrucao.cor);
			});
		});
});

function adicionarCartao(conteudo, cor) {
	// pega o que o usuario digiou
	conteudo = conteudo.replace(/\n/g,"<br>")
		.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
		.replace(/\*(.*?)\*/g, "<em>$1</em>");

	// Cria os elementos do cartao e adiciona no DOM
	if (conteudo) {
		// Incrementa o contador
		contador++;

		// Cria a tag botao
		var botaoRemove = $("<button>").addClass("opcoesDoCartao-remove")
			.attr("data-ref", contador)
			.text("Remover")
			.click(removeCartao);
		// Cria div Opcoes
		var opcoes = $("<div>").addClass("opcoesDoCartao").append(botaoRemove);
		// Cria a tag paragrafo
		var conteudoTag = $("<p>").addClass("cartao-conteudo").append(conteudo);
		// Decide o teipo de cartao
		var tipoCartao = decideTipoCartao(conteudo);
		// Cria a div e adiciona no mural
		$("<div>")
			.attr("id", "cartao_" + contador)
			.addClass("cartao")
			.addClass(tipoCartao)
			.append(opcoes)
			.append(conteudoTag)
			.css("background-color", cor)
			.prependTo(".mural");
	}
}

$("#sync").click(function(){
	$("#sync").removeClass("botaoSync--sincronizado");
	$("#sync").addClass("botaoSync--esperando");

	var cartoes = [];
	$(".cartao").each(function(){
		var cartao = {};
		cartao.conteudo = $(this).find(".cartao-conteudo").html();
		cartoes.push(cartao);
	});

	var mural = {
		usuario: "pabloguardiao@gmail.com",
		cartoes: cartoes
	};

	$.ajax({
		url:"https://ceep.herokuapp.com/cartoes/salvar",
		method: "POST",
		data: mural,
		success: function(res) {
			$("#sync").addClass("botaoSync--sincronizado");
			console.log(res.quantidade + " cartoes salvos em " + res.usuario);
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

(function(){
	var usuario = "pabloguardiao@gmail.com";

	$.getJSON(
		"https://ceep.herokuapp.com/cartoes/carregar?callback=?",
		{usuario : usuario},
		function(res) {
			var cartoes = res.cartoes;
			console.log(cartoes.length + " cartoes carregados em " + res.usuario);
			cartoes.forEach(function(cartao){
				adicionarCartao(cartao.conteudo);
			});
		}
	);
})();