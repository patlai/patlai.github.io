var dataTable = "";
var coinList = "";

function refreshTable(){
  dataTable = $('#coinTable').DataTable({
    iDisplayLength: -1,
    order: [[ 6, "desc" ]]
  });
  coinList = dataTable.rows().data();
}

window.onload = function() {
  populateTable();
};

 function populateTable(){
  var allCoinsUrl = "https://api.coinmarketcap.com/v1/ticker/?limit=200";
  var allCoinsList = [];

  // make the API call to coinmarketcap to get the list of all coins
  $.ajax({
    url : allCoinsUrl,
    type: 'GET',
    crossDomain: true,
  }).done(function(response) {
      allCoinsList = response;
      // iterate through the response and populate the table of coins
      var table = document.getElementById("coinTableHead");
      for(var i = 0; i < response.length; i++){

        // add a new row to the end of the table
        var rowCount = table.getElementsByTagName("tr").length;
        // insert at rowCount because the current last index is rowCount - 1 and we want to insert it after it
        var row = table.insertRow(rowCount);

        // populate the current row with cells
        var nameCell = row.insertCell(0);
        var shortCell = row.insertCell(1);
        var priceCell = row.insertCell(2);
        var capCell = row.insertCell(3);
        var volumeCell = row.insertCell(4);
        var redditNameCell = row.insertCell(5);
        var redditSubCell = row.insertCell(6);
        var ratioCell = row.insertCell(7);

        // fill out the cells with the response info
        nameCell.innerHTML = response[i]["id"];
        shortCell.innerHTML = response[i]["symbol"];
        priceCell.innerHTML = parseFloat(response[i]["price_usd"]);
        capCell.innerHTML = numberWithCommas(parseFloat(response[i]["market_cap_usd"]));
        volumeCell.innerHTML = numberWithCommas(parseFloat(response[i]["24h_volume_usd"]));
        redditNameCell.innerHTML = "--";
        redditSubCell.innerHTML = 0;
        ratioCell.innerHTML = 0.0;
      }

      var coinTb = document.getElementById("coinTable");

      // map each row to a different promise, and resolve the promise in every possible case for each row
      // possible outcomes: found a valid subreddit, didn't find a subreddit, call returns an error / failed
      var promises = [].slice.call(coinTb.rows).map(
        row => new Promise((resolve, reject) => {

          // get the coin name / id from the table
          var coinName = row.cells[0].innerHTML;

          // link to the about.json file for the current sub
          var redditUrl = "https://www.reddit.com/r/" + coinName + "/about.json"

          // make a get request to the about.json file, then populate the corresponding row in a callback
          $.getJSON(redditUrl, function(result){
              
              // check if the subscriber count and display name are valid. If a call is made
              // to a subreddit that doesn't exist, these 2 properties won't be there
              if(result["data"]["display_name"] && result["data"]["subscribers"]){

                // get the link to the subreddit itself
                var subUrl = "https://www.reddit.com/r/" + coinName;
                row.cells[5].innerHTML = "<a href='"+ subUrl +"'>" + result["data"]["display_name"] + "</a>"

                row.cells[6].innerHTML = numberWithCommas(parseInt(result["data"]["subscribers"]));

                row.cells[7].innerHTML = (parseFloat(row.cells[3].innerHTML.replace(',','') ) / parseFloat(result["data"]["subscribers"]) ).toFixed(3);
              } 
              // resolve when row is filled
              resolve();

          }).fail(function() { resolve(); })
        }));

      Promise.all(promises).then( () => { refreshTable() } );
    
  });
}

function updateTable(){
   var data = dataTable.rows().data();

   console.log(data);

   for(i = 0; i < data.length; i++){
      var coinName = data[i][0];
      var coinTickerUrl = "https://api.coinmarketcap.com/v1/ticker/" + coinName;

      // send request to coincap API for the current coin
      $.getJSON(coinTickerUrl, function(result){ 

      }).then(function(){
        // update coin price
        data[2] = 
      });

      

   }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}