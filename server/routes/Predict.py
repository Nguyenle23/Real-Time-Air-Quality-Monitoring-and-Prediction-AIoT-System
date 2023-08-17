from flask import Blueprint

from controllers.PredictController import PredictController

Predict = Blueprint('Predict', __name__)

Predict.route('/temp', methods = ['POST'])(PredictController.predictTemp)
Predict.route('/humi', methods = ['POST'])(PredictController.predictHumi)
Predict.route('/co', methods = ['POST'])(PredictController.predictCO)
Predict.route('/co2', methods = ['POST'])(PredictController.predictCO2)
Predict.route('/uv', methods = ['POST'])(PredictController.predictUV)
Predict.route('/pm25', methods = ['POST'])(PredictController.predictPM25)

