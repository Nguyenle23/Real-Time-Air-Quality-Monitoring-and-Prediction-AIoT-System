from flask import request, jsonify
import numpy as np
import pandas as pd
from prophet import Prophet

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

class PredictController:
  def predictTestTemp():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataTemp']

        # push data to array
        tempTime = []
        for i in objectFormat['time']:
          tempTime.append(i)

        tempData = []
        for i in objectFormat['value']:
          tempData.append(i)

        # convert to numpy array and pandas dataframe
        arrayData = np.array(tempData)
        arrayTime = np.array(tempTime)
        datetimeTemp = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeTemp, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        model_prophet = Prophet()
        model_prophet.fit(dataset)

        # Make a future dataframe for 1 hours later (5 minutes each)
        future = model_prophet.make_future_dataframe(periods=12, freq='5T')
        forecast = model_prophet.predict(future)

        # get last 12 rows
        forecast = forecast.tail(12)

        # get only ds and yhat
        forecast = forecast[['ds', 'yhat']]
        forecast = forecast.set_index('ds')
        forecast.reset_index(inplace=True)

        # convert to numpy array
        arrayForecast = np.array(forecast['yhat'])

        # round up to 2 decimal
        arrayForecast = np.around(arrayForecast, decimals=2)

        # combine array
        # arrayForecast = np.concatenate((arrayData, arrayForecast), axis=0)
        # print(arrayForecast)

        # convert to list
        listForecast = arrayForecast.tolist()

        # convert to json
        objectFormat['forecast'] = listForecast
      
      except Exception as e:
        print(e)
      
    return jsonify(objectFormat)
  