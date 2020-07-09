$(function () {
  $('select').formSelect();
  $('.tooltipped').tooltip();
  let apiURL = "https://corona-bd.herokuapp.com/district";
  $.get(apiURL, function () {})
    .done(function (res) {
      let districtData = res.data;
      setBtnData(res);
      setMapColor(districtData);
      changeData(districtData);
      setMapData(districtData);
      showMapFromTable(districtData);
      $('#lastUpdate').text("Last update on : " + res.updated_on);
    })
    .fail(function () {
      console.log("Internal Problem!!!");
    });
});

function setMapColor(districtData) {
  for (let i = 0; i < districtData.length; i++) {
    let disName = districtData[i].name;
    if (disName === "Dhaka (District)") disName = "Dhaka";
    if (disName === "Cox's bazar") disName = "Coxs Bazar";

    let cnt = districtData[i].count;
    let data = mapData.find(el => el.name === disName);

    if (cnt > 0 && cnt <= 50) {
      $('#' + data.id).css({ fill: "#f8c1c3" });
    } else if (cnt > 50 && cnt <= 100) {
      $('#' + data.id).css({ fill: "#f3989b" });
    } else if (cnt > 100 && cnt <= 500) {
      $('#' + data.id).css({ fill: "#ee6e73" });
    } else if (cnt > 500 && cnt <= 1000) {
      $('#' + data.id).css({ fill: "#ea454b" });
    } else {
      $('#' + data.id).css({ fill: "#FF1744" });
    }
  }
}

function setBtnData(res) {
  let pages = Math.ceil(res.data.length / 10);

  let btnStr = "<ul class='pagination'>";

  for (let i = 1; i <= pages; i++) {
    btnStr += "<li class='waves-effect'><a class='commonClass' id='"+ i +"'"
    btnStr += ">" + i + "</a></li>"
  }
  btnStr += "</ul>";
  makeTable(res.data, 1);
  $("#disTableBtn").html(btnStr);
}

function changeData(districtData) {
  $(".commonClass").click(function () {
    let pageNum = this.id;
    //$('#' + pageNum).css({ "background-color": "blue" });
    makeTable(districtData, pageNum);
    window.localStorage.clear();
    showMapFromTable(districtData);
  });
}

function makeTable(data, pageNum) {
  let tableStr = "<table>";
  tableStr +="<thead><tr><th><strong>District</strong></th><th>";
  tableStr += "<strong>Today</strong><th><strong>Last-Day</strong>";
  tableStr += "</th><th><strong>New</strong></th></th></tr></thead><tbody>";

  let currentNum = pageNum * 10;
  for (let i = currentNum - 10; i < Math.min(currentNum, data.length); i++) {
    if (data[i].name === "Dhaka (District)") data[i].name = "Dhaka";
    if (data[i].name === "Cox's bazar") data[i].name = "Coxs Bazar";
    tableStr += "<tr id='"+ data[i].name +"'><td>" + data[i].name + "</td>";
    tableStr += "<td>" + data[i].count + "</td>";
    tableStr += "<td>" + data[i].prev_count + "</td>";
    tableStr += "<td>" + (data[i].count - data[i].prev_count) + "</td></tr>";
  }
  tableStr += "</tbody></table>";
  $("#disTable").html(tableStr);
}

function setMapData(districtData) {
  $tooltip = $('#myId');
  let tooltip = document.querySelector('#myId');
  $("a").on("click mouseover", function (event) {
    let districtName = $(this).data("value");
    if (districtName === "Dhaka") districtName = "Dhaka (District)";
    if (districtName === "Coxs Bazar") districtName = "Cox's bazar";
    let selectedDistrict = districtData.find((o) => o.name === districtName);    
    $tooltip.html(districtName + " : " + selectedDistrict.count);
    tooltip.style.display = 'block';
    $(myId).css('top', event.pageY - 70);
    $(myId).css('left', event.pageX - 10);
  });
  $("a").mouseleave(function() {
    tooltip.style.display = 'none';
  });
}

function showMapFromTable(districtData) {
  $("tr").on("mouseover", function () {
    window.localStorage.clear();
    let districtName = this.id;
    let disID = mapData.find(el => el.name === districtName).id;
    let getColor = $('#' + disID).css('fill');
    if (disID) {
      window.localStorage.setItem("disID", disID);
      window.localStorage.setItem("disColor", getColor);
      $('#' + disID).css("fill", "black");
    }
    console.log(districtName)
    //console.log(getColor)
    //console.log(districtName, disID);
  });
  $("tr").mouseleave(function() {
    let disID = window.localStorage.getItem("disID");
    let disColor = window.localStorage.getItem("disColor");
    console.log(disID, disColor)
    $('#' + disID).css("fill", disColor);
    window.localStorage.clear();
  });
}