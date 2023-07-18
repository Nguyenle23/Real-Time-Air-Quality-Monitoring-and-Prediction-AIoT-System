from flask import Flask
from config import HOST, PORT, DEBUG
from routes.Router import Router
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return '<h1>Rest API with Python Flask</h1>'

Router.run(app)

if __name__ == '__main__':
    app.run(host = HOST, port = PORT, debug = DEBUG)
