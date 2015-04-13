import os
from datetime import date
from datetime import timedelta
import random
from PIL import Image

DATASET = 'new_data'

fpath = os.path.dirname(os.path.realpath(__file__))
dpath = os.path.join(fpath, 'data')
dspath = os.path.join(dpath, DATASET)

raw_path = os.path.join(dpath, 'raw_data')
files = [os.path.join(raw_path, f) for f in os.listdir(raw_path)]


def get_random_file():
    return files[random.randint(0, len(files) - 1)]


def main():
    current_date = date(2015, 1, 1)
    end_date = date(2015, 5, 1)
    one_day = timedelta(days=1)
    while current_date != end_date:
        generate(current_date)
        current_date += one_day


def generate(d):
    date_str = d.isoformat()
    date_str = date_str.replace('-', '_')
    dest_dir = os.path.join(dspath, date_str)
    os.makedirs(dest_dir)
    dest_file = os.path.join(dest_dir, 'data.png')
    gen_datafile(dest_file)
    print dest_dir + ' generated'


raw1 = Image.open("data/raw_data/new_color.png")
raw2 = Image.open("data/raw_data/new_color.png")

alpha = 0


def gen_datafile(dest_file):
    global alpha
    im = Image.blend(raw1, raw2, alpha)
    rand = random.randint(10, 40) / 100.0
    rand_sign = random.randint(0, 1)
    if rand_sign == 0:
        rand = -rand
    if alpha + rand > 1 or alpha + rand < 0:
        alpha -= rand
    else:
        alpha += rand
    im.save(dest_file, "PNG")

if __name__ == "__main__":
    main()