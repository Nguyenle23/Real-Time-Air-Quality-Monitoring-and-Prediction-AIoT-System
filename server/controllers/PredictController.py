from flask import request, jsonify
import numpy as np
import tensorflow as tf
# from joblib import load
import os
import pandas as pd
from datetime import datetime
# from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
# from xgboost import XGBRegressor
from prophet import Prophet
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from keras.models import model_from_json

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

script_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.dirname(os.path.dirname(script_dir))

class PredictController:
  #-------------------Prophet-------------------
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
  
  #-------------------predict temperature-------------------
  def predictLRTemp():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataTemp']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/linear_regression/model_lr_temp.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictGBTemp():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataTemp']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_temp.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictXGBTemp():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataTemp']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/extreme_gradient_boost/model_xgb_temp.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictRFTemp():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataTemp']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_temp.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictKNNTemp():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataTemp']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_temp.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())
  
  
  
  #----------------------predict humidity----------------------
  def predictLRHumi():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataHumi']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/linear_regression/model_lr_humi.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictGBHumi():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataHumi']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_humi.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictXGBHumi():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataHumi']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/extreme_gradient_boost/model_xgb_humi.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictRFHumi():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataHumi']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_humi.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictKNNHumi():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataHumi']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_humi.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())
  
  #------------------predict CO2------------------
  def predictLRCO2():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO2']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/linear_regression/model_lr_co2.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictGBCO2():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO2']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_co2.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictXGBCO2():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO2']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/extreme_gradient_boost/model_xgb_co2.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictRFCO2():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO2']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_co2.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictKNNCO2():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO2']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_co2.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())
  
  #------------------predict CO------------------
  def predictLRCO():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/linear_regression/model_lr_co.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictGBCO():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_co.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictXGBCO():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/extreme_gradient_boost/model_xgb_co.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictRFCO():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_co.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictKNNCO():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_co.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())
  
  #------------------predict UV------------------
  def predictLRUV():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataUV']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/linear_regression/model_lr_uv.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictGBUV():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataUV']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_uv.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictXGBUV():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataUV']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/extreme_gradient_boost/model_xgb_uv.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictRFUV():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataUV']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_uv.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictKNNUV():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataUV']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_uv.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())
  
  #------------------predict PM2.5------------------
  def predictLRPM25():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataPM25']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/linear_regression/model_lr_pm25.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictGBPM25():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataPM25']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_pm25.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictXGBPM25():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataPM25']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/extreme_gradient_boost/model_xgb_pm25.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictRFPM25():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataPM25']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_pm25.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())

  def predictKNNPM25():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataPM25']
      originalArray = np.array(tempDate)
      input_datetime_str = pd.to_datetime(originalArray)
      input_datetime_str = str(input_datetime_str.max())

      # Parse the input datetime string
      input_datetime = datetime.strptime(input_datetime_str, "%Y-%m-%d %H:%M:%S%z")

      # Format the datetime as desired
      formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S")

      old_date = pd.to_datetime(formatted_datetime)

      # #get current date
      current_date = pd.Timestamp.now()

      time_differences = (current_date - old_date).total_seconds()

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_pm25.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())