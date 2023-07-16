import json
from bson import json_util
from flask import render_template
import requests

class TestController:
  def getSampleData():
    getNewestData = requests.get('https://api.thingspeak.com/channels/2044945/feeds.json?api_key=UMVXZ6J6YC9JPAVT&results=1')
    newData = getNewestData.json()
    newResponse = json.loads(json_util.dumps(newData))

    getData = requests.get(
        'https://api.thingspeak.com/channels/2044945/feeds.json?api_key=UMVXZ6J6YC9JPAVT&results=20')
    data = getData.json()
    resp = json.loads(json_util.dumps(data))

    return render_template('index.html', 
        data=resp['feeds'], 
        CO2=newResponse['feeds'][0]['field3'], 
        CO=newResponse['feeds'][0]['field4'],
        PM25=newResponse['feeds'][0]['field6'],  
        UV=newResponse['feeds'][0]['field5'], 
        TEMP=newResponse['feeds'][0]['field1'], 
        HUMI=newResponse['feeds'][0]['field2'],
    )