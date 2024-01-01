from flask import Blueprint

from controllers.PredictController import PredictController

Predict = Blueprint('Predict', __name__)

Predict.route('/test/temp', methods = ['POST'])(PredictController.predictTestTemp)

