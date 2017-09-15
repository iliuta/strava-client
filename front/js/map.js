import L from 'leaflet';
import Routing from 'leaflet-routing-machine';
import Geocoder from 'leaflet-control-geocoder';
import Polyline from 'polyline-encoded';

// hack for avoiding leaflet bug with webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
const osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 18, attribution: osmAttrib});
const ocm = L.tileLayer("http://a.tile.thunderforest.com/cycle/{z}/{x}/{y}.png");
const google = L.tileLayer('//mt{s}.googleapis.com/vt?x={x}&y={y}&z={z}', {
    maxZoom: 18,
    subdomains: [ 0, 1, 2, 3 ]
});

const runBikeHike =
    L.tileLayer("https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=" + mapboxToken,
        {
            attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        });
const streets =
    L.tileLayer("https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=" + mapboxToken,
        {
            attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        });
const satellite =
    L.tileLayer("https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=" + mapboxToken,
        {
            attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
        });


const baseMaps = {
    "OpenStreetMap": osm,
    "OpenCycleMap": ocm,
    "Mapbox Terrain": runBikeHike,
    "Mapbox Streets Satellite": satellite,
    "Mapbox Streets": streets,
    "Google": google
};


function StravaMap(infoWindowCompiler) {

    // events
    let onSelectActivity = null;
    let onPhotoClick = null;
    let onRouteFound = null;

    // local vars
    let internalMap = L.map('map-canvas', {
        center: [39.73, -104.99],
        zoom: 8,
        layers: [runBikeHike]
    });
    L.control.layers(baseMaps).addTo(internalMap);

    let photosLayerGroup = null;

    let activityPopup = L.popup();

    setTimeout(function() {
        activityPopup.setContent(infoWindowCompiler());
    });

    let polylinesLayerGroup = null;

    let routingControl = Routing.control(
        {
            waypoints: [],
            lineOptions: {
                styles: [
                    {color: 'black', opacity: 0.15, weight: 9},
                    {color: 'white', opacity: 0.8, weight: 6},
                    {color: 'yellow', opacity: 1, weight: 2}
                ]
            },
            router: new Routing.OSRMv1({
                serviceUrl: '//router.project-osrm.org/route/v1',
                timeout: 30 * 1000,
                routingOptions: {}
            }),
            geocoder: Geocoder.nominatim()
        }
    );

    routingControl.on("routeselected", function (e) {
     if (onRouteFound) {
         // every time a route is found, save its coordinates to create gpx file
         // gpxTrack is about all coordinates of the selected route
         let gpxTrck = e.route.coordinates;
         // gpxRoute is about the coordinates of the crossings, taken from the cue sheet (instructions)
         let gpxRoute = [];
         e.route.instructions.forEach(function (instruction) {
             gpxRoute.push(e.route.coordinates[instruction.index]);
         });
         onRouteFound(gpxTrck, gpxRoute);
    }
    });

    function createRoutePlannerButton(label, container) {
        var btn = L.DomUtil.create('button', '', container);
        btn.setAttribute('type', 'button');
        btn.innerHTML = label;
        return btn;
    }

    // hack to prevent click/dblclick weird behaviour
    let routePlannerMapOnDblClick = function (event) {
        internalMap.clicked = 0;
        internalMap.zoomIn();
    };

    let routePlannerMapOnClick = function (e) {
        // hack to prevent click/dblclick weird behaviour
        if (!internalMap.clicked) {
            internalMap.clicked = 0;
        }
        internalMap.clicked = internalMap.clicked + 1;
        setTimeout(function () {
            if (internalMap.clicked == 1) {
                // at first click display a popup
                if (!routingControl.getWaypoints()[0].latLng) {
                    let container = L.DomUtil.create('div');
                    let startBtn = createRoutePlannerButton('Start route from this location', container);

                    L.DomEvent.on(startBtn, 'click', function () {
                        routingControl.spliceWaypoints(0, 1, e.latlng);
                        internalMap.closePopup();
                    });

                    L.popup()
                        .setContent(container)
                        .setLatLng(e.latlng)
                        .openOn(internalMap);

                } else if (routingControl.getWaypoints().length == 2 && !routingControl.getWaypoints()[1].latLng) {
                    // then fill the coords of the last waypoint
                    routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, e.latlng);
                } else {
                    // then add the new waypoint to the end
                    var lastWaypoint = routingControl.getWaypoints()[routingControl.getWaypoints().length - 1].latLng;
                    routingControl.spliceWaypoints(routingControl.getWaypoints().length - 1, 1, lastWaypoint, e.latlng);
                }
                internalMap.clicked = 0;
            }
        }, 300);
    };

    function drawActivityPolylineOnMap(activity) {
        if (!activity.map.summary_polyline) {
            console.log(activity.name);
            return null;
        } else {
            var decodedPath = L.Polyline.fromEncoded(activity.map.summary_polyline);

            var osmPath = L.polyline(decodedPath.getLatLngs(), {color: '#FF0000', weight: 2}).addTo(internalMap);

            osmPath.bindPopup(activityPopup);

            osmPath.addEventListener('mouseover',
                function (event) {
                    osmPath.setStyle({color: 'blue', weight: 7});
                });


            osmPath.addEventListener('mouseout',
                function () {
                    osmPath.setStyle({color: '#FF0000', weight: 2});
                });

            osmPath.addEventListener('click',
                function (event) {
                    if (onSelectActivity) {
                        onSelectActivity(activity);
                    }
                    activityPopup.setContent(infoWindowCompiler());
                    activityPopup.setLatLng(event.latlng);
                });


            return osmPath;
        }
    }

    this.invalidateMapSize = function() {
        internalMap.invalidateSize();
    }

    this.drawActivities = function (activities) {
        if (photosLayerGroup) {
            photosLayerGroup.clearLayers();
        }
        if (polylinesLayerGroup) {
            polylinesLayerGroup.clearLayers();
        }

        let bounds = null;

        polylinesLayerGroup = L.layerGroup();
        polylinesLayerGroup.addTo(internalMap);

        activities.forEach(function (activity) {
            var polyline = drawActivityPolylineOnMap(activity);
            if (polyline) {
                if (!bounds) {
                    bounds = polyline.getBounds();
                } else {
                    bounds.extend(polyline.getBounds());
                }
                polylinesLayerGroup.addLayer(polyline);
            }
        });

        if (bounds) {
            internalMap.fitBounds(bounds);
            internalMap.panInsideBounds(bounds);
        }
    };

    this.drawPhotos = function (photos) {
        if (!photosLayerGroup) {
            photosLayerGroup = L.layerGroup();
            photosLayerGroup.addTo(internalMap);
        }

        photos.forEach(function (photo) {
            if (photo.location && photo.location.length == 2) {
                var photoLatLng = new L.latLng(photo.location[0], photo.location[1]);

                var photoUrl = photo.urls[300];

                var image = L.icon({
                    iconUrl: photoUrl,
                    iconSize: [50, 50],
                    iconAnchor: [0, 32]
                });

                var marker = L.marker(photoLatLng, {
                    riseOnHover: true,
                    title: photoUrl,
                    icon: image
                });

                marker.addEventListener('click', function () {
                    if (onPhotoClick) {
                        onPhotoClick(photoUrl, photo);
                    }
                });
                photosLayerGroup.addLayer(marker);
                marker.addTo(internalMap);
            }
        });
    };

    this.on = function(eventName, handler) {
        if (eventName === 'selectActivity') {
            onSelectActivity = handler;
        } else if (eventName === 'photoClick') {
            onPhotoClick = handler;
        } else if (eventName === 'routeFound') {
            onRouteFound = handler;
        }
        return this;
    };


    this.displayRoutePlanner = function() {
        routingControl.addTo(internalMap);
        internalMap.on("dblclick", routePlannerMapOnDblClick);
        internalMap.on("click", routePlannerMapOnClick);
    };

    this.hideRoutePlanner = function() {
        routingControl.remove();
        internalMap.off("dblclick", routePlannerMapOnDblClick);
        internalMap.off("click", routePlannerMapOnClick);
     };

    this.resetRoutePlanner = function() {
       routingControl.spliceWaypoints(0, routingControl.getWaypoints().length);
    };


};

export default StravaMap;