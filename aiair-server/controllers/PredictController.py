import os
import numpy as np
import pandas as pd

from flask import request, jsonify
from prophet import Prophet
from sklearn.preprocessing import MinMaxScaler
from keras.models import model_from_json

import warnings
warnings.filterwarnings('ignore')

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
  
  def predictHumiProphet():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataHumi']

        humiTime = []
        for i in objectFormat['time']:
          humiTime.append(i)

        humiData = []
        for i in objectFormat['value']:
          humiData.append(i)

        arrayData = np.array(humiData)
        arrayTime = np.array(humiTime)
        datetimeHumi = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeHumi, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        model_prophet = Prophet()
        model_prophet.fit(dataset)

        future = model_prophet.make_future_dataframe(periods=12, freq='5T')
        forecast = model_prophet.predict(future)
        forecast = forecast.tail(12)

        forecast = forecast[['ds', 'yhat']]
        forecast = forecast.set_index('ds')
        forecast.reset_index(inplace=True)

        arrayForecast = np.array(forecast['yhat'])
        arrayForecast = np.around(arrayForecast, decimals=2)
        listForecast = arrayForecast.tolist()
        objectFormat['forecast'] = listForecast
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictCO2Prophet():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataCO2']

        co2Time = []
        for i in objectFormat['time']:
          co2Time.append(i)

        co2Data = []
        for i in objectFormat['value']:
          co2Data.append(i)

        arrayData = np.array(co2Data)
        arrayTime = np.array(co2Time)
        datetimeCO2 = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeCO2, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        model_prophet = Prophet()
        model_prophet.fit(dataset)

        future = model_prophet.make_future_dataframe(periods=12, freq='5T')
        forecast = model_prophet.predict(future)
        forecast = forecast.tail(12)

        forecast = forecast[['ds', 'yhat']]
        forecast = forecast.set_index('ds')
        forecast.reset_index(inplace=True)

        arrayForecast = np.array(forecast['yhat'])
        arrayForecast = np.around(arrayForecast, decimals=2)
        listForecast = arrayForecast.tolist()
        objectFormat['forecast'] = listForecast
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictCOProphet():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataCO']

        coTime = []
        for i in objectFormat['time']:
          coTime.append(i)

        coData = []
        for i in objectFormat['value']:
          coData.append(i)

        arrayData = np.array(coData)
        arrayTime = np.array(coTime)
        datetimeCO = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeCO, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        model_prophet = Prophet()
        model_prophet.fit(dataset)

        future = model_prophet.make_future_dataframe(periods=12, freq='5T')
        forecast = model_prophet.predict(future)
        forecast = forecast.tail(12)

        forecast = forecast[['ds', 'yhat']]
        forecast = forecast.set_index('ds')
        forecast.reset_index(inplace=True)

        arrayForecast = np.array(forecast['yhat'])
        arrayForecast = np.around(arrayForecast, decimals=2)
        listForecast = arrayForecast.tolist()
        objectFormat['forecast'] = listForecast
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictUVProphet():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataUV']

        uvTime = []
        for i in objectFormat['time']:
          uvTime.append(i)

        uvData = []
        for i in objectFormat['value']:
          uvData.append(i)

        arrayData = np.array(uvData)
        arrayTime = np.array(uvTime)
        datetimeUV = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeUV, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        model_prophet = Prophet()
        model_prophet.fit(dataset)

        future = model_prophet.make_future_dataframe(periods=12, freq='5T')
        forecast = model_prophet.predict(future)
        forecast = forecast.tail(12)

        forecast = forecast[['ds', 'yhat']]
        forecast = forecast.set_index('ds')
        forecast.reset_index(inplace=True)

        arrayForecast = np.array(forecast['yhat'])
        arrayForecast = np.around(arrayForecast, decimals=2)
        listForecast = arrayForecast.tolist()
        objectFormat['forecast'] = listForecast
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictPM25Prophet():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataPM25']

        pm25Time = []
        for i in objectFormat['time']:
          pm25Time.append(i)

        pm25Data = []
        for i in objectFormat['value']:
          pm25Data.append(i)

        arrayData = np.array(pm25Data)
        arrayTime = np.array(pm25Time)
        datetimePM25 = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimePM25, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        model_prophet = Prophet()
        model_prophet.fit(dataset)

        future = model_prophet.make_future_dataframe(periods=12, freq='5T')
        forecast = model_prophet.predict(future)
        forecast = forecast.tail(12)

        forecast = forecast[['ds', 'yhat']]
        forecast = forecast.set_index('ds')
        forecast.reset_index(inplace=True)

        arrayForecast = np.array(forecast['yhat'])
        arrayForecast = np.around(arrayForecast, decimals=2)
        listForecast = arrayForecast.tolist()
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
        dataset = dataset.dropna()
        dataset = dataset.iloc[1:]
        
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
        temp_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/temp_pc_lstm_weight.json')
        temp_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/temp_pc_lstm_weight.h5')
        with open(temp_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        # Load model json
        loaded_model = model_from_json(loaded_model_json)

        # Load model weights
        loaded_model.load_weights(temp_lstm_weight)

        if os.path.exists(temp_lstm_weight) and os.path.exists(temp_lstm_json):
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

  def predictHumiLSTM():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataHumi']

        # push data to array
        humiTime = []
        for i in objectFormat['time']:
          humiTime.append(i)

        humiData = []
        for i in objectFormat['value']:
          humiData.append(i)

        arrayData = np.array(humiData)
        arrayTime = np.array(humiTime)
        datetimeHumi = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeHumi, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset = dataset.dropna()
        dataset = dataset.iloc[1:]
        dataset.reset_index(inplace=True)

        scaler = MinMaxScaler()
        scaled_humi = scaler.fit_transform(dataset[['y']])

        sequence_length = 100
        if len(scaled_humi) < sequence_length:
            padded_humi = np.pad(scaled_humi, ((sequence_length - len(scaled_humi), 0), (0, 0)), mode='constant')
        else:
            padded_humi = scaled_humi[-sequence_length:]
        input_data = padded_humi.reshape((1, 1, sequence_length))
        
        humi_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/humi-lstm.json')
        humi_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/humi_lstm_weight.h5')
        with open(humi_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        loaded_model = model_from_json(loaded_model_json)
        loaded_model.load_weights(humi_lstm_weight)

        if os.path.exists(humi_lstm_weight):
          predictions = loaded_model.predict(input_data)
          predictions_inv = scaler.inverse_transform(predictions)[0]
          arrayForecast = np.array(predictions_inv)
          arrayForecast = np.around(arrayForecast, decimals=4)
          listForecast = arrayForecast.tolist()
          objectFormat['forecast'] = listForecast
        else:
          print(f"File not found: {humi_lstm_weight}")
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictCO2LSTM():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataCO2']

        # push data to array
        co2Time = []
        for i in objectFormat['time']:
          co2Time.append(i)

        co2Data = []
        for i in objectFormat['value']:
          co2Data.append(i)

        arrayData = np.array(co2Data)
        arrayTime = np.array(co2Time)
        datetimeCO2 = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeCO2, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        scaler = MinMaxScaler()
        scaled_co2 = scaler.fit_transform(dataset[['y']])

        sequence_length = 100
        if len(scaled_co2) < sequence_length:
            padded_co2 = np.pad(scaled_co2, ((sequence_length - len(scaled_co2), 0), (0, 0)), mode='constant')
        else:
            padded_co2 = scaled_co2[-sequence_length:]
        input_data = padded_co2.reshape((1, 1, sequence_length))
        
        co2_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/co2-lstm.json')
        co2_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/co2_lstm_weight.h5')
        with open(co2_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        loaded_model = model_from_json(loaded_model_json)
        loaded_model.load_weights(co2_lstm_weight)

        if os.path.exists(co2_lstm_weight):
          predictions = loaded_model.predict(input_data)
          predictions_inv = scaler.inverse_transform(predictions)[0]
          arrayForecast = np.array(predictions_inv)
          arrayForecast = np.around(arrayForecast, decimals=4)
          listForecast = arrayForecast.tolist()
          objectFormat['forecast'] = listForecast
        else:
          print(f"File not found: {co2_lstm_weight}")
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictCOLSTM():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataCO']

        # push data to array
        coTime = []
        for i in objectFormat['time']:
          coTime.append(i)

        coData = []
        for i in objectFormat['value']:
          coData.append(i)

        arrayData = np.array(coData)
        arrayTime = np.array(coTime)
        datetimeCO = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeCO, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        scaler = MinMaxScaler()
        scaled_co = scaler.fit_transform(dataset[['y']])

        sequence_length = 100
        if len(scaled_co) < sequence_length:
            padded_co = np.pad(scaled_co, ((sequence_length - len(scaled_co), 0), (0, 0)), mode='constant')
        else:
            padded_co = scaled_co[-sequence_length:]
        input_data = padded_co.reshape((1, 1, sequence_length))
        
        co_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/co-lstm.json')
        co_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/co_lstm_weight.h5')
        with open(co_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        loaded_model = model_from_json(loaded_model_json)
        loaded_model.load_weights(co_lstm_weight)

        if os.path.exists(co_lstm_weight):
          predictions = loaded_model.predict(input_data)
          predictions_inv = scaler.inverse_transform(predictions)[0]
          arrayForecast = np.array(predictions_inv)
          arrayForecast = np.around(arrayForecast, decimals=4)
          listForecast = arrayForecast.tolist()
          objectFormat['forecast'] = listForecast
        else:
          print(f"File not found: {co_lstm_weight}")
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictUVLSTM():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataUV']

        # push data to array
        uvTime = []
        for i in objectFormat['time']:
          uvTime.append(i)

        uvData = []
        for i in objectFormat['value']:
          uvData.append(i)

        arrayData = np.array(uvData)
        arrayTime = np.array(uvTime)
        datetimeUV = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimeUV, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        scaler = MinMaxScaler()
        scaled_uv = scaler.fit_transform(dataset[['y']])

        sequence_length = 100
        if len(scaled_uv) < sequence_length:
            padded_uv = np.pad(scaled_uv, ((sequence_length - len(scaled_uv), 0), (0, 0)), mode='constant')
        else:
            padded_uv = scaled_uv[-sequence_length:]
        input_data = padded_uv.reshape((1, 1, sequence_length))
        
        uv_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/uv-lstm.json')
        uv_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/uv_lstm_weight.h5')
        with open(uv_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        loaded_model = model_from_json(loaded_model_json)
        loaded_model.load_weights(uv_lstm_weight)

        if os.path.exists(uv_lstm_weight):
          predictions = loaded_model.predict(input_data)
          predictions_inv = scaler.inverse_transform(predictions)[0]
          arrayForecast = np.array(predictions_inv)
          arrayForecast = np.around(arrayForecast, decimals=4)
          listForecast = arrayForecast.tolist()
          objectFormat['forecast'] = listForecast
        else:
          print(f"File not found: {uv_lstm_weight}")
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  
  def predictPM25LSTM():
    if request.method == 'POST':
      try:
        data = request.json
        objectFormat = data['dataPM25']

        # push data to array
        pm25Time = []
        for i in objectFormat['time']:
          pm25Time.append(i)

        pm25Data = []
        for i in objectFormat['value']:
          pm25Data.append(i)

        arrayData = np.array(pm25Data)
        arrayTime = np.array(pm25Time)
        datetimePM25 = pd.to_datetime(arrayTime)

        dataset = pd.DataFrame({'ds': datetimePM25, 'y': arrayData})
        dataset = dataset.set_index('ds')
        dataset = dataset.resample('5T').ffill()
        dataset.reset_index(inplace=True)

        scaler = MinMaxScaler()
        scaled_pm25 = scaler.fit_transform(dataset[['y']])

        sequence_length = 100
        if len(scaled_pm25) < sequence_length:
            padded_pm25 = np.pad(scaled_pm25, ((sequence_length - len(scaled_pm25), 0), (0, 0)), mode='constant')
        else:
            padded_pm25 = scaled_pm25[-sequence_length:]
        input_data = padded_pm25.reshape((1, 1, sequence_length))
        
        pm25_lstm_json = os.path.join(server_dir, 'server/datasets/models/lstm/pm25-lstm.json')
        pm25_lstm_weight = os.path.join(server_dir, 'server/datasets/models/lstm/pm25_lstm_weight.h5')
        with open(pm25_lstm_json, 'r') as json_file:
            loaded_model_json = json_file.read()
        
        loaded_model = model_from_json(loaded_model_json)
        loaded_model.load_weights(pm25_lstm_weight)

        if os.path.exists(pm25_lstm_weight):
          predictions = loaded_model.predict(input_data)
          predictions_inv = scaler.inverse_transform(predictions)[0]
          arrayForecast = np.array(predictions_inv)
          arrayForecast = np.around(arrayForecast, decimals=4)
          listForecast = arrayForecast.tolist()
          objectFormat['forecast'] = listForecast
        else:
          print(f"File not found: {pm25_lstm_weight}")
      except Exception as e:
        print(e)
    return jsonify(objectFormat)
  