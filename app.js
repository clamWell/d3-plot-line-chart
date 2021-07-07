$(function(){

	var screenWidth = $(window).width(),
		screenHeight = $(window).height();
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};



	function getRandomColor(){ 
		 var color = '#'+Math.round(Math.random()*0xffffff).toString(16);
		 return color;
	 };


	function makePlotChart(){

		var data = stockData; // json 배열 데이터 가져옴
		data.map(function(v) { 
              v.rdcolor = getRandomColor() ;
         });
		data.map(function(v,i,a) {
			var c = "#ddd";
			var type;
			if( Number(v["p_now"]) > Number(v["p2"]) ){
				c = "#f44336"; 
				type = "up";
			}else if(Number(v["p_now"]) ==  Number(v["p2"]) ){
				c = "#777"; 
				type = "same";
			}else if(Number(v["p_now"]) <  Number(v["p2"]) ){
				c = "#27a0ff"; 
				type = "down";
			}
            v.color = c;
			v.type = type;
        });
		data.map(function(v,i,a) { 
              v.id = i;
        });

		// svg캔버스 생성
		var plot_chart_svg = d3.select("#CHART")
		var width = 800,
			height= 400;

		plot_chart_svg.attr("width", width +"px" )
			.attr("height", height +"px");
        
        var chart_holder = plot_chart_svg.append("g")
			.attr("class","chart-holder");

        //공모가 기준 시총
		var amount_start_values = data.map(function(v) {
			  return Number(v["amount_p2"]);
			});
        //현재가 기준 시총
        var amount_now_values = data.map(function(v) { 
              return Number(v["amount_now"]);
            });
        //청약 경쟁률
        var	comp_values = data.map(function(v) { 
              return Number(v["comp"]);
         });
		 //공모가대비 시초가
        var	rate_start_values = data.map(function(v) { 
              return Number(v["rate_start"]);
         });


		
		var amountStartMaxValue = d3.max(amount_start_values);
        var amountNowMaxValue = d3.max(amount_now_values); 
		var compMaxValue = d3.max(comp_values); 
		var rateStartMaxValue = d3.max(rate_start_values); 
	
		console.log();
        
        
        // X축과 Y축 설정
        var x = d3.scale.log() // 로그스케일적용
			.domain([44087885000, 13047459336000])
			.range([0, width])

		var y = d3.scale.linear()
			.range([height, 0])
			.domain([0, compMaxValue]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom").ticks(10);
           
        var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left").ticks(10)
            .tickFormat(function(d, i){ return d+"대 1"; });
					
        chart_holder.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+(Number(height)+20)+")")
            .call(xAxis);

        chart_holder.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-10,0)")
            .call(yAxis);
        // X축과 Y축 설정

        // 실제 데이터로 plot 그리기
        var plotRadius;
		
		var plot_container = chart_holder.append("g")
				.attr("class", "plots-holder");

		var each_plot_g = plot_container
            .selectAll("g").data(data).enter() // plots 객체에 data 연결
            .append("g")
			.attr("class", function (d) { return "plot-g plot-g-"+d["id"] })

		/*
		each_plot_g.attr("transform", function (d) {
						var v = "translate("+ x(d["amount_p2"])+ "," +y(d["comp"]) + ")";
						return v;
					}
				);*/

		var plot_start = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-start"})
            .attr("cx", function (d) { return x(d["amount_p2"]); })
			.attr("cy", function (d) { return y(d["comp"]); })
			.attr("r", function (d) { return d["rate_start"]*8; })
			.attr("fill", function(d){ return d["color"] });

		var plot_now = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-now"; })
            .attr("cx", function (d) { return x(d["amount_now"]); })
			.attr("cy", function (d) { return y(d["comp"]); })
			.attr("r", function (d) { return d["rate_start"]*8; })
			.attr("fill", function(d){ return d["color"] })

		var plot_line = each_plot_g.append("line")
				.attr("class", "plot-line")
				.attr("x1", function (d) { return x(d["amount_p2"]); })
				.attr("y1", function (d) { return y(d["comp"]); })
				.attr("x2", function (d) { return x(d["amount_now"]); })
				.attr("y2", function (d) { return y(d["comp"]); })
				.attr("stroke", function (d) { return d["color"]; })
		
		var $tooltip = $(".tooltip");

		each_plot_g.on("mouseenter", function(d) {
			d3.selectAll(".plot-g").style("opacity", 0.2);
            d3.select(this)
                .style("opacity", "1");
			//d3.select(this).children.style("stroke", "red");

            $tooltip.css({"display":"block","opacity":"1"})
            $tooltip.find(".name").html(d["name"]);
          //  $tooltip.css({"left": (Number(d3.select(this).attr("cx"))-5) + "px"});
            //$tooltip.css({"top": (Number(d3.select(this).attr("cy"))+15) +"px"});


        }).on("mouseleave", function(d){
			d3.selectAll(".plot-g")
                .style("opacity", null);

            $tooltip.css({"display":"none","opacity":"0"});

        });

        console.log("plot chart를 성공적으로 그렸습니다");
        

	};

    // 차트를 그리는 함수 실행
	//makePlotChart();



    function makePlotChart2(){
		var data = stockData; // json 배열 데이터 가져옴
		data.map(function(v) { 
              v.rdcolor = getRandomColor() ;
         });
		data.map(function(v,i,a) {
			var c = "#ddd";
			var type;
			if( v["pAfter3m"] == null){
				if( Number(v["p_now"]) > Number(v["p2"]) ){
					c = "#f44336";
					type = "up";
				}else if(Number(v["p_now"]) ==  Number(v["p2"]) ){
					c = "#777";
					type = "same";
				}else if(Number(v["p_now"]) <  Number(v["p2"]) ){
					c = "#27a0ff"; 
					type = "down";
				}
			}else{
				if( Number(v["pAfter3m"]) > Number(v["p2"]) ){
					c = "#f44336"; 
					type = "up";
				}else if( Number(v["pAfter3m"]) ==  Number(v["p2"]) ){
					c = "#777";
					type = "same";
				}else if(Number(v["pAfter3m"]) <  Number(v["p2"]) ){
					c = "#27a0ff"; 
					type = "down";
				}
			}
		
            v.color = c;
			v.type = type;
        });

		data.map(function(v,i,a) { 
              v.id = i;
        });

		data.map(function(v,i,a) {
			//2016-01-01T00:02:00.000Z
			v.day = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z").parse(v.date);
			v.dayAfter = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z").parse(v.dateAfter3m);
		});

		
		// svg캔버스 생성
		var plot_chart_svg = d3.select("#CHART")
		var width = 1000,
			height= 500;

		plot_chart_svg.attr("width", width +"px" )
			.attr("height", height +"px");
        
        var chart_holder = plot_chart_svg.append("g")
			.attr("class","chart-holder");

		var yScaleMax = 292500;
		var yScaleMin = 3100;
		var xScaleMin = "2020. 2. 20";
		var xScaleMax = "2021. 6. 3";

        // X축과 Y축 설정
        var x = d3.time.scale() 
			.domain([new Date(2020, 1, 0), new Date(2021, 6, 3)])
			.range([0, width])
	
		var y =  d3.scale.log() // 로그스케일적용
			.domain([3100, 292500])
			.range([height, 0])
		var y2 =  d3.scale.linear() // 로그스케일적용하지않음
			.domain([3100, 292500])
			.range([height, 0])


        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom").ticks(d3.timeMonth)
			.tickFormat( d3.time.format("%Y.%m") );
           
        var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left").ticks(10)
            .tickFormat(function(d, i){ return d +"원"; });
					
        chart_holder.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+(Number(height)+20)+")")
            .call(xAxis);

        chart_holder.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-10,0)")
            .call(yAxis);
        // X축과 Y축 설정

        // 실제 데이터로 plot 그리기
        var plotRadius;
		
		var plot_container = chart_holder.append("g")
				.attr("class", "plots-holder");

		var each_plot_g = plot_container
            .selectAll("g").data(data).enter() // plots 객체에 data 연결
            .append("g")
			.attr("class", function (d) { 
				if(d["double"]=="X"){
					return "plot-g plot-g-"+d["id"]+" plot-g-"+d["type"];
				}else{
					return "plot-g plot-g-"+d["id"]+" plot-g-"+d["type"]+" plot-g-double";
				}
			})

		var plot_eval = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-cont"}) //공모가
            .attr("cx", function (d) { return x(d["day"]); })
			.attr("cy", function (d) { return y(d["p2"]); })
			.attr("r", function (d) { 
				var r;
				/*
				if(d["restrict"]*50> 30){
					r = 30;
				}else if(d["restrict"]*50<7){
					r = 7;
				}else{
					r = d["restrict"]*50;
				}*/

				/*
				r = (1-Number(d["restrict"]))*50
				if(r<7){
				 r = 7;
				}*/
				r = 4; 
				return r;
			})
			.attr("fill", function(d){ return d["color"] });
		/*
		var plot_start = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-start"}) //시초가
            .attr("cx", function (d) { return x(d["day"]); })
			.attr("cy", function (d) { return y(d["pStart"]); })
			.attr("r", function (d) { 
				var r;
				if(d["comp"]/100<5){
					r = 5;
				}else{
					r = d["comp"]/100;
				}
				return r;
			})
			.attr("fill", function(d){ return d["color"] });*/

		var plot_after = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-now"}) //현재가
            .attr("cx", function (d) { return x(d["dayAfter"]); })
			.attr("cy", function (d) { 
				if( d["pAfter3m"] == null){
					return y(d["p_now"]);
				}else{
					return y(d["pAfter3m"]);
				}
			})
			.attr("r", function (d) { 
				var r;
				/*
				if(d["restrict"]*50> 30){
					r = 30;
				}else if(d["restrict"]*50<7){
					r = 7;
				}else{
					r = d["restrict"]*50;
				}*/
				r = (1-Number(d["restrict"]))*50
				if(r<3){
				 r = 3;
				}
				return r;
			})
			.attr("fill", function(d){ return d["color"] });
		
		
		/*
		var plot_line1 = each_plot_g.append("line") // 공모가>시초가
			.attr("class", "plot-line plot-line-1")
			.attr("x1", function (d) { return x(d["day"]); })
			.attr("y1", function (d) { return y(d["p2"]); })
			.attr("x2", function (d) { return x(d["day"]); })
			.attr("y2", function (d) { 
				return y(d["pStart"]);
			})
			.attr("stroke", function (d) { return d["color"]; })

		var plot_line2 = each_plot_g.append("line") // 공모가>시초가
			.attr("class", "plot-line plot-line-2")
			.attr("x1", function (d) { return x(d["day"]); })
			.attr("y1", function (d) { return y(d["pStart"]); })
			.attr("x2", function (d) { return x(d["dayAfter"]); })
			.attr("y2", function (d) { 
				if( d["pAfter3m"] == null){
					return y(d["p_now"]);
				}else{
					return y(d["pAfter3m"]);
				}
			})
			.attr("stroke", function (d) { return d["color"]; })*/

		var plot_line = each_plot_g.append("line") // 
			.attr("class", "plot-line plot-line-3")
			.attr("x1", function (d) { return x(d["day"]); })
			.attr("y1", function (d) { return y(d["p2"]); })
			.attr("x2", function (d) { return x(d["dayAfter"]); })
			.attr("y2", function (d) { 
				if( d["pAfter3m"] == null){
					return y(d["p_now"]);
				}else{
					return y(d["pAfter3m"]);
				}
			})
			.attr("stroke", function (d) { //return d["color"]; 
				if(d["type"]=="up"){
					return "url(#Grad1)";
				}else{
					return "url(#Grad2)";
				}
			})


		var label = each_plot_g.append("text")
			.attr("class", function (d) { return "label label-name"})
			.attr("transform", function (d) { 
				var yv;	
				if( d["pAfter3m"] == null){
					yv = y(d["p_now"]);
				}else{
					yv = y(d["pAfter3m"]);
				}
				return "translate("+x(d["dayAfter"])+","+yv+")";  
			}).text(function(d) { 
				return d["name"]; 
			})
	

		var $tooltip = $(".tooltip");
		each_plot_g.on("mouseenter", function(d) {
			d3.selectAll(".plot-g").style("opacity",0.05);
            d3.select(this)
                .style("opacity", "1");

            $tooltip.css({"display":"block","opacity":"1"})
            $tooltip.find(".name").html(d["name"]);


        }).on("mouseleave", function(d){
			d3.selectAll(".plot-g")
                .style("opacity", null);

            $tooltip.css({"display":"none","opacity":"0"});

        });

        console.log("plot chart를 성공적으로 그렸습니다");
	
    }

    makePlotChart2();




	function makePlotChart3(){
		var data = stockData; // json 배열 데이터 가져옴
		data.map(function(v) { 
              v.rdcolor = getRandomColor() ;
         });
		data.map(function(v,i,a) {
			var c = "#ddd";
			var type;
			if( v["pAfter3m"] == null){
				if( Number(v["p_now"]) > Number(v["p2"]) ){
					c = "#f44336";
					type = "up";
				}else if(Number(v["p_now"]) ==  Number(v["p2"]) ){
					c = "#777";
					type = "same";
				}else if(Number(v["p_now"]) <  Number(v["p2"]) ){
					c = "#27a0ff"; 
					type = "down";
				}
			}else{
				if( Number(v["pAfter3m"]) > Number(v["p2"]) ){
					c = "#f44336"; 
					type = "up";
				}else if( Number(v["pAfter3m"]) ==  Number(v["p2"]) ){
					c = "#777";
					type = "same";
				}else if(Number(v["pAfter3m"]) <  Number(v["p2"]) ){
					c = "#27a0ff"; 
					type = "down";
				}
			}
		
            v.color = c;
			v.type = type;
        });

		data.map(function(v,i,a) { 
              v.id = i;
        });

		data.map(function(v,i,a) {
			//2016-01-01T00:02:00.000Z
			v.day = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z").parse(v.date);
			v.dayAfter = d3.time.format("%Y-%m-%dT%H:%M:%S.000Z").parse(v.dateAfter3m);
		});

		
		// svg캔버스 생성
		var plot_chart_svg = d3.select("#CHART")
		var width = 1000,
			height= 500;

		plot_chart_svg.attr("width", width +"px" )
			.attr("height", height +"px");
        
        var chart_holder = plot_chart_svg.append("g")
			.attr("class","chart-holder");

		var yScaleMax = 292500;
		var yScaleMin = 3100;
		var xScaleMin = "2020. 2. 20";
		var xScaleMax = "2021. 6. 3";

        // X축과 Y축 설정
        var x = d3.time.scale() 
			.domain([new Date(2020, 1, 0), new Date(2021, 6, 3)])
			.range([0, width])
	
		var y =  d3.scale.log() // 로그스케일적용
			.domain([3100, 292500])
			.range([height, 0])
		var y2 =  d3.scale.linear() // 로그스케일적용하지않음
			.domain([3100, 292500])
			.range([height, 0])


        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom").ticks(d3.timeMonth)
			.tickFormat( d3.time.format("%Y.%m") );
           
        var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left").ticks(10)
            .tickFormat(function(d, i){ return d +"원"; });
					
        chart_holder.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+(Number(height)+20)+")")
            .call(xAxis);

        chart_holder.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-10,0)")
            .call(yAxis);
        // X축과 Y축 설정

        // 실제 데이터로 plot 그리기
        var plotRadius;
		
		var plot_container = chart_holder.append("g")
				.attr("class", "plots-holder");

		var each_plot_g = plot_container
            .selectAll("g").data(data).enter() // plots 객체에 data 연결
            .append("g")
			.attr("class", function (d) { 
				if(d["double"]=="X"){
					return "plot-g plot-g-"+d["id"]+" plot-g-"+d["type"];
				}else{
					return "plot-g plot-g-"+d["id"]+" plot-g-"+d["type"]+" plot-g-double";
				}
			})

		var plot_eval = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-cont"}) //공모가
            .attr("cx", function (d) { return x(d["day"]); })
			.attr("cy", function (d) { return y(d["p2"]); })
			.attr("r", function (d) { 
				var r;
				/*
				if(d["restrict"]*50> 30){
					r = 30;
				}else if(d["restrict"]*50<7){
					r = 7;
				}else{
					r = d["restrict"]*50;
				}*/
				r = (1-Number(d["restrict"]))*50
				if(r<7){
				 r = 7;
				}
				return r;
			})
			.attr("fill", function(d){ return d["color"] });
		/*
		var plot_start = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-start"}) //시초가
            .attr("cx", function (d) { return x(d["day"]); })
			.attr("cy", function (d) { return y(d["pStart"]); })
			.attr("r", function (d) { 
				var r;
				if(d["comp"]/100<5){
					r = 5;
				}else{
					r = d["comp"]/100;
				}
				return r;
			})
			.attr("fill", function(d){ return d["color"] });*/

		var plot_after = each_plot_g.append("circle")
			.attr("class", function (d) { return "plot plot-now"}) //현재가
            .attr("cx", function (d) { return x(d["dayAfter"]); })
			.attr("cy", function (d) { 
				if( d["pAfter3m"] == null){
					return y(d["p_now"]);
				}else{
					return y(d["pAfter3m"]);
				}
			})
			.attr("r", function (d) { 
				var r;
				/*
				if(d["restrict"]*50> 30){
					r = 30;
				}else if(d["restrict"]*50<7){
					r = 7;
				}else{
					r = d["restrict"]*50;
				}*/
				r = (1-Number(d["restrict"]))*50
				if(r<7){
				 r = 7;
				}
				return r;
			})
			.attr("fill", function(d){ return d["color"] });
		
		
		/*
		var plot_line1 = each_plot_g.append("line") // 공모가>시초가
			.attr("class", "plot-line plot-line-1")
			.attr("x1", function (d) { return x(d["day"]); })
			.attr("y1", function (d) { return y(d["p2"]); })
			.attr("x2", function (d) { return x(d["day"]); })
			.attr("y2", function (d) { 
				return y(d["pStart"]);
			})
			.attr("stroke", function (d) { return d["color"]; })

		var plot_line2 = each_plot_g.append("line") // 공모가>시초가
			.attr("class", "plot-line plot-line-2")
			.attr("x1", function (d) { return x(d["day"]); })
			.attr("y1", function (d) { return y(d["pStart"]); })
			.attr("x2", function (d) { return x(d["dayAfter"]); })
			.attr("y2", function (d) { 
				if( d["pAfter3m"] == null){
					return y(d["p_now"]);
				}else{
					return y(d["pAfter3m"]);
				}
			})
			.attr("stroke", function (d) { return d["color"]; })*/

		var plot_line = each_plot_g.append("line") // 
			.attr("class", "plot-line plot-line-3")
			.attr("x1", function (d) { return x(d["day"]); })
			.attr("y1", function (d) { return y(d["p2"]); })
			.attr("x2", function (d) { return x(d["dayAfter"]); })
			.attr("y2", function (d) { 
				if( d["pAfter3m"] == null){
					return y(d["p_now"]);
				}else{
					return y(d["pAfter3m"]);
				}
			})
			.attr("stroke", function (d) { return d["color"]; })


		var label = each_plot_g.append("text")
			.attr("class", function (d) { return "label label-name"})
			.attr("transform", function (d) { 
				var yv;	
				if( d["pAfter3m"] == null){
					yv = y(d["p_now"]);
				}else{
					yv = y(d["pAfter3m"]);
				}
				return "translate("+x(d["dayAfter"])+","+yv+")";  
			}).text(function(d) { 
				return d["name"]; 
			})
	

		var $tooltip = $(".tooltip");
		each_plot_g.on("mouseenter", function(d) {
			d3.selectAll(".plot-g").style("opacity",0.05);
            d3.select(this)
                .style("opacity", "1");

            $tooltip.css({"display":"block","opacity":"1"})
            $tooltip.find(".name").html(d["name"]);


        }).on("mouseleave", function(d){
			d3.selectAll(".plot-g")
                .style("opacity", null);

            $tooltip.css({"display":"none","opacity":"0"});

        });

        console.log("plot chart를 성공적으로 그렸습니다");
	
    }

   // makePlotChart3();


	$(".up-btn").on("click", function(){
		$(".plot-g-up").css({"opacity":"1"});
		$(".plot-g-down").css({"opacity":"0.05"});
	});
	$(".down-btn").on("click", function(){
		$(".plot-g-up").css({"opacity":"0.05"});
		$(".plot-g-down").css({"opacity":"1"});
	});
	$(".double-btn").on("click", function(){
		$(".plot-g").css({"opacity":"0.05"});
		$(".plot-g-double").css({"opacity":"1"});
	});

	$(".default").on("click", function(){
		$(".plot-g").css({"opacity": "1"});
	});

	function writeDownloadLink(){
		try {
			var isFileSaverSupported = !!new Blob();
		} catch (e) {
			alert("blob not supported");
		}

		var html = d3.select("#CHART")
			.attr("title", "test")
			.attr("version", 1.1)
			.attr("xmlns", "http://www.w3.org/2000/svg")
			.node().parentNode.innerHTML;

		var blob = new Blob([html], {type: "image/svg+xml"});
		saveAs(blob, "myProfile.svg");
		console.log(blob);
	};

	/*
	function down(){
		var svgData = $("#CHART")[0].outerHTML;
		var svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
		var svgUrl = URL.createObjectURL(svgBlob);
		var downloadLink = document.createElement("a");
		downloadLink.href = svgUrl;
		downloadLink.download = "newesttree.svg";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);	
	}

	d3.select("#generate").on("click", down() );*/


});