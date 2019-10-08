angular
  .module('assetFormApp')
  .directive('assetForm', ['assets', 'login', function (assets, login) {
    return {
      require: '^?loginForm',
      restrict: 'E',
      templateUrl: 'scripts/assetForm/assetForm.html',
      controller: function ($scope, $timeout, $window, login) {
        $scope.exists = false;
        $scope.toggleGrayout = function (show) {
/*          $('#fakeModal').modal(((show) ? 'show' : 'hide'));
          console.log(((show) ? 'show' : 'hide'));*/

          if (show) {
            $scope.grayout = show;
          } else {
           $timeout(function () {
            $scope.grayout = show;
          }, 500);
          }

        }
        var showMessage = function (type, message) {
          $scope.alert = {type: type, message: message};
/*          $timeout(function () {
            $scope.alert = null;
          }, 10000);*/
          $window.scrollTo(0,0);
        };
        var getTag = function () {
          var tag = "";
          var f = $scope.fields.filter(function (f) {
            return f.name === 'FACILITYID';
          });
          if (f.length > 0) {
            f = f[0];
            tag = f.value;
          }
          return tag;
        };

        var filtval = function (dropdown) {
          var dups = [];
          var uniqueval = dropdown.filter(function(el){
            if (dups.indexOf(el.name) == -1){
                dups.push(el.name);
                return true;
            }

            return false;
          })
          return uniqueval;

          };

          var getSites = function (token) {
            assets.getSites(token).then(function (data) {
              $scope.sites = [];
              var siteNames = [];
              var bldgs = [];
              var flrs = [];
              var flrId= [];
              var rmId= [];
              var arrLength;
              var arrflrLength;
              var arrflrIdLength;

              angular.forEach(data.features, function (f) {
                if (siteNames.indexOf(f.attributes.CAMPUS) === -1) {
                  bldgs = [];
                  flrs = [];
                  flrId= [];
                  rmId= [];
                  $scope.sites.push({name: f.attributes.CAMPUS, id: parseInt(f.attributes.OBJECTID), buildings:[{name: f.attributes.BUILDING, id: parseInt(f.attributes.OBJECTID), bid: f.attributes.BUILDINGID ,floors:[{name: f.attributes.FLOOR, id: parseInt(f.attributes.OBJECTID),floorids:[{name: f.attributes.FLOORID, id: parseInt(f.attributes.OBJECTID), roomids:[{name: f.attributes.ROOMID, id: parseInt(f.attributes.OBJECTID)}]}] }] }]  })
                  bldgs.push(f.attributes.BUILDING);
                  siteNames.push(f.attributes.CAMPUS);
                  flrs.push(f.attributes.FLOOR);
                  flrId.push(f.attributes.FLOORID);
                  rmId.push(f.attributes.ROOMID);
                } else {
                  var site = $scope.sites.filter(function (s) {
                    return s.name === f.attributes.CAMPUS;
                  });
                  if (site.length > 0) {
                    site = site[0];

                    if(bldgs.indexOf(f.attributes.BUILDING) === -1){
                      flrs = [];
                      flrId= [];
                      rmId= [];
                      site.buildings.push({name: f.attributes.BUILDING, id: parseInt(f.attributes.OBJECTID) , bid: f.attributes.BUILDINGID, floors:[{name: f.attributes.FLOOR, id: parseInt(f.attributes.OBJECTID),floorids:[{name: f.attributes.FLOORID, id: parseInt(f.attributes.OBJECTID), roomids:[{name: f.attributes.ROOMID, id: parseInt(f.attributes.OBJECTID)}]}] }]});
                      bldgs.push(f.attributes.BUILDING);
                      flrs.push(f.attributes.FLOOR);
                      flrId.push(f.attributes.FLOORID);
                      rmId.push(f.attributes.ROOMID);
                      arrLength = 0;
                    } else{

                        var bldg = $scope.sites.filter(function (s) {
                        arrLength = (s.buildings.length - 1);
                        return s.buildings[arrLength].name === f.attributes.BUILDING;
                      });
                        if (bldg.length > 0) {

                          bldg = bldg[0];
                          if(flrs.indexOf(f.attributes.FLOOR) === -1){
                            flrId= [];
                            rmId= [];
                            site.buildings[arrLength].floors.push({name: f.attributes.FLOOR, id: parseInt(f.attributes.OBJECTID), floorids:[{name: f.attributes.FLOORID, id: parseInt(f.attributes.OBJECTID), roomids:[{name: f.attributes.ROOMID, id: parseInt(f.attributes.OBJECTID)}]}] });
                            flrs.push(f.attributes.FLOOR);
                            flrId.push(f.attributes.FLOORID);
                            rmId.push(f.attributes.ROOMID);
                          }else {
                             var bldg_flr = $scope.sites.filter(function (t) {
                              arrflrLength = (t.buildings[arrLength].floors.length - 1);
                             return t.buildings[arrLength].floors[arrflrLength].name === f.attributes.FLOOR;
                          });
                          if (bldg_flr.length >0){
                            bldg_flr = bldg_flr[0];
                            if(flrId.indexOf(f.attributes.FLOORID) === -1){
                              rmId= [];
                              site.buildings[arrLength].floors[arrflrLength].floorids.push({name: f.attributes.FLOORID, id: parseInt(f.attributes.OBJECTID), roomids:[{name: f.attributes.ROOMID, id: parseInt(f.attributes.OBJECTID)}]});
                              flrId.push(f.attributes.FLOORID);
                              rmId.push(f.attributes.ROOMID);
                            }else{

                              var flr_flrid = $scope.sites.filter(function (t) {
                                arrflrIdLength = (t.buildings[arrLength].floors[arrflrLength].floorids.length - 1);
                                return t.buildings[arrLength].floors[arrflrLength].floorids[arrflrIdLength].name === f.attributes.FLOORID;

                              });
                              if (flr_flrid.length >0){
                                flr_flrid = flr_flrid[0];
                                if(rmId.indexOf(f.attributes.ROOMID) === -1){
                                  site.buildings[arrLength].floors[arrflrLength].floorids[arrflrIdLength].roomids.push({name: f.attributes.ROOMID, id: parseInt(f.attributes.OBJECTID)});
                                  rmId.push(f.attributes.ROOMID);
                                }else{
                                  var flrId_rmId = $scope.sites.filter(function (t){
                                    arrrmIdLength = (t.buildings[arrLength].floors[arrflrLength].floorids[arrflrIdLength].length - 1);
                                    return t.buildings[arrLength].floors[arrflrLength].floorids[arrflrIdLength].roomids[arrrmIdLength].name === f.attributes.ROOMID;

                                  });
                                  if (flrId_rmId  >0){
                                    flrId_rmId = flrId_rmId [0];
                                  }

                                }


                              }

                            }


                          }

                        }


                    }}

                  }
                }
              });
              //console.log($scope.sites)
            });

        };


        var getTypes = function (token, id) {
            $scope.toggleGrayout(true);
             assets.getTypes($scope.token, id).then(function (data, a, b) {
              $scope.toggleGrayout(false);
              if (data.error) {
                if (data.error.code === 498) {
                  login.login($scope.user, $scope.password).then(function (data) {
                    $scope.token = data.token;
                    getTypes(data.token, id);
                  });
                }
              }
               else {
                if (data === "") {
                  $scope.showMessage('danger', 'Could not complete request, check internet connectivity!');
                }
                $scope.tableData = data;
                //$scope.fields = [];
                $scope.fields = data.fields;
                $scope.prefix = data.description;
                $scope.types = data.types;
              }
            }, function (status, data) {
              $scope.toggleGrayout(false);
            });
        }
        var checkAssetExists = function (token, field, id) {
            $scope.toggleGrayout(true);
            assets.checkAssetExists(token, field.value, id).then(function (data) {
              $scope.toggleGrayout(false);
              console.log(data);
              if (data.error) {
                if (data.error.code === 498) {
                  login.login($scope.user, $scope.password).then(function (data) {
                    $scope.token = data.token;
                    checkAssetExists($scope.token, field, $scope.table.id);
                  });
                }
              } else if (data.features.length > 0) {
                $scope.oid = data.features[0].attributes.OBJECTID;
                setFieldValues(data.features[0].attributes);
                showMessage("warning", 'An asset with a tag of ' + $scope.prefix + " - " + getTag() + " has already been entered. Any changes will update the existing asset.")
                $scope.exists = true;
              } else {
                if (data === "") {
                  $scope.showMessage('danger', 'Could not complete request, check internet connectivity!');
                }
                if ($scope.exists) {
                  $scope.clearForm(false, true);
                }

                showMessage("info", 'An asset with a tag of ' + $scope.prefix + " - " + getTag() + " has not been entered. Fill out the form and click submit to enter asset.")
                $scope.exists = false;
                //$scope.alert = null;
              }

            }, function (status, data) {
              $scope.toggleGrayout(false);
            });
        };
        var setFieldValues = function (attributes) {
          var site = $scope.sites.filter(function (s) {
            return s.name === attributes['CAMPUS'];
          });


          if (site.length > 0) {
            site = site[0];
            $scope.site = site;
            $scope.buildings = site.buildings;

            var bldg = $scope.buildings.filter(function (b) {
              return b.name === attributes['BUILDING'];
            });
            if (bldg.length > 0) {
              bldg = bldg[0];

              $scope.building = bldg;
              $scope.floors = bldg.floors;

              var flr = $scope.floors.filter(function (b){
                return b.name === attributes['FLOOR'];
              });
              if (flr.length > 0) {
                flr = flr[0];
                $scope.floor = flr;
                $scope.floorids = flr.floorids;

                var flrid = $scope.floorids.filter(function(b){
                  return b.name === attributes['FLOORID'];

                });
                if (flrid.length > 0){
                  flrid = flrid[0];
                  $scope.floorid = flrid;
                  $scope.roomids = flrid.roomids;

                  var rmid = $scope.roomids.filter(function(b){
                    return b.name === attributes['ROOMID'];
                  });
                  rmid = rmid[0];
                  $scope.roomid = rmid;


                }



              }


            }



          }
          var type = $scope.types.filter(function (t) {
            return t.id === attributes['ASSET_TYPE_SUBTYPE'];
          });
          if (type.length > 0) {
            type = type[0];
            $scope.type = type;
          }
          angular.forEach($scope.fields, function (f) {
              switch (f.name) {
                case 'CAMPUS':
                  f.value = site;
                break;
                case 'BUILDING':
                  f.value = bldg;
                break;
                case 'FLOOR':
                    f.value = flr;
                break;

                case 'FLOORID':
                  f.value = flrid;
                break;
                case 'ROOMID':
                  f.value = rmid;
                break;

                default:
                  f.value = attributes[f.name];

                  if (f.type === 'esriFieldTypeDate' && f.value) {

                    f.value = moment(f.value).zone(-5).format('MM/DD/YYYY');
                  } else if (!f.domain && typeof f.value === 'string') {
                    f.value = f.value.toUpperCase();
                  }
                break;
              }

          });
        };
        var submitAsset = function(token, feature, id, oid) {
          $scope.processing = true;
          $scope.toggleGrayout(true);
          assets.submitAsset(token, feature, id, oid).then(function (data) {
            $scope.processing = false;
            $scope.toggleGrayout(false);
            console.log(data);
            var success = false;
              if (data.error) {
                if (data.error.code === 498) {
                  login.login($scope.user, $scope.password).then(function (data) {
                    $scope.token = data.token;
                    submitAsset(data.token, feature, id, oid);
                  });
                }
              } else {
                 if (data.addResults) {
                  success = data.addResults[0].success;
                } else if (data.updateResults) {
                  success = data.updateResults[0].success;
                }
                if (success) {
                  showMessage("success", "An asset with a type of " + $scope.type.name + " and a facilityID of " + $scope.prefix + " - " + getTag() + " successfully " + ((data.updateResults) ? 'updated': 'created') + ".");
                  $scope.oid = null;
                  $scope.clearForm(false, false);
                  $scope.exists = false;
                } else {
                  showMessage("danger", "Error submitting assets, please check internet connectivity and try again");
                }

              }
          });
        };
        $scope.$watch('token', function (token) {
          if (token && !$scope.tables) {
            $scope.toggleGrayout(true);
            assets.getTables(token).then(function (data) {
              $scope.toggleGrayout(false);
              $scope.tables = data.tables;
              getSites(token);
            }, function (status, data) {
              $scope.toggleGrayout(false);
            });
          }
        });
        $scope.$watch('type', function (type) {
          if (type) {
            $scope.typeSelected(type);
          }
        });
        $scope.tableSelected = function (id) {
          $scope.alert = null;
          $scope.oid = null;
          $scope.type = null;
          $scope.types = null;
          $scope.fields = [];
          ga('send', 'event', 'Table', 'Table Selected', $scope.table.name);
          getTypes($scope.token, id);
        };
        $scope.typeSelected = function (type) {
          ga('send', 'event', 'Type', 'Type Selected', $scope.type.name);
          angular.forEach($scope.tableData.fields, function (f) {
            if (type.domains[f.name]) {
              if (type.domains[f.name].codedValues) {
                f.domain = type.domains[f.name];
              }
            } else {
              f.domain = null;
            }

            if (type.templates[0].prototype.attributes[f.name]) {
              if (type.templates[0].prototype.attributes[f.name] != " ") {
                f.value = type.templates[0].prototype.attributes[f.name];
                f.defaultValue = f.value;
              }
            }
          });
          $scope.fields = $scope.tableData.fields;
          //$scope.clearForm(false, true);
        };
        $scope.siteSelected = function () {
          var flds = $scope.fields.filter(function (f) {
            return f.name === 'CAMPUS' || f.name === 'BUILDING' || f.name === 'FLOOR' || f.name === 'FLOORID';
          });
          if (flds.length > 0) {
            angular.forEach(flds, function (f) {
              if (f.name === 'CAMPUS') {
                $scope.site = f.value;
                ga('send', 'event', 'Site', 'Site Selected', $scope.site.name);
                $scope.buildings = filtval(f.value.buildings);
                $scope.buildings.floors = filtval(f.value.buildings[0].floors);
               // $scope.floorids = filtval(f.value.buildings[0].floors[0].floorids) ;

              } else if (f.name === 'BUILDING') {
             //   f.value = undefined;
              } else if (f.name === 'FLOOR') {
             //   f.value = undefined;
              } else if (f.name === 'FLOORID') {
             //   f.value = undefined;
              }
            });
          }
        };
        $scope.bldgSelected = function () {
          var f = $scope.fields.filter(function (f) {
            return f.name === 'BUILDING';
          });
          if (f.length > 0) {
            f = f[0];
            $scope.building= f.value;
            $scope.floors = filtval(f.value.floors);

            ga('send', 'event', 'Building', 'Building Selected', $scope.building.name);
          }
        };

        $scope.floorSelected = function () {
          var f = $scope.fields.filter(function (f) {
            return f.name === 'FLOOR';
          });
          if (f.length > 0) {
            f = f[0];
            $scope.floor = f.value;
            //ga('send', 'event', 'Building', 'Building Selected', $scope.floor.name);
            $scope.floorids = filtval(f.value.floorids) ;
          }
        };

        $scope.floorIdSelected = function () {
          var f = $scope.fields.filter(function (f) {
            return f.name === 'FLOORID';
          });
          if (f.length > 0) {
            f = f[0];
            $scope.floorid = f.value;
            $scope.roomids = filtval(f.value.roomids) ;
           // ga('send', 'event', 'Building', 'Building Selected', $scope.floorid.name);
          }
        };

        $scope.roomIdSelected = function () {
          var f = $scope.fields.filter(function (f) {
            return f.name === 'ROOMID';
          });
          if (f.length > 0) {
            f = f[0];
            $scope.roomid = f.value;
          }
        };



        $scope.dateInit = function (e) {
          $('.date').datepicker({clearBtn: true, endDate: '+0d', startDate: '-100y'});
        };
        $scope.inputBlur = function (field, e) {
          if (field.name == 'FACILITYID') {
            $scope.tagFocused = false;
            $scope.facilityid = field.value;
            $scope.oid = null;
            checkAssetExists($scope.token, field, $scope.table.id);
          }
        };

        $scope.inputFocus = function (field, e) {
          if (field.name == 'FACILITYID') {
            $scope.tagFocused = true;
          }
        };
        $scope.clearForm = function (all, keepTag) {
          $scope.oid = null;
          $window.scrollTo(0,0);
          angular.forEach($scope.fields, function (f) {
            if (all) {
              if (f.defaultValue) {
                f.value = f.defaultValue;
              } else {
                f.value = null;
              }

            } else {
              if ($scope.persistedFields.indexOf(f.name) === -1) {
                if (keepTag && f.name === 'FACILITYID') {
                  f.value = f.value;
                } else {
                  if (f.defaultValue) {
                    f.value = f.defaultValue;
                  } else {
                    f.value = null;
                  }
                }
              }
            }
          });
        };
        $scope.resetForm = function () {
          $scope.type = null;
          $scope.types = null;
          $scope.fields = null;
          $scope.table = null;
          $scope.oid = null;
          $scope.alert = null;
        };
        $scope.confirm = function () {
          $scope.confirmation.modal({keyboard: false, backdrop: 'static'});
        };
        $scope.hideConfirmation = function () {
          $scope.confirmation.modal('hide');
        }
        $scope.submitForm = function () {
          var feature = {attributes: {}};
          $scope.processing = true;
          angular.forEach($scope.fields, function (f) {

              switch (f.name) {
                case 'ASSET_TYPE_SUBTYPE':
                  feature.attributes[f.name] = $scope.type.id;
                break;
                case 'ASSET_TYPE':
                  feature.attributes[f.name] = $scope.type.name;
                break;
                case 'CAMPUS':
                  feature.attributes[f.name] = $scope.site.name;
                break;

                case 'FLOOR':
                  feature.attributes[f.name] = $scope.floor.name;
                break;

                case 'FLOORID':
                  feature.attributes[f.name] = $scope.floorid.name;
                break;

                case 'ROOMID':
                  feature.attributes[f.name] = $scope.roomid.name;
                break;

                case 'BUILDING':
                  feature.attributes[f.name] = $scope.building.name;
                break;
                 case 'BUILDINGID':
                  feature.attributes[f.name] = $scope.building.bid;
                break;
                case 'FACILITYID':
                    feature.attributes[f.name] = $scope.facilityid;

                break;
                case 'LOCATION_TYPE':
                  feature.attributes[f.name] = $scope.building.assetType;
                break;
                case 'FO_ASSET_ID':
                  feature.attributes[f.name] = $scope.building.id;
                break;
                case 'FO_ASSETID':
                  feature.attributes[f.name] = $scope.building.id;
                break;
                default:
                  if (f.value) {
                    feature.attributes[f.name] = f.value;
                    if (f.value === '') {
                      feature.attributes[f.name] = null;
                    }
                    if (!f.domain && typeof f.value === 'string') {

                      feature.attributes[f.name] = f.value.toUpperCase();
                      if (f.type === "esriFieldTypeDate") {
                        var m = moment(f.value);
                        f.value = m.unix()*1000;
                        feature.attributes[f.name] = f.value;
                      }
                    }
                  } else {
                      feature.attributes[f.name] = null;
                  }
                break;
              }

          });
          if ($scope.oid) {
            feature.attributes.OBJECTID = $scope.oid;
          }
          $scope.feature = feature;
          if (typeof (feature.attributes.FACILITYID) !== "undefined"){
            submitAsset($scope.token, feature, $scope.table.id, $scope.oid);
          }else {
            showMessage("danger", "Error submitting assets, Facility ID cannot be empty");
          }

        };
      },
      link: function (scope, element, attrs, loginFormCtrl) {
        scope.hiddenFields = attrs.hiddenFields.split(',');
        scope.persistedFields = attrs.persistedFields.split(',');
        scope.confirmation = $('#confirmModal', element[0]);

        $(document).on("keydown", function (e) {
            if (e.which === 8 && !$(e.target).is("input, textarea")) {
                e.preventDefault();
            }
        });
      }
    }
  }









])


   .factory('assets', ['$http', '$q', function($http, $q){
    var service = {getTables:getTables, getTypes:getTypes, getSites:getSites, checkAssetExists:checkAssetExists, submitAsset:submitAsset},
      baseUrl = 'https://mapstest.raleighnc.gov/arcgis/rest/services/PublicUtility/Vertical_Assets/FeatureServer';
    return service;
    function getTables(token){
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseUrl,
        data: $.param(
          {
            token: token,
            f: 'json'
          }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(deferred.resolve)
      .error(deferred.resolve);
      return deferred.promise;
    };
    function getTypes(token, id){
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseUrl+'/'+id,
        data: $.param(
          {
            token: token,
            f: 'json'
          }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(deferred.resolve)
      .error(deferred.resolve);
      return deferred.promise;
    };
    function getSites (token) {
       var deferred = $q.defer();
       $http({
        method: 'POST',
        url: baseUrl+'/0/query',
        data: $.param(
          {
            token: token,
            where: "BUILDING IS NOT NULL",
            returnGeometry: false,
            outFields: '*',
            orderByFields: 'CAMPUS, BUILDING, FLOOR, FLOORID',
            f: 'json'
          }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(deferred.resolve)
      .error(deferred.resolve);
      return deferred.promise;
    };
    function checkAssetExists (token, id, table) {
       var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseUrl+'/'+ table +'/query',
        data: $.param(
          {
            token: token,
            where: "FACILITYID = '" + id + "'",
            returnGeometry: false,
            outFields: '*',
            f: 'json'
          }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(deferred.resolve)
      .error(deferred.resolve);
      return deferred.promise;
    };
    function submitAsset (token, feature, table, oid) {
       var deferred = $q.defer();
       $http({
        method: 'POST',
        url: baseUrl+'/'+ table +'/' + ((oid) ? 'updateFeatures' : 'addFeatures'),
        params:
          {
            token: token,
            features: JSON.stringify([feature]),
            f: 'json'
          }
        }).success(deferred.resolve)
      .error(deferred.resolve);
      return deferred.promise;
    }
  }



]);
