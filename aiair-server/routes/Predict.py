from flask import Blueprint

from controllers.PredictController import PredictController

Predict = Blueprint('Predict', __name__)

Predict.route('/prophet/temp', methods = ['POST'])(PredictController.predictTempProphet)
Predict.route('/lstm/temp', methods = ['POST'])(PredictController.predictTempLSTM)

