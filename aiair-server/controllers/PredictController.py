import os
import numpy as np
import pandas as pd

from flask import request, jsonify
from prophet import Prophet
from sklearn.preprocessing import MinMaxScaler
from keras.models import model_from_json

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

script_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.dirname(os.path.dirname(script_dir))

class PredictController:
  #-------------------Prophet-------------------
  def predictTempProphet():
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
  
  #-------------------LSTM-------------------
  def predictTempLSTM():
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

        arrayData = np.array(tempData)
        arrayTime = np.array(tempTime)
        datetimeTemp = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeTemp, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        # Scale the data to be between 0 and 1
        scaler = MinMaxScaler()
        scaled_temp = scaler.fit_transform(dataset[['y']])

        # Ensure the sequence length matches the model's input (100 time steps)
        sequence_length = 100

        # Pad or truncate the sequence to match the model's input sequence length
        if len(scaled_temp) < sequence_length:
            padded_temp = np.pad(scaled_temp, ((sequence_length - len(scaled_temp), 0), (0, 0)), mode='constant')
        else:
            padded_temp = scaled_temp[-sequence_length:]

        # Reshape the data to be suitable for LSTM (samples, time steps, features)
        input_data = padded_temp.reshape((1, 1, sequence_length))
        
        # Load model architecture from JSON file
        temp_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/temp-lstm.json')
        temp_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/temp_lstm_weight.h5')
        with open(temp_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        # Load model json
        loaded_model = model_from_json(loaded_model_json)

        # Load model weights
        loaded_model.load_weights(temp_lstm_weight)

        if os.path.exists(temp_lstm_weight):
          print("--------model loaded---------")
          predictions = loaded_model.predict(input_data)

          # # Inverse transform the predictions to get original scale
          predictions_inv = scaler.inverse_transform(predictions)[0]

          # get data from predictions
          arrayForecast = np.array(predictions_inv)

          # round up to 2 decimal
          arrayForecast = np.around(arrayForecast, decimals=4)

          # convert to list
          listForecast = arrayForecast.tolist()

          # convert to json
          objectFormat['forecast'] = listForecast

        else:
          print(f"File not found: {temp_lstm_weight}")
      except Exception as e:
        print(e)
      
    return jsonify(objectFormat)