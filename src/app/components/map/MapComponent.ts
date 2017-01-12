import { Component, ElementRef, Output, EventEmitter } from 'angular2/core';
import MapService from './MapService';

import { MapView } from 'esri-mods';
import { Graphic } from 'esri/Graphic';
import { PopupTemplate } from 'esri/PopupTemplate';

import { FeatureLayer } from 'esri/layers/FeatureLayer';
import { GraphicsLayer } from 'esri/layers/GraphicsLayer';

import { Search } from 'esri/widgets/Search';
import { Locate } from 'esri/widgets/Locate';
import { LocateViewModel } from 'esri/widgets/Locate/LocateViewModel';
import { SearchViewModel } from 'esri/widgets/Search/SearchViewModel';

import { Point } from 'esri/geometry/Point';
import { Circle } from 'esri/geometry/Circle';
import { Polygon } from 'esri/geometry/Polygon';
import { Polyline } from 'esri/geometry/Polyline';
import { SpatialReference } from 'esri/geometry/SpatialReference';

import { MarkerSymbol } from 'esri/symbols/MarkerSymbol';
import { SimpleLineSymbol } from 'esri/symbols/SimpleLineSymbol';
import { SimpleFillSymbol } from 'esri/symbols/SimpleFillSymbol';
import { SimpleMarkerSymbol } from 'esri/symbols/SimpleMarkerSymbol';
import { PictureMarkerSymbol } from 'esri/symbols/PictureMarkerSymbol';

@Component({
    selector: 'esri-map',
    templateUrl: 'app/components/map/mapComponent.html',
    providers: [MapService]
})
export class MapComponent {

  @Output() viewCreated = new EventEmitter();
  

  private view: MapView;
  private widgetsLayer: GraphicsLayer;
  private donorsLayer: GraphicsLayer;
    
  constructor(private service: MapService, private elRef:ElementRef) {}
  
  private loadWidgets() {
    this.widgetsLayer = new GraphicsLayer();
    this.service.map.add(this.widgetsLayer);

    var searchWidget = new Search({
      viewModel: new SearchViewModel({
        view: this.view
      })
    }, "searchView");
    searchWidget.startup();
    searchWidget.viewModel.on("search-results", function(evt) {
      console.log("Results of the search: ", evt);
    });

    var locateBtn = new Locate({
      viewModel: new LocateViewModel({
        view: this.view,
        graphicsLayer: this.widgetsLayer
      })
    }, "locateView");

    locateBtn.startup();
  }

  private addPoint(lat:number, lon:number, donorData:any){
    var point = new Point({
      longitude: -49.97,
      latitude: 41.73
    });

    //Create a symbol for drawing the point
    var markerSymbol = new SimpleMarkerSymbol({
      color: [255, 0, 0],
      outline: new SimpleLineSymbol({
        color: [255, 255, 255],
        width: 2
      })
    });
    //Create an object for storing attributes related to the line
    var lineAtt = {
      Name: "Keystone Pipeline",
      Owner: "TransCanada",
      Length: "3,456 km"
    };

    //Create a graphic and add the geometry and symbol to it
    var pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
      attributes: lineAtt,
      popupTemplate: new PopupTemplate({
        title: "{Name}",
        content: "{*}"
      })
    });

    this.donorsLayer.add(pointGraphic);
  }

  ngOnInit() {
    this.view = new MapView({
      container: this.elRef.nativeElement.firstChild,
      map: this.service.map,
      center: [-73.950, 40.702],
      zoom: 3
    });

    this.donorsLayer = new GraphicsLayer();
    this.service.map.add(this.donorsLayer);    

    this.addPoint();

    this.view.on("layer-view-create", function(evt) {
      console.log("layer create ->: ", evt);
      if (evt.layer.id === "myId") {
        evt.layerView;
      }
    });
    this.viewCreated.next(this.view);

    function extentWatch(watched) {
      watched.watch('extent', function(val) {
        console.log('view.extent change', val);
      });
      return watched;
    }

    this.view.then(function(watched){
      watched.watch('extent', function(val) {
      console.log(val);
      console.log(val.getCenter());
      console.log('event');
      });
    });

    this.loadWidgets();
  }

  
}
