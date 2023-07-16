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
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Center(
              child: Image(
                image: AssetImage('assets/images/faviconIU1.png'),
                height: 40,
                width: 40,
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
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            bottom: Radius.circular(20),
          ),
        ),
      ),
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
                height: 100,
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Padding(
                          padding: EdgeInsets.only(
                            top: 20,
                          ),
                          child: Icon(
                            Icons.location_on_rounded,
                            color: Colors.blue,
                            size: 30,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(
                            top: 20,
                            left: 2,
                          ),
                          child: Center(
                              child: Text(
                                  "Phu Nhuan District, Ho Chi Minh City",
                                  style: TextStyle(fontSize: 20))),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(
                          Icons.calendar_today,
                          color: Colors.blue,
                          size: 30,
                        ),
                        Padding(
                          padding: EdgeInsets.only(
                            left: 2,
                          ),
                          child: Text("07/09/2023",
                              style: TextStyle(fontSize: 20)),
                        ),
                        Padding(
                          padding: EdgeInsets.only(
                            left: 20,
                          ),
                          child: Text("|", style: TextStyle(fontSize: 30)),
                        ),
                        Padding(
                          padding: EdgeInsets.only(
                            left: 10,
                          ),
                          child: Icon(
                            Icons.access_time,
                            color: Colors.blue,
                            size: 30,
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.only(
                            left: 2,
                          ),
                          child:
                              Text("15:23 PM", style: TextStyle(fontSize: 20)),
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
                              fontSize: 30,
                              fontFamily: 'Arial',
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
                  color: Colors.green,
                  border: Border.all(
                    color: Colors.green,
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
                    const Expanded(
                        child: Image(
                      image: AssetImage('assets/images/good.png'),
                      height: 275,
                      width: 275,
                    )),
                    Column(
                      children: [
                        const SizedBox(height: 10),
                        const Expanded(
                          child: Text(
                            "AQI",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 50,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                        Expanded(
                          child: Text(
                            _airQualityIndex.toString(),
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 50,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    Expanded(
                      child: _airQualityIndex != "0" ? const Text(
                        'Good',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 40,
                            fontFamily: 'Arial',
                            fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ) : const Text(
                        'Loading...',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
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
                style: TextStyle(fontSize: 23),
              ),
            ),
            Container(
              margin: const EdgeInsets.only(left: 5),
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
