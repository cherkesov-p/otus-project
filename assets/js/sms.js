$(document).ready(function(){
	$('#search').focus();
	$('#search-clear').on('click', function(){ $('#search').val('').trigger('keyup').focus();} );

	$('#table-works').searchable({
		striped: true,
		oddRow: { 'background-color': '#f5f5f5' },
		evenRow: { 'background-color': '#ffffff' },
		searchType: 'default'
	});
		
	$(".onSmsStatus").on('click', function() {
		var id = $(this).attr("data-smsc-id");
		var tel = $(".statusTel").html();
		$.ajax({
				type: "POST",
				url: './ajax/sms_status.php',
				data: "id="+id+"&tel="+tel,
				success: function(data){
						notify('success', "Статус обновлён на "+data);
				},
				error: function(jqXHR, textStatus, errorThrown){
						notify('danger', textStatus + " " + errorThrown);
				},
		});
	});	
});
