from flask import Blueprint

from controllers.PredictController import PredictController

Predict = Blueprint('Predict', __name__)

Predict.route('/co', methods = ['POST'])(PredictController.predictCO)

