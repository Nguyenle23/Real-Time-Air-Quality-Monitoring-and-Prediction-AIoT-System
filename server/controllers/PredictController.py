from flask import request, jsonify
import numpy as np
from tensorflow.keras.models import load_model, model_from_json
from joblib import load
import os

class PredictController:
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

      model_path = os.path.join(server_dir, 'server/datasets/models/model_co.h5')
      model_json_path = os.path.join(server_dir, 'server/datasets/models/model_co.json')
      scaler_path = os.path.join(server_dir, 'server/datasets/models/scalerCO.joblib')

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