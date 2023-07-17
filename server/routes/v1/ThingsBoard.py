from flask import Blueprint

from controllers.v1.ThingsBoardController import ThingsBoardController

Thingsboard = Blueprint('Thingsboard', __name__)

Thingsboard.route('/', methods = ['GET'])(ThingsBoardController.fetchAllData)

