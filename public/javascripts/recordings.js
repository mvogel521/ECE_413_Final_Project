$(function() {
    $.ajax({
      url: '/particle/getRecordings',
      method: 'GET',
      dataType: 'json'
    })
    .done(function(data, textStatus, jqXHR) {
      $('#rxData').html(JSON.stringify(data, null, 2));
  
      // Assuming the data has a 'record' array with the necessary fields
      const recordings = data.records; // Assuming the response contains the 'record' field
  
      // Extract the data you need for the chart, e.g., temperature and timestamps
  
      const temp1Data = recordings.map(records => records.temp1);
      const temp2Data = recordings.map(records => records.temp2);
  
      const ctx = document.getElementById('myChart').getContext('2d');
  
      const myChart = new Chart(ctx, {
        type: 'line', // Change to 'bar', 'pie', etc. based on your needs
        data: {
          // labels: labels, // X-axis labels (timestamps)
          datasets: [
            {
              label: 'Temp1', // Label for the first temperature dataset
              data: temp1Data, // Y-axis data for Temp1
              borderColor: 'rgba(0, 0, 0, 1)',
              fill: false, // Do not fill the area under the curve
              tension: 0.1
            },
            {
              label: 'Temp2', // Label for the second temperature dataset
              data: temp2Data, // Y-axis data for Temp2
              borderColor: 'rgba(0, 0, 0, 1)',
              fill: false, // Do not fill the area under the curve
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'category', // X-axis should be categorical (timestamps)
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              title: {
                display: true,
                text: 'BPM' // Adjust if needed based on your data
              }
            }
          }
        }
      });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
      window.location.replace("display.html");
    });
  });
  