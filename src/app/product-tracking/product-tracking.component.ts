import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var window: any;
declare let Chart: any;
declare var alertify: any;
// import * as $ from 'jQuery';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../data.service';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-tracking',
  templateUrl: './product-tracking.component.html',
  styleUrls: ['./product-tracking.component.css']
})
export class ProductTrackingComponent implements OnInit {
  products$: Observable<any>;
  users$: Observable<any>;
  product: {};
  error: {};
  asinName: string = '';
  asinDelete: string = '';
  searchasin: string = '';
  filtertext: string = '';
  userId = '';
  response: {};
  found: boolean = true;
  spin: boolean;
  fa_spin: boolean = false;
  tracking: boolean = false;
  check: boolean;
  times: boolean;
  title = 'Product Tracking';
  p: number = 1;
  asinData = {};
  asinVariationData = {};
  myForm: FormGroup;
  emailFormArray = [];
  asinVariations = [];
  showerror: boolean;
  showpop: boolean = true;
  count = {};
  proimage: string = '';
  protitle: string = '';
  price: string = '';
  proimagepop: string = '';
  protitlepop: string = '';
  pricepop: string = '';
  asinpop: string = '';
  ServerUrl = 'http://amzblast.moviesdoctor.com/amzblast1/webservices/';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private data: DataService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.userId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit() {

    this.titleService.setTitle(this.title);
    /* this.data.getProducts().subscribe(
      (data) => {
      this.users = data;
      },
      error => {
      this.error = error
      }); */

    this.users$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.data.getProducts(params.get('id'))

      )

    );



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
          $('.table tr').each(function () {
            var trdata = $(this).find('.btn-grph').attr('data-value');
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
              $(this).find('.sparkline1').sparkline(sales, { type: 'bar', barColor: '#4285f4', height: 50, barSpacing: 3, barWidth: 6 });
            }
          });
        }
      });
    }, 2000);

    /* this.http.get("http://amzblast.moviesdoctor.com/amzblast1/webservices/product_tracking_id.php?data_asinid=" + data_array).subscribe(
      (responsedata) => {
        
      }
    ); */
  }
  openModel() {

    $('.asin-graph').modal();
    $('.tracked-product').on('click', '.btn-grph', function () {
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
        var avsales = parseInt($(this).parent().find('.totalsale').val());
        var avsale = (avsales / trckcount).toFixed();
        var avranks = parseInt($(this).parent().find('.totalrank').val());
        var avrank = (avranks / trckcount).toFixed();
        trdata = $.parseJSON(trdata);
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
        $('.track-container').append("<span class='no-pro'>No data available! Please wait for traking data.</span>");
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

  onNameKeyUp(event: any) {

    this.asinName = event.target.value.trim();
    console.log(this.asinName);
    this.asinVariations = [];
    if (this.asinName) {
      this.found = true;
      this.spin = true;
      this.times = false;
      this.check = false;
      this.data.checkKeepaProduct(this.asinName)
        .subscribe((data) => {
          this.asinData = data;
          let variationsImgs = data.products[0].imagesCSV;
          variationsImgs = variationsImgs.split(",");
          this.proimage = variationsImgs[0];
          this.protitle = data.products[0].title;
          this.price = data.products[0].fbaFees;
          console.log(data);
          if (data.products) {
            if (data.products[0].productType == 4) {
              this.found = true;
              this.spin = false;
              this.times = true;
              this.check = false;
              $('.asin-child').modal('hide');
            } else if (data.products[0].variationCSV == null) {
              this.check = true;
              this.found = false;
              this.spin = false;
              $('.asin-child').modal('hide');
            } else if (data.products[0].variationCSV != null) {
              let variations = data.products[0].variationCSV;
              variations = variations.split(",");
              console.log(variations);
              this.count = variations.length;
              for (let i = 0; i < variations.length; i++) {
                this.data.checkKeepaProduct(variations[i])
                  .subscribe((data) => {
                    this.asinVariationData = data.products[0].size;
                    let variationsImg = data.products[0].imagesCSV;
                    variationsImg = variationsImg.split(",");
                    this.asinVariations.push({ asin: variations[i], extra: this.asinVariationData, img: variationsImg });
                  }, error => {
                    this.error = error;
                  });
              }
              console.log(this.asinVariations);
              this.spin = false;
              $('.asin-child').modal();
            }
          } else {
            this.spin = false;
            this.found = true;
            this.check = false;
            this.times = true;
            this.fa_spin = false;
          }
        }, error => {
          this.error = error;
        });
    } else {
      this.spin = false;
      this.found = true;
      this.check = false;
      this.times = false;
      this.fa_spin = false;
    }

  }

  addTracker() {
    $('.asin-child').modal('hide');
    this.userId = this.route.snapshot.paramMap.get("id");
    this.fa_spin = true;
    if (this.asinName) {
      this.data.addToTracker(this.asinName, this.userId, this.proimage, this.protitle, this.price)
        //this.data.addToTracker(this.asinName, this.userId)
        .subscribe((data) => {
          this.fa_spin = false;
          if (data.status == 1) {
            this.ngOnInit();
            this.resetTracking();
            alertify.alert("Hurrayyyy.... Now we have started to track your product. Check tomorrow we will surely have some data!");
            alertify.success("Hurrayyyy.... Now we have started to track your product. Check tomorrow we will surely have some data!");
          } else if (data.status == 2) {
            alertify.alert("As per available membership package you are already tracking '" + this.asinName + "' products. To track further product kindly delete one product from tracking list");
            return false;
          } else if (data.status == 3) {
            alertify.alert("As per available PRT package you cant track any products now.");
            return false;
          } else {
            alertify.alert("Already tracking this asin please add another.");
            return false;
          }

          console.log(data);
        }, error => {
          this.error = error;
        });
    } else {
      this.times = true;
      this.fa_spin = false;
    }
  }

  deleteAsin(deleteAsin: string) {
    $('.delete-modals').modal();
    this.asinDelete = deleteAsin;
  }
  resetTracking() {
    this.spin = false;
    this.found = true;
    this.check = false;
    this.times = false;
    this.searchasin = null;
  }
  confirmAsin() {
    console.log(this.asinDelete);
    this.userId = this.route.snapshot.paramMap.get("id");
    $('.delete-modals').modal('hide');
    this.data.delteAsin(this.asinDelete, this.userId)
      .subscribe((data) => {
        if (data.status == 1) {
          this.ngOnInit();
          alertify.success(this.asinDelete + " has been deleted..");
        } else if (data.status == 0) {
          alertify.alert("Something went wrong.");
          return false;
        }
        console.log(data);
      }, error => {
        this.error = error;
      });
  }

  onChange(email: string, isChecked: boolean) {
    if (isChecked) {
      this.emailFormArray.push(email);
      this.showerror = false;
    } else {
      var index = this.emailFormArray.indexOf(email);
      if (index !== -1) this.emailFormArray.splice(index, 1);
    }

  }

  startTracking() {
    if (this.emailFormArray.length > 0) {
      console.log(this.emailFormArray);
      this.tracking = true;
      this.userId = this.route.snapshot.paramMap.get("id");
      for (var i = 0; i < this.emailFormArray.length; i++) {
        console.log(this.emailFormArray[i]);
        this.data.checkKeepaProduct(this.emailFormArray[i])
          .subscribe((data) => {
            let variationsImgs = data.products[0].imagesCSV;
            variationsImgs = variationsImgs.split(",");
            this.proimagepop = variationsImgs[0];
            this.protitlepop = data.products[0].title;
            this.pricepop = data.products[0].fbaFees;
            let asin = data.products[0].asin;
            this.asinpop = asin;
            this.data.addToTracker(this.asinpop, this.userId, this.proimagepop, this.protitlepop, this.pricepop)
              .subscribe((data) => {
                if (data.status == 1) {
                  this.ngOnInit();
                  this.resetTracking();
                  $('.asin-child').modal('hide');
                  this.tracking = false;
                  alertify.success("Hurrayyyy.... Now we have started to track your product. Check tomorrow we will surely have some data!  products.");
                } else if (data.status == 2) {
                  this.tracking = false;
                  alertify.alert("As per available membership package you are already tracking products. To track further product kindly delete one product from tracking list");
                  return false;
                } else if (data.status == 3) {
                  this.tracking = false;
                  alertify.alert("As per available PRT package you cant track any products now.");
                  return false;
                } else {
                  this.tracking = false;
                  alertify.alert("Already tracking this asin please add another.");
                  return false;
                }
              }, error => {
                this.error = error;
              });
          }, error => {
            this.error = error;
          });


        //Do something
      }
    } else {
      this.showerror = true;
    }


  }

}
