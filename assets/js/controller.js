$(function () {
  const apiURL = "https://corona-bd.herokuapp.com/district";
  $("main").hide();

  $.get(apiURL, function () {})
    .done(function (res) {
      const districtData = res.data;
      setBtnData(res);
      defaultBtnColor();
      setMapColor(districtData);
      changeData(districtData);
      setMapData(districtData);
      setDivisionMap();
      showMapFromTable();
      $("#lastUpdate").text("Last update on : " + res.updated_on);
      $(".mainLoader").hide();
      $("main").show();
    })
    .fail(function () {
      console.log("Internal Problem!!!");
    });
});

function setMapColor(districtData) {
  for (let i = 0; i < districtData.length; i++) {
    let disName = districtData[i].name;
    if (disName === "Dhaka City") disName = "Dhaka";
    if (disName === "Cox's bazar") disName = "Coxs Bazar";
    if (disName === "Jashore" || disName === "Moulvibazar" ||
      disName === "Panchagarh") continue;
    const cnt = districtData[i].count;
    const data = mapData.find((el) => el.name === disName);
    if (data === undefined) continue;
    if (cnt > 0 && cnt <= 50) {
      $("#" + data.id).css({
        fill: "#f8c1c3"
      });
    } else if (cnt > 50 && cnt <= 100) {
      $("#" + data.id).css({
        fill: "#f3989b"
      });
    } else if (cnt > 100 && cnt <= 500) {
      $("#" + data.id).css({
        fill: "#ee6e73"
      });
    } else if (cnt > 500 && cnt <= 1000) {
      $("#" + data.id).css({
        fill: "#ea454b"
      });
    } else {
      $("#" + data.id).css({
        fill: "#FC0404"
      });
    }
  }
}

function setBtnData(res) {
  const pages = Math.ceil(res.data.length / 10);
  const btnStr = "<ul class='pagination'>";
  for (let i = 1; i <= pages; i++) {
    btnStr +=
      "<li class='waves-effect'><a class='commonClass btn' id='" +
      i +
      "'";
    btnStr += ">" + i + "</a></li>";
  }
  btnStr += "</ul>";
  makeTable(res.data, 1);
  $("#disTableBtn").html(btnStr);
}

function changeData(districtData) {
  $(".commonClass").click(function () {
    // set default btn colors
    defaultBtnColor();
    const pageNum = this.id;
    $("#" + pageNum).css({
      backgroundColor: "#69f0ae"
    });
    makeTable(districtData, pageNum);
    window.localStorage.clear();
    showMapFromTable(districtData);
  });
}

function defaultBtnColor() {
  $("#1").css({
    backgroundColor: "#cfd8dc"
  });
  $("#2").css({
    backgroundColor: "#cfd8dc"
  });
  $("#3").css({
    backgroundColor: "#cfd8dc"
  });
  $("#4").css({
    backgroundColor: "#cfd8dc"
  });
  $("#5").css({
    backgroundColor: "#cfd8dc"
  });
  $("#6").css({
    backgroundColor: "#cfd8dc"
  });
  $("#7").css({
    backgroundColor: "#cfd8dc"
  });
}

function makeTable(data, pageNum) {
  const tableStr = "<table>";
  tableStr += "<thead><tr><th><strong>District</strong></th><th>";
  tableStr += "<strong>Today</strong><th><strong>Last-Day</strong>";
  tableStr += "</th><th><strong>New</strong></th></th></tr></thead><tbody>";

  const currentNum = pageNum * 10;
  for (let i = currentNum - 10; i < Math.min(currentNum, data.length); i++) {
    if (data[i].name === "Dhaka (District)") data[i].name = "Dhaka";
    if (data[i].name === "Cox's bazar") data[i].name = "Coxs Bazar";
    tableStr += "<tr id='" + data[i].name + "'><td>" + data[i].name + "</td>";
    tableStr += "<td>" + data[i].count + "</td>";
    tableStr += "<td>" + data[i].prev_count + "</td>";
    tableStr += "<td>" + (data[i].count - data[i].prev_count) + "</td></tr>";
  }
  tableStr += "</tbody></table>";
  $("#disTable").html(tableStr);
}

