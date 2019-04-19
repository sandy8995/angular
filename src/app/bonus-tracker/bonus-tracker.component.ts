import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var window: any;
declare let Chart: any;
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../data.service';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bonus-tracker',
  templateUrl: './bonus-tracker.component.html',
  styleUrls: ['./bonus-tracker.component.css']
})
export class BonusTrackerComponent implements OnInit {
  userId = '';
  messages: any[];
  showfiltererror: boolean = false;
  preloader: boolean = true;
  Arr = Array;
  num: number = 10;
  showallasin: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private data: DataService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
    localStorage.setItem('dataSource', this.userId);
  }
  ServerUrl = 'http://amzblast.moviesdoctor.com/amzblast1/webservices/';
  filtertext: string = '';
  p: number = 1;
  resetsearch: boolean = true;
  users$: Observable<any>;
  largeimage(img: any, asin: any) {
    $('.showimage' + asin).css('visibility', 'visible');
  }
  smallimage(asin: any) {
    $('.showimage' + asin).css('visibility', 'hidden');
  }
  ngOnInit() {
    this.data.getAdditionProducts()
      .subscribe((data) => {
        console.log(data);
        this.preloader = false;
        this.messages = data;
        if (data) {
          setTimeout(function () {
            /* $(document).ready(function () { */
            $('.tracked-product .table tr').each(function () {
              var data_asinid = $(this).attr('data-asinid');
              var start_date = $(this).attr('asin_start_date');
              var end_date = $(this).attr('asin_end_date');

              if (data_asinid != '' && typeof data_asinid != 'undefined') {
                $.get("http://amzblast.moviesdoctor.com/amzblast1/webservices/product_tracking_id.php", { data_asinid: data_asinid, start_date: start_date, end_date: end_date }, function (responsedata: any) {
                  var data = $.parseJSON(responsedata);
                  var month = new Array();
                  month[0] = "Jan";
                  month[1] = "Feb";
                  month[2] = "Mar";
                  month[3] = "Apr";
                  month[4] = "May";
                  month[5] = "June";
                  month[6] = "July";
                  month[7] = "Aug";
                  month[8] = "Sept";
                  month[9] = "Oct";
                  month[10] = "Nov";
                  month[11] = "Dec";
                  var data_arr = [];
                  if (data.data) {
                    for (var i = 0; i < data.data.length; i++) {

                      $('.asin_btn_graph' + data.data[i].asin).attr('data-value', JSON.stringify(data.data));
                      $('.asin_btn_graph' + data.data[i].asin).attr('data-count', JSON.stringify(data.data.length));
                      $('.asin_btn_graph' + data.data[i].asin).prop("disabled", false);
                      $('.updatetotalrank' + data.data[i].asin).val(data.data[i].totalrank);
                      $('.updatetotalsale' + data.data[i].asin).val(data.data[i].totalsale);
                      var d = new Date(data.data[i].date);
                      var month_name = month[d.getMonth()];
                      var date = d.getDate();
                      var year = d.getFullYear();
                      var update_date = month_name + ' ' + date + ', ' + year;
                      $('.lprank' + data.data[i].asin).html("Rank : " + data.data[i].rank);
                      $('.lppdate' + data.data[i].asin).html("Updated on : " + update_date);
                      $('.lpseller' + data.data[i].asin).html(data.data[i].seller);
                    }
                  }
                  barchart();
                });
              }
            });
            function barchart() {
              $('.tracked-product .table tr').each(function () {
                var asin = $(this).attr('data-asinid');
                var trdata = $(this).find('.asin_btn_graph'+asin).attr('data-value');
                if (trdata) {
                  trdata = $.parseJSON(trdata);
                  var sales = new Array();
                  trdata.reverse();
                  var trackdata = new Array();
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    var ddz = "0" + dd;
                  }
                  if (mm < 10) {
                    var mmz = '0' + mm;
                  }
                  var todayr = yyyy + '-' + mmz + '-' + ddz;
                  for (var i = 0; i < 7; i++) {
                    if (todayr <= trdata[i]) {
                      trackdata.push(trdata[i]);
                    }
                  }
                  trackdata.reverse();
                  trdata = trackdata;
                  for (var i = 0; i < trdata.length; i++) {
                    sales.push(trdata[i].sales);
                  }
                  $(this).find('.sparkline1'+asin).sparkline(sales, { type: 'bar', barColor: '#4285f4', height: 50, barSpacing: 3, barWidth: 6 });

                } else {
                  $(this).find('.sparkline1'+asin).html("N/A");
                }
              });
            }
            /*});*/
          }, 1000);
        }
      });
    /* this.users$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.data.getAdditionProducts()
      )
    ); */


  }

  openprint() {
    var prdata = $('.row-trackingdata').val();
    var prtitle = $('.tpro-title').text();
    var prasin = $('.tpro-asin').text();
    if (prdata) {
      prdata = $.parseJSON(prdata);
      var datatablebody = "";
      var datatablehead = "<tr><th style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>Date</th><th style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>Stock</th><th style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>Sales</th><th style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>Rank</th><th style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>Seller</th></tr>";
      for (var i = 0; i < prdata.length; i++) {
        datatablebody += "<tr>";
        datatablebody += "<td style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>" + prdata[i].date + "</td>";
        datatablebody += "<td style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>" + prdata[i].stock + "</td>";
        datatablebody += "<td style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>" + prdata[i].sales + "</td>";
        datatablebody += "<td style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>" + prdata[i].rank + "</td>";
        datatablebody += "<td style='border: 1px solid #000; border-collapse: collapse; padding: 15px;'>" + prdata[i].seller + "</td>";
        datatablebody += "</tr>";
      }
      var newWin = window.open('', 'Print-Window');
      newWin.document.open();
      newWin.document.write('<html><body onload="window.print()"><h4>' + prtitle + '</h4><span>ASIN : ' + prasin + '</span><br/><br/><table style="border: 1px solid #ccc; border-collapse: collapse;"><thead>' + datatablehead + '</thead><tbody>' + datatablebody + '</tbody></table></body></html>');
      newWin.document.close();
      setTimeout(function () {
        newWin.close();
      }, 10);
    }
  }

  openModel() {

    $('.asin-graph').modal();
    $('.tracked-product').on('click', '.btn-grph', function () {
      console.log("ok");
      $("#urltooltip").hide();
      $('#producttrack').remove();
      $('.no-pro').remove();
      var procat = $(this).parent().find('.procat').val().trim();
      var trdata = $(this).attr('data-value').replace("'", "");
      var proname = $(this).parent().parent().parent().find('.asin-title').text();
      var proasin = $(this).parent().parent().parent().find('.cell-detail-description a').text().trim();
      var proimage = $(this).parent().parent().parent().find('.proasin img').attr('src');
      var trckcount = parseInt($(this).attr('data-count').trim());
      $('.asin-graph .tpro-title').text(proname);
      if (procat != "") {
        $('.asin-graph .tpro-cat').text('Category : ' + procat);
      }
      $('.asin-graph .tpro-asin').text(proasin);
      $('.asin-graph .tpro-elink a').attr('href', 'https://www.amazon.in/dp/' + proasin);
      $('.asin-graph .tpro-image').html("<img style='object-fit: contain;width: 100%;height: 214px;border: 1px solid #aaa;' src='" + proimage + "'/>");
      $('.row-trackingdata').attr('value', trdata);
      if (trdata) {
        /* var avsales = parseInt($(this).parent().find('.totalsale').val());
        var avsale = (avsales / trckcount).toFixed();
        var avranks = parseInt($(this).parent().find('.totalrank').val());
        var avrank = (avranks / trckcount).toFixed(); */
        trdata = $.parseJSON(trdata);
        trdata.reverse();
        var trackdata = new Array();
        var datalength = 14;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
          var ddz = '0' + dd;
        }
        if (mm < 10) {
          var mmm = '0' + mm;
        }
        var todayr = yyyy + '-' + mmm + '-' + ddz;
        var totalsales = 0;
        var totalrank = 0;
        for (var i = 0; i < datalength; i++) {
          let totalsales;
          let totalrank;
          if (todayr <= trdata[i]) {
            totalsales = parseInt(totalsales) + parseInt(trdata[i].sales);
            totalrank = parseInt(totalrank) + parseInt(trdata[i].rank);
            trackdata.push(trdata[i]);
          }
        }
        var trackcount = trackdata.length;
        avsale = (totalsales / trackcount).toFixed();
        avrank = (totalrank / trackcount).toFixed();
        trackdata.reverse();
        trdata = trackdata;
        var dates = new Array(), stocks = new Array(), sales = new Array(), ranks = new Array(), sellers = new Array();
        for (var i = 0; i < trdata.length; i++) {
          dates.push(trdata[i].date);
          stocks.push(trdata[i].stock);
          sales.push(trdata[i].sales);
          ranks.push(trdata[i].rank);
          sellers.push(trdata[i].seller);
        }
        $('.track-container').append('<canvas id="producttrack"><canvas>');
        line_chart(dates, stocks, sales, ranks, sellers);
      } else {
        var avsales = 0;
        var avsale = '0';
        var avrank = '0';
        $('.track-container').append("<span class='no-pro'><center>No data available! Please wait for traking data.</center></span>");
      }
      $('.asin-graph .tl-sales-reviews span').html("<i class='fa fa-refresh fa-spin'></i>");
      if (proasin != "") {
        //$(this).find('.fa').removeClass('fa-search').addClass('fa-refresh fa-spin');
        $.get("http://amzblast.moviesdoctor.com/amzblast1/webservices/chart.php", { tlsasin: proasin }, function (returndata) {
          $('.btn-tsals').find('.fa').addClass('fa-search').removeClass('fa-refresh fa-spin');
          var returndata = JSON.parse(returndata);
          $('.asin-graph .tl-sales-reviews span').html(returndata.totalsale);
        });
      }
      $('.asin-graph').modal();
      $('.asin-graph .av-sales span').text(avsale);
      $('.asin-graph .av-rank span').text(avrank);
      $('.asin-graph .tl-sales span').text(avsales);
    });
    $('.btn-days').click(function () {
      $('#producttrack').remove();
      $('.no-pro').remove();
      var trdata = $('.row-trackingdata').attr('value');
      var days = $(this).data('value');
      if (trdata) {
        var tax_data = $.parseJSON(trdata);
        tax_data.reverse();
        var trackdata = new Array();
        //var datalength = "";
        if (tax_data.length <= days) {
          var datalength = tax_data.length;
        } else {
          var datalength = days;
        }
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
          var ddz = '0' + dd;
        }
        if (mm < 10) {
          var mmz = '0' + mm;
        }
        var todayr = yyyy + '-' + mmz + '-' + ddz;
        let totalsales = 0;
        let totalrank = 0;
        for (var i = 0; i < datalength; i++) {
          let totalsales;
          let totalrank;
          if (todayr <= tax_data[i]) {
            totalsales = parseInt(totalsales) + parseInt(tax_data[i].sales);
            totalrank = parseInt(totalrank) + parseInt(tax_data[i].rank);
            trackdata.push(tax_data[i]);
          }
        }
        var trackcount = trackdata.length;
        let avsale = (totalsales / trackcount).toFixed();
        let avrank = (totalrank / trackcount).toFixed();
        trackdata.reverse();
        trdata = trackdata;
        var dates = new Array(), stocks = new Array(), sales = new Array(), ranks = new Array(), sellers = new Array();
        for (var i = 0; i < trdata.length; i++) {
          dates.push(trdata[i].date);
          stocks.push(trdata[i].stock);
          sales.push(trdata[i].sales);
          ranks.push(trdata[i].rank);
          sellers.push(trdata[i].seller);
        }
        $('.track-container').append('<canvas id="producttrack"><canvas>');
        line_chart(dates, stocks, sales, ranks, sellers);
      } else {
        var totalsales = 0;
        var avsale = 0;
        var avrank = 0;
        $('.track-container').append("<span class='no-pro'>No data available! Please wait for traking data.</span>");
      }
      $('.asin-graph .av-sales span').text(avsale);
      $('.asin-graph .av-rank span').text(avrank);
      $('.asin-graph .tl-sales span').text(totalsales);
    });
    function line_chart(dates, stocks, sales, ranks, sellers) {
      var chartData = {
        xLabels: dates,
        yLabels: sellers,
        datasets: [{
          type: 'line',
          label: 'Stock',
          borderColor: window.chartColors.blue,
          backgroundColor: window.chartColors.blue,
          borderWidth: 3,
          fill: false,
          data: stocks,
          yAxisID: 'y-axis-1',
          pointRadius: 5,
        }, {
          type: 'line',
          label: 'Sales',
          borderColor: window.chartColors.green,
          backgroundColor: window.chartColors.green,
          fill: false,
          data: sales,
          borderWidth: 3,
          pointRadius: 5,
        }, {
          type: 'line',
          label: 'Rank',
          borderColor: window.chartColors.red,
          backgroundColor: window.chartColors.red,
          borderWidth: 3,
          fill: false,
          data: ranks,
          yAxisID: 'y-axis-2',
          pointRadius: 5,
        }, {
          label: 'Seller',
          data: sellers,
          yAxisID: 'y-axis-3',
          fill: false,
          borderColor: window.chartColors.white,
          backgroundColor: window.chartColors.white

        }]
      };

      const el = <HTMLCanvasElement>document.getElementById('producttrack');
      var ctx = el.getContext('2d');
      window.myMixedChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scaleShowVerticalLines: false,
          responsive: true,
          title: {
            display: false
          },
          tooltips: {
            mode: 'index',
            intersect: true
          },
          scales: {
            xAxes: [{
              ticks: {
                minRotation: 45
              }
            }],
            yAxes: [{
              type: 'linear',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Units'
              },
              position: 'left',
              id: 'y-axis-1',
            }, {
              type: 'linear',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Rank'
              },
              position: 'right',
              id: 'y-axis-2',
            }, {
              type: 'category',
              display: false,
              scaleLabel: {
                display: true,
                labelString: 'Seller'
              },
              position: 'right',
              id: 'y-axis-3',
              gridLines: {
                drawOnChartArea: false,
              }
            }],
          }
        }
      });
    }
  }
  resetFilter() {
    this.filtertext = null;
    this.resetsearch = true;
  }
  checkPage(event) {
    setTimeout(function () {
      $(document).ready(function () {
        $('.tracked-product .table tr').each(function () {
          var data_asinid = $(this).attr('data-asinid');
          var start_date = $(this).attr('asin_start_date');
          var end_date = $(this).attr('asin_end_date');
          if (data_asinid != '' && typeof data_asinid != 'undefined') {
            $.get("http://amzblast.moviesdoctor.com/amzblast1/webservices/product_tracking_id.php", { data_asinid: data_asinid, start_date: start_date, end_date: end_date }, function (responsedata) {
              var data = $.parseJSON(responsedata);
              var month = new Array();
              month[0] = "Jan";
              month[1] = "Feb";
              month[2] = "Mar";
              month[3] = "Apr";
              month[4] = "May";
              month[5] = "June";
              month[6] = "July";
              month[7] = "Aug";
              month[8] = "Sept";
              month[9] = "Oct";
              month[10] = "Nov";
              month[11] = "Dec";
              var data_arr = [];
              if (data.data) {
                for (var i = 0; i < data.data.length; i++) {
                  $('.asin_btn_graph' + data.data[i].asin).attr('data-value', JSON.stringify(data.data));
                  $('.asin_btn_graph' + data.data[i].asin).attr('data-count', JSON.stringify(data.data.length));
                  $('.asin_btn_graph' + data.data[i].asin).prop("disabled", false);
                  $('.updatetotalrank' + data.data[i].asin).val(data.data[i].totalrank);
                  $('.updatetotalsale' + data.data[i].asin).val(data.data[i].totalsale);
                  var d = new Date(data.data[i].date);
                  var month_name = month[d.getMonth()];
                  var date = d.getDate();
                  var year = d.getFullYear();
                  var update_date = month_name + ' ' + date + ', ' + year;
                  $('.lprank' + data.data[i].asin).html("Rank : " + data.data[i].rank);
                  $('.lppdate' + data.data[i].asin).html("Updated on : " + update_date);
                  $('.lpseller' + data.data[i].asin).html(data.data[i].seller);
                }
              }
              barchart();
            });
          }
        });
        function barchart() {
          $('.tracked-product .table tr').each(function () {
            var asin = $(this).attr('data-asinid');
            var trdata = $(this).find('.asin_btn_graph'+asin).attr('data-value');
            if (trdata) {
              trdata = $.parseJSON(trdata);
              var sales = new Array();
              trdata.reverse();
              var trackdata = new Array();
              var today = new Date();
              var dd = today.getDate();
              var mm = today.getMonth() + 1;
              var yyyy = today.getFullYear();
              if (dd < 10) {
                var ddz = "0" + dd;
              }
              if (mm < 10) {
                var mmz = '0' + mm;
              }
              var todayr = yyyy + '-' + mmz + '-' + ddz;
              for (var i = 0; i < 7; i++) {
                if (todayr <= trdata[i]) {
                  trackdata.push(trdata[i]);
                }
              }
              trackdata.reverse();
              trdata = trackdata;
              for (var i = 0; i < trdata.length; i++) {
                sales.push(trdata[i].sales);
              }
              $(this).find('.sparkline1'+asin).sparkline(sales, { type: 'bar', barColor: '#4285f4', height: 50, barSpacing: 3, barWidth: 6 });

            } else {
              $(this).find('.sparkline1'+asin).html("N/A");
            }
          });
        }
      });
    }, 1000);
  }
  checkfilter(event: any) {

    if (event.target.value.trim() == '') {

      this.resetsearch = true;

    } else {
      this.resetsearch = false;
    }
    setTimeout(function () {
      $(document).ready(function () {
        $('.tracked-product .table tr').each(function () {
          var data_asinid = $(this).attr('data-asinid');
          var start_date = $(this).attr('asin_start_date');
          var end_date = $(this).attr('asin_end_date');
          if (data_asinid != '' && typeof data_asinid != 'undefined') {
            $.get("http://amzblast.moviesdoctor.com/amzblast1/webservices/product_tracking_id.php", { data_asinid: data_asinid, start_date: start_date, end_date: end_date }, function (responsedata) {
              var data = $.parseJSON(responsedata);
              var month = new Array();
              month[0] = "Jan";
              month[1] = "Feb";
              month[2] = "Mar";
              month[3] = "Apr";
              month[4] = "May";
              month[5] = "June";
              month[6] = "July";
              month[7] = "Aug";
              month[8] = "Sept";
              month[9] = "Oct";
              month[10] = "Nov";
              month[11] = "Dec";
              var data_arr = [];
              if (data.data) {
                for (var i = 0; i < data.data.length; i++) {
                  $('.asin_btn_graph' + data.data[i].asin).attr('data-value', JSON.stringify(data.data));
                  $('.asin_btn_graph' + data.data[i].asin).attr('data-count', JSON.stringify(data.data.length));
                  $('.asin_btn_graph' + data.data[i].asin).prop("disabled", false);
                  $('.updatetotalrank' + data.data[i].asin).val(data.data[i].totalrank);
                  $('.updatetotalsale' + data.data[i].asin).val(data.data[i].totalsale);
                  var d = new Date(data.data[i].date);
                  var month_name = month[d.getMonth()];
                  var date = d.getDate();
                  var year = d.getFullYear();
                  var update_date = month_name + ' ' + date + ', ' + year;
                  $('.lprank' + data.data[i].asin).html("Rank : " + data.data[i].rank);
                  $('.lppdate' + data.data[i].asin).html("Updated on : " + update_date);
                  $('.lpseller' + data.data[i].asin).html(data.data[i].seller);
                }
              }
              barchart();
            });
          }
        });
        function barchart() {
          $('.tracked-product .table tr').each(function () {
            var asin = $(this).attr('data-asinid');
            var trdata = $(this).find('.asin_btn_graph'+asin).attr('data-value');
            if (trdata) {
              trdata = $.parseJSON(trdata);
              var sales = new Array();
              trdata.reverse();
              var trackdata = new Array();
              var today = new Date();
              var dd = today.getDate();
              var mm = today.getMonth() + 1;
              var yyyy = today.getFullYear();
              if (dd < 10) {
                var ddz = "0" + dd;
              }
              if (mm < 10) {
                var mmz = '0' + mm;
              }
              var todayr = yyyy + '-' + mmz + '-' + ddz;
              for (var i = 0; i < 7; i++) {
                if (todayr <= trdata[i]) {
                  trackdata.push(trdata[i]);
                }
              }
              trackdata.reverse();
              trdata = trackdata;
              for (var i = 0; i < trdata.length; i++) {
                sales.push(trdata[i].sales);
              }

              $(this).find('.sparkline1'+asin).sparkline(sales, { type: 'bar', barColor: '#4285f4', height: 50, barSpacing: 3, barWidth: 6 });

            } else {
              $(this).find('.sparkline1'+asin).html("N/A");
            }
          });
        }
      });
    }, 2000);
  }
}
