import 'package:flutter/material.dart';

class InfoScreen extends StatefulWidget {
  const InfoScreen({super.key});

  @override
  State<InfoScreen> createState() => _InfoScreenState();
}

class _InfoScreenState extends State<InfoScreen> {
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
        padding: const EdgeInsets.all(20),
        child: Column(
          children: const [
            //information about the air quality index level
            Text(
              'Air Quality Index (AQI) Level',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              'The AQI is an index for reporting daily air quality. It tells you how clean or polluted your air is, and what associated health effects might be a concern for you. The AQI focuses on health effects you may experience within a few hours or days after breathing polluted air. EPA calculates the AQI for five major air pollutants regulated by the Clean Air Act: ground-level ozone, particle pollution (also known as particulate matter), carbon monoxide, sulfur dioxide, and nitrogen dioxide. For each of these pollutants, EPA has established national air quality standards to protect public health. Ground-level ozone and airborne particles are the two pollutants that pose the greatest threat to human health in this country.',
              style: TextStyle(
                fontSize: 15,
              ),
            ),
            SizedBox(
              height: 20,
            ),

            Text(
          'Levels of Air Quality Index',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(
          height: 10,
        ),
        Text(
          'Each category corresponds to a different level of health concern. The six levels of health concern and what they mean are:',
          style: TextStyle(
            fontSize: 15,
          ),
        ),
        SizedBox(
          height: 10,
        ),
        LevelItem(
          title: 'Good',
          range: '0 to 50',
          description:
              'Air quality is considered satisfactory, and air pollution poses little or no risk.',
        ),
        LevelItem(
          title: 'Moderate',
          range: '51 to 100',
          description:
              'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people. For example, people who are unusually sensitive to ozone may experience respiratory symptoms.',
        ),
        LevelItem(
          title: 'Unhealthy for Sensitive Groups',
          range: '101 to 150',
          description:
              'Although the general public is not likely to be affected at this AQI range, people with lung disease, older adults, and children are at greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults, and children are at greater risk from the presence of particles in the air.',
        ),
        LevelItem(
          title: 'Unhealthy',
          range: '151 to 200',
          description:
              'Everyone may begin to experience some adverse health effects, and members of the sensitive groups may experience more serious effects.',
        ),
        LevelItem(
          title: 'Very Unhealthy',
          range: '201 to 300',
          description:
              'This would trigger a health alert signifying that everyone may experience more serious health effects.',
        ),
        LevelItem(
          title: 'Hazardous',
          range: 'greater than 300',
          description:
              'This would trigger health warnings of emergency conditions. The entire population is more likely to be affected.',
        ),
        SizedBox(
          height: 20,
        ),
          ],
        ),
      ),
    );
  }
}

class LevelItem extends StatelessWidget {
  final String title;
  final String range;
  final String description;

  const LevelItem({
    Key? key,
    required this.title,
    required this.range,
    required this.description,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '• "$title" AQI is $range.',
          style: const TextStyle(
            fontSize: 15,
          ),
        ),
        const SizedBox(
          height: 5,
        ),
        Text(
          description,
          style: const TextStyle(
            fontSize: 15,
          ),
        ),
        const SizedBox(
          height: 10,
        ),
      ],
    );
  }
}
