import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';
import 'package:syncfusion_flutter_charts/charts.dart';

class ChartScreen extends StatefulWidget {
  const ChartScreen({super.key});

  @override
  State<ChartScreen> createState() => _ChartScreenState();
}

class AQIDataHCM {
  AQIDataHCM({
    required this.time,
    required this.temp,
    // required this.humidity,
    // required this.co2,
    // required this.co,
    // required this.pm25,
    // required this.uvIndex,
    // required this.windDirection,
    // required this.windSpeed,
  });

  final DateTime time;
  final double temp;
  // final double humidity;
  // final double co2;
  // final double co;
  // final double pm25;
  // final double uvIndex;
  // final double windDirection;
  // final double windSpeed;
}

class _ChartScreenState extends State<ChartScreen> {
  List<AQIDataHCM> dataAIQ = [];

  @override
  void initState() {
    super.initState();
    getAirQualityIndex();
  }

  @override
  void dispose() {
    dataAIQ.clear();
    super.dispose();
  }

  Future<void> getAirQualityIndex() async {
    try {
      final String formatInputStartDate =
          DateFormat('yyyy-MM-dd 00:00:00').format(DateTime.now().toUtc());
      final String formatInputEndDate =
          DateFormat('yyyy-MM-dd 23:59:00').format(DateTime.now().toUtc());

      final String urlTemp =
          "https://api.thingspeak.com/channels/2115707/fields/2.json?timezone=Asia%2FBangkok&results=288&start=$formatInputStartDate&end=$formatInputEndDate";
      print(urlTemp);
      // final String urlHumi =
      //     "https://api.thingspeak.com/channels/2115707/fields/2.json?timezone=Asia%2FBangkok&results=288&start=$formatInputStartDate&end=$formatInputEndDate";

      // final String urlCO2 =
      //     "https://api.thingspeak.com/channels/2115707/fields/3.json?timezone=Asia%2FBangkok&results=288&start=$formatInputStartDate&end=$formatInputEndDate";

      // final String urlCO =
      //     "https://api.thingspeak.com/channels/2115707/fields/4.json?timezone=Asia%2FBangkok&results=288&start=$formatInputStartDate&end=$formatInputEndDate";

      // final String urlUV =
      //     "https://api.thingspeak.com/channels/2115707/fields/5.json?timezone=Asia%2FBangkok&results=288&start=$formatInputStartDate&end=$formatInputEndDate";

      // final String urlPM =
      //     "https://api.thingspeak.com/channels/2115707/fields/6.json?timezone=Asia%2FBangkok&results=288&start=$formatInputStartDate&end=$formatInputEndDate";

      final responseTemp = await http.get(
        Uri.parse(urlTemp),
        headers: {"Accept": "application/json"},
      );

      // final responseHumi = await http.get(
      //   Uri.parse(urlHumi),
      //   headers: {"Accept": "application/json"},
      // );

      // final responseCO2 = await http.get(
      //   Uri.parse(urlCO2),
      //   headers: {"Accept": "application/json"},
      // );

      // final responseCO = await http.get(
      //   Uri.parse(urlCO),
      //   headers: {"Accept": "application/json"},
      // );

      // final responsePM = await http.get(
      //   Uri.parse(urlPM),
      //   headers: {"Accept": "application/json"},
      // );

      // final responseUV = await http.get(
      //   Uri.parse(urlUV),
      //   headers: {"Accept": "application/json"},
      // );

      if (responseTemp.statusCode == 200) {
        final jsonDataTemp = json.decode(responseTemp.body);
        final getFeedTemp = jsonDataTemp['feeds'];

        // final jsonDataHumi = json.decode(responseHumi.body);
        // final getFeedHumi = jsonDataHumi['feeds'];

        // final jsonDataCO2 = json.decode(responseCO2.body);
        // final getFeedCO2 = jsonDataCO2['feeds'];

        // final jsonDataCO = json.decode(responseCO.body);
        // final getFeedCO = jsonDataCO['feeds'];

        // final jsonDataPM = json.decode(responsePM.body);
        // final getFeedPM = jsonDataPM['feeds'];

        // final jsonDataUV = json.decode(responseUV.body);
        // final getFeedUV = jsonDataUV['feeds'];

        for (var i = 0; i < getFeedTemp.length; i++) {
          final String dateTimeString = getFeedTemp[i]['created_at'];
          final DateTime dateTime = DateTime.parse(dateTimeString);
          final String tempData = getFeedTemp[i]['field1'];

          addDataToAIQ(dateTime, double.parse(tempData));
        }
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  void addDataToAIQ(
    DateTime time,
    double temp,
    // double humidity,
    // double co2,
    // double co,
    // double pm25,
    // double uvIndex,
    // double windDirection,
    // double windSpeed,
  ) {
    setState(() {
      dataAIQ.add(AQIDataHCM(
        time: time,
        temp: temp,
        // humidity: humidity,
        // co2: co2,
        // co: co,
        // pm25: pm25,
        // uvIndex: uvIndex,
        // windDirection: windDirection,
        // windSpeed: windSpeed,
      ));
      dataAIQ.sort((a, b) => a.time.compareTo(b.time));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
          SafeArea(
            child: SfCartesianChart(
              zoomPanBehavior: ZoomPanBehavior(
                enablePanning: true,
                enableDoubleTapZooming: true,
                enablePinching: true,
                enableMouseWheelZooming: true,
              ),
              primaryXAxis: DateTimeAxis(
                dateFormat: DateFormat('HH:mm'), // Set your desired time format
                labelRotation: 45,
                majorGridLines: const MajorGridLines(width: 0),
              ),
              primaryYAxis: NumericAxis(
                labelFormat: '{value} °C',
                axisLine: const AxisLine(width: 0),
                majorTickLines: const MajorTickLines(color: Colors.transparent),
                minimum: 20,
                maximum: 40,
                interval: 5,
                edgeLabelPlacement: EdgeLabelPlacement.shift,
                numberFormat: NumberFormat.compact(),
              ),
              title: ChartTitle(
                text: 'Time-series line chart for temperature (°C)',
                textStyle: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              legend: const Legend(
                isVisible: true,
                position: LegendPosition.bottom,
              ),
              series: <ChartSeries>[
                FastLineSeries<AQIDataHCM, DateTime>(
                  name: "Temperature (°C)",
                  dataSource: dataAIQ,
                  xValueMapper: (AQIDataHCM data, _) => data.time,
                  yValueMapper: (AQIDataHCM data, _) => data.temp,
                  markerSettings: const MarkerSettings(isVisible: true),
                ),
              ],
              tooltipBehavior: TooltipBehavior(
                enable: true,
              ),
            ),
          ),
        ],
      ),
    ));
  }
}

