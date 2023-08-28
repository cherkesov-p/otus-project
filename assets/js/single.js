$(document).ready(function(){

	$(".statusbar label").on('click', function (event) {
		var id = $(this).attr('data-id');
		var value = $(this).attr('data-value');
		$.ajax({
			type: "GET",
			url: '/api/status/' +id + "/" + value,
			// data: "q="+value+"&idr="+id,
			success: function(data, textStatus){
				notify('success', "Статус изменён");
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
	});

	$(".onWorkerSave").on('click', function(event) {
		var id = $("#work-id").html();
		var id_worker = $("#work-worker-select").val();
		var name = $("#work-worker-select option:selected").text();
		$.ajax({
			type: "GET",
			url: 'ajax/edit_worker.php',
			data: "id="+id+"&id_worker="+id_worker,
			success: function(data, textStatus){
				$("#work-worker").html(name);
				$("#work-worker").attr("data-worker-id", id_worker);
				$("#worker-name").show();
				$("#worker-select").hide();
				notify('success', "Работа закреплена");
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
	});

	$(".onWorkerRemove").on('click', function(event) {
		var id = $("#work-id").html();
		$.ajax({
			type: "GET",
			url: 'ajax/edit_worker.php',
			data: "id="+id,
			success: function(data, textStatus){
				$("#work-worker").attr("data-worker-id", "");
				$("#worker-select").show();
				$("#worker-name").hide();
				notify('success', "Работа освобождена");
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
	});

	$(".onPartsAdd").on('click', function () {
		$("#parts").append($("#parts_row").html());
	});

	$(".warranty-radio").on('click', 'button', function(event){
		$("#warrantyTime").val($(this).attr("data-time"));
		$(".warranty-radio button").each(function (index) {
			$(this).removeClass('btn-primary');
			$(this).addClass('btn-default');
		});
		$(this).removeClass('btn-default');
		$(this).addClass('btn-primary');
	});

	$(".onWorkComplete").on('click', function (event) {
		$("#editForm").attr("action", $(this).href());
		$("#editForm").submit();
		event.preventDefault();
	});

	$(".onWorkCompleteWOCheck").on('click', function (event) {
		$("#editForm").attr("action", $(this).href());
		$("#editForm").submit();
		event.preventDefault();
	});

	$(".onWorkUncomplete").on('click', function (event) {
		$("#editForm").attr("action", $(this).href());
		$("#editForm").submit();
		event.preventDefault();
	});

	$(".onWorkDel").on('click', function (event) {
		var id = $(this).attr('data-work-id');
		$("#editForm").attr("action", "index.php?r=single/_delete");
		$("#edit_id_work").val(id);
		$("#editForm").submit();
		event.preventDefault();
	});

	$(".onWorkEdit").on('click', function (event) {
		var id = $(this).attr('data-work-id');
		$("#editFrame").show();
		// $("#editForm").attr("action", "index.php?r=single/_edit");
		$("#work_id").val(id);
		$.ajax({
			type: "GET",
			url: '/edit_work.php',
			data: "id="+id,
			dataType: "json",
			success: function(data, textStatus){
				$("#edit_date").val(data.date);
				$("#edit_text").html(data.text);
				$("#edit_price").val(data.price);
				$("#parts").html("");
				if(data.hardJson) {
					$.each(data.hardJson, function(id, text) {
						$("#parts_row").show();
						$("#parts_row").find("input[type=text]").val(text.edit_hard);
						$("#parts_row").find("input[type=number]").val(text.edit_hardprice);
						$("#parts_row").clone().appendTo('#parts');
						$("#parts_row").hide();
					});
				};
				$("#edit_worker option").each(function (index) {
					$(this).removeAttr('selected');
					if($(this).val() == data.id_worker) {
						$(this).attr("selected", true);
					}
				});
				$("html, body").animate({scrollDown: $("#editFrame")}, 500);
				$("#edit_text").focus();
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
		event.preventDefault();
	});

	$(".onWorkAdd").on('click', function (event) {
		$("#editFrame").show();
		// $("#editForm").attr("action", "index.php?r=single/_create");
		$("#work_id").val("0");
		$("#edit_date").val($(this).attr('data-curr-date'));
		$("#edit_text").html("");
		$("#edit_price").val("");
		$("#parts").html("");
		$("#edit_worker option").each(function (index) {
			$(this).removeAttr('selected');
			if( $(this).val() == $("#work-worker").attr("data-worker-id") ) {
				$(this).attr("selected", true);
			}
		});
		$("html, body").animate({scrollDown: $("#editFrame")}, 500);
		$("#edit_text").focus();

		event.preventDefault();
	});

	$("#editForm").on('submit', function(event) {
		var parts = new Array();
		var parts_price = 0;
		$("#parts .row").each(function(index) {
			parts.push({ 
				'edit_hard': $(this).find("input[type=text]").val(), 
				'edit_hardprice':  parseInt($(this).find("input[type=number]").val()),
			});
			parts_price = parts_price + parseInt($(this).find("input[type=number]").val());
		});
		$("#edit_parts").val(JSON.stringify(parts));
		$("#edit_parts_price").val(parts_price);
	});

	$("#sendSMS_tel").mask("(999) 999-9999");
	$("#sendSMS_submit").on('click', function(event) {
		var id = $("#work-id").html();
		var tel = $("#sendSMS_tel").val();
		var text = $("#sendSMS_text").val();
		if(tel == "") {
			notify('danger', "Не указан телефон");
			$("#sendSMS_tel").addClass('has-error');
			return;
		}
		$(this).button('loading');
		$.ajax({
				type: "POST",
				url: './ajax/send_sms.php',
				data: "id="+id+"&tel="+tel+"&msg="+text,
				success: function(data){
						notify('success', "Сообщение отправлено <br>"+data);
				},
				error: function(jqXHR, textStatus, errorThrown){
						notify('danger', textStatus + " " + errorThrown);
				},
				always: function() {
				}
		});
		$("#sendSMS_tel").removeClass('has-error');
		$(this).button('reset');
		$(".statusbar label[data-value=9]").addClass('active');
		$('#sendSMS_modal').modal('hide');
	});

	$("#printCheck_submit").on('click', function (event) {
		var id = $("#work-id").html();
		$.ajax({
				type: "POST",
				url: './check_xls.php',
				data: "edit_id="+id,
				success: function(data){
						notify('success', "Чек отправлен на печать <br>"+data);
				},
				error: function(jqXHR, textStatus, errorThrown){
						notify('danger', textStatus + " " + errorThrown);
				},
		});
		event.preventDefault();
	});

});
