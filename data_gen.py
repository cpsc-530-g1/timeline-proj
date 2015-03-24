import os
from datetime import date
from datetime import timedelta
import random
import shutil

DATASET = 'no2'

fpath = os.path.dirname(os.path.realpath(__file__))
dpath = os.path.join(fpath, 'data')
dspath = os.path.join(dpath, DATASET)

raw_path = os.path.join(dpath, 'raw_data')
files = [os.path.join(raw_path, f) for f in os.listdir(raw_path)]

def get_random_file():
    return files[random.randint(0, len(files) - 1)]


def main():
    current_date = date(2015,1,1)
    end_date = date(2015,3,31)
    one_day = timedelta(days=1)
    while current_date != end_date:
        generate(current_date)
        current_date += one_day




def generate(date):
    date_str = date.isoformat()
    date_str = date_str.replace('-', '_')
    dest_dir = os.path.join(dspath, date_str)
    os.makedirs(dest_dir)
    #os.mkdir(dest_dir)
    dest_file = os.path.join(dest_dir, 'data.png')
    shutil.copyfile(get_random_file(), dest_file)
    print dest_dir + ' copied'




if __name__ == "__main__":
    main()