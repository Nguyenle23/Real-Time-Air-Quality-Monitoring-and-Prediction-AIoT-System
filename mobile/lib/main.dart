import 'package:flutter/material.dart';
import 'package:iu_air_quality/screen/home_screen.dart';
import 'package:timezone/data/latest.dart' as tzdata;

void main() {
  tzdata.initializeTimeZones();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Air Quality Monitoring',
      home: HomeScreen(),
    );
  }
}
