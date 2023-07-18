import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:graphic/graphic.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  var _airQualityIndex = "0";

  // get data from thingspeak
  Future<String> getStringData() async {
    var url =
        "https://api.thingspeak.com/channels/2044945/feeds.json?api_key=UMVXZ6J6YC9JPAVT&results=5";
    var response = await http.get(
      Uri.parse(url),
      headers: {"Accept": "application/json"},
    );
    // print(response.body);
    // print(response.body.runtimeType);
    return response.body;
  }

  // draw chart
  void addDataToAIQ(String date, String airQualityIndex) {
    dataAIQ.add(AQIData(date, airQualityIndex));
  }

  getAirQualityIndex() async {
    var data = await getStringData();
    var jsonData = json.decode(data);
    var getFeed = jsonData['feeds'];

    for (var i = 0; i < getFeed.length; i++) {
      String dateTimeString = getFeed[i]['created_at'];
      DateTime dateTime = DateTime.parse(dateTimeString);
      String collectedDate = DateFormat('HH:mm').format(dateTime).toString();
      String indeAir = getFeed[i]['field1'];
      addDataToAIQ(collectedDate, indeAir);
    }

    setState(() {
      _airQualityIndex = getFeed[0]['field1'];
    });
  }

  @override
  void dispose() {
    super.dispose();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   automaticallyImplyLeading: false,
      //   backgroundColor: Colors.indigo[800],
      //   title: Row(
      //     mainAxisAlignment: MainAxisAlignment.center,
      //     children: const [
      //       Center(
      //         child: Image(
      //           image: AssetImage('assets/images/faviconIU1.png'),
      //           height: 40,
      //           width: 40,
      //         ),
      //       ),
      //       SizedBox(
      //         width: 10,
      //       ),
      //       Center(
      //         child: Text(
      //           'Air Quality App',
      //           style: TextStyle(
      //             color: Colors.white,
      //             fontSize: 25,
      //           ),
      //         ),
      //       ),
      //     ],
      //   ),
      //   shape: const RoundedRectangleBorder(
      //     borderRadius: BorderRadius.vertical(
      //       bottom: Radius.circular(20),
      //     ),
      //   ),
      // ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            //location part
            Padding(
              padding: const EdgeInsets.only(
                top: 5,
              ),
              child: SizedBox(
                height: 80,
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        // Padding(
                        //   padding: EdgeInsets.only(
                        //     top: 5,
                        //   ),
                        //   child: Icon(
                        //     Icons.location_on_rounded,
                        //     color: Colors.deepPurple,
                        //     size: 35,
                        //   ),
                        // ),
                        Padding(
                          padding: EdgeInsets.only(
                            left: 2,
                          ),
                          child: Center(
                              child: Text("Phu Nhuan District",
                                  style: TextStyle(
                                      fontSize: 30,
                                      fontFamily: 'Kanit Regular 400'))),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Padding(
                          padding: EdgeInsets.only(
                            left: 2,
                          ),
                          child: Text("07 July 2023",
                              style: TextStyle(
                                  fontSize: 20, fontFamily: 'Kanit Light')),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            //button refresh
            Padding(
              padding: const EdgeInsets.only(
                bottom: 10,
                left: 100,
                right: 100,
              ),
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.blue,
                  border: Border.all(
                    color: Colors.black,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: const [
                    BoxShadow(
                      color: Colors.black,
                      offset: Offset.zero,
                      blurRadius: 1,
                      blurStyle: BlurStyle.outer,
                    ),
                  ],
                ),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: TextButton(
                        style: TextButton.styleFrom(
                          backgroundColor: Colors.indigo[800],
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(15),
                          ),
                        ),
                        onPressed: () {
                          getAirQualityIndex();
                        },
                        child: const Text(
                          'Predict',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 25,
                              fontFamily: 'Kanit Medium 500',
                              fontWeight: FontWeight.bold),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            //AQI part
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 150,
                decoration: BoxDecoration(
                  color: _airQualityIndex == "0"
                      ? const Color.fromARGB(255, 190, 171, 171)
                      : Colors.lightGreen,
                  border: Border.all(
                    color: Colors.black,
                    width: 3,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    Expanded(
                        child: _airQualityIndex == "0"
                            ? const Icon(
                                Icons.sentiment_satisfied_alt_outlined,
                                color: Colors.black,
                                size: 100,
                              )
                            : const Icon(
                                Icons.sentiment_very_satisfied,
                                color: Colors.black,
                                size: 100,
                              )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    Expanded(
                      child: _airQualityIndex != "0"
                          ? Text(
                              _airQualityIndex,
                              style: const TextStyle(
                                  color: Colors.black,
                                  fontSize: 40,
                                  fontFamily: 'Arial',
                                  fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            )
                          : const Text(
                              'NA',
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 45,
                                  fontFamily: 'Arial',
                                  fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                    ),
                    //add a line between two expanded
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    Expanded(
                      child: _airQualityIndex != "0"
                          ? const Text(
                              'Good',
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 40,
                                  fontFamily: 'Arial',
                                  fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            )
                          : const Text(
                              'Loading',
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 28,
                                  fontFamily: 'Arial',
                                  fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                    ),
                  ],
                ),
              ),
            ),

            //time-serie part
            Container(
              padding: const EdgeInsets.only(
                top: 20,
                left: 20,
              ),
              child: const Text(
                'Time series line chart',
                style: TextStyle(fontSize: 23, fontFamily: 'Kanit Regular 400'),
              ),
            ),
            Container(
              margin: const EdgeInsets.only(left: 12),
              width: 350,
              height: 300,
              child: Chart(
                data: dataAIQ,
                variables: {
                  'Time': Variable(
                    accessor: (AQIData e) => e.time,
                  ),
                  'Index': Variable(
                    accessor: (AQIData e) => e.index,
                  ),
                },
                marks: [
                  LineMark(
                    shape: ShapeEncode(
                        value: BasicLineShape(
                      smooth: true,
                    )),
                    selected: {
                      'touchMove': {1}
                    },
                  )
                ],
                coord: RectCoord(color: Colors.white),
                axes: [
                  Defaults.horizontalAxis,
                  Defaults.verticalAxis,
                ],
                selections: {
                  'touchMove': PointSelection(
                    on: {
                      GestureType.scaleUpdate,
                      GestureType.tapDown,
                      GestureType.longPressMoveUpdate
                    },
                    dim: Dim.x,
                  )
                },
                tooltip: TooltipGuide(
                  followPointer: [false, true],
                  align: Alignment.topLeft,
                  offset: const Offset(-20, -20),
                ),
                crosshair: CrosshairGuide(followPointer: [false, true]),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class AQIData {
  final String time;
  final String index;

  AQIData(this.time, this.index);
}

final dataAIQ = [
  AQIData("00:00", "00"),
  AQIData("00:00", "00"),
];
