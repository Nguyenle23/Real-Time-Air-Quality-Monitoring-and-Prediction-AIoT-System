from flask import Blueprint

from controllers.QAController import QAController

QARouter = Blueprint('QARouter', __name__)

QARouter.route('/quynhanh', methods = ['GET'])(QAController.getSampleData)

