import csv
import json
from collections import OrderedDict, Counter

with open('SmallData.csv', "rb") as ifile:
    reader = csv.reader(ifile)
    next(reader)  # skip header row
    data = set()
    for row in reader:
    	data.add((row[3].title(),row[4].title()))

count = 0
authors = []
for elem in data:
	if count<100:
		authors.append({"name":elem[0],"aff":elem[1]})
finda = {"authors":authors}
with open('authors.json', 'w') as outfile:
    json.dump(finda, outfile,indent = 9)
