from routes.TestRouter import TestRouter

class Router:
  def run(app):
    app.register_blueprint(TestRouter, url_prefix = '/')

