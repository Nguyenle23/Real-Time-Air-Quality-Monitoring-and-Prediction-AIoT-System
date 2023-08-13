import 'dart:async';
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

class AirQualityData {
  String tempValue;
  String humiValue;
  String co2Value;
  String coValue;
  String pm25Value;
  String uvValue;
  String date;

  AirQualityData(
      {this.tempValue = "",
      this.humiValue = "",
      this.co2Value = "",
      this.coValue = "",
      this.pm25Value = "",
      this.uvValue = "",
      this.date = ""});
}

class _DashboardScreenState extends State<DashboardScreen> {
  AirQualityData _airQualityData = AirQualityData();

  // get data from thingspeak
  getStringData() async {
    var url =
        "https://api.thingspeak.com/channels/2115707/feeds.json?results=1";
    var response = await http.get(
      Uri.parse(url),
      headers: {"Accept": "application/json"},
    );

    var data = response.body;
    var jsonData = json.decode(data);
    var getFeed = jsonData['feeds'];

    // for (var i = 0; i < getFeed.length; i++) {
    //   String dateTimeString = getFeed[i]['created_at'];
    //   DateTime dateTime = DateTime.parse(dateTimeString);
    //   String collectedDate = DateFormat('HH:mm').format(dateTime).toString();
    //   String indeAir = getFeed[i]['field1'];
    // }

    //formate date
    String dateTimeString = getFeed[0]['created_at'];
    DateTime dateTime = DateTime.parse(dateTimeString);
    String collectedDate = DateFormat('HH:mm:ss').format(dateTime).toString();

    //get the day of week from date
    String dayOfWeek = DateFormat('EEEE').format(dateTime).toString();

    //check if AM or PM
    String amPm = DateFormat('a').format(dateTime).toString();

    setState(() {
      _airQualityData = AirQualityData(
          tempValue: getFeed[0]['field1'],
          humiValue: getFeed[0]['field2'],
          co2Value: getFeed[0]['field3'],
          coValue: getFeed[0]['field4'],
          pm25Value: getFeed[0]['field5'],
          uvValue: getFeed[0]['field6'],
          date: "$dayOfWeek, $collectedDate $amPm");
    });
  }

