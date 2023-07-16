from flask import Blueprint

from controllers.TestController import TestController

TestRouter = Blueprint('TestRouter', __name__)

TestRouter.route('/test', methods = ['GET'])(TestController.getSampleData)

