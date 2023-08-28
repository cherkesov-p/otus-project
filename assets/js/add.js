$(document).ready(function(){
	$("#tel_human").mask("(999) 999-9999");
	$("#editClient_tel").mask("(999) 999-9999");

	$('#on-addWork')[0].reset();
	$('#ListPanel').collapse('hide');
	$('#fio_human').focus();

	if($("#client_id").val() > 1){
		$(".nav-tabs li").removeClass("active");
		$(".nav-tabs li:nth-child(2)").addClass("active");
		$("#human").removeClass("active");
		$("#org").addClass("active");		
	}

	$(".on-searchClear").on('click', function(event) {
		$("#ListSearch").val('');
	});

	$('#noFields').on('click', function() {
		$("#client_id").val("1");
		$('#ListPanel').collapse('hide');
		$('#fio_human').focus();
	});

	$('#human').on('click', function() {
		$("#client_id").val("1");
		$('#ListPanel').collapse('hide');
	});

	$('#affixFields').on('click', function() {
		$('#ListPanel').collapse('hide');
	});

	$('#clientFields, #org').on('click', function() {
		$("#on-ListName").html("Клиенты");
		loadList("client");
		$("#org_name").val('');
		$("#org_telephone").val('');
	});

	$('#deviceFields').on('click', function() {
		$("#on-ListName").html("Устройства");
		loadList("device");
	});

	$('#serialFields').on('click', function () {
		if($("#device_id").val() == "") return;
		$("#on-ListName").html("Серийные номера");
		var args = $("#device_id").val();
		loadList("serial", args, false);
	});

	function loadList (action, args = "", focus = true) {
		$('#ListPanel').collapse('show');
		$('#List').html('<div id="loader"></div>');
		if(action == "client") {
			url = "/api/clients"
		}
		if(action == "device") {
			url = "/api/devices"
		}
		if(action == "serial") {
			url = "/api/serial/" + args
		}
		$.ajax({
			type: "GET",
			url: url,
			success: function(data, textStatus){
				$('#List').html(data);
				$('#List').searchable({
					searchField: "#ListSearch",
					searchType: 'default',
					reset: 'true',
				});
				$("#ListSearch").val('');
				if(focus == true) {	$("#ListSearch").focus(); }
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
	};


	$("#List").on('click', "a.on-client", function (event) {
		$("#client_id").val( $(this).attr('data-client-id') );
		$("#org_name").val( $(this).html() );
		$("#org_telephone").val( $(this).attr('data-client-tel') );
		event.preventDefault();
	});

	$("#List").on('click', ".on-addClient", function(event) {
		$('#editClient_modal input').each(function (count) {
			$(this).removeClass("has-error");
		});			
		$("#editClient_id").val('0');
		$("#editClient_name").val('');
		$("#editClient_tel").val('');
		$("#editClient_modal").modal('show');
	});

	$("#List").on('click', "span.on-client", function (event) {
		$('#editClient_modal input').each(function (count) {
			$(this).removeClass("has-error");
		});			
		$("#editClient_id").val($(this).attr('data-client-id'));
		$("#editClient_name").val($(this).attr('data-client-name'));
		$("#editClient_tel").val($(this).attr('data-client-tel'));
		$("#editClient_modal").modal('show');
	});

	$("#editClient_submit").on('click', function(event) {
		var error = 0;
		var id = $("#editClient_id").val();
		var client = $("#editClient_name").val();
		var client_tel = $("#editClient_tel").val();
		$('#editClient_modal input').each(function (count) {
			if($(this).val() == ''){ $(this).addClass("has-error"); error = 1; }
			else { $(this).removeClass("has-error"); }
		});
		if(error == 1) { return; }
		$.ajax({
			type: "POST",
			url: 'ajax/add_edit_client.php',
			data: "id_client="+id+"&client_name="+client+"&client_tel="+client_tel,
			success: function(data, textStatus){
				$('#editClient_modal input').each(function (count) {
					$(this).removeClass("has-error");
				});				
				$("#editClient_modal").modal('hide');
				loadList("client");
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
	});

	$("#List").on('click', "a.on-device", function (event) {
		$("#device_id").val($(this).attr('data-device-id'));
		$("#device_name").val($(this).html());
		event.preventDefault();
	});

	$("#List").on('click', ".on-addDevice", function(event) {
		$('#editDevice_modal input').each( function (count) {
			$(this).removeClass("has-error");
		});		
		$("#editDevice_id").val('0');
		$("#editDevice_type").val('');
		$("#editDevice_brand").val('');
		$("#editDevice_name").val('');
		$("#editDevice_modal").modal('show');
	});

	$("#List").on('click', "span.on-device", function (event) {
		$('#editDevice_modal input').each( function (count) {
			$(this).removeClass("has-error");
		});		
		$("#editDevice_id").val($(this).attr('data-device-id'));
		$("#editDevice_type").val($(this).attr('data-device-type'));
		$("#editDevice_brand").val($(this).attr('data-device-brand'));
		$("#editDevice_name").val($(this).attr('data-device-name'));
		$("#editDevice_modal").modal('show');
	});

	$("#editDevice_submit").on('click', function(event) {
		var error = 0;
		var id = $("#editDevice_id").val();
		var type = $("#editDevice_type").val();
		var brand = $("#editDevice_brand").val();
		var device = $("#editDevice_name").val();
		$('#editDevice_modal input').each(function (count) {
			if($(this).val() == '' && $(this).attr("id") != "editDevice_id") {
				$(this).addClass("has-error");
				error = 1; 
			}
			else { $(this).removeClass("has-error"); }
		});
		if(error == 1) { return; }
		$.ajax({
			type: "POST",
			url: 'ajax/add_edit_device.php',
			data: "action=add&id="+id+"&type="+type+"&brand="+brand+"&device="+device,
			success: function(data, textStatus){
				$('#editDevice_modal input').each( function (count) {
					$(this).removeClass("has-error");
				});
				$("#editDevice_modal").modal('hide');
				loadList("device");
				$("#id_device").val(data.id_device);
				$("#device_name").val(data.device_name);
			},
			error: function(jqXHR, textStatus, errorThrown){
				notify('danger', textStatus);
			}
		});
	});

	$('#editDevice_type').typeahead({
		source: function (query, process) {
			return loadDevice('type', query, process);
		}
	});

	$('#editDevice_brand').typeahead({
		source: function (query, process) {
			return loadDevice('brand', query, process);
		}
	});

	$('#editDevice_name').typeahead({
		source: function (query, process) {
			return loadDevice('device', query, process);
		}
	});

	function loadDevice(type, query, process) {
		return $.post(
			'ajax/add_edit_device.php', 
			{'action': 'typeahead-'+type, 'name': query},
			function (response) {
				var data = new Array();
				if(response !== null) {
					$.each(response, function(i, name) {
						data.push(name);
					});
				}
				return process(data);
			},
			'json'
		);
	}

	$("#List").on('click', "a.on-serial", function (event) {
		$("#serial").val( $(this).html() );
		event.preventDefault();
	});

	$("#List").on('click', "span.on-serial", function (event) {
		window.open("/index.php?r=search/view&search="+ $(this).attr('data-serial'), '_blank');
	});

	$("#on-addWork").on('submit', function(event) {
		var error = 0;

		$("#on-addWork input").each(function (count) {
			$(this).removeClass('has-error');
			$(this).removeClass('has-success');
		});

		if($("#client_id").val() == "1" && $("#fio_human").val() == "") {
			$("#fio_human").addClass('has-error');
			error = 1;
		}
		if($("#id_device").val() == ""){
		$("#device_name").addClass('has-error');
			error = 1;
		}
		
		if(error == 1) { event.preventDefault(); }
	});
});