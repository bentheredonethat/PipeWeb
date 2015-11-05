// process data here
function processData() {
   var jsonData = '[{"rank":"9","content":"Alon","UID":"5"},{"rank":"6","content":"Tala","UID":"6"}]';

$.ajax({
    url: '/echo/json/',
    type: 'POST',
    data: {
        json: jsonData
    },
    success: function (response) {
        var trHTML = '';
        $.each(response, function (i, item) {
            trHTML += '<tr><td>' + item.rank + '</td><td>' + item.content + '</td><td>' + item.UID + '</td></tr>';
        });
        $('#records_table').append(trHTML);
    }
});
};