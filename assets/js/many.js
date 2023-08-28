$(document).ready(function(){

	$('#search').focus();
	$('#search-clear').on('click', function(){ $('#search').val('').trigger('keyup').focus();} );
	
	$("#workerSort select").on('change', function(event){
		$("#workerSort").attr("action", "index.php?r=many/incomplete&sort=" + $(this).val());
		$("#workerSort").submit();
	});	

	$('#table-works').searchable({
		striped: true,
		oddRow: { 'background-color': '#f5f5f5' },
		evenRow: { 'background-color': '#ffffff' },
		searchType: 'default'
	});
});
