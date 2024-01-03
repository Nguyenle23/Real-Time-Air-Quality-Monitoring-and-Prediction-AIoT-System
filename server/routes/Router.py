# from routes.QArouter import QARouter
from routes.Predict import Predict
# from routes.v1.ThingsBoard import Thingsboard

class Router:
  def run(app):
    # app.register_blueprint(QARouter, url_prefix = '/')
    # app.register_blueprint(Thingsboard, url_prefix = '/v1/thingsboard')
    app.register_blueprint(Predict, url_prefix = '/predict')

