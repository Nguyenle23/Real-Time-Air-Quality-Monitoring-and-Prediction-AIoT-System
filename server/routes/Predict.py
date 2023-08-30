from flask import Blueprint

from controllers.PredictController import PredictController

Predict = Blueprint('Predict', __name__)

Predict.route('/lr/temp', methods = ['POST'])(PredictController.predictLRTemp)
Predict.route('/gb/temp', methods = ['POST'])(PredictController.predictGBTemp)
Predict.route('/xgb/temp', methods = ['POST'])(PredictController.predictXGBTemp)
Predict.route('/rf/temp', methods = ['POST'])(PredictController.predictRFTemp)
Predict.route('/knn/temp', methods = ['POST'])(PredictController.predictKNNTemp)

Predict.route('/humi', methods = ['POST'])(PredictController.predictHumi)
Predict.route('/co', methods = ['POST'])(PredictController.predictCO)
Predict.route('/co2', methods = ['POST'])(PredictController.predictCO2)
Predict.route('/uv', methods = ['POST'])(PredictController.predictUV)
Predict.route('/pm25', methods = ['POST'])(PredictController.predictPM25)

