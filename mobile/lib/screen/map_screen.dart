import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_osm_plugin/flutter_osm_plugin.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import 'package:http/http.dart' as http;

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool _isSearchActive = false;
  final _mapController = MapController();
  List _markers = [];
  Map<String, dynamic> newestData = {};
  var dataChannels = [];
  var dataFeeds = [];
  double latThingspeak = 0.0;
  double lngThingspeak = 0.0;
  bool isLoading = true;

  void toggleSearch() {
    setState(() {
      _isSearchActive = !_isSearchActive;
      if (!_isSearchActive) {
        _searchController.clear();
      }
    });
  }

  // get data from thingspeak
  Future<String> getThingspeakData() async {
    var url =
        "https://api.thingspeak.com/channels/2044945/feeds.json?api_key=UMVXZ6J6YC9JPAVT&results=5";
    var response = await http.get(
      Uri.parse(url),
      headers: {"Accept": "application/json"},
    );
    // print(response.body.runtimeType);
    return response.body;
  }

  getData() async {
    var data = await getThingspeakData();
    var jsonData = json.decode(data);
    var getChannel = jsonData['channel'];
    print(getChannel);
    newestData = jsonData['feeds'][0];
    print(newestData);

    setState(() {
      latThingspeak = double.parse(getChannel['latitude']);
      lngThingspeak = double.parse(getChannel['longitude']);
      isLoading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    getData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Center(
              child: Image(
                image: AssetImage('assets/images/faviconIU1.png'),
                height: 30,
                width: 30,
              ),
            ),
            SizedBox(
              width: 10,
            ),
            Center(
              child: Text(
                'Air Quality App',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 25,
                ),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: toggleSearch,
            icon: const Icon(Icons.search),
          ),
        ],
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(20),
          ),
        ),
        bottom: _isSearchActive
            ? PreferredSize(
                preferredSize: const Size.fromHeight(50),
                child: Container(
                  margin: const EdgeInsets.all(10),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search',
                      suffixIcon: IconButton(
                        onPressed: () {
                          _searchController.clear();
                        },
                        icon: const Icon(Icons.clear),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide:
                            const BorderSide(color: Colors.white, width: 2),
                      ),
                    ),
                  ),
                ),
              )
            : null,
      ),
      body: OSMFlutter(
        controller: _mapController,
        trackMyPosition: true,
        initZoom: 12,
        minZoomLevel: 3,
        maxZoomLevel: 18,
        stepZoom: 1.0,
        userLocationMarker: UserLocationMaker(
          personMarker: const MarkerIcon(
            icon: Icon(
              Icons.person_pin_circle,
              color: Colors.deepPurple,
              size: 120,
            ),
          ),
          directionArrowMarker: const MarkerIcon(
            icon: Icon(
              Icons.location_on,
              color: Colors.deepPurple,
              size: 120,
            ),
          ),
        ),
        roadConfiguration:
            const RoadOption(roadColor: Colors.black, roadWidth: 10),
        markerOption: MarkerOption(
          defaultMarker: const MarkerIcon(
            icon: Icon(
              Icons.location_on,
              color: Colors.red,
              size: 140,
            ),
          ),
          advancedPickerMarker: const MarkerIcon(
            icon: Icon(
              Icons.location_on,
              color: Colors.red,
              size: 140,
            ),
          ),
        ),
        onMapIsReady: (isReady) async {
          if (isReady) {
            await Future.delayed(const Duration(seconds: 2), () async {
              await _mapController.currentLocation();

              // add marker
              GeoPoint position =
                  GeoPoint(latitude: latThingspeak, longitude: lngThingspeak);
              _mapController.addMarker(
                position,
                markerIcon: const MarkerIcon(
                  icon: Icon(
                    Icons.cloud_circle_rounded,
                    color: Colors.blue,
                    size: 140,
                  ),
                ),
              );
            });
          }
        },
        onGeoPointClicked: (geoPoint) {
          showBottomSheet(
              context: context,
              builder: (context) => Card(
                  color: Colors.white70,
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    children: const [
                                      Text(
                                        'Station: 1',
                                        style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold),
                                      ),
                                      Text(
                                        'AQI: 29 - Good',
                                        style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 50.0),
                                child: Divider(
                                  thickness: 2,
                                  color: Color.fromARGB(255, 12, 21, 134),
                                ),
                              ),
                              Text(
                                'Time: ${newestData['created_at']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'Latitude: $latThingspeak',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'Longitude: $lngThingspeak',
                                style: const TextStyle(fontSize: 18),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 50.0),
                                child: Divider(
                                  thickness: 2,
                                  color: Color.fromARGB(255, 12, 21, 134),
                                ),
                              ),
                              Text(
                                'Temperature: ${newestData['field1']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'Humidity: ${newestData['field2']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'CO2: ${newestData['field3']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'CO: ${newestData['field4']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'PM2.5: ${newestData['field5']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'UV Index: ${newestData['field6']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                              Text(
                                'Dewpoint: ${newestData['field7']}',
                                style: const TextStyle(fontSize: 18),
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.pop(context);
                          },
                          child: const Icon(Icons.clear),
                        ),
                      ],
                    ),
                  )));
        },
        onLocationChanged: (location) {
          print(location);
        },
      ),
      floatingActionButton: SpeedDial(
        marginBottom: 8,
        marginEnd: 4,
        icon: Icons.menu,
        activeIcon: Icons.close,
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        activeBackgroundColor: const Color.fromARGB(255, 46, 38, 70),
        activeForegroundColor: Colors.white,
        buttonSize: 40.0, //button size
        visible: true,
        closeManually: false,
        curve: Curves.bounceIn,
        overlayColor: Colors.black,
        overlayOpacity: 0.25,
        onOpen: () => print('OPENING DIAL'), // action when menu opens
        onClose: () => print('DIAL CLOSED'), //action when menu closes

        elevation: 5.0,
        shape: const CircleBorder(),

        children: [
          SpeedDialChild(
            child: const Icon(Icons.my_location_outlined),
            backgroundColor: Colors.red[400],
            foregroundColor: Colors.white,
            label: 'Your Location',
            labelStyle: const TextStyle(fontSize: 15.0),
            onTap: () => {_mapController.currentLocation()},
            // onLongPress: () => print('FIRST CHILD LONG PRESS'),
          ),
          SpeedDialChild(
            child: const Icon(Icons.cloud_rounded),
            foregroundColor: Colors.white,
            backgroundColor: Colors.green,
            label: 'Air Quality Index',
            labelStyle: const TextStyle(fontSize: 15.0),
            onTap: () => print('SECOND CHILD'),
          ),
          SpeedDialChild(
            child: const Icon(Icons.refresh_outlined),
            backgroundColor: Colors.blue,
            foregroundColor: Colors.white,
            label: 'Refresh Map',
            labelStyle: const TextStyle(fontSize: 15.0),
            onTap: () => print('THIRD CHILD LONG PRESS'),
          ),
        ],
      ),
    );
  }
}
