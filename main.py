"""
Usecase:
start this program, then use following query string:
http://127.0.0.1:8080/no2?start_date=yyyy_mm_dd&end_date=yyyy_mm_dd
http://127.0.0.1:8080/no2?date=yyyy_mm_dd
http://127.0.0.1:8080/no2

"""
from bottle import route, run, request, static_file

import os

import json
import datetime


hostname = '127.0.0.1'
file_server_port = 8080

@route("/")
def hello():
    return static_file('index_v2.html', root=os.path.dirname(os.getcwd()))


@route('/static/<filepath:path>')
def serve_static(filepath):
    stat_dir = os.path.join(os.path.dirname(os.getcwd()), 'static')
    return static_file(filepath, root=stat_dir)


@route('/data/<filepath:path>')
def serve_data(filepath):
    return static_file(filepath, root=os.getcwd())


@route('/<data_set>')
def get_ds(data_set):
    if not os.path.exists(data_set):
        return encode_json('invalid')

    query = request.query

    if query.adate:
        adate = parse_date(query.adate)
        if adate is None:
            return encode_json('invalid')
        else:
            return encode_json(get_data_set(data_set, adate))
    elif query.start_date and query.end_date:
        start_date = parse_date(query.start_date)
        end_date = parse_date(query.end_date)
        if start_date and end_date:
            result = []
            a_day = datetime.timedelta(days=1)
            while start_date <= end_date:
                result.append((date_2_str(start_date), get_data_set(data_set, start_date)))
                start_date += a_day
            return encode_json(result)
        else:
            return encode_json('invalid')
    else:
        return encode_json(get_data_set(data_set, datetime.date.today()))

# @route("/no2")
def no2():
    query = request.query

    if query.adate:
        adate = parse_date(query.adate)
        if adate is None:
            return encode_json('invalid')
        else:
            return encode_json(get_data_set('no2', adate))
    elif query.start_date and query.end_date:
        start_date = parse_date(query.start_date)
        end_date = parse_date(query.end_date)
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
                         'data',
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


def main():
    os.chdir(os.path.join(os.getcwd(), 'data'))
    run(host='localhost', port=8080, debug=True)


if __name__ == "__main__":
    main()

