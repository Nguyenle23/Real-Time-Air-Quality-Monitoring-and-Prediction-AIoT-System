from flask import request, jsonify
import numpy as np
from tensorflow.keras.models import load_model, model_from_json
from joblib import load
import os
import pandas as pd
from datetime import datetime
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

script_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.dirname(os.path.dirname(script_dir))

class PredictController:
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

      model_path = os.path.join(server_dir, 'server/datasets/models/gradient_boost/model_gb_temp.pkl')
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

      model_path = os.path.join(server_dir, 'server/datasets/models/k_nearest_neighboor/model_knn_temp.pkl')
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

      model_path = os.path.join(server_dir, 'server/datasets/models/random_forest/model_rf_temp.pkl')
      if os.path.exists(model_path):
        loaded_model = load(model_path)
        prediction = loaded_model.predict([[time_differences]])
        print(prediction[0])
      else:
        print(f"File not found: {model_path}")
    return jsonify(prediction[0].tolist())
  
  def predictHumi():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataHumi']
      originalArray = np.array(tempDate)

      # #reshape data to (1, 12, 1)
      window_size = 12
      data_batches = originalArray[:window_size].reshape(1, 12, 1)

      script_dir = os.path.dirname(os.path.abspath(__file__))
      server_dir = os.path.dirname(os.path.dirname(script_dir))

      model_path = os.path.join(server_dir, 'server/datasets/models/predictHumi/model_humi.h5')
      model_json_path = os.path.join(server_dir, 'server/datasets/models/predictHumi/model_humi.json')
      scaler_path = os.path.join(server_dir, 'server/datasets/models/predictHumi/scalerHumi.joblib')

      if os.path.exists(model_path) and os.path.exists(model_json_path):
        json_file = open(model_json_path, 'r')
        loaded_model_json = json_file.read()
        json_file.close()

        loaded_model = model_from_json(loaded_model_json)

        loaded_model.load_weights(model_path)

        loaded_model.compile(optimizer='adam', loss='mse')

        prediction = loaded_model.predict(data_batches)

        #scale back the data to the original representation
        scaler = load(scaler_path)
        prediction = scaler.inverse_transform(prediction)
        print(prediction[0])

      else:
        print(f"File not found: {model_path}")
      
    return jsonify(prediction[0].tolist())
  
  def predictCO2():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO2']
      originalArray = np.array(tempDate)

      # #reshape data to (1, 12, 1)
      window_size = 12
      data_batches = originalArray[:window_size].reshape(1, 12, 1)

      script_dir = os.path.dirname(os.path.abspath(__file__))
      server_dir = os.path.dirname(os.path.dirname(script_dir))

      model_path = os.path.join(server_dir, 'server/datasets/models/predictCO2/model_co2.h5')
      model_json_path = os.path.join(server_dir, 'server/datasets/models/predictCO2/model_co2.json')
      scaler_path = os.path.join(server_dir, 'server/datasets/models/predictCO2/scalerCO2.joblib')

      if os.path.exists(model_path) and os.path.exists(model_json_path):
        json_file = open(model_json_path, 'r')
        loaded_model_json = json_file.read()
        json_file.close()

        loaded_model = model_from_json(loaded_model_json)

        loaded_model.load_weights(model_path)

        loaded_model.compile(optimizer='adam', loss='mse')

        prediction = loaded_model.predict(data_batches)

        #scale back the data to the original representation
        scaler = load(scaler_path)
        prediction = scaler.inverse_transform(prediction)
        print(prediction[0])

      else:
        print(f"File not found: {model_path}")
      
    return jsonify(prediction[0].tolist())
  
  def predictCO():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataCO']
      originalArray = np.array(tempDate)

      # #reshape data to (1, 12, 1)
      window_size = 12
      data_batches = originalArray[:window_size].reshape(1, 12, 1)

      script_dir = os.path.dirname(os.path.abspath(__file__))
      server_dir = os.path.dirname(os.path.dirname(script_dir))

      model_path = os.path.join(server_dir, 'server/datasets/models/predictCO/model_co.h5')
      model_json_path = os.path.join(server_dir, 'server/datasets/models/predictCO/model_co.json')
      scaler_path = os.path.join(server_dir, 'server/datasets/models/predictCO/scalerCO.joblib')

      if os.path.exists(model_path) and os.path.exists(model_json_path):
        json_file = open(model_json_path, 'r')
        loaded_model_json = json_file.read()
        json_file.close()

        loaded_model = model_from_json(loaded_model_json)

        loaded_model.load_weights(model_path)

        loaded_model.compile(optimizer='adam', loss='mse')

        prediction = loaded_model.predict(data_batches)

        #scale back the data to the original representation
        scaler = load(scaler_path)
        prediction = scaler.inverse_transform(prediction)
        print(prediction[0])

      else:
        print(f"File not found: {model_path}")
      
    return jsonify(prediction[0].tolist())
  
  def predictUV():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataUV']
      originalArray = np.array(tempDate)

      # #reshape data to (1, 12, 1)
      window_size = 12
      data_batches = originalArray[:window_size].reshape(1, 12, 1)

      script_dir = os.path.dirname(os.path.abspath(__file__))
      server_dir = os.path.dirname(os.path.dirname(script_dir))

      model_path = os.path.join(server_dir, 'server/datasets/models/predictUV/model_uv.h5')
      model_json_path = os.path.join(server_dir, 'server/datasets/models/predictUV/model_uv.json')
      scaler_path = os.path.join(server_dir, 'server/datasets/models/predictUV/scalerUV.joblib')

      if os.path.exists(model_path) and os.path.exists(model_json_path):
        json_file = open(model_json_path, 'r')
        loaded_model_json = json_file.read()
        json_file.close()

        loaded_model = model_from_json(loaded_model_json)

        loaded_model.load_weights(model_path)

        loaded_model.compile(optimizer='adam', loss='mse')

        prediction = loaded_model.predict(data_batches)

        #scale back the data to the original representation
        scaler = load(scaler_path)
        prediction = scaler.inverse_transform(prediction)
        print(prediction[0])

      else:
        print(f"File not found: {model_path}")
      
    return jsonify(prediction[0].tolist())
  
  def predictPM25():
    if request.method == 'POST':
      data = request.json
      tempDate = data['dataPM25']
      originalArray = np.array(tempDate)

      # #reshape data to (1, 12, 1)
      window_size = 12
      data_batches = originalArray[:window_size].reshape(1, 12, 1)

      script_dir = os.path.dirname(os.path.abspath(__file__))
      server_dir = os.path.dirname(os.path.dirname(script_dir))

      model_path = os.path.join(server_dir, 'server/datasets/models/predictPM25/model_pm25.h5')
      model_json_path = os.path.join(server_dir, 'server/datasets/models/predictPM25/model_pm25.json')
      scaler_path = os.path.join(server_dir, 'server/datasets/models/predictPM25/scalerPM25.joblib')

      if os.path.exists(model_path) and os.path.exists(model_json_path):
        json_file = open(model_json_path, 'r')
        loaded_model_json = json_file.read()
        json_file.close()

        loaded_model = model_from_json(loaded_model_json)

        loaded_model.load_weights(model_path)

        loaded_model.compile(optimizer='adam', loss='mse')

        prediction = loaded_model.predict(data_batches)

        #scale back the data to the original representation
        scaler = load(scaler_path)
        prediction = scaler.inverse_transform(prediction)
        print(prediction[0])

      else:
        print(f"File not found: {model_path}")
      
    return jsonify(prediction[0].tolist())