function setMapData(districtData) {
  $tooltip = $("#myId");
  const tooltip = document.querySelector("#myId");
  $("a").on("click mouseover", function (event) {
    const districtName = $(this).data("value");
    const selectedDistrict = districtData.find((o) => o.name === districtName);
    $tooltip.html(districtName + " : " + selectedDistrict.count);
    tooltip.style.display = "block";
    $(myId).css("top", event.pageY - 70);
    $(myId).css("left", event.pageX - 10);
  });
  $("a").mouseleave(function () {
    tooltip.style.display = "none";
  });
}

function setDivisionMap() {
  $("select.divisionName").change(function () {
    const divName = $(this).children("option:selected").val();
    allDivShow();
    if (divName === "dhaka") {
      $(".rajshahiDivision").hide();
      $(".khulnaDivision").hide();
      $(".rangpurDivision").hide();
      $(".mymenshingDivision").hide();
      $(".barishalDivision").hide();
      $(".sylhetDivision").hide();
      $(".chittagongDivision").hide();
      $(".st1").hide();
      $(".div_Dha").show();
    } else if (divName === "chittagong") {
      $(".rajshahiDivision").hide();
      $(".khulnaDivision").hide();
      $(".rangpurDivision").hide();
      $(".mymenshingDivision").hide();
      $(".barishalDivision").hide();
      $(".sylhetDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Cha").show();
    } else if (divName === "rajshahi") {
      $(".chittagongDivision").hide();
      $(".khulnaDivision").hide();
      $(".rangpurDivision").hide();
      $(".mymenshingDivision").hide();
      $(".barishalDivision").hide();
      $(".sylhetDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Raj").show();
    } else if (divName === "khulna") {
      $(".chittagongDivision").hide();
      $(".rajshahiDivision").hide();
      $(".rangpurDivision").hide();
      $(".mymenshingDivision").hide();
      $(".barishalDivision").hide();
      $(".sylhetDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Khu").show();
    } else if (divName === "rangpur") {
      $(".chittagongDivision").hide();
      $(".rajshahiDivision").hide();
      $(".khulnaDivision").hide();
      $(".mymenshingDivision").hide();
      $(".barishalDivision").hide();
      $(".sylhetDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Ran").show();
    } else if (divName === "mymenshing") {
      $(".chittagongDivision").hide();
      $(".rajshahiDivision").hide();
      $(".khulnaDivision").hide();
      $(".rangpurDivision").hide();
      $(".barishalDivision").hide();
      $(".sylhetDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Mym").show();
    } else if (divName === "barishal") {
      $(".chittagongDivision").hide();
      $(".rajshahiDivision").hide();
      $(".khulnaDivision").hide();
      $(".rangpurDivision").hide();
      $(".mymenshingDivision").hide();
      $(".sylhetDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Bar").show();
    } else if (divName === "sylhet") {
      $(".chittagongDivision").hide();
      $(".rajshahiDivision").hide();
      $(".khulnaDivision").hide();
      $(".rangpurDivision").hide();
      $(".mymenshingDivision").hide();
      $(".barishalDivision").hide();
      $(".dhakaDivision").hide();
      $(".st1").hide();
      $(".div_Syl").show();
    } else {
      allDivShow();
    }
  });
}

function allDivShow() {
  $(".chittagongDivision").show();
  $(".rajshahiDivision").show();
  $(".khulnaDivision").show();
  $(".rangpurDivision").show();
  $(".mymenshingDivision").show();
  $(".barishalDivision").show();
  $(".dhakaDivision").show();
  $(".sylhetDivision").show();
  $(".st1").show();
}

function showMapFromTable() {
  $("tr").on("mouseover", function () {
    window.localStorage.clear();
    const districtName = this.id;
    const disID = mapData.find((el) => el.name === districtName).id;
    if (disID) {
      window.localStorage.setItem("disID", disID);
      $("#" + disID).hide();
    }
  });
  $("tr").mouseleave(function () {
    const disID = window.localStorage.getItem("disID");
    $("#" + disID).show();
    window.localStorage.clear();
  });
}