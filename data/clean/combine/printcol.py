import sys

for line in sys.stdin:
    tmp = line.split(",")
    if tmp[1]=="":
        print tmp[0]