  //auto refresh
  @override
  void initState() {
    super.initState();
    getStringData();
    Timer.periodic(const Duration(minutes: 5), (timer) {
      getStringData();
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
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
                        Padding(
                          padding: EdgeInsets.only(
                            top: 5,
                          ),
                          child: Icon(
                            Icons.location_on_rounded,
                            color: Colors.blueGrey,
                            size: 35,
                          ),
                        ),
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
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(
                            left: 2,
                          ),
                          // child: Text("07 July 2023",
                          //     style: TextStyle(
                          //         fontSize: 20, fontFamily: 'Kanit Light')),
                          child: _airQualityData.date == ""
                              ? const Text("Loading...",
                                  style: TextStyle(
                                      fontSize: 20,
                                      fontFamily: 'Kanit Regular 400'))
                              : Text(_airQualityData.date,
                                  style: const TextStyle(
                                      fontSize: 20,
                                      fontFamily: 'Kanit Medium 500')),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            //button refresh
            // Padding(
            //   padding: const EdgeInsets.only(
            //     bottom: 10,
            //     left: 100,
            //     right: 100,
            //   ),
            //   child: Container(
            //     height: 50,
            //     decoration: BoxDecoration(
            //       color: Colors.black,
            //       border: Border.all(
            //         color: Colors.black,
            //         width: 2,
            //       ),
            //       borderRadius: BorderRadius.circular(15),
            //       boxShadow: const [
            //         BoxShadow(
            //           color: Colors.black,
            //           offset: Offset.zero,
            //           blurRadius: 1,
            //           blurStyle: BlurStyle.outer,
            //         ),
            //       ],
            //     ),
            //     child: Row(
            //       children: <Widget>[
            //         Expanded(
            //           child: TextButton(
            //             style: TextButton.styleFrom(
            //               backgroundColor: Colors.green,
            //               shape: RoundedRectangleBorder(
            //                 borderRadius: BorderRadius.circular(15),
            //               ),
            //             ),
            //             onPressed: () {
            //               getAirQualityIndex();
            //             },
            //             child: const Text(
            //               'Predict',
            //               style: TextStyle(
            //                   color: Colors.white,
            //                   fontSize: 25,
            //                   fontWeight: FontWeight.bold),
            //               textAlign: TextAlign.center,
            //             ),
            //           ),
            //         ),
            //       ],
            //     ),
            //   ),
            // ),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.blueGrey[100],
                  border: Border.all(
                    color: Colors.black,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    const Expanded(
                        child: Icon(
                      Icons.sentiment_very_satisfied,
                      color: Colors.black,
                      size: 80,
                    )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    const SizedBox(width: 35),
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 25, 0),
                          child: Expanded(
                              child: Text(
                            'Temperature',
                            style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          )),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 30, 0),
                          child: _airQualityData.tempValue == "0"
                              ? const Text(
                                  'Loading...',
                                  style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                )
                              : Text(
                                  "${_airQualityData.tempValue}°C",
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.blueGrey[100],
                  border: Border.all(
                    color: Colors.black,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    const Expanded(
                        child: Icon(
                      Icons.sentiment_very_satisfied,
                      color: Colors.black,
                      size: 80,
                    )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    const SizedBox(width: 45),
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 45, 0),
                          child: Expanded(
                              child: Text(
                            'Humidity',
                            style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          )),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 30, 0),
                          child: _airQualityData.humiValue == "0"
                              ? const Text(
                                  'Loading...',
                                  style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                )
                              : Text(
                                  "${_airQualityData.humiValue}%",
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.blueGrey[100],
                  border: Border.all(
                    color: Colors.black,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    const Expanded(
                        child: Icon(
                      Icons.sentiment_very_satisfied,
                      color: Colors.black,
                      size: 80,
                    )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    const SizedBox(width: 30),
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 30, 0),
                          child: Expanded(
                              child: Text(
                            'CO2 Gas',
                            style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          )),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 30, 0),
                          child: _airQualityData.co2Value == "0"
                              ? const Text(
                                  'Loading...',
                                  style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                )
                              : Text(
                                  "${_airQualityData.co2Value}ppm",
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.blueGrey[100],
                  border: Border.all(
                    color: Colors.black,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    const Expanded(
                        child: Icon(
                      Icons.sentiment_very_satisfied,
                      color: Colors.black,
                      size: 80,
                    )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    const SizedBox(width: 30),
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 30, 0),
                          child: Expanded(
                              child: Text(
                            'CO Value',
                            style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          )),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 30, 0),
                          child: _airQualityData.coValue == "0"
                              ? const Text(
                                  'Loading...',
                                  style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                )
                              : Text(
                                  "${_airQualityData.coValue}ppm",
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.blueGrey[100],
                  border: Border.all(
                    color: Colors.black,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    const Expanded(
                        child: Icon(
                      Icons.sentiment_very_satisfied,
                      color: Colors.black,
                      size: 80,
                    )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    const SizedBox(width: 15),
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 20, 0),
                          child: Expanded(
                              child: Text(
                            'PM 2.5',
                            style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          )),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 25, 0),
                          child: _airQualityData.pm25Value == "0"
                              ? const Text(
                                  'Loading...',
                                  style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                )
                              : Text(
                                  "${_airQualityData.pm25Value}ug/m3",
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 20,
              ),
              child: Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.blueGrey[100],
                  border: Border.all(
                    color: Colors.black,
                    width: 4,
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Row(
                  children: <Widget>[
                    const Expanded(
                        child: Icon(
                      Icons.sentiment_very_satisfied,
                      color: Colors.black,
                      size: 80,
                    )),
                    const VerticalDivider(
                      color: Colors.black,
                      thickness: 3,
                      width: 20,
                    ),
                    const SizedBox(width: 45),
                    Column(
                      children: [
                        const SizedBox(height: 15),
                        const Padding(
                          padding: EdgeInsets.fromLTRB(0, 0, 45, 0),
                          child: Expanded(
                              child: Text(
                            'UV Index',
                            style: TextStyle(
                                color: Colors.black,
                                fontSize: 20,
                                fontFamily: 'Arial',
                                fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          )),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(0, 10, 45, 0),
                          child: _airQualityData.uvValue == "0"
                              ? const Text(
                                  'Loading...',
                                  style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                )
                              : Text(
                                  _airQualityData.uvValue,
                                  style: const TextStyle(
                                      color: Colors.green,
                                      fontSize: 20,
                                      fontFamily: 'Arial',
                                      fontWeight: FontWeight.bold),
                                  textAlign: TextAlign.center,
                                ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 15),
          ],
        ),
      ),
    );
  }
}
