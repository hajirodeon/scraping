var s,
	workSpace ={
	settings:{},
	init: function(){
		//this.debbug();
		//this.getNews();
		this.getNewsPaper();
		this.selectNewsPaper();
		//this.selectSection();
	},

	debbug: function(){
		
	},
	getNews: function(pageUrl,section){
		//console.log(pageUrl+"--"+section);

		$.ajax({
			beforeSend: function(){
				$(".loading").fadeIn(300);
			},
			url:"http://oaguillon.co/daily/proccess.php",
			type:"post",
			data: {pagina:pageUrl,seccion:section},
			success: function(data){
				//console.log(data);
				var news = $.parseJSON(data);
				var obj = [];
				$.each(news,function(id,item){
					//console.log(item.id[idSelect]);
					obj.push("<li><a href='#' onclick='window.open('"+item.url+"','_system')'><img src='"+item.image+"'><p>"+item.desc+"</p></a></li>");
				});
				$("#noticias ul").html(obj.join(""));
			},
			complete:function(){
				$(".loading").fadeOut(300);
			}
				
		});
	},
	getNewsPaper: function(){
		$.post("http://oaguillon.co/daily/newspaper.php",function(data){
			var papers = $.parseJSON(data);
			var obj = [];
			//-- recorremos el array de periodicos disponibles
			$.each(papers,function(id,item){				
				obj.push('<option value="'+item.url+'" id="'+item.id+'">'+item.nombre+'</option>');//añadimos los nombres de los periodicos							
			});//end each periodicos
			
			$("select#diario").append(obj.join(""));

		})
	},
	getSections: function(idSelect,idAccion){
		//console.log(idSelect+"--"+idAccion);
		
		$.post("http://oaguillon.co/daily/newspaper.php",{id:idSelect,accion:idAccion},function(data){
			//console.log(data)
			var papers = $.parseJSON(data);
			var obj = [];
			var extensiones = [".asp",".html"];
			$.each(papers,function(id,item){
				//console.log(item);
				obj.push('<option value="'+item+'" id="'+id+'">'+item.replace(extensiones[0],' ')+'</option>');//añadimos los nombres de las secciones de los periodicos
			});
			$("select#secciones").html("<option disable>Seleccione</option>"+obj.join(""));
		});

	},
	selectNewsPaper: function(){
		
		$("select#diario").on("change",function(){
			
			var idSelect = $('option:selected',this).attr("id");	
			var pageUrl = $(this).val();
			var idAccion = $(this).attr("id");
			
			workSpace.getSections(idSelect,idAccion);
			workSpace.getNews(pageUrl);
			workSpace.selectSection(pageUrl);

		});
	},
	selectSection: function(pageUrl){
		//console.log(pageUrl);
		$("select#secciones").on("change",function(){
			var section = $(this).val();
			//console.log(section);
			workSpace.getNews(pageUrl,section);
		});

	}
}

$(function(){
	workSpace.init();
})