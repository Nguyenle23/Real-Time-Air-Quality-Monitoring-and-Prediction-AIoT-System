from flask import Blueprint

from controllers.PredictController import PredictController

Predict = Blueprint('Predict', __name__)

Predict.route('/prophet/temp', methods = ['POST'])(PredictController.predictTempProphet)
Predict.route('/prophet/humi', methods = ['POST'])(PredictController.predictHumiProphet)
Predict.route('/prophet/co2', methods = ['POST'])(PredictController.predictCO2Prophet)
Predict.route('/prophet/co', methods = ['POST'])(PredictController.predictCOProphet)
Predict.route('/prophet/uv', methods = ['POST'])(PredictController.predictUVProphet)
Predict.route('/prophet/pm25', methods = ['POST'])(PredictController.predictPM25Prophet)

Predict.route('/lstm/temp', methods = ['POST'])(PredictController.predictTempLSTM)
Predict.route('/lstm/humi', methods = ['POST'])(PredictController.predictHumiLSTM)
Predict.route('/lstm/co2', methods = ['POST'])(PredictController.predictCO2LSTM)
Predict.route('/lstm/co', methods = ['POST'])(PredictController.predictCOLSTM)
Predict.route('/lstm/uv', methods = ['POST'])(PredictController.predictUVLSTM)
Predict.route('/lstm/pm25', methods = ['POST'])(PredictController.predictPM25LSTM)

