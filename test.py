"""
Usecase:
start this program, then use following query string:
http://127.0.0.1:5000/no2?start_date=yyyy_mm_dd&end_date=yyyy_mm_dd
http://127.0.0.1:5000/no2?date=yyyy_mm_dd
http://127.0.0.1:5000/no2

"""
from flask import Flask
from flask import request
from flask import send_from_directory

import os
import threading
import SimpleHTTPServer
import SocketServer

import json
import datetime


hostname = '127.0.0.1'
file_server_port = 8000

app = Flask(__name__)

@app.route("/")
def hello():
    return "hello world!"

@app.route("/cwd")
def cwd():
    return os.getcwd()


@app.route("/no2/<path:path>")
def no2_data(path):
    print 'in getting data'
    print path
    path = str(path)
    dirs = path.split('/')
    print dirs
    p = os.path.join(dirs)
    print p
    return send_from_directory('no2', p)


@app.route("/no2")
def no2():
    req_param = request.args

    if req_param.has_key('date'):
        date = parse_date(req_param.get('date'))
        if date is None:
            return encode_json('invalid')
        else:
            return encode_json(get_data_set('no2', date))
    elif req_param.has_key('start_date') and req_param.has_key('end_date'):
        start_date = parse_date(req_param.get('start_date'))
        end_date = parse_date(req_param.get("end_date"))
        if start_date and end_date:
            result = []
            a_day = datetime.timedelta(days=1)
            while start_date <= end_date:
                result.append((date_2_str(start_date), get_data_set('no2', start_date)))
                start_date += a_day
            return encode_json(result)
        else:
            return encode_json('invalid')
    else:
        return encode_json(get_data_set('no2', datetime.date.today()))


def encode_json(obj):
    dict = {}
    dict['result'] = obj
    str_json = json.dumps(dict)
    print 'return json:' + str_json
    return str_json


def date_2_str(date):
    return date.isoformat().replace('-', '_')


def get_data_set(dataset, date):
    folder_name = date.isoformat().replace('-', '_')
    if os.path.isdir(os.path.join(os.getcwd(), dataset, folder_name)):

        return '/'.join(['http://' + hostname + ':' + str(file_server_port),
                         dataset,
                         folder_name,
                         'data.png'])
    else:
        return None


def parse_date(str):
    """the input str should be like yyyy_mm_dd, will parse into a date object"""
    try:
        nums = [int(s) for s in str.split('_')]
        if len(nums) != 3:
            return None
        d = datetime.date(nums[0], nums[1], nums[2])
        return d
    except:
        return 'not exist'


def http_server():
    handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", file_server_port), handler)
    print "serving static files at port", file_server_port
    httpd.serve_forever()

def main():
    os.chdir(os.path.join(os.getcwd(), 'data'))
    t = threading.Thread(target=http_server)
    t.start()
    app.run()


if __name__ == "__main__":
    main()